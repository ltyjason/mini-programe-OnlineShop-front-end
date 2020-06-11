const app = getApp()
const ajax = require('../../utils/ajax.js');
// const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [], //数据 
    iscart: false,
    hidden: null,
    isAllSelect: false,
    totalMoney: 0,
    Allprice: 0,
  },

  shop: function() {
      wx.switchTab({
        url: "/pages/classify/classify",
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取产品展示页保存的缓存数据（购物车的缓存数组，没有数据，则赋予一个空数组）  
    
    
  },


  onReady: function() {
    var i;
    var Allprice = 0;
    for (i = 0; i < this.data.carts.length; i++) {
      Allprice = this.data.Allprice + (this.data.carts[i].price * this.data.carts[i].count);
      this.setData({
        Allprice: Allprice,
      })
    }
    for (i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].isSelect == true) {
        this.setData({
          totalMoney: this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count),
        })
        // console.log(this.data.totalMoney)
        if (Allprice == this.data.totalMoney) {
          this.setData({
            isAllSelect: true,
          })
        }
      }
    }
    // console.log(this.data.totalMoney)
    // console.log(Allprice)
  },

  onShow: function(e) {
    var openid = wx.getStorageSync('openid')
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
    var arr = wx.getStorageSync('cart') || [];
    
    console.info("缓存数据：" + arr);
    // 有数据的话，就遍历数据，计算总金额 和 总数量  
    if (arr.length > 0) {
      // 更新数据  
      this.setData({
        carts: arr,
        iscart: true,
        hidden: false
      });
      console.info("缓存数据：" + this.data.carts);
    } else {
      this.setData({
        iscart: false,
        hidden: true,
      });
    }
  },

  //勾选事件处理函数  
  switchSelect: function(e) {
    // 获取item项的id，和数组的下标值  
    var i = 0;
    let id = e.target.dataset.id,

      index = parseInt(e.target.dataset.index);
    this.data.carts[index].isSelect = !this.data.carts[index].isSelect;

    this.data.carts[id].isSelect = this.data.carts[index].isSelect;
    wx.setStorageSync('cart', this.data.carts)

    //价钱统计
    if (this.data.carts[index].isSelect) {
      this.data.totalMoney = this.data.totalMoney + (this.data.carts[index].price * this.data.carts[index].count);
    } else {
      this.data.totalMoney = this.data.totalMoney - (this.data.carts[index].price * this.data.carts[index].count);
    }
    //是否全选判断
    if (this.data.Allprice == this.data.totalMoney) {
      this.data.isAllSelect = true;
    }
    else {
      this.data.isAllSelect = false;
    }
    this.setData({
      carts: this.data.carts,
      totalMoney: this.data.totalMoney,
      isAllSelect: this.data.isAllSelect,
    })
  },
  //全选
  allSelect: function(e) {
    //处理全选逻辑
    let i = 0;
    if (!this.data.isAllSelect) {
      this.data.totalMoney = 0;
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = true;
        wx.setStorageSync('cart', this.data.carts)
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);

      }
    } else {
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = false;
        wx.setStorageSync('cart', this.data.carts)
      }
      this.data.totalMoney = 0;
    }
    this.setData({
      carts: this.data.carts,
      isAllSelect: !this.data.isAllSelect,
      totalMoney: this.data.totalMoney,
    })
  },
  // 去结算
  toBuy() {
    wx.navigateTo({
      url: '../pay/pay',
    })
  },

  /* 减数 */
  delCount: function(e) {
    var index = e.target.dataset.index;
    var totalMoney = 0;
    // 商品总数量-1
    if (this.data.carts[index].count <= 1) {
      wx.showToast({
        title: '数量为一不可再减少',
        icon: 'none',
        duration: 1000
      })
    } else {
      this.data.carts[index].count--;
      this.data.carts[index].totalMoney = this.data.carts[index].price * this.data.carts[index].count;
      this.data.Allprice = this.data.Allprice - this.data.carts[index].price * 1
      if (this.data.carts[index].isSelect == true) {
        totalMoney = this.data.totalMoney - (this.data.carts[index].price * 1);
        this.setData({
          totalMoney: totalMoney
        })
      }
    }
    // 将数值与状态写回  
    this.setData({
      carts: this.data.carts,
      Allprice: this.data.Allprice,
    });
    wx.setStorageSync('cart', this.data.carts)
    
  },
  /* 加数 */
  addCount: function(e) {
    var index = e.target.dataset.index;
    var totalMoney = 0;
    console.log("刚刚您点击了加+");
    // 商品总数量+1  
    this.data.carts[index].count++;
    this.data.carts[index].totalMoney = this.data.carts[index].price * this.data.carts[index].count;
    this.data.Allprice = this.data.Allprice + this.data.carts[index].price * 1
    if (this.data.carts[index].isSelect == true) {
      totalMoney = this.data.totalMoney + (this.data.carts[index].price * 1);
      this.setData({
        totalMoney: totalMoney,
      })
    }
    // 将数值与状态写回  
    this.setData({
      carts: this.data.carts,
      Allprice: this.data.Allprice,
    });
    wx.setStorageSync('cart', this.data.carts)
    
  },

  
  /* 删除item */
  delGoods: function(e) {
    this.data.carts.splice(e.target.id.substring(3), 1);
    // 更新data数据对象  
    if (this.data.carts.length > 0) {
      this.setData({
        carts: this.data.carts
      })
      wx.setStorageSync('cart', this.data.carts);
      this.priceCount();
    } else {
      this.setData({
        cart: this.data.carts,
        iscart: false,
        hidden: true,
      })
      wx.setStorageSync('cart', []);
    }
  },
})