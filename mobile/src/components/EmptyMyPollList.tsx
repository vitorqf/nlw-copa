import { Pressable, Row, Text } from 'native-base';

interface Props {
  code: string;
}

export function EmptyMyPollList({ code }: Props) {
  return (
    <Row
      flexWrap='wrap'
      justifyContent='center'
      p={4}
    >
      <Text
        color='gray.200'
        fontSize='sm'
      >
        This poll doesn't have any participant yet, what if you
      </Text>

      <Pressable onPress={() => {}}>
        <Text
          textDecorationLine='underline'
          color='yellow.500'
          textDecoration='underline'
        >
          share your code
        </Text>
      </Pressable>

      <Text
        color='gray.200'
        fontSize='sm'
        mx={1}
      >
        with some friend?
      </Text>

      <Text
        color='gray.200'
        mr={1}
      >
        Use your code
      </Text>

      <Text
        color='gray.200'
        fontSize='sm'
        textAlign='center'
        fontFamily='heading'
      >
        {code}
      </Text>
    </Row>
  );
}
