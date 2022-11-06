import { useRoute } from '@react-navigation/native';
import { HStack, useToast, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { Share } from 'react-native';

import { EmptyMyPollList } from '../components/EmptyMyPollList';
import { Guesses } from '../components/Guesses';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Option } from '../components/Option';
import { PollCardProps } from '../components/PollCard';
import { PollHeader } from '../components/PollHeader';
import { api } from '../services/api';

interface RouteParams {
    id: string
}

export function Details() {
    const route = useRoute()
    const toast = useToast()

    const [isLoading, setIsLoading] = useState(true)
    const [optionSelected, setOptionSelected] = useState<'Your Guesses' | 'Group Ranking'>('Your Guesses')
    const [pollDetails, setPollDetails] = useState<PollCardProps>({} as PollCardProps)


    const {id} = route.params as RouteParams

    async function fetchPollDetails() {
        try {
            
            setIsLoading(true)

            const response = await api.get(`/polls/${id}`)
            console.log(response.data)
            setPollDetails(response.data.polls)

        } catch (error) {
            
            console.log(error)

            toast.show({
                title: 'Sorry! Failed to load this poll.\nPlease, try opening the page again.',
                placement: 'top',
                bgColor: 'red.500'
            })
      
        } finally {

            setIsLoading(false)
            
        }
    }

    async function handleCodeShare() {
        await Share.share({
            message: pollDetails.code
        })
    }

    useEffect(() => {
        fetchPollDetails()
    }, [id])
    

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack
            flex={1}
            bgColor='gray.900'
        >
            <Header title={pollDetails.title} showBackButton showShareButton onShare={handleCodeShare}/>

            {
                pollDetails._count.participants > 0 ?
                (
                    <VStack px={5} flex={1}>
                        <PollHeader data={pollDetails} />

                        <HStack
                            bgColor="gray.800"
                            p={1}
                            rounded="sm"
                            mb={8}                   
                        >
                            <Option
                                title="Your guesses"
                                isSelected={optionSelected === 'Your Guesses'} 
                                onPress={() => setOptionSelected('Your Guesses')}
                            />

                            <Option 
                                title="Group rank" 
                                isSelected={optionSelected === 'Group Ranking'} 
                                onPress={() => setOptionSelected('Group Ranking')}
                            />
                        </HStack>

                        <Guesses pollId={pollDetails.id} code={pollDetails.code}/>

                    </VStack> 
                ) :
                <EmptyMyPollList code={pollDetails.code}/>
            }

        </VStack>
    )
}