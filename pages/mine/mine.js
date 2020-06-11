const app = getApp()
const ajax = require('../../utils/ajax.js');
const utils = require('../../utils/util.js');

Page({
  data: {
    userInfo: {},
    isHide: true,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderItems: [{
        typeId: 0,
        name: '待付款',
        url: 'bill',
        imageurl: '../../images/person/personal_pay.png',
      },
      {
        typeId: 1,
        name: '待收货',
        url: 'bill',
        imageurl: '../../images/person/personal_receipt.png',
      },
      {
        typeId: 2,
        name: '待评价',
        url: 'bill',
        imageurl: '../../images/person/personal_comment.png'
      },
      {
        typeId: 3,
        name: '退换/售后',
        url: 'bill',
        imageurl: '../../images/person/personal_service.png'
      }
    ],

  },
  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },

  toOrder: function() {
    wx.navigateTo({
      url: '../allOrder/allOrder'
    })
  },

  onLoad: function() {
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    console.log(app.globalData.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.authorize()
          this.setData({
            userInfo: res.userInfo,

          })
        }
      })
    console.log(res)
    }  
    // wx.getSetting({
    //   success: function(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: function(res) {
    //           wx.login({
    //             success: res => {
    //               console.log(res.code)
    //               var code = res.code
    //               var appId = app.globalData.appId
    //               var nickname = app.globalData.userInfo.nickName
    //               var gender = app.globalData.userInfo.gender
    //               var avatarUrl = app.globalData.userInfo.avatarUrl
    //               wx.request({
    //                 url: app.globalData.serverUrl + app.globalData.apiVersion + '/auth/user',
    //                 method: 'POST',
    //                 data: {
    //                   code: code,
    //                   appId: appId,
    //                   nickname: nickname,
    //                   gender: gender,
    //                   avatarUrl: avatarUrl
    //                 },
    //                 header: {
    //                   'content-type': 'application/json'
    //                 },
    //               })
    //             }
    //           })
    //         }
    //       })
    //     } else {
    //       that.setData({
    //         isHide: true
    //       })
    //     }
    //   }
    // })
  },


  getUserInfo: function(e) {
    var that = this
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    console.log(app.globalData.userInfo)
    that.authorize()
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        isHide: false
      })
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
    console.log('getuserinfo',this.data.userInfo)
    console.log(this.data.hasUserInfo)
  },
  

  authorize: function() {
    wx.login({
      success(res) {
        if (res.code) {
          var code = res.code
          var appId = app.globalData.appId
          var nickname = app.globalData.userInfo.nickName
          var gender = app.globalData.userInfo.gender
          var avatarUrl = app.globalData.userInfo.avatarUrl
          ajax.request({
            url: '/auth/user',
            method: 'POST',
            data: {
              code: code,
              appId: appId,
              nickname: nickname,
              gender: gender,
              avatarUrl: avatarUrl
            },
            header: {
              'content-type': 'application/json'
            },
            success: function(res) {
              wx.setStorageSync('openid', res.uuid)
            },
          })
        } else {
          console.log('授权失败' + res.errMsg)
        }
      },

    })
  },

  myAddress: function(e) {
    wx.navigateTo({
      url: '../addressList/addressList'
    });
  },

  myLike: function(e) {
    wx.navigateTo({
      url: '../like/like',
    })
  }
})