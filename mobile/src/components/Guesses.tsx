import { FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';

import { api } from '../services/api';
import { EmptyMyPollList } from './EmptyMyPollList';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  pollId: string;
  code: string;
}

export function Guesses({ pollId, code }: Props) {
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')


  async function fetchGames() {
    try {

      setIsLoading(true)

      const response = await api.get(`/polls/${pollId}/games`)
      setGames(response.data.games)

      
    } catch (error) {
            
      console.log(error)

      toast.show({
          title: 'Sorry! Failed to load this poll games.\nPlease, try opening the page again.',
          placement: 'top',
          bgColor: 'red.500'
      })

    } finally {

      setIsLoading(false)
      
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {

      setIsLoading(true)

      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Please, insert a valid guess',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post(`/polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      })

      toast.show({
        title: 'Successfully created a new guess!',
        placement: 'top',
        bgColor: 'green.500'
      })

      fetchGames()

      
    } catch (error) {
            
      toast.show({
          title: 'Sorry! Failed to confirm guess.\nPlease, try opening the page again.',
          placement: 'top',
          bgColor: 'red.500'
      })

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [pollId])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}    
      renderItem={({ item }) => (
        <Game 
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
          isLoading={isLoading}
        />
      )}
      _contentContainerStyle={{pb: 10}}
      ListEmptyComponent={() => <EmptyMyPollList code={code}/>}
    />
  )
}
