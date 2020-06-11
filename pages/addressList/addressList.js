// pages/address/addressList.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
  },

  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var arr = wx.getStorageSync('addressList') || [];
    console.info("缓存数据：" + arr);
    // 更新数据  
    this.setData({
      addressList: arr
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
  },


  addAddress: function () {
    wx.navigateTo({ url: '../address/address' });
  },

  modAddress: function(e) {
    console.log(e.currentTarget.dataset.id)
    // console.log(this.data.addressList[e.currentTarget.dataset.index])
    var address = e.currentTarget.dataset.index
    console.log(JSON.stringify(address))
    wx.navigateTo({
      url: '/pages/address/address?address='+ JSON.stringify(address) + '&id=' + e.currentTarget.dataset.id,
    })
  },

  /* 删除item */
  delAddress: function (e) {
    this.data.addressList.splice(e.target.id.substring(3), 1);
    // 更新data数据对象  
    if (this.data.addressList.length > 0) {
      this.setData({
        addressList: this.data.addressList
      })
      wx.setStorageSync('addressList', this.data.addressList);
    } else {
      this.setData({
        addressList: this.data.addressList
      })
      wx.setStorageSync('addressList', []);
    }
  },

  select: function(e) {
    var pages= getCurrentPages(); //获取页面栈
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    console.log(e.currentTarget.dataset.id)
    if (prevPage.__route__ == 'pages/pay/pay') {
      var address = {
        consignee: e.currentTarget.dataset.consignee,
        address: e.currentTarget.dataset.address,
        mobile: e.currentTarget.dataset.mobile,
        time: e.currentTarget.dataset.time,
        id: e.currentTarget.dataset.id,
      }
      
      console.log('为上一页的address赋值', address)
      prevPage.setData({
        address: address
      })
      wx.navigateBack({
        delta: 1
      })
    }
  }
})