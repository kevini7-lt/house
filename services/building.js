function normalizeBuilding(item, roomList) {
  var building = item || {}
  var rooms = Array.isArray(roomList) ? roomList : []

  return {
    id: building.id || '',
    communityId: building.communityId || '',
    name: building.name || '未命名楼栋',
    address: building.address || '',
    floorCount: building.floorCount || 0,
    elevator: !!building.elevator,
    roomCount: rooms.filter(function (room) {
      return room && room.buildingId === building.id
    }).length
  }
}

module.exports = {
  normalizeBuilding: normalizeBuilding
}
