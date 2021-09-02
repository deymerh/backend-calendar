const moment = require('moment');

const isDateCorrect = (value) => {
  if (!value) {
    return false;
  }
  const date = moment(value);
  if (date.isValid()) {
    return true;
  }
  return false;
}
module.exports = { isDateCorrect };