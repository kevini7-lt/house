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
        console.error('鎴块棿鏁版嵁鍔犺浇澶辫触', error)
        wx.showToast({ title: '鎴块棿鍔犺浇澶辫触', icon: 'none' })
        that.setData({ building: null, rooms: [] })
      })
      .finally(function () {
        that.setData({ loading: false })
      })
  },

  goRoomDetail: function (event) {
    var dataset = event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset : {}
    var roomId = dataset.id || ''
    if (!roomId) {
      wx.showToast({ title: '鎴块棿淇℃伅涓嶅瓨鍦?', icon: 'none' })
      return
    }

    wx.navigateTo({
      url: '/pages/room-detail/index?roomId=' + roomId
    })
  },

  callOwner: function (event) {
    var phone = event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.phone : ''
    if (!phone) {
      wx.showToast({ title: '鏆傛棤鑱旂郴鐢佃瘽', icon: 'none' })
      return
    }
    wx.makePhoneCall({ phoneNumber: phone })
  }
})
