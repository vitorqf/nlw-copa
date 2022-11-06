import { useNavigation } from '@react-navigation/native';
import { Pressable, Row, Text } from 'native-base';

export function EmptyPollList() {
  const { navigate } = useNavigation()

  return (
    <Row
      flexWrap='wrap'
      justifyContent='center'
    >
      <Text
        color='white'
        fontSize='sm'
        textAlign='center'
      >
        You aren't participating in any poll yet, try
      </Text>

      <Pressable onPress={() => navigate('find')}>
        <Text
          textDecorationLine='underline'
          color='yellow.500'
          textDecoration='underline'
        >
          searching by a code
        </Text>
      </Pressable>

      <Text
        color='white'
        fontSize='sm'
        textAlign='center'
        mx={1}
      >
        or
      </Text>

      <Pressable onPress={() => navigate('new')}>
        <Text
          textDecorationLine='underline'
          color='yellow.500'
        >
          create a new one
        </Text>
      </Pressable>
    </Row>
  );
}
