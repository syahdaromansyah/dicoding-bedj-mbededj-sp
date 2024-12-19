const IdGenerator = require('../../Applications/utilities/IdGenerator');

class IdGeneratorImpl extends IdGenerator {
  constructor(idGen) {
    super();

    this._idGen = idGen;
  }

  generate(length) {
    return this._idGen(length);
  }
}

module.exports = IdGeneratorImpl;
