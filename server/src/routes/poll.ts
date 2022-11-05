import { FastifyInstance } from 'fastify';
import ShortUniqueId from 'short-unique-id';
import { z } from 'zod';

import { prisma } from '../lib/prisma';
import { authenticate } from '../plugins/authenticate';

export async function pollRoutes(fastify: FastifyInstance) {
    fastify.get('/polls/count', async () => {
        const count = await prisma.poll.count();
    
        return { count };
    });

    fastify.post('/polls', async (request, reply) => {
        const createPollBody = z.object({
          title: z.string(),
        });
    
        const { title } = createPollBody.parse(request.body);
    
        const generate = new ShortUniqueId({ length: 6 });
        const code = String(generate()).toUpperCase();

        try {
          await request.jwtVerify()

          await prisma.poll.create({
            data: {
              title,
              code,
              ownerId: request.user.sub,

              participants: {
                create: {
                  userId: request.user.sub
                }
              }
            },
          });

        } catch {
          await prisma.poll.create({
            data: {
              title,
              code,
            },
          });

        }
    
        
    
        return reply.status(201).send({ code });
    });

    // Poll joining route
    fastify.post('/polls/join', {
      onRequest: [authenticate]
    }, async (request, reply) => {

      const joinPollBody = z.object({
        code: z.string()
      })

      const { code } = joinPollBody.parse(request.body)

      // Search if theres is a valid poll and return if user is already participating
      const poll = await prisma.poll.findUnique({
        where: {
          code
        },

        include: {
          participants: {
            where: {
              // participants is greater than 0 if user is already participating
              userId: request.user.sub
            }
          }
        }
      })

      // If there's no poll with that poll code, then return status 400
      if (!poll) {
        return reply.status(400).send({
          message: 'Poll not found'
        })
      }

      if (poll.participants.length > 0) {
        return reply.status(400).send({
          message: 'You already joined this poll.'
        })
      }

      // Since Web version doesn't have an authentication system, if there is a pool web created, which won't have an owner, then the first user that joins it, become the owner
      if (!poll.ownerId) {
        await prisma.poll.update({
          where: {
            id: poll.id,
          },

          data: {
            ownerId: request.user.sub
          }
        })
      }

      // If there's a valid poll code and a authenticated user, then create a participant relation
      await prisma.participant.create({
        data: {
          pollId: poll.id,
          userId: request.user.sub,
        }
      })

      // If everything its ok, then return 201 status
      return reply.status(201).send()
    })

    // Return all polls that authenticated user is participating
    fastify.get('/polls', {
      onRequest: [authenticate]
    }, async (request) => {

      const polls = await prisma.poll.findMany({
        // Search in all participants...
        where: {
          participants: {
            // If there is at least one that matches authenticated user id.
            some: {
              userId: request.user.sub
            }
          }
        },

        include: {
          _count: {
            select: {
              participants: true
            }
          },

          // Return id and user avatarUrl from the 4 first registered participants in poll 
          participants: {
            select: {
              id: true,

              user: {
                select: {
                  avatarUrl: true
                }
              }
            },
            take: 4
          },
          
          // owner: true; return every info from owner
          owner: {
            select: {
              id: true, 
              name: true
            }
          }
        }
      })

      return { polls }
    })

    fastify.get('/polls/:id', {
      onRequest: [authenticate]
    }, async (request) => {
      const getPollParams = z.object({
        id: z.string()
      })

      const { id } = getPollParams.parse(request.params)


      const polls = await prisma.poll.findUnique({
        // Search in all poll the specified poll id
        where: {
          id
        },

        include: {
          _count: {
            select: {
              participants: true
            }
          },

          // Return id and user avatarUrl from all registered participants in poll 
          participants: {
            select: {
              id: true,

              user: {
                select: {
                  avatarUrl: true
                }
              }
            },
          },
          
          // owner: true; return every info from owner
          owner: {
            select: {
              id: true, 
              name: true
            }
          }
        }
      })

      return { polls }
    })
}