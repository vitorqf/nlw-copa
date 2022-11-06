import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { prisma } from '../lib/prisma';
import { authenticate } from '../plugins/authenticate';

export async function guessRoutes(fastify: FastifyInstance) {
    fastify.get('/guesses/count', async () => {
        const count = await prisma.guess.count();
    
        return { count };
    });

    // Create a new guess for a game
    // url query: From polls I wanna search a specific poll and from games I wanna create a guess for a specific one
    fastify.post('/polls/:pollId/games/:gameId/guesses', {
        onRequest: [authenticate]
    }, async (request, reply) => {
        // Validate url params
        const createGuessParams = z.object({
            pollId: z.string(),
            gameId: z.string()
        })

        //Validate request body
        const createGuessBody = z.object({
            firstTeamPoints: z.number(),
            secondTeamPoints: z.number()
        })

        const { pollId, gameId } = createGuessParams.parse(request.params)
        const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body)

        // Search for a participation that has same userId and pollId, cuz it can't be different
        const participant = await prisma.participant.findUnique({
            where: {
                userId_pollId: {
                    pollId,
                    userId: request.user.sub
                }
            }
        })

        // If there is no element in participant that matches it, then the user is not a poll participant
        if (!participant) {
            return reply.status(400).send({
                message: "You're not allowed to create a guess inside this poll."
            })
        }

        // Search for a guess that matches a participantId(userId, pollId)
        const guess = await prisma.guess.findUnique({
            where: {
                participantId_gameId: {
                    participantId: participant.id,
                    gameId
                }
            }
        })

        // If above condition its true, than user already made a guess, so its not possible to continue
        if (guess) {
            return reply.status(400).send({
                message: "You already sent a guess to this game on this poll."
            })
        }

        // Search by a game
        const game = await prisma.game.findUnique({
            where: {
                id: gameId
            }
        })

        // If there is no game, return 400
        if (!game) {
            return reply.status(400).send({
                message: "Game not found!"
            })
        }

        // If there is a game but it has already been finished, then return 400
        if (game.date < new Date()) {
            return reply.status(400).send({
                message: "You cannot send guesses after the game date."
            })
        }

        // Finally, if there is a valid participation, a game that didn't happen yet and if user hasn't guessed it before, then create a new guess
        await prisma.guess.create({
            data: {
                gameId,
                participantId: participant.id,
                firstTeamPoints,
                secondTeamPoints
            }
        })

        return reply.status(201).send()

        
    })
}