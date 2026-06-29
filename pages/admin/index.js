var services = require('../../services/index')

Page({
  data: {
    loading: false,
    communityCount: 0,
    buildingCount: 0,
    roomCount: 0,
    rentedCount: 0,
    availableCount: 0,
    rentedRate: '0%'
  },

  onLoad: function () {
    this.loadStats()
  },

  onShow: function () {
    this.loadStats()
  },

  loadStats: function () {
    var that = this
    that.setData({ loading: true })

    return Promise.all([
      services.getCommunityList(),
      services.getBuildingList(),
      services.getRoomList()
    ])
      .then(function (res) {
        var communities = Array.isArray(res && res[0]) ? res[0] : []
        var buildings = Array.isArray(res && res[1]) ? res[1] : []
        var rooms = Array.isArray(res && res[2]) ? res[2] : []
        var rented = rooms.filter(function (room) {
          return room && room.status === '已租'
        }).length
        var total = rooms.length
        var rate = total > 0 ? Math.round((rented / total) * 100) + '%' : '0%'

        that.setData({
          communityCount: communities.length,
          buildingCount: buildings.length,
          roomCount: total,
          rentedCount: rented,
          availableCount: total - rented,
          rentedRate: rate
        })
      })
      .catch(function (error) {
        console.error('管理统计加载失败', error)
        wx.showToast({ title: '统计加载失败', icon: 'none' })
        that.setData({
          communityCount: 0,
          buildingCount: 0,
          roomCount: 0,
          rentedCount: 0,
          availableCount: 0,
          rentedRate: '0%'
        })
      })
      .finally(function () {
        that.setData({ loading: false })
      })
  }
})
