// pages/address/address.js
// keys 腾讯地图sdk密钥
var keys = ''
var _page, _this;
var app = getApp()
var addressList = null;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag: true,
    userInfo: {},
    transportValues: ["收货时间不限", "周六日/节假日收货", "周一至周五收货"],
    transportIndex: 0,
    custonItem: '全部',
    province: '',
    city: '',
    country: '',
  },

  onLoad(e) {
    _this = this;
    // console.log(e.address)
    if (e.address != undefined) {
      var address = JSON.parse(e.address)
      // console.log(address) 
      this.setData({
        address: address,
        id: e.id,
      })
    }
  

    wx.getLocation({
      success: function(res) {
        _this.getDistrict(res.latitude, res.longitude)
      },
    })

    var that = this;
    //获取用户信息
    wx.getUserInfo({
      success: function(res) {
        // console.log(res);
        that.data.userInfo = res.userInfo;
        that.setData({
          userInfo: that.data.userInfo
        })
      }
    })
  },

  

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },



  getDistrict(latitude, longitude) {
    _page = this;
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${keys}`,
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res.data.result.address_component.district, res.data.result)
        // console.log(res.data.result.address_component)
        // 省
        var province = res.data.result.address_component.province;
        // 市
        var city = res.data.result.address_component.city;
        // 区
        var district = res.data.result.address_component.district;

        _page.setData({
          region: [province, city, district],
          province: province,
          city: city,
          country: district
        })
      }
    })
  },

  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
    })
  },

  onShow(e) {
    console.log(this.data.address)
    if (this.data.address != undefined) {
      this.setData({
        tag: false
      })
    }
  },

  saveAddress: function(e) {
    var consignee = e.detail.value.consignee;
    var mobile = e.detail.value.mobile;
    var transportDay = e.detail.value.transportDay;
    var province = e.detail.value.province;
    var city = e.detail.value.city;
    var county = e.detail.value.county;
    var address = e.detail.value.address;

    if (e.detail.value.consignee == "") {
      wx.showModal({
        title: '提示',
        content: '请输入您的姓名！',
      })
    } else if (e.detail.value.mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请输入您的手机号码！',
      })
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.mobile))) {
      wx.showModal({
        title: '提示',
        content: '手机号格式不正确',
      })
    } else if (e.detail.value.address == "") {
      wx.showModal({
        title: '提示',
        content: '请输入您的详细地址',
      })
    } else {
      // console.log(transportDay + "," + province + "," + city + "," + county + "," + address); //输出该文本 
      // console.log(e.detail.value);
      // console.log(this.data.tag)

      if (this.data.tag == true) {
        console.log(this.data.tag)
        // 保存数据
        var arr = wx.getStorageSync('addressList') || [];
        console.log("arr,{}", arr);
        addressList = {
          consignee: consignee,
          mobile: mobile,
          address: province + city + county,
          door_card: address,
          transportDay: transportDay
        }
        console.log(addressList)
        arr.push(addressList);
        wx.setStorageSync('addressList', arr);
        wx.navigateBack({
        })
      } else{
        var arr = wx.getStorageSync('addressList') || [];
        console.log(arr[this.data.id])
        addressList = {
          consignee: consignee,
          mobile: mobile,
          address: province + city + county,
          door_card: address,
          transportDay: transportDay
        }
        arr[this.data.id] = addressList
        console.log(arr[this.data.id])
        wx.setStorageSync('addressList', arr);
        wx.navigateBack({
          
        })
      }
    }
  }
})