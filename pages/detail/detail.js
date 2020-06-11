// pages/detail/detail.js
// const app = getApp()
const ajax = require('../../utils/ajax.js');
const utils = require('../../utils/util.js');
var imgUrls = [];
var detailImg = [];
var goodsId = null;
var goods = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid : null,
    getopenid: null,
    isLike: false,
    showDialog: false,
    goods: null,
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
  },

  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgUrls // 需要预览的图片http链接列表  
    })
  },

  // 收藏
  addLike() {
    console.log(!this.data.isLike)
    this.setData({
       isLike: !this.data.isLike,
    });
    ajax.request({
      method: 'POST',
      url: '/server/islike/',
      data: {
        uuid: this.data.openid,
        goodid: goodsId
      },
    })
    wx.showToast({
      title: this.data.isLike?'收藏成功':'取消收藏',
      icon: 'success'
    })
  },
  // 跳到购物车
  toCar() {
    wx.switchTab({ url: '../cart/cart' })
  },
  // 立即购买
  immeBuy() {
    wx.showToast({
      title: '购买成功',
      icon: 'success',
      duration: 2000
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openid = wx.getStorageSync('openid')
    goodsId = options.goodsId;
    console.log('goodsId:' + goodsId);
    console.log(openid)
    if (openid == "") {
      wx.showToast({
        title: '用户未登陆,即将跳转到登陆页面',
        icon: 'none',
        duration: 2000,
        success: function () {
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }, 2000)
        }
      })
    }
    //加载商品详情
    this.setData({
      openid : wx.getStorageSync('openid')
    })
    console.log(this.data.openid)
    that.getLike();
    that.goodsInfoShow();
  },
  goodsInfoShow: function (success) {
    var that = this;
    ajax.request({
      method: 'GET',
      url: '/server/gooddetails/' + goodsId,
      success: data => {
        console.log(data.shopGoodsImageList)
        var goodsItem = data;
        for (var i = 0; i < goodsItem.shopGoodsImageList.length; i++) {
          imgUrls[i] = goodsItem.shopGoodsImageList[i].imgUrl;
        }
        var details = goodsItem.details.split(";");
        for (var j = 0; j < details.length; j++) {
          detailImg[j] = details[j];
        }
        goods = {
          imgUrls: imgUrls,
          name: goodsItem.name,
          price: goodsItem.price,
          privilegePrice: goodsItem.privilegePrice,
          detailImg: detailImg,
          imgUrl: goodsItem.imgUrl,
          buyRate: goodsItem.buyRate,
          goodsId: goodsId,
          count: 1,
          totalMoney: goodsItem.price,
        }

        that.setData({
          goods: goods
        })
        console.log(goods.name)
      }
    })
  },

  getLike: function (success) {
    var that = this
    ajax.request({
      url: '/server/islike/',
      data: {
        uuid: this.data.openid,
        goodid: goodsId,
      },
      method: 'GET',
      success: data => {
        console.log(data[0])
        if (data[0] == undefined){
          return
        }else if (data[0].like){
          this.setData({
            isLike : !this.data.isLike
          })
          // console.log(islike)
        }
      },
    })

  },

  /**
   * sku 弹出
   */
  toggleDialog: function () {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  /**
   * sku 关闭
   */
  closeDialog: function () {
    console.info("关闭");
    this.setData({
      showDialog: false
    });
  },
  /* 减数 */
  delCount: function (e) {
    console.log("刚刚您点击了减1");
    var count = this.data.goods.count;
    // 商品总数量-1
    if (count > 1) {
      this.data.goods.count--;
    }
    // 将数值与状态写回  
    this.setData({
      goods: this.data.goods
    });
    this.priceCount();
  },
  /* 加数 */
  addCount: function (e) {
    console.log("刚刚您点击了加1");
    var count = this.data.goods.count;
    // 商品总数量-1  
    if (count < 10) {
      this.data.goods.count++;
    }
    // 将数值与状态写回  
    this.setData({
      goods: this.data.goods
    });
    this.priceCount();
  },
  //价格计算
  priceCount: function (e) {
    this.data.goods.totalMoney = this.data.goods.price * this.data.goods.count;
    this.setData({
      goods: this.data.goods
    })
  },
  /**
   * 加入购物车
   */
  addCar: function (e) {
    var goods = this.data.goods;
    goods.isSelect = false;
    var count = this.data.goods.count;

    var name = this.data.goods.name;
    if (name.length > 13) {
      goods.name = name.substring(0, 23) + '...';
    }

    // 获取购物车的缓存数组（没有数据，则赋予一个空数组）  
    var arr = wx.getStorageSync('cart') || [];
    console.log("arr,{}", arr);
    if (arr.length > 0) {
      // 遍历购物车数组  
      for (var j in arr) {
        // 判断购物车内的item的id，和事件传递过来的id，是否相等  
        if (arr[j].goodsId == goodsId) {
          // 相等的话，给count+1（即再次添加入购物车，数量+1）  
          arr[j].count = arr[j].count + 1;
          // 最后，把购物车数据，存放入缓存（此处不用再给购物车数组push元素进去，因为这个是购物车有的，直接更新当前数组即可）  
          try {
            wx.setStorageSync('cart', arr)
          } catch (e) {
            console.log(e)
          }
          //关闭窗口
          wx.showToast({
            title: '加入购物车成功！',
            icon: 'success',
            duration: 2000
          });
          this.closeDialog();
          // 返回（在if内使用return，跳出循环节约运算，节约性能） 
          return;
        }
      }
      // 遍历完购物车后，没有对应的item项，把goodslist的当前项放入购物车数组  
      arr.push(goods);
    } else {
      arr.push(goods);
    }
    // 最后，把购物车数据，存放入缓存  
    try {
      wx.setStorageSync('cart', arr)
      // 返回（在if内使用return，跳出循环节约运算，节约性能） 
      //关闭窗口
      wx.showToast({
        title: '加入购物车成功！',
        icon: 'success',
        duration: 2000
      });
      this.closeDialog();
      return;
    } catch (e) {
      console.log(e)
    }
  }
})