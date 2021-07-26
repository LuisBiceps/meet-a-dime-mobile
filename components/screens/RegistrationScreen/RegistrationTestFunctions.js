import moment from 'moment';

export function isLegal(date, minimum_age = 18) {
  const [year, month, day] = date.split('-');
  const [y, m, d] = moment()
    .subtract(18, 'years')
    .format('yyyy-MM-DD')
    .split('-');

  var d1 = new Date(y, m, d);
  var d2 = new Date(year, month, day);
  // console.log(d2 <= d1 ? true : false);
  return d2 <= d1 ? true : false;
}

export function formatNumber(val) {
  if (!val) return val;

  const number = val.replace(/[^\d]/g, '');
  if (number.length < 4) return number;

  if (number.length < 7) {
    return `(${number.slice(0, 3)}) ${number.slice(3)}`;
  }

  return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
}
// module.exports = formatNumber;
// module.exports = isLegal;
