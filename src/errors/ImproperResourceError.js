module.exports = function ImproperResourceError(message = 'error 403') {
  this.name = 'ImproperResourceError'
  this.message = message
}
