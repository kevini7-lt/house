function delay(min, max) {
  var start = typeof min === 'number' ? min : 150
  var end = typeof max === 'number' ? max : 300
  var wait = Math.floor(start + Math.random() * (end - start + 1))
  return new Promise(function (resolve) {
    setTimeout(resolve, wait)
  })
}

module.exports = delay
