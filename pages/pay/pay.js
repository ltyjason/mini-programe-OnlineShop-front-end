// pages/pay/pay.js
// const app = getApp()
const ajax = require('../../utils/ajax.js');
const utils = require('../../utils/util.js');

Page({
  data: {
    address: [],
    isShow: true,
    cart: [],
    picker: ['快递 免邮'],
    textareaValue: '',
    totalMoney: 0,
    totalCount: 0,
    isSelect: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var totalCount = 0;
    var totalMoney = 0;
    var cart = [];
    var carts =  wx.getStorageSync('cart')
    var i
    for (i = 0; i < carts.length; i++) {
      // console.log(carts[i])
      if (carts[i].isSelect == true){
        totalCount = totalCount + carts[i].count
        totalMoney = totalMoney + carts[i].totalMoney
        cart.push(carts[i])
      }
    }
    // console.log(cart)
    // console.log(JSON.stringify(cart))
    this.setData({
      cart: cart,
      totalMoney: totalMoney,
      totalCount: totalCount
    })
    ajax.request({
      url: '/server/order/',
      method: 'POST',
      data: {
        cart: this.data.cart
      }
    })

  },

  chooseAD: function(e){
      wx.navigateTo({
        url: '../addressList/addressList',
      })
  },

  choose: function (e) {
    wx.navigateTo({
      url: '../addressList/addressList',
    })
  },
  
  onShow: function (){
    console.log(this.data.address)
    if (this.data.address == "") {
      this.setData({
        isShow: true,
      })
    } else {
      this.setData({
        isShow: false,
      })
    }
  },

  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },

  textareaInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
  }
})