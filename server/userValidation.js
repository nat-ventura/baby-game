// temp users object
var USERS = {
  'bob': 'asd'
}

var isValidPassword = (data) => {
  return USERS[data.username] === data.password;
}
var isUsernameTaken = (data) => {
  return USERS[data.username];
}
var addUser = (data) => {
  USERS[data.username] = data.password;
}

module.exports = {
  isValidPassword,
  isUsernameTaken,
  addUser
}