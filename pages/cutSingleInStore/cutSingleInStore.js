const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    cutStoreQcode:'',
    tailorQcodes: [],
    placeholder:'请扫描货架二维码',
    isShow:false,
    scanPic:'../../static/img/success.png',
    storeFocus:true,
    storeDisabled:false,
  },
  onLoad: function (option) {
    
  },
  changeCutStoreQcode:function(e) {
    var cutStoreQcode = e.detail.value;
    if(e.detail.keyCode == 10) {
      cutStoreQcode = cutStoreQcode.replace('\n','');
      this.setData({
        storeFocus:false,
        storeDisabled:true
      });
      if (this.data.tailorQcodes.length > 0) {
        var tailorQcode = "tailorQcodes[" + (this.data.tailorQcodes.length - 1) +"].focus";
        this.setData({
          [tailorQcode]:true
        })
      }else {
        var tailorQcodes = [{ 'tailorQcodeID': '', 'disabled': false, 'focus': true, 'delShow': false, 'imgShow': false, 'srcUrl':'../../static/img/success1.png'}];
        this.setData({
          tailorQcodes: tailorQcodes
        })
      }
    }
    this.setData({
      cutStoreQcode: cutStoreQcode
    })
  },
  clearCutStoreQcode:function() {
    this.setData({
      storeDisabled:false,
      cutStoreQcode: '',
      storeFocus:true
    })
  },
  tailorMoveCursor:function(e) {
    var obj = this;
    var index = e.currentTarget.dataset.index;
    var tailorQcode = e.detail.value;
    var tailor = "tailorQcodes[" + index + "].tailorQcodeID";
    if (e.detail.keyCode == 10) {
      tailorQcode = tailorQcode.replace('\n', '');
      var tailorQcodes = this.data.tailorQcodes;
      var isAdd = true;
      for (var i = 0; i < tailorQcodes.length;i++) {
        if (tailorQcodes[i].tailorQcodeID==tailorQcode && index!=i) {
          isAdd = false;
          wx.showToast({
            title: '扫描裁片重复',
            icon: 'none',
            duration: 1000
          })
          break;
        }
        tailorQcodes[i].disabled = true;
        tailorQcodes[i].focus = false;
        tailorQcodes[i].delShow = true;
        tailorQcodes[i].imgShow = true;
      }
      if (isAdd) {
        wx.request({
          url: app.globalData.backUrl + '/erp/minigettailorbytailorqcodeid',
          data: {
            'tailorQcodeID': tailorQcode
          },
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (response) {
            if (response.statusCode == 200) {
              if (response.data.tailor) {
                for (var i = 0; i < tailorQcodes.length-1; i++) {
                  if (tailorQcodes[i].srcUrl == '../../static/img/fail.png') {
                    continue;
                  } else if (tailorQcodes[i].colorName != response.data.tailor.colorName || tailorQcodes[i].sizeName != response.data.tailor.sizeName) {
                    tailorQcodes[index].srcUrl = '../../static/img/warn.png';
                  }
                  break;
                }
                tailorQcodes[index].colorName = response.data.tailor.colorName;
                tailorQcodes[index].sizeName = response.data.tailor.sizeName;
              } else {
                tailorQcodes[index].srcUrl = '../../static/img/fail.png';
              }
              tailorQcodes.push({ 'tailorQcodeID': '', 'disabled': false, 'focus': true, 'delShow': false, 'imgShow': false, 'srcUrl': '../../static/img/success1.png' });
              obj.setData({
                tailorQcodes: tailorQcodes
              })
            } else {
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
      }else {
        tailorQcode = '';
      }
    }
    this.setData({
      [tailor]: tailorQcode
    })
  },
  delTailorQcode:function(e){
    var index = e.currentTarget.dataset.index;
    var tailorQcodes = this.data.tailorQcodes;
    tailorQcodes.splice(index, 1)
    this.setData({
      tailorQcodes: tailorQcodes
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
    if (tailorQcodes.length == 0 || tailorQcodes.length==1 ) {
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
              content: '共有' + (tailorQcodes.length-1) +'扎，确认入库吗?',
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