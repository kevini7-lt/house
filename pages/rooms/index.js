var services = require('../../services/index')

Page({
  data: {
    loading: false,
    communityId: '',
    buildingId: '',
    keyword: '',
    building: null,
    rooms: [],
    filters: {
      priceMin: '',
      priceMax: '',
      roomType: '',
      buildingNo: '',
      status: ''
    },
    roomTypeOptions: ['全部', '单间', '一室一厅', '两室一厅'],
    statusOptions: ['全部', '可租', '已租'],
    roomTypeIndex: 0,
    statusIndex: 0
  },

  onLoad: function (options) {
    var communityId = options && options.communityId ? options.communityId : ''
    var buildingId = options && options.buildingId ? options.buildingId : ''
    var keyword = options && options.keyword ? options.keyword : ''

    this.setData({
      communityId: communityId,
      buildingId: buildingId,
      keyword: keyword || ''
    })
    this.loadRooms()
  },

  loadRooms: function () {
    var that = this
    var filters = this.data.filters

    that.setData({ loading: true })

    return Promise.all([
      services.getBuildingById(this.data.buildingId),
      services.filterRoomList({
        communityId: this.data.communityId,
        buildingId: this.data.buildingId,
        keyword: this.data.keyword,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        roomType: filters.roomType,
        buildingNo: filters.buildingNo,
        status: filters.status
      })
    ])
      .then(function (res) {
        that.setData({
          building: res && res[0] ? res[0] : null,
          rooms: Array.isArray(res && res[1]) ? res[1] : []
        })
      })
      .catch(function (error) {
        console.error('Room list load failed', error)
        wx.showToast({ title: 'Load failed', icon: 'none' })
        that.setData({ building: null, rooms: [] })
      })
      .finally(function () {
        that.setData({ loading: false })
      })
  },

  onPriceMinInput: function (event) {
    this.setData({
      'filters.priceMin': event && event.detail ? event.detail.value : ''
    })
  },

  onPriceMaxInput: function (event) {
    this.setData({
      'filters.priceMax': event && event.detail ? event.detail.value : ''
    })
  },

  onBuildingNoInput: function (event) {
    this.setData({
      'filters.buildingNo': event && event.detail ? event.detail.value : ''
    })
  },

  onRoomTypeChange: function (event) {
    var index = event && event.detail ? Number(event.detail.value) : 0
    var value = this.data.roomTypeOptions[index] || '全部'
    this.setData({
      roomTypeIndex: index,
      'filters.roomType': value === '全部' ? '' : value
    })
  },

  onStatusChange: function (event) {
    var index = event && event.detail ? Number(event.detail.value) : 0
    var value = this.data.statusOptions[index] || '全部'
    this.setData({
      statusIndex: index,
      'filters.status': value === '全部' ? '' : value
    })
  },

  applyFilters: function () {
    this.loadRooms()
  },

  resetFilters: function () {
    this.setData({
      filters: {
        priceMin: '',
        priceMax: '',
        roomType: '',
        buildingNo: '',
        status: ''
      },
      roomTypeIndex: 0,
      statusIndex: 0
    })
    this.loadRooms()
  },

  goRoomDetail: function (event) {
    var room = event && event.detail ? event.detail.room : null
    var roomId = room && room.roomId ? room.roomId : ''
    if (!roomId) {
      wx.showToast({ title: '房间信息不存在', icon: 'none' })
      return
    }

    wx.navigateTo({
      url: '/pages/room-detail/index?roomId=' + roomId
    })
  }
})
