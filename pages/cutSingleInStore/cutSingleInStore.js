const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    cutStoreQcode:'',
    tailorQcodes:[],
    placeholder:'请扫描货架二维码',
    isShow:false,
    scanPic:'../../static/img/success.png',
    isFocus:false,
    isFocus1: false
  },
  onLoad: function (option) {
    
  },
  changeCutStoreQcode:function(e) {
    console.log(e)
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
  moveCursor:function(e) {
    // this.setData({
    //   isFocus:true
    // })
    console.log(e)
  },
  moveCursor1: function (e) {
    console.log(e)
  },
  scanTailor:function(){
    var obj = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var tailorQcodes = obj.data.tailorQcodes;
        var isAdd = true;
        for (var i = 0; i < tailorQcodes.length; i++) {
          if (tailorQcodes[i].tailorQcodeID == res.result) {
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
          wx.request({
            url: app.globalData.backUrl + '/erp/minigettailorbytailorqcodeid',
            data: {
              'tailorQcodeID': res.result
            },
            method: 'GET',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (response) {
              if (response.statusCode == 200) {
                if (response.data.tailor) {
                  for (var i = 0; i < tailorQcodes.length;i++) {
                    if (tailorQcodes[i].mark=='red') {
                      continue;
                    } else if (tailorQcodes[i].colorName != response.data.tailor.colorName || tailorQcodes[i].sizeName != response.data.tailor.sizeName){
                      response.data.tailor.mark = 'yellow';
                    }
                    break;
                  }
                  tailorQcodes.push(response.data.tailor);
                }else {
                  var tmp = {};
                  tmp.tailorQcodeID = res.result;
                  tmp.mark = 'red';
                  tailorQcodes.push(tmp);
                } 
                obj.setData({
                  tailorQcodes: tailorQcodes
                })            
              }else {
                wx.showToast({
                  title: "服务器发生错误",
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
          });
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
    var tailorQcodes = this.data.tailorQcodes
    if (tailorQcodes.length==0) {
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
            wx.showModal({
              title: '提示',
              content: '共有' + tailorQcodes.length +'扎，确认入库吗?',
              success: function (sm) {
                if (sm.confirm) {
                  var embInStoreJson = {};
                  embInStoreJson.cutStoreLocation = obj.data.cutStoreQcode;
                  embInStoreJson.tailors = tailorQcodes;
                  wx.request({
                    url: app.globalData.backUrl + '/erp/miniinstoresingle',
                    data: {
                      'inStoreJson': JSON.stringify(embInStoreJson)
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded' // 默认值
                    },
                    success: function (res) {
                      if (res.statusCode == 200) {
                        if(res.data==0) {
                          wx.showToast({
                            title: "入库成功",
                            icon: 'success',
                            duration: 1000
                          })
                          obj.setData({
                            tailorQcodes: [],
							              cutStoreQcode: '',
                          })
                        }else if(res.data==1){
                          wx.showToast({
                            title: "入库失败",
                            image: '../../static/img/error.png',
                            duration: 1000
                          })
                        }else if(res.data==2) {
                          wx.showToast({
                            title: "记录不存在或不用入库",
                            icon: 'none',
                            duration: 1000
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
})