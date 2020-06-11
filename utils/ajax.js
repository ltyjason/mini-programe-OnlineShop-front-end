var app = getApp();

const serverUrl = app.globalData.serverUrl
const apiVersion = app.globalData.apiVersion

function request(opt) {
  wx.request({
    method: opt.method || 'GET',
    url: serverUrl + apiVersion + opt.url,
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: opt.data,
    success: function (res) {
      // console.log(res)
      if (res.statusCode == 200) {
        if (opt.success) {
          opt.success(res.data);
        }
      } else {
        // console.error(res);
        wx.showToast({
          title: res.data.message,
        })
      }
    }
  })
}

module.exports.request = request