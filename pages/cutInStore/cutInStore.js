const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    cutStoreQcode:'',
    tailorQcode:'',
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
        if (obj.data.tailorQcode) {
          wx.showToast({
            title: '只需扫描一扎',
            icon: 'none',
            duration: 1000
          })
        }else {
          obj.setData({
            tailorQcode:res.result,
            isShowTailor:true
          })
        }
      }
    })
  },
  inStore: function (e) {
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
    var tailorQcode = this.data.tailorQcode
    if (!tailorQcode) {
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
            var inStoreJson = {};
            inStoreJson.tailorQcode = new Array(obj.data.tailorQcode);
            wx.request({
              url: app.globalData.backUrl + '/erp/miniinstorenum',
              data: {
                'inStoreJson': JSON.stringify(inStoreJson)
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: function (res) {
                if (res.statusCode == 200) {
                  if (res.data == -1) {
                    wx.showToast({
                      title: "后台服务发生错误",
                      icon: 'none',
                      duration: 1000,
                    })
                  } else if(res.data==0){
                    wx.showToast({
                      title: "记录不存在或该部位不用入库",
                      icon: 'none',
                      duration: 1000,
                    })
                  } else if (res.data == -2) {
                    wx.showToast({
                      title: "已入库，请勿重复入库",
                      icon: 'none',
                      duration: 1000,
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '共有' + res.data +'扎，确认入库吗?',
                      success: function (sm) {
                        if (sm.confirm) {
                          inStoreJson.cutStoreLocation = obj.data.cutStoreQcode;
                          wx.request({
                            url: app.globalData.backUrl + '/erp/miniinstore',
                            data: {
                              'inStoreJson': JSON.stringify(inStoreJson)
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
                                    title: "入库失败",
                                    image: '../../static/img/error.png',
                                    duration: 1000
                                  })
                                }else {
                                  wx.showToast({
                                    title: "入库成功",
                                    icon: 'success',
                                    duration: 1000
                                  })
                                  obj.setData({
                                    tailorQcode:'',
                                    cutStoreQcode: '',
                                    isShowTailor:false
                                  })
                                }
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