class connectionError extends Error {
  code = 502;
  name = 'connectionError';
  type = 'system';

  constructor(message = 'Connection Error') {
    super(message)
  }

  serialize() {
    return {message: this.message}
  }
}

module.exports = connectionError

