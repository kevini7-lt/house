var services = require('../../services/index')

Page({
  data: {
    loading: false,
    rooms: []
  },

  onShow: function () {
    this.loadFavorites()
  },

  loadFavorites: function () {
    var that = this
    that.setData({ loading: true })

    try {
      var rooms = services.getFavoriteList()
      that.setData({
        rooms: Array.isArray(rooms) ? rooms : []
      })
    } catch (error) {
      console.error('Favorite list load failed', error)
      wx.showToast({ title: 'Load failed', icon: 'none' })
      that.setData({ rooms: [] })
    } finally {
      that.setData({ loading: false })
    }
  },

  goRoomDetail: function (event) {
    var room = event && event.detail ? event.detail.room : null
    var roomId = room && room.roomId ? room.roomId : ''
    if (!roomId) {
      return
    }

    wx.navigateTo({
      url: '/pages/room-detail/index?roomId=' + roomId
    })
  }
})
