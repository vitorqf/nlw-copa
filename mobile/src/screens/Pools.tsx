import { Octicons } from '@expo/vector-icons';
import { Icon, VStack } from 'native-base';

import { Button } from '../components/Button';
import { Header } from '../components/Header';

export function Polls() {
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
        />
      </VStack>
    </VStack>
  );
}
