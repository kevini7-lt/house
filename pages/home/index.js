var services = require('../../services/index')

Page({
  data: {
    loading: false,
    keyword: '',
    banners: [],
    communities: []
  },

  onLoad: function () {
    this.loadHome()
  },

  onPullDownRefresh: function () {
    this.loadHome().finally(function () {
      wx.stopPullDownRefresh()
    })
  },

  onSearchInput: function (event) {
    var value = event && event.detail ? event.detail.value : ''
    this.setData({ keyword: value || '' })
    this.loadHome(value || '')
  },

  loadHome: function (keyword) {
    var that = this
    that.setData({ loading: true })

    return services.getHomeList({ keyword: keyword || that.data.keyword || '' })
      .then(function (res) {
        that.setData({
          banners: Array.isArray(res && res.banners) ? res.banners : [],
          communities: Array.isArray(res && res.communities) ? res.communities : []
        })
      })
      .catch(function (error) {
        console.error('首页数据加载失败', error)
        wx.showToast({ title: '加载失败', icon: 'none' })
        that.setData({ banners: [], communities: [] })
      })
      .finally(function () {
        that.setData({ loading: false })
      })
  },

  goBuildings: function (event) {
    var id = event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.id : ''
    if (!id) {
      wx.showToast({ title: '小区信息不存在', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/buildings/index?communityId=' + id })
  }
})
