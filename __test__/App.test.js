import * as registration from '../components/screens/RegistrationScreen/RegistrationTestFunctions';
import * as chat from '../components/screens/ChatScreen/ChatTestFunctions';
describe('Registration functions', () => {
  test('birth of YYYY-MM-DD formatted date is at 18', () => {
    expect(registration.isLegal('2000-07-27')).toBe(true);
  });
  test('birth of YYYY-MM-DD formatted date is at 18', () => {
    expect(registration.isLegal('2000-07-27')).toBe(true);
  });
  test('birth of YYYY-MM-DD formatted date is at 18', () => {
    expect(registration.isLegal('2006-07-27')).toBe(false);
  });

  test('input strings get formatted correctly', () => {
    expect(registration.formatNumber('4077854111')).toMatch('(407) 785-4111');
  });
  test('input strings get formatted correctly', () => {
    expect(registration.formatNumber('4075459999')).toMatch('(407) 545-9999');
  });
  test('input strings get formatted correctly', () => {
    expect(registration.formatNumber('0000001112')).toMatch('(000) 000-1112');
  });
});
const chats = [
  'im hanging out with my boyfriend can you send me the homework',
  'yeah sure.. ill send it now..',

  'hey do you wanna go see a movie sometime?',
  'me.. go on a date with you..? LMAOO 💀 thats never going to happen',
  'were just friends and thats all were ever going to be',
];

describe('Chat functions', () => {
  chats.forEach((message) => {
    test('chat messages get hashed to a unique id', () => {
      expect(typeof chat.hash_str(message + Date().toString)).toBe('number');
      expect(typeof chat.hash_str(message + Date().toString)).not.toBe(message);
    });
  });
});

//   test('chat messages get hashed to a unique id', () => {
//     expect(
//       typeof chat.hash_str(
//         'im hanging out with my boyfriend can you send me the homework' +
//           Date().toString
//       )
//     ).toBe('number');
//   });
//   test('chat messages get hashed to a unique id', () => {
//     expect(
//       typeof chat.hash_str('yeah sure.. ill send it now..' + Date().toString)
//     ).toBe('number');
//   });
//   test('chat messages get hashed to a unique id', () => {
//     expect(
//       typeof chat.hash_str(
//         'hey do you wanna go see a movie sometime?' + Date().toString
//       )
//     ).toBe('number');
//   });
//   test('chat messages get hashed to a unique id', () => {
//     expect(
//       typeof chat.hash_str(
//         'me.. go on a date with you..? LMAOO 💀 thats never going to happen' +
//           Date().toString
//       )
//     ).toBe('number');
//   });
//   test('chat messages get hashed to a unique id', () => {
//     expect(
//       typeof chat.hash_str(
//         'were just friends and thats all were ever going to be' +
//           Date().toString
//       )
//     ).toBe('number');
//   });
