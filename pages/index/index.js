Page({
   data: {
     imgs: [
       "../../images/guide/hi.jpg",
     ], 
     time: 3,
   },
 
  onReady() {
    //5s后跳转
    this.data.Time = setInterval(() => {
      this.setData({
        time: --this.data.time
      })
      if (this.data.time <= 0) {
        clearInterval(this.data.Time)
        this.goHome()
      }
    }, 1000)
  },
  goHome() {
    clearInterval(this.data.Time)
    wx.reLaunch({
      url: '../home/home'
    })
  }
 })