function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function makeId(length = 8) {
  var txt = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}


module.exports = {
  randInt,
  makeId,
}