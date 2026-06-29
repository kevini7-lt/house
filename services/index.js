var data = require('./data')
var delay = require('../utils/delay')
var clone = require('../utils/clone')
var normalize = require('./normalize')
var search = require('./search')

function safeArray(value) {
  return Array.isArray(value) ? value : []
}

function matchText(text, keyword) {
  var source = String(text || '').toLowerCase()
  var key = String(keyword || '').trim().toLowerCase()
  return !key || source.indexOf(key) > -1
}

function withDelay(result) {
  return delay(150, 300).then(function () {
    return clone(result)
  })
}

function getBannerList() {
  return withDelay(safeArray(data.bannerList).map(function (item) {
    return normalize.normalizeBanner(item)
  }))
}

function getCommunityList(options) {
  var keyword = options && options.keyword ? options.keyword : ''
  var roomList = safeArray(data.roomList)
  var buildingList = safeArray(data.buildingList)
  var list = safeArray(data.communityList)
    .filter(function (item) {
      return matchText((item && item.name) + ' ' + (item && item.district) + ' ' + (item && item.address), keyword)
    })
    .map(function (item) {
      return normalize.normalizeCommunity(item, roomList, buildingList)
    })

  return withDelay(list)
}

function getBuildingList(options) {
  var communityId = options && options.communityId ? options.communityId : ''
  var keyword = options && options.keyword ? options.keyword : ''
  var rooms = safeArray(data.roomList)
  var list = safeArray(data.buildingList)
    .filter(function (item) {
      var hitCommunity = !communityId || (item && item.communityId === communityId)
      var hitKeyword = matchText((item && item.name) + ' ' + (item && item.address), keyword)
      return hitCommunity && hitKeyword
    })
    .map(function (item) {
      return normalize.normalizeBuilding(item, rooms)
    })

  return withDelay(list)
}

function getRoomList(options) {
  var communityId = options && options.communityId ? options.communityId : ''
  var buildingId = options && options.buildingId ? options.buildingId : ''
  var keyword = options && options.keyword ? options.keyword : ''
  var list = safeArray(data.roomList)
    .filter(function (item) {
      var hitCommunity = !communityId || (item && item.communityId === communityId)
      var hitBuilding = !buildingId || (item && item.buildingId === buildingId)
      var hitKeyword = matchText([
        item && item.communityName,
        item && item.buildingName,
        item && item.number,
        item && item.status,
        item && item.layout,
        item && item.address,
        safeArray(item && item.tags).join(' ')
      ].join(' '), keyword)
      return hitCommunity && hitBuilding && hitKeyword
    })
    .map(function (item) {
      return normalize.normalizeRoom(item)
    })

  return withDelay(list)
}

function getHomeList(options) {
  return Promise.all([
    getBannerList(),
    getCommunityList(options)
  ]).then(function (res) {
    return {
      banners: safeArray(res && res[0]),
      communities: safeArray(res && res[1])
    }
  })
}

function getCommunityById(id) {
  var item = safeArray(data.communityList).find(function (community) {
    return community && community.id === id
  })
  var result = item ? normalize.normalizeCommunity(item, safeArray(data.roomList), safeArray(data.buildingList)) : null
  return withDelay(result)
}

function getBuildingById(id) {
  var item = safeArray(data.buildingList).find(function (building) {
    return building && building.id === id
  })
  var result = item ? normalize.normalizeBuilding(item, safeArray(data.roomList)) : null
  return withDelay(result)
}

function getRoomById(id) {
  var item = safeArray(data.roomList).find(function (room) {
    return room && room.id === id
  })
  var result = item ? normalize.normalizeRoom(item) : null
  return withDelay(result)
}

module.exports = {
  getCommunityList: getCommunityList,
  getBuildingList: getBuildingList,
  getRoomList: getRoomList,
  getHomeList: getHomeList,
  getBannerList: getBannerList,
  getCommunityById: getCommunityById,
  getBuildingById: getBuildingById,
  getRoomById: getRoomById,
  searchService: search.searchService
}
