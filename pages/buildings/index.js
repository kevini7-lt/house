var services = require('../../services/index')

Page({
  data: {
    loading: false,
    communityId: '',
    community: null,
    buildings: []
  },

  onLoad: function (options) {
    var communityId = options && options.communityId ? options.communityId : ''
    this.setData({ communityId: communityId })
    this.loadBuildings(communityId)
  },

  loadBuildings: function (communityId) {
    var that = this
    that.setData({ loading: true })

    return Promise.all([
      services.getCommunityById(communityId),
      services.getBuildingList({ communityId: communityId })
    ])
      .then(function (res) {
        that.setData({
          community: res && res[0] ? res[0] : null,
          buildings: Array.isArray(res && res[1]) ? res[1] : []
        })
      })
      .catch(function (error) {
        console.error('楼栋数据加载失败', error)
        wx.showToast({ title: '楼栋加载失败', icon: 'none' })
        that.setData({ community: null, buildings: [] })
      })
      .finally(function () {
        that.setData({ loading: false })
      })
  },

  goRooms: function (event) {
    var building = event && event.detail ? event.detail.building : null
    var buildingId = building && building.id ? building.id : ''
    if (!buildingId) {
      wx.showToast({ title: '楼栋信息不存在', icon: 'none' })
      return
    }
    wx.navigateTo({
      url: '/pages/rooms/index?buildingId=' + buildingId + '&communityId=' + (this.data.communityId || '')
    })
  }
})
