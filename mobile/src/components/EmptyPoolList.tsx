import { Row, Text, Pressable } from 'native-base';

export function EmptyPoolList() {
  return (
    <Row flexWrap="wrap" justifyContent="center">
      <Text color="white" fontSize="sm" textAlign="center">
        You aren't participating in {'\n'} any pool yet, try
      </Text>

      <Pressable>
          <Text textDecorationLine="underline" color="yellow.500" textDecoration="underline">
            searching by a code
          </Text>
      </Pressable>

      <Text color="white" fontSize="sm" textAlign="center" mx={1}>
        or
      </Text>

      <Pressable>
        <Text textDecorationLine="underline"  color="yellow.500">
          create a new one
        </Text>
      </Pressable>

      <Text color="white" fontSize="sm" textAlign="center">
        ?
      </Text>
    </Row>
  );
}