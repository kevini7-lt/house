function normalizeCommunity(item, roomList, buildingList) {
  var community = item || {}
  var rooms = Array.isArray(roomList) ? roomList : []
  var buildings = Array.isArray(buildingList) ? buildingList : []

  return {
    id: community.id || '',
    name: community.name || '未命名小区',
    district: community.district || '',
    address: community.address || '',
    cover: community.cover || '',
    tags: Array.isArray(community.tags) ? community.tags : [],
    buildingCount: buildings.filter(function (building) {
      return building && building.communityId === community.id
    }).length,
    roomCount: rooms.filter(function (room) {
      return room && room.communityId === community.id
    }).length
  }
}

module.exports = {
  normalizeCommunity: normalizeCommunity
}
