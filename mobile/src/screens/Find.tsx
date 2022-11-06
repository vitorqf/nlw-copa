import { useNavigation } from '@react-navigation/native';
import { Heading, useToast, VStack } from 'native-base';
import { useState } from 'react';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { api } from '../services/api';

export function Find() {

  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')

  const { navigate } = useNavigation()

  const toast = useToast()

  async function handleJoinPoll() {
    try {

      setIsLoading(true)

      if(!code.trim()) {
        return toast.show({
          title: 'Insert a valid code',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post('/polls/join', { code })

      toast.show({
        title: 'Successfully joined the poll',
        placement: 'top',
        bgColor: 'green.500'
      })

      navigate('polls')
      
    } catch (error) {

      setIsLoading(false)

      if (error.response?.data?.message.includes('Poll not found')) {
        return toast.show({
          title: error.response?.data?.message,
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      if (error.response?.data?.message.includes('You already joined this poll')) {
        return toast.show({
          title: error.response?.data?.message,
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      return toast.show({
        title: "Sorry! Your poll hasn't been found. Please, verify your code.",
        placement: 'top',
        bgColor: 'red.500'
      })
      
      
    }
  }

  return (
    <VStack
      flex={1}
      bgColor='gray.900'
    >
      <Header
        title='Search by code'
        showBackButton
      />

      <VStack
        mt={8}
        mx={5}
        alignItems='center'
      >
        <Heading
          fontFamily='heading'
          color='white'
          fontSize='xl'
          mb={8}
          textAlign='center'
        >
          Search a poll by its unique code
        </Heading>

        <Input
          mb={2}
          placeholder="What's the poll code?"
          autoCapitalize='characters'
          onChangeText={setCode}
          value={code}
        />

        <Button title='Search poll' onPress={handleJoinPoll} />
      </VStack>
    </VStack>
  );
}
