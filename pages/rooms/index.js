var services = require('../../services/index')

Page({
  data: {
    loading: false,
    communityId: '',
    buildingId: '',
    building: null,
    rooms: []
  },

  onLoad: function (options) {
    var communityId = options && options.communityId ? options.communityId : ''
    var buildingId = options && options.buildingId ? options.buildingId : ''
    this.setData({
      communityId: communityId,
      buildingId: buildingId
    })
    this.loadRooms(communityId, buildingId)
  },

  loadRooms: function (communityId, buildingId) {
    var that = this
    that.setData({ loading: true })

    return Promise.all([
      services.getBuildingById(buildingId),
      services.getRoomList({ communityId: communityId, buildingId: buildingId })
    ])
      .then(function (res) {
        that.setData({
          building: res && res[0] ? res[0] : null,
          rooms: Array.isArray(res && res[1]) ? res[1] : []
        })
      })
      .catch(function (error) {
        console.error('房间数据加载失败', error)
        wx.showToast({ title: '房间加载失败', icon: 'none' })
        that.setData({ building: null, rooms: [] })
      })
      .finally(function () {
        that.setData({ loading: false })
      })
  },

  callOwner: function (event) {
    var phone = event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.phone : ''
    if (!phone) {
      wx.showToast({ title: '暂无联系电话', icon: 'none' })
      return
    }
    wx.makePhoneCall({ phoneNumber: phone })
  }
})
