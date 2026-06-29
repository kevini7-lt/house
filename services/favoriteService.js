var data = require('./data')
var normalize = require('./normalize')

var STORAGE_KEY = 'favorites'

function safeArray(value) {
  return Array.isArray(value) ? value : []
}

function readFavoriteIds() {
  var list = wx.getStorageSync(STORAGE_KEY)
  return safeArray(list).filter(function (item) {
    return !!item
  })
}

function writeFavoriteIds(list) {
  wx.setStorageSync(STORAGE_KEY, safeArray(list))
  return readFavoriteIds()
}

function addFavorite(roomId) {
  var id = String(roomId || '').trim()
  if (!id) {
    return false
  }

  var list = readFavoriteIds()
  if (list.indexOf(id) === -1) {
    list.push(id)
    writeFavoriteIds(list)
  }

  return true
}

function removeFavorite(roomId) {
  var id = String(roomId || '').trim()
  if (!id) {
    return false
  }

  var list = readFavoriteIds().filter(function (item) {
    return item !== id
  })
  writeFavoriteIds(list)
  return true
}

function isFavorite(roomId) {
  var id = String(roomId || '').trim()
  if (!id) {
    return false
  }

  return readFavoriteIds().indexOf(id) > -1
}

function toggleFavorite(roomId) {
  if (isFavorite(roomId)) {
    removeFavorite(roomId)
    return false
  }

  addFavorite(roomId)
  return true
}

function getFavoriteList() {
  var ids = readFavoriteIds()
  var roomMap = {}

  safeArray(data.roomList).forEach(function (room) {
    if (room && room.id) {
      roomMap[room.id] = normalize.normalizeRoom(room)
    }
  })

  return ids.map(function (id) {
    return roomMap[id]
  }).filter(Boolean)
}

module.exports = {
  addFavorite: addFavorite,
  removeFavorite: removeFavorite,
  toggleFavorite: toggleFavorite,
  isFavorite: isFavorite,
  getFavoriteList: getFavoriteList
}
