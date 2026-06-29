const {
  fetchRoomById
} = require('../../services');
const { formatRent, formatPhone } = require('../../utils/format');
const { goBack } = require('../../utils/navigation');

Page({
  data: {
    room: null,
    imageList: [],
    pageTitle: '房间详情',
    loading: true,
    formatRent,
    formatPhone
  },

  onLoad(options) {
    this.roomId = options.roomId || '';
    this.loadRoomDetail();
  },

  async loadRoomDetail() {
    if (!this.roomId) {
      wx.showToast({
        title: '缺少房间信息',
        icon: 'none'
      });
      goBack();
      return;
    }

    wx.showLoading({ title: '加载中' });

    try {
      const room = await fetchRoomById(this.roomId);

      this.setData({
        room,
        imageList: room ? room.gallery : [],
        pageTitle: room ? `Room${room.number}` : '房间详情',
        loading: false
      });
    } catch (error) {
      wx.showToast({
        title: '房间详情加载失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    } finally {
      wx.hideLoading();
    }
  },

  handleCall() {
    if (!this.data.room) {
      return;
    }

    wx.makePhoneCall({
      phoneNumber: this.data.room.phone
    });
  },

  handleCopyWechat() {
    if (!this.data.room) {
      return;
    }

    wx.setClipboardData({
      data: this.data.room.wechat,
      success: () => {
        wx.showToast({
          title: '微信号已复制',
          icon: 'success'
        });
      }
    });
  }
});
