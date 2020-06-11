// keys 填写腾讯地图sdk的的密钥，并把腾讯的sdk下载放到libs目录下
var keys = ''
var _page, _this;
const ajax = require('../../utils/ajax.js');
const utils = require('../../utils/util.js');
var page = 1;
var ifLoadMore = null;
var sectionData = [];

Page({
  data: {
    custonItem: '全部',
    cardCur: 0,
    swiperList: null,
    menus: null,
    brands: [
      {
        name: '雅诗兰黛EsteeLauder化妆品专场',
        remark: '跨品牌满498减100，上不封顶。',
        imgUrl: "https://a.vimage1.com/upcb/2018/04/20/175/ias_152423133788119_604x290_80.jpg"
      },
      {
        name: '欧莱雅Loreal化妆品专场',
        remark: '欧莱雅专场 满199减60 上不封顶。',
        imgUrl: "https://a.vimage1.com/upcb/2018/05/04/6/ias_152542727279118_604x290_80.jpg"
      },
      {
        name: '兰蔻Lancome化妆品专场',
        remark: '兰蔻专场 满350减50 上不封顶。',
        imgUrl:  "https://a.vimage1.com/upcb/2018/05/04/82/ias_152541360171054_604x290_80.jpg"
      },
    ],
    hidden: true,
  },
  onLoad() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    var that = this
    that.bannerShow();
    that.menuShow();
    that.newGoodsShow();
    // this.towerSwiper('swiperList');
    _this = this;
    wx.getLocation({
      success: function(res) {
        _this.getDistrict(res.latitude, res.longitude)
      },
    })
    // 初始化towerSwiper 传已有的数组名即可
  },

  onReady() {
    wx.hideLoading()
  },

  getDistrict(latitude, longitude) {
    _page = this;
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${keys}`,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.result.address_component.district, res.data.result)

        // 省
        let province = res.data.result.address_component.province;
        // 市
        let city = res.data.result.address_component.city;
        // 区
        let district = res.data.result.address_component.district;

        _page.setData({
          district: res.data.result.address_component.district,
          region: [province, city, district]
        })
      }
    })
  },

  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  bannerShow: function(success){
    var that = this;
    ajax.request({
      method: 'GET',
      url: '/server/banner',
      success: data => {
        that.setData({
          swiperList: data
        })
        // console.log(data)
      }
    })
  },

  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // // towerSwiper
  // // 初始化towerSwiper
  // towerSwiper(name) {
  //   let list = this.data[name];
  //   for (let i = 0; i < list.length; i++) {
  //     list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
  //     list[i].mLeft = i - parseInt(list.length / 2)
  //   }
  //   this.setData({
  //     swiperList: list
  //   })
  // },
  // // towerSwiper触摸开始
  // towerStart(e) {
  //   this.setData({
  //     towerStart: e.touches[0].pageX
  //   })
  // },
  // // towerSwiper计算方向
  // towerMove(e) {
  //   this.setData({
  //     direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
  //   })
  // },
  // // towerSwiper计算滚动
  // towerEnd(e) {
  //   let direction = this.data.direction;
  //   let list = this.data.swiperList;
  //   if (direction == 'right') {
  //     let mLeft = list[0].mLeft;
  //     let zIndex = list[0].zIndex;
  //     for (let i = 1; i < list.length; i++) {
  //       list[i - 1].mLeft = list[i].mLeft
  //       list[i - 1].zIndex = list[i].zIndex
  //     }
  //     list[list.length - 1].mLeft = mLeft;
  //     list[list.length - 1].zIndex = zIndex;
  //     this.setData({
  //       swiperList: list
  //     })
  //   } else {
  //     let mLeft = list[list.length - 1].mLeft;
  //     let zIndex = list[list.length - 1].zIndex;
  //     for (let i = list.length - 1; i > 0; i--) {
  //       list[i].mLeft = list[i - 1].mLeft
  //       list[i].zIndex = list[i - 1].zIndex
  //     }
  //     list[0].mLeft = mLeft;
  //     list[0].zIndex = zIndex;
  //     this.setData({
  //       swiperList: list
  //     })
  //   }
  // },

  search: function(){
    wx.navigateTo({
      url: '../wxSearch/wxSearch',
    })
  },

  menuShow: function(success){
    var that = this
    ajax.request({
      method: 'GET',
      url: '/server/nav_menu/',
      success : data => {
        that.setData({
          menus: data
        })
        // console.log(data)
      }
    })
  },

  newGoodsShow: function (success) {
    var that = this;
    ajax.request({
      method: 'GET',
      url: '/server/goods/?page=' + page + '&size=4',
      success: data => {
        console.log(data)
        var newGoodsData = data.results;
        console.log(newGoodsData)
        page += 1;
        if (ifLoadMore) {
          //加载更多
          if (data.next != null) {
            // console.log('new',newGoodsData)
            //日期以及title长度处理
            for (var i in newGoodsData) {
              //商品名称长度处理
              var name = newGoodsData[i].g_name;
              if (name.length > 26) {
                newGoodsData[i].g_name = name.substring(0, 23) + '...';
              }
            }
            sectionData['newGoods'] = sectionData['newGoods'].concat(newGoodsData);
          } else{
            ifLoadMore = false;
            for (var i in newGoodsData) {
              //商品名称长度处理
              var name = newGoodsData[i].g_name;
              if (name.length > 26) {
                newGoodsData[i].g_name = name.substring(0, 23) + '...';
              }
            }
            sectionData['newGoods'] = sectionData['newGoods'].concat(newGoodsData);
            this.setData({
              hidden: true
            })
            // wx.showToast({
            //   title: '暂无更多内容！',
            //   icon: 'loading',
            //   duration: 2000
            // })
          }

        } else {
          if (ifLoadMore == null) {
            ifLoadMore = true;

            //日期以及title长度处理
            for (var i in newGoodsData) {
              //商品名称长度处理
              var name = newGoodsData[i].g_name;
              if (name.length > 26) {
                newGoodsData[i].g_name = name.substring(0, 23) + '...';
              }
            }
            sectionData['newGoods'] = newGoodsData;//刷新
          }

        }
        that.setData({
          newGoods: sectionData['newGoods'],
          // isHideLoadMore: true
        });
        wx.stopPullDownRefresh();//结束动画
      }
    })
  },

  catchTapCategory: function(e){
    console.log(e.currentTarget.dataset.goodsid)
    
    var goodsId = e.currentTarget.dataset.goodsid
    
    wx.navigateTo({ url: '../detail/detail?goodsId=' + goodsId })
  },

  onReachBottom: function () {
    // console.log("上拉");
    var that = this;
    // console.log('加载更多');
    if (ifLoadMore != null && ifLoadMore == true) {
      that.newGoodsShow();
    } else {
      wx.showToast({
        title: '暂无更多内容！',
        icon: 'loading',
        duration: 1000
      })
    }
  },
})