var services = require('../../services/index')
var format = require('../../utils/format')

Page({
  data: {
    room: null,
    imageList: [],
    pageTitle: '房间详情',
    loading: true,
    formatRent: format.formatRent
  },

  onLoad: function (options) {
    this.roomId = options && options.roomId ? options.roomId : ''
    this.loadRoomDetail()
  },

  loadRoomDetail: function () {
    var that = this

    if (!that.roomId) {
      wx.showToast({
        title: '缺少房间信息',
        icon: 'none'
      })
      that.setData({ loading: false })
      return
    }

    wx.showLoading({ title: '加载中' })

    return services.getRoomById(that.roomId)
      .then(function (room) {
        that.setData({
          room: room || null,
          imageList: room ? (room.gallery && room.gallery.length ? room.gallery : [room.cover].filter(Boolean)) : [],
          pageTitle: room ? room.title || (room.number ? 'Room' + room.number : '房间详情') : '房间详情',
          loading: false
        })
      })
      .catch(function (error) {
        console.error('房间详情加载失败', error)
        wx.showToast({
          title: '房间详情加载失败',
          icon: 'none'
        })
        that.setData({ loading: false })
      })
      .finally(function () {
        wx.hideLoading()
      })
  }
})
