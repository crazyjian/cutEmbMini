const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    tailorQcodes:[],
  },
  onLoad: function (option) {
  },
  scanTailor:function(){
    var obj = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var tailorQcodes = obj.data.tailorQcodes;
        var isAdd = true;
        for(var i=0;i<tailorQcodes.length;i++) {
          if (tailorQcodes[i] == res.result) {
            isAdd = false;
            wx.showToast({
              title: '扫描裁片重复',
              icon: 'none',
              duration: 1000
            })
            break;
          }
        }
        if(isAdd) {
          tailorQcodes.push(res.result);
        }
        obj.setData({
          tailorQcodes: tailorQcodes
        })
      }
    })
  },
  outStore: function (e) {
    var obj = this;
    var tailorQcodes = this.data.tailorQcodes
    if (tailorQcodes.length == 0) {
      wx.showToast({
        title: '请扫描裁片二维码',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '共有' + tailorQcodes.length +'扎，确认出库吗?',
      success: function (sm) {
        if (sm.confirm) {
          var outStoreJson = {};
          outStoreJson.tailorQcode = tailorQcodes;
          wx.request({
            url: app.globalData.backUrl + '/erp/minioutstore',
            data: {
              'outStoreJson': JSON.stringify(outStoreJson)
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.statusCode == 200) {
                if(res.data==0) {
                  wx.showToast({
                    title: "出库成功",
                    icon: 'success',
                    duration: 1000
                  })
                  obj.setData({
                    tailorQcodes: []
                  })
                }else {
                  wx.showToast({
                    title: "出库失败",
                    image: '../../static/img/error.png',
                    duration: 1000
                  })
                }
              }else {
                wx.showToast({
                  title: "出库失败",
                  image: '../../static/img/error.png',
                  duration: 1000
                })
              }
            },
            fail: function (res) {
              wx.showToast({
                title: "服务连接失败",
                image: '../../static/img/error.png',
                duration: 1000,
              })
            }
          })
        }
      }
    })
  }
})