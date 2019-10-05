const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    cutStoreQcode:'',
    tailorQcodes: [],
    placeholder:'请扫描货架二维码',
    isShow:false,
    isShowTailor:false,
    scanPic:'../../static/img/success.png'
  },
  onLoad: function (option) {
    
  },
  scanStore:function() {
    var obj = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if(res.result.indexOf("-")==-1) {
          obj.setData({
            cutStoreQcode: "",
            placeholder: "货架二维码不正确",
            isShow: true,
            scanPic: '../../static/img/scan_error.png'
          })
        }else {
          obj.setData({
            cutStoreQcode: res.result,
            isShow:true,
            scanPic: '../../static/img/success.png'
          })
        }
      },
      fail(res) {
        obj.setData({
          cutStoreQcode: "",
          placeholder:"扫描有误",
          isShow: true,
          scanPic: '../../static/img/scan_error.png'
        })
      }
    })
  },
  scanTailor:function(){
    var obj = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var tailorQcodes = obj.data.tailorQcodes;
        var isAdd = true;
        for (var i = 0; i < tailorQcodes.length; i++) {
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
        if (isAdd) {
          tailorQcodes.push(res.result);
        }
        obj.setData({
          tailorQcodes: tailorQcodes
        })
      }
    })
  },
  changeStore: function (e) {
    var obj = this;
    var cutStoreQcode = this.data.cutStoreQcode
    if (!cutStoreQcode) {
      wx.showToast({
        title: '请扫描货架二维码',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    var tailorQcodes = this.data.tailorQcodes
    if (tailorQcodes.length == 0) {
      wx.showToast({
        title: '请扫描裁片二维码',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetstorehousebylocation',
      data: {
        'storehouseLocation': obj.data.cutStoreQcode
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if(res.data == 1) {
            wx.showToast({
              title: "您扫描的货架不存在",
              icon: 'none',
              duration: 1000,
            })
          }else {
            var changestoreJson = {};
            changestoreJson.tailorQcode = tailorQcodes;
            changestoreJson.storehouseLocation = cutStoreQcode;
            wx.showModal({
              title: '提示',
              content: '共有' + tailorQcodes.length + '扎，确认调库吗?',
              success: function (sm) {
                if (sm.confirm) {
                  wx.request({
                    url: app.globalData.backUrl + '/erp/minichangestore',
                    data: {
                      'changestoreJson': JSON.stringify(changestoreJson)
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded' // 默认值
                    },
                    success: function (res) {
                      // console.log(res.data);
                      if (res.statusCode == 200) {
                        if (!res.data) {
                          wx.showToast({
                            title: "调库失败",
                            image: '../../static/img/error.png',
                            duration: 1000
                          })
                        } else {
                          wx.showToast({
                            title: "调库成功",
                            icon: 'success',
                            duration: 1000
                          })
                          obj.setData({
                            tailorQcodes: []
                          })
                        }
                      }else {
                        wx.showToast({
                          title: "服务器发生异常",
                          image: '../../static/img/error.png',
                          duration: 1000,
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
        }else {
          wx.showToast({
            title: "服务器发生异常",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "服务器发生异常",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    });
  }
})