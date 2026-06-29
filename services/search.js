var data = require('./data')
var normalize = require('./normalize')

function safeArray(value) {
  return Array.isArray(value) ? value : []
}

function normalizeSearchText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[\u00b7\u2022\uff0e.\/,，;；:：_\-\u2014\(\)（）【】\[\]{}]/g, '')
    .replace(/\u4e00/g, '1')
    .replace(/\u4e8c/g, '2')
    .replace(/\u4e09/g, '3')
    .replace(/\u56db/g, '4')
    .replace(/\u4e94/g, '5')
    .replace(/\u516d/g, '6')
    .replace(/\u4e03/g, '7')
    .replace(/\u516b/g, '8')
    .replace(/\u4e5d/g, '9')
    .replace(/\u96f6/g, '0')
}

function uniqueTokens(list) {
  return safeArray(list).filter(function (item, index, arr) {
    return item && arr.indexOf(item) === index
  })
}

function tokenize(keyword) {
  var raw = String(keyword || '').trim()
  if (!raw) {
    return []
  }

  var unitPattern = /[0-9\u4e00-\u9fa5]+(?:\u6811|\u53f7\u697c|\u697c|\u5ba4|\u623f\u95f4|\u5c42)/g
  var digitPattern = /[0-9]+/g
  var wordPattern = /[A-Za-z]+/g
  var parts = []

  parts = parts.concat(
    raw
      .replace(unitPattern, ' ')
      .replace(digitPattern, ' ')
      .split(/[\s,，;；:：]+/)
      .map(function (item) {
        return String(item || '').trim()
      })
      .filter(Boolean)
  )

  parts = parts.concat(raw.match(unitPattern) || [])
  parts = parts.concat(raw.match(digitPattern) || [])
  parts = parts.concat(raw.match(wordPattern) || [])

  return uniqueTokens(parts)
}

function stringifyTags(tags) {
  return safeArray(tags).join(' ')
}

function matchTokens(fields, keyword) {
  var tokens = tokenize(keyword)
  if (!tokens.length) {
    return true
  }

  var normalizedFields = safeArray(fields).map(function (field) {
    return normalizeSearchText(field)
  })

  return tokens.every(function (token) {
    var normalizedToken = normalizeSearchText(token)
    if (!normalizedToken) {
      return true
    }

    return normalizedFields.some(function (field) {
      return field.indexOf(normalizedToken) > -1
    })
  })
}

function searchService(options) {
  var keyword = options && options.keyword ? options.keyword : ''
  var roomList = safeArray(data.roomList)
  var buildingList = safeArray(data.buildingList)

  var communities = safeArray(data.communityList)
    .map(function (item) {
      var normalized = normalize.normalizeCommunity(item, roomList, buildingList)
      return {
        type: 'community',
        typeLabel: '\u5c0f\u533a',
        id: normalized.id,
        title: normalized.name,
        subtitle: normalized.description,
        cover: normalized.cover,
        communityId: normalized.id,
        tags: normalized.tags
      }
    })
    .filter(function (item) {
      return matchTokens([item && item.title], keyword)
    })

  var buildings = safeArray(data.buildingList)
    .map(function (item) {
      var normalized = normalize.normalizeBuilding(item, roomList)
      return {
        type: 'building',
        typeLabel: '\u697c\u680b',
        id: normalized.id,
        title: normalized.buildingNo || normalized.title,
        subtitle: normalized.description || normalized.name,
        cover: normalized.cover,
        communityId: normalized.communityId,
        tags: normalized.tags || []
      }
    })
    .filter(function (item) {
      return matchTokens([item && item.title, item && item.subtitle], keyword)
    })

  var rooms = safeArray(data.roomList)
    .map(function (item) {
      var normalized = normalize.normalizeRoom(item)
      return {
        type: 'room',
        typeLabel: '\u623f\u95f4',
        id: normalized.roomId || normalized.id,
        roomId: normalized.roomId || normalized.id,
        title: normalized.title,
        subtitle: [normalized.communityName, normalized.buildingName, stringifyTags(normalized.tags)].filter(Boolean).join(' \u00b7 '),
        cover: normalized.cover,
        communityId: normalized.communityId,
        buildingId: normalized.buildingId,
        rent: normalized.rent,
        tags: normalized.tags,
        roomNo: normalized.number,
        buildingNo: normalized.buildingName
      }
    })
    .filter(function (item) {
      return matchTokens([
        item && item.title,
        item && item.roomNo,
        item && item.buildingNo,
        item && item.buildingId,
        item && item.subtitle,
        stringifyTags(item && item.tags)
      ], keyword)
    })

  return Promise.resolve(communities.concat(buildings).concat(rooms))
}

module.exports = {
  searchService: searchService
}
