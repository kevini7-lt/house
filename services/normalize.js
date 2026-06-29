var BANNER_COVERS = [
  '/assets/images/banner-1.png',
  '/assets/images/banner-2.png',
  '/assets/images/banner-3.png'
]

var COMMUNITY_COVERS = [
  '/assets/images/community-1.png',
  '/assets/images/community-2.png',
  '/assets/images/community-3.png'
]

var BUILDING_COVERS = [
  '/assets/images/building-a.png',
  '/assets/images/building-b.png',
  '/assets/images/building-c.png',
  '/assets/images/building-d.png',
  '/assets/images/building-e.png',
  '/assets/images/building-f.png',
  '/assets/images/building-g.png',
  '/assets/images/building-h.png',
  '/assets/images/building-i.png'
]

var ROOM_COVERS = [
  '/assets/images/room-1.png',
  '/assets/images/room-2.png',
  '/assets/images/room-3.png',
  '/assets/images/room-4.png'
]

function toArray(value) {
  return Array.isArray(value) ? value : []
}

function digitsFromId(value) {
  var digits = String(value || '').replace(/[^0-9]/g, '')
  var number = parseInt(digits, 10)
  return !isNaN(number) && number > 0 ? number : 1
}

function pickById(id, list) {
  if (!list.length) {
    return ''
  }
  var index = (digitsFromId(id) - 1) % list.length
  return list[index]
}

function createTitle(value, fallback) {
  return value || fallback || ''
}

function normalizeBanner(item) {
  var banner = item || {}
  var cover = banner.image || banner.cover || pickById(banner.id, BANNER_COVERS)
  var title = createTitle(banner.title, banner.name)
  var subtitle = createTitle(banner.subtitle, '')

  return {
    type: 'banner',
    id: banner.id || '',
    name: title,
    title: title,
    subtitle: subtitle,
    description: subtitle,
    cover: cover,
    image: cover,
    color: banner.color || '#1677ff'
  }
}

function normalizeCommunity(item, roomList, buildingList) {
  var community = item || {}
  var rooms = toArray(roomList)
  var buildings = toArray(buildingList)
  var cover = community.cover || pickById(community.id, COMMUNITY_COVERS)
  var name = createTitle(community.name, '')

  return {
    type: 'community',
    id: community.id || '',
    name: name,
    title: name,
    subtitle: createTitle(community.district, ''),
    description: createTitle(community.address, ''),
    cover: cover,
    image: cover,
    district: createTitle(community.district, ''),
    address: createTitle(community.address, ''),
    tags: toArray(community.tags),
    buildingCount: buildings.filter(function (building) {
      return building && building.communityId === community.id
    }).length,
    roomCount: rooms.filter(function (room) {
      return room && room.communityId === community.id
    }).length
  }
}

function normalizeBuilding(item, roomList) {
  var building = item || {}
  var rooms = toArray(roomList)
  var cover = building.cover || pickById(building.id, BUILDING_COVERS)
  var subtitle = []

  if (building.floorCount) {
    subtitle.push(String(building.floorCount) + 'F')
  }

  subtitle.push(building.elevator ? 'elevator' : 'stairs')

  var name = createTitle(building.name, '')

  return {
    type: 'building',
    id: building.id || '',
    communityId: building.communityId || '',
    name: name,
    title: name,
    buildingNo: name,
    subtitle: subtitle.join(' | '),
    description: createTitle(building.address, ''),
    cover: cover,
    image: cover,
    address: createTitle(building.address, ''),
    floorCount: building.floorCount || 0,
    elevator: !!building.elevator,
    roomCount: rooms.filter(function (room) {
      return room && room.buildingId === building.id
    }).length
  }
}

function normalizeRoom(item) {
  var room = item || {}
  var gallery = toArray(room.gallery)
  var fallbackImages = toArray(room.images).map(function (_, index) {
    return ROOM_COVERS[index % ROOM_COVERS.length]
  })
  var imageList = gallery.length ? gallery : fallbackImages
  var cover = room.cover || imageList[0] || pickById(room.id, ROOM_COVERS)

  if (!imageList.length) {
    imageList = [
      cover,
      ROOM_COVERS[digitsFromId(room.id) % ROOM_COVERS.length]
    ]
  }

  return {
    type: 'room',
    id: room.id || '',
    communityId: room.communityId || '',
    buildingId: room.buildingId || '',
    communityName: room.communityName || '',
    buildingName: room.buildingName || '',
    number: room.number || '',
    name: room.number ? 'Room' + room.number : 'Room',
    title: room.number ? 'Room' + room.number : 'Room',
    subtitle: [room.layout || '', room.status || ''].filter(Boolean).join(' | '),
    description: room.address || '',
    cover: cover,
    image: cover,
    rent: room.rent || 0,
    status: room.status || '',
    layout: room.layout || '',
    images: toArray(room.images),
    gallery: imageList,
    contactName: room.contactName || '',
    phone: room.phone || '',
    address: room.address || '',
    tags: toArray(room.tags)
  }
}

module.exports = {
  normalizeBanner: normalizeBanner,
  normalizeCommunity: normalizeCommunity,
  normalizeBuilding: normalizeBuilding,
  normalizeRoom: normalizeRoom
}
