function createSeededRandom(seedText) {
  var text = String(seedText || '');
  var seed = 0;
  var i;

  for (i = 0; i < text.length; i += 1) {
    seed = (seed * 31 + text.charCodeAt(i)) >>> 0;
  }

  return function nextRandom() {
    var t;

    seed = (seed + 0x6d2b79f5) >>> 0;
    t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = t ^ (t + Math.imul(t ^ (t >>> 7), 61 | t));

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne(list, seedText) {
  var random;
  var index;

  if (!Array.isArray(list) || list.length === 0) {
    return undefined;
  }

  random = createSeededRandom(seedText);
  index = Math.floor(random() * list.length);

  return list[index];
}

function pickMany(list, seedText, count) {
  var random;
  var pool;
  var result;
  var index;

  if (!Array.isArray(list) || list.length === 0 || count <= 0) {
    return [];
  }

  random = createSeededRandom(seedText);
  pool = list.slice();
  result = [];

  while (pool.length > 0 && result.length < count) {
    index = Math.floor(random() * pool.length);
    result.push(pool.splice(index, 1)[0]);
  }

  return result;
}

module.exports = {
  createSeededRandom: createSeededRandom,
  pickOne: pickOne,
  pickMany: pickMany
};
