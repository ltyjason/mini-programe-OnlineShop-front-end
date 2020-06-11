// pages/allOrder/allOrder.js


Page({
  data: {
    TabCur: 0,
    scrollLeft: 0,
    orderlist: [
      {
        typeId : 1,
        name: '全部',
      },
      {
        typeId : 2,
        name: '待付款',
      },
      {
        typeId : 3,
        name: '待收货',
      },
      {
        typeId : 4,
        name: '已完成',
      },
      {
        typeId : 5,
        name: '已取消',
      }
    ]
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  }
})