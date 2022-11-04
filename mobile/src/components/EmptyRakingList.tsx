import { Text } from 'native-base';

export function EmptyRakingList() {
  return (
    <Text
      color='white'
      fontSize='sm'
      textAlign='center'
    >
      This pool rank hasn't been yet {'\n'}
      created, wait till results.
    </Text>
  );
}
