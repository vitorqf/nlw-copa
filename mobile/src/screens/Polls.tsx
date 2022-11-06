import { Octicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlatList, Icon, useToast, VStack } from 'native-base';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '../components/Button';
import { EmptyPollList } from '../components/EmptyPollList';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { PollCard, PollCardProps } from '../components/PollCard';
import { api } from '../services/api';

export function Polls() {
  const { navigate } = useNavigation()

  const [isLoading, setIsLoading] = useState(true)
  const [polls, setPolls] = useState<PollCardProps[]>([])

  const toast = useToast()

  useFocusEffect(useCallback(() => {
    fetchPolls()
  }, []))

  async function fetchPolls() {
    try {
      setIsLoading(true)

      const response = await api.get('/polls')

      setPolls(response.data.polls)
      
    } catch (error) {

      console.log(error)

      toast.show({
        title: 'Sorry! Failed to load polls.\nPlease, try reloading the page.',
        placement: 'top',
        bgColor: 'red.500'
      })
      
    } finally {

      setIsLoading(false)

    }
  }

  return (
    <VStack
      flex={1}
      bgColor='gray.900'
    >
      <Header title='My polls' />

      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor='gray.600'
        pb={4}
        mb={4}
      >
        <Button
          title='Search a poll by its code'
          leftIcon={
            <Icon
              as={Octicons}
              name='search'
              color='black'
              size='md'
            />
          }
          onPress={() => navigate('find')}
        />

      </VStack>

      {
        isLoading ?

        <Loading /> :

        <FlatList
          data={polls}
          keyExtractor={poll => poll.id}
          renderItem={({ item }) => <PollCard data={item} />} 
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => <EmptyPollList />}
        />
      }
        
    </VStack>
  );
}
