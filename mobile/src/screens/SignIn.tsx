import { Fontisto } from '@expo/vector-icons';
import { Center, Icon, Text } from 'native-base';

import Logo from '../assets/logo.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

export function SignIn() {
  const { signIn, isUserLoading } = useAuth();

  return (
    <Center
      flex={1}
      bgColor='gray.900'
      p={7}
    >
      <Logo
        width={212}
        height={40}
      />

      <Button
        title='LOGIN WITH GOOGLE'
        type='SECONDARY'
        leftIcon={
          <Icon
            as={Fontisto}
            name='google'
            color='white'
            size='md'
          />
        }
        mt={12}
        onPress={signIn}
        isLoading={isUserLoading}
        _loading={{
          _spinner: {color: 'white'}
        }}
      />

      <Text
        color='gray.200'
        textAlign='center'
        mt={4}
      >
        We won't use any information than {'\n'}
        your e-mail for account creating.
      </Text>
    </Center>
  );
}
