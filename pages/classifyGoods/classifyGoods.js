// const app = getApp()
const ajax = require('../../utils/ajax.js');
const utils = require('../../utils/util.js');
var sectionData = [];
var ifLoadMore = null;
var classifyId = null;
var page = 1;//默认第一页
Page({

  data: {
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: []
  },

  onLoad: function (options) {
    classifyId = options.classifyId;
    page = 1;
    ifLoadMore = null;
    // console.log('classifyId:' + classifyId);
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });

        //加载首组图片
        // this.loadImages();
        this.brandShow();
      }
    })
  },

  onImageLoad1: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    let images = this.data.brandGoods;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id + "" === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;
    // console.log(this.data)
    // console.log(col1)
    // console.log(col2)

    //判断当前图片添加到左列还是右列
    if (col1.length <= col2.length) {
      col1.push(imageObj);
    } else {
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    //当前这组图片已加载完毕，则清空图片临时加载区域的内容
    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },

  brandShow: function (success) {
    var that = this;
    // console.log(page)
    ajax.request({
      method: 'GET',
      url: '/server/goods/' + classifyId + '?page' + page + '&size=10',
      success: data => {
        var newGoodsData = data.results;
        page += 1;
        console.log(ifLoadMore)
        if (ifLoadMore) {
          //加载更多
          if (newGoodsData.length > 0) {
            console.log(newGoodsData);
            for (var i in newGoodsData) {
              //商品名称长度处理
              var name = newGoodsData[i].g_name;
              if (name.length > 26) {
                newGoodsData[i].g_name = name.substring(0, 23) + '...';

              }
            }
            sectionData['brandGoods'] = newGoodsData;
            

          } else {
            ifLoadMore = false;
            this.setData({
              hidden: true
            })

            wx.showToast({
              title: '暂无更多内容！',
              icon: 'loading',
              duration: 2000
            })
          }

        } else {
          if (ifLoadMore == null) {
            ifLoadMore = true;
            for (var i in newGoodsData) {
              //商品名称长度处理
              var name = newGoodsData[i].g_name;
              if (name.length > 26) {
                newGoodsData[i].g_name = name.substring(0, 23) + '...';
              }
            }
            sectionData['brandGoods'] = newGoodsData;//刷新
          }
          else {
            sectionData['brandGoods'] = newGoodsData;//刷新
          }
        }
        that.setData({
          brandGoods: sectionData['brandGoods'],
          
          
          loadingCount: sectionData['brandGoods'].length,
        });
        
        console.log(that.data.brandGoods)
        wx.stopPullDownRefresh();//结束动画
      }
    })
  },

  catchTapCategory: function (e) {
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    console.log('goodsId:' + goodsId);
    //新增商品用户点击数量
    // that.goodsClickShow(goodsId);
    //跳转商品详情
    wx.navigateTo({ url: '../detail/detail?goodsId=' + goodsId })
  },
  // goodsClickShow(goodsId) {
  //   console.log('增加商品用户点击数量');
  //   var that = this;
  //   wx.request({
  //     method: 'GET',
  //     url: '',
  //     success: data => {
  //       console.log("用户点击统计返回结果：" + data.message)
  //     }
  //   })
  // },
})

