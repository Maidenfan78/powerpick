import AsyncStorage from '@react-native-async-storage/async-storage';

test('AsyncStorage mock works', async () => {
  await AsyncStorage.setItem('foo', 'bar');
  const value = await AsyncStorage.getItem('foo');
  expect(value).toBe('bar');
});
