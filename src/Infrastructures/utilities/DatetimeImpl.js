const Datetime = require('../../Applications/utilities/Datetime');

class DatetimeImpl extends Datetime {
  constructor(date) {
    super();

    this._date = date;
  }

  now() {
    return new this._date();
  }
}

module.exports = DatetimeImpl;
