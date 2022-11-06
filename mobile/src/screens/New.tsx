import { Heading, Text, useToast, VStack } from 'native-base';
import { useState } from 'react';

import Logo from '../assets/logo.svg';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { api } from '../services/api';

export function New() {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()

  async function handlePoolCreate() {
    if(!title.trim()) {
      return toast.show({
        title: 'Insert a name to your poll',
        placement: 'top',
        bgColor: 'red.500'
      })
    }

    try {
      setIsLoading(true)

      await api.post('/polls', {title})

      toast.show({
        title: 'Successfully created a new poll!',
        placement: 'top',
        bgColor: 'green.500'
      })

      setTitle('')

    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Sorry! Failed to create a new poll. Try again later',
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
      <Header title='Create new poll' />

      <VStack
        mt={8}
        mx={5}
        alignItems='center'
      >
        <Logo />

        <Heading
          fontFamily='heading'
          color='white'
          fontSize='xl'
          my={8}
          textAlign='center'
        >
          Create your own poll and {'\n'} share with friends!
        </Heading>

        <Input
          mb={2}
          placeholder="What's your poll name?"
          value={title}
          onChangeText={setTitle}
        />

        <Button
          title='Create my poll' 
          onPress={handlePoolCreate}
          isLoading={isLoading}
        />

        <Text
          color='gray.200'
          fontSize='sm'
          textAlign='center'
          px={10}
          mt={4}
        >
          After creating your poll, you'll receive an unique code that you might
          share to invite other people.
        </Text>
      </VStack>
    </VStack>
  );
}
