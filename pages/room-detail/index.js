var services = require('../../services/index')
var format = require('../../utils/format')

Page({
  data: {
    room: null,
    imageList: [],
    pageTitle: 'Room Detail',
    loading: true,
    formatRent: format.formatRent,
    favoriteActive: false,
    favoriteText: 'Favorite'
  },

  onLoad: function (options) {
    this.roomId = options && options.roomId ? options.roomId : ''
    this.loadRoomDetail()
  },

  onShow: function () {
    this.refreshFavoriteState()
  },

  refreshFavoriteState: function () {
    if (!this.roomId) {
      return
    }

    var active = services.isFavorite(this.roomId)
    this.setData({
      favoriteActive: active,
      favoriteText: active ? 'Favorited' : 'Favorite'
    })
  },

  loadRoomDetail: function () {
    var that = this

    if (!that.roomId) {
      wx.showToast({
        title: 'Missing room',
        icon: 'none'
      })
      that.setData({ loading: false })
      return
    }

    wx.showLoading({ title: 'Loading' })

    return services.getRoomById(that.roomId)
      .then(function (room) {
        that.setData({
          room: room || null,
          imageList: room ? (room.gallery && room.gallery.length ? room.gallery : [room.cover].filter(Boolean)) : [],
          pageTitle: room ? room.title || (room.number ? 'Room' + room.number : 'Room Detail') : 'Room Detail',
          loading: false
        })
        that.refreshFavoriteState()
      })
      .catch(function (error) {
        console.error('Room detail load failed', error)
        wx.showToast({
          title: 'Load failed',
          icon: 'none'
        })
        that.setData({ loading: false })
      })
      .finally(function () {
        wx.hideLoading()
      })
  },

  handleFavorite: function () {
    if (!this.roomId) {
      return
    }

    var active = services.toggleFavorite(this.roomId)
    this.setData({
      favoriteActive: active,
      favoriteText: active ? 'Favorited' : 'Favorite'
    })
  }
})
