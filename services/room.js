function normalizeRoom(item) {
  var room = item || {}

  return {
    id: room.id || '',
    communityId: room.communityId || '',
    buildingId: room.buildingId || '',
    communityName: room.communityName || '',
    buildingName: room.buildingName || '',
    number: room.number || '',
    rent: room.rent || 0,
    status: room.status || '可入住',
    layout: room.layout || '单间',
    images: Array.isArray(room.images) ? room.images : [],
    contactName: room.contactName || '',
    phone: room.phone || '',
    address: room.address || '',
    tags: Array.isArray(room.tags) ? room.tags : []
  }
}

module.exports = {
  normalizeRoom: normalizeRoom
}
