var services = require('../../services/index')

Page({
  data: {
    keyword: '',
    loading: false,
    results: []
  },

  onLoad: function (options) {
    var keyword = options && options.keyword ? decodeURIComponent(options.keyword) : ''
    this.setData({ keyword: keyword || '' })
    if (keyword) {
      this.loadResults(keyword)
    }
  },

  onSearchInput: function (event) {
    var value = event && event.detail ? event.detail.value : ''
    this.setData({ keyword: value || '' })
  },

  onSearchConfirm: function (event) {
    var value = event && event.detail ? event.detail.value : ''
    var keyword = value || this.data.keyword || ''
    if (!keyword) {
      wx.showToast({ title: '请输入关键词', icon: 'none' })
      return
    }

    this.setData({ keyword: keyword })
    this.loadResults(keyword)
  },

  loadResults: function (keyword) {
    var that = this
    that.setData({ loading: true })

    return services.searchService({ keyword: keyword || that.data.keyword || '' })
      .then(function (results) {
        that.setData({
          results: Array.isArray(results) ? results : []
        })
      })
      .catch(function (error) {
        console.error('搜索加载失败', error)
        wx.showToast({ title: '搜索失败', icon: 'none' })
        that.setData({ results: [] })
      })
      .finally(function () {
        that.setData({ loading: false })
      })
  },

  goResult: function (event) {
    var dataset = event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset : {}
    var type = dataset.type || ''
    var id = dataset.id || ''
    var roomId = dataset.roomid || ''
    var communityId = dataset.communityid || ''

    if (!type) {
      return
    }

    if (type === 'room') {
      wx.navigateTo({
        url: '/pages/room-detail/index?roomId=' + (roomId || id || '')
      })
      return
    }

    wx.navigateTo({
      url: '/pages/buildings/index?communityId=' + (communityId || '')
    })
  }
})
