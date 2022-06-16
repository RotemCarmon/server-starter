class DataValidationError extends Error {
  code = 422;
  name = 'DataValidationError';
  type = 'system';

  constructor(message = 'Request contains invalid data') {
    super(message);
  }

  serialize() {
    return {message: this.message}
  }
}

module.exports = DataValidationError