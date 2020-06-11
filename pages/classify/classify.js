const app = getApp()
const ajax = require('../../utils/ajax.js');
const utils = require('../../utils/util.js');
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    load: true,
    classifylist: [],
  },
  onLoad() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    var that = this;
    that.navMenu()
  },

  navMenu: function(success) {
    var that = this;
    ajax.request({
      url: '/server/goodtypes',
      method: 'GET',
      success: data => {
        that.setData({
          list: data,
        })
        console.log(data)
      }
    })
  },


  onReady() {
    wx.hideLoading()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
})