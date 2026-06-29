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

  return parts.filter(function (item, index, list) {
    return item && list.indexOf(item) === index
  })
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

function toNumber(value) {
  var num = parseFloat(value)
  return isNaN(num) ? null : num
}

function translateRoomType(value) {
  var text = String(value || '').trim()
  var key = text.toLowerCase()

  if (!text) {
    return ''
  }

  if (key === 'studio' || text === '单间') {
    return '单间'
  }

  if (key === '1b1b' || text === '1房1厅' || text === '一房一厅') {
    return '一室一厅'
  }

  if (key === '2b1b' || text === '2房1厅' || text === '两房一厅') {
    return '两室一厅'
  }

  return text
}

function translateStatus(value) {
  var text = String(value || '').trim()
  var key = text.toLowerCase()

  if (!text) {
    return ''
  }

  if (key === 'available' || text === '可租' || text === '可入住') {
    return '可租'
  }

  if (key === 'rented' || text === '已租') {
    return '已租'
  }

  return text
}

function translateTag(value) {
  var text = String(value || '').trim()
  var key = text.toLowerCase()

  if (!text) {
    return ''
  }

  if (key === 'balcony') {
    return '阳台'
  }

  if (key === 'wifi') {
    return 'WiFi'
  }

  if (key === 'parking') {
    return '停车位'
  }

  return text
}

function buildRoomItem(item) {
  var room = normalize.normalizeRoom(item)
  var roomTypeText = translateRoomType(room.layout)
  var statusText = translateStatus(room.status)
  var tagTextList = safeArray(room.tags).map(function (tag) {
    return translateTag(tag)
  }).filter(Boolean)

  return {
    type: 'room',
    id: room.roomId || room.id,
    roomId: room.roomId || room.id,
    title: room.title,
    cover: room.cover,
    rent: room.rent,
    roomType: room.layout,
    roomTypeText: roomTypeText,
    status: room.status,
    statusText: statusText,
    buildingNo: room.buildingName,
    buildingNoText: room.buildingName,
    buildingName: room.buildingName,
    roomNo: room.number,
    roomNoText: room.number,
    tags: room.tags,
    tagTextList: tagTextList,
    communityId: room.communityId,
    buildingId: room.buildingId,
    subtitle: [room.communityName, room.buildingName].filter(Boolean).join(' · '),
    description: room.description || room.address || ''
  }
}

function filterRoomList(options) {
  var keyword = options && options.keyword ? options.keyword : ''
  var communityId = options && options.communityId ? options.communityId : ''
  var buildingId = options && options.buildingId ? options.buildingId : ''
  var priceMin = toNumber(options && options.priceMin)
  var priceMax = toNumber(options && options.priceMax)
  var roomType = String(options && options.roomType ? options.roomType : '').trim()
  var buildingNo = String(options && options.buildingNo ? options.buildingNo : '').trim()
  var status = String(options && options.status ? options.status : '').trim()

  var list = safeArray(data.roomList)
    .filter(function (item) {
      var hitCommunity = !communityId || (item && item.communityId === communityId)
      var hitBuilding = !buildingId || (item && item.buildingId === buildingId)
      return hitCommunity && hitBuilding
    })
    .map(buildRoomItem)
    .filter(function (item) {
      var hitPriceMin = priceMin === null || item.rent >= priceMin
      var hitPriceMax = priceMax === null || item.rent <= priceMax
      var hitRoomType = !roomType || item.roomTypeText === roomType
      var hitBuildingNo = !buildingNo || matchTokens([
        item.buildingNoText,
        item.buildingName,
        item.buildingId
      ], buildingNo)
      var hitStatus = !status || item.statusText === status
      var hitKeyword = matchTokens([
        item.title,
        item.roomNoText,
        item.buildingNoText,
        item.buildingName,
        item.roomTypeText,
        item.statusText,
        safeArray(item.tags).join(' ')
      ], keyword)

      return hitPriceMin && hitPriceMax && hitRoomType && hitBuildingNo && hitStatus && hitKeyword
    })

  return Promise.resolve(list)
}

module.exports = {
  filterRoomList: filterRoomList
}
