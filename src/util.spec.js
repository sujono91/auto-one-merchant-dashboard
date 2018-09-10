import { convertNumberToCurrency, convertUtcToLocalDate } from './util';

test('Should convert number to currency correctly', () => {
  expect(convertNumberToCurrency(2000)).toEqual('$2,000.00');
});

test('Should convert utc to local date correctly', () => {
  expect(convertUtcToLocalDate('2014-11-29T05:23:56')).toEqual(
    '2014-11-29 05:23:56'
  );
});
