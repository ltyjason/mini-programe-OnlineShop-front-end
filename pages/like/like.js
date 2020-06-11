// pages/like/like.js
// const app = getApp()
const ajax = require('../../utils/ajax.js');
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: null,
    likes: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //加载商品详情
    this.setData({
      openid: wx.getStorageSync('openid')
    })
    this.getLikes()
  },

  getLikes: function(success) {
    var that = this
    ajax.request({
      url: '/server/islikes/',
      data: {
        uuid: this.data.openid,
      },
      method: 'GET',
      success: data => {
        // console.log(data.data)
        this.setData({
          likes: data,
        })
      }      
    })   
  },

  toDetail: function(e){
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../detail/detail?goodsId='+ goodsId,
    })
  }
})