const ajax = require('../../utils/ajax.js');
const utils = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    showView: true,
    isclose: true,
    searchvalue: "",
    searchreset: false,
    hotsearch: [{ message: "短裤" }, { message: "背带裙" }, { message: "牛仔裤男" }, { message: "运动 休闲男鞋" }, { message: "蕾丝连衣裙" }, { message: "电视" }, { message: "长裙" }, { message: "oppo" }, { message: "蓝牙耳机" }, { message: "女包" }, { message: "格力空调" }, { message: "魅族" }],
    falg: true,
    hotsearch1: [{ message: "短裤" }, { message: "背带裙" }, { message: "牛仔裤男" }, { message: "运动 休闲男鞋" }, { message: "蕾丝连衣裙" }, { message: "电视" }, { message: "长裙" }, { message: "oppo" }, { message: "蓝牙耳机" }, { message: "女包" }, { message: "格力空调" }, { message: "魅族" }],
    hotsearch2: [{ message: "平板电脑" }, { message: "耳机" }, { message: "男鞋" }, { message: "iPhone" }, { message: "蕾丝连衣裙" }, { message: "电视" }, { message: "长裙" }, { message: "oppo" }, { message: "蓝牙耳机" }, { message: "女包" }, { message: "格力空调" }, { message: "魅族" }],
    historydata: [],
    historydatashow: false,
    searchresult: false,
    inputsearch: "",//输入框内的值,
    searchResult: [{ result: "小米CC9e" }, { result: "Redmi Note8Pro" }, { result: "华为Mate 30 pro" }, { result: "荣耀20" }, { result: "荣耀20S" }]


  },

  bindSearchFouce: function(){
    this.setData({
      show: true,
      showView: false,
      isclose: false,
      searchresult: true,
    })
  },

  

  bindSearchBlur: function(){
    this.setData({
      show: false,
      showView: true,
      searchresult: false,
    })
  },

  bindSearchConfirm: function(e){
    var that = this;
    var formData = e.detail.value;
    console.log(formData)
    if (formData) {

      ajax.request({

        url: '/server/search/',
        data: {
          title: formData
        },
        // success: function (res) {
        //   that.setData({
        //     search: res.data,
        //   })
          // if (res.data.msg == '无相关视频') {
          //   wx.showToast({
          //     title: '无相关视频',
          //     icon: 'none',
          //     duration: 1500
          //   })
          // } else {
          //   let str = JSON.stringify(res.data.result.data);
          //   wx.navigateTo({
          //     url: '../searchShow/searchShow?data=' + str
          //   })
          // }

          // console.log(res.data.msg)
        // }
      })
    } else {

      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        duration: 1500
      })

    }
  },


  //点击X
  resetinput: function () {
    this.setData({
      searchreset: false,
      isclose: true,
      inputsearch: "",
      searchresult: false


    })
  },
  /*取消搜索 */
  cancelsearch: function () {
    wx.navigateBack({
      url: '../home/home'
    })
  },
  /*换一批操作 */
  changeother: function () {
    this.setData({
      falg: !this.data.falg
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 历史搜索
    let that = this
    wx.getStorage({
      key: 'historydata',
      success: function (res) {
        console.log(res.data)
        that.setData({
          historydatashow: true,
          historydata: res.data
        })
      }
    })
  },
})
