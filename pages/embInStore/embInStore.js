const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    cutStoreQcode: '',
    tailorQcodes: [],
    placeholder: '扫描货架二维码',
    storeFocus: true,
    storeDisabled: false,
  },
  onLoad: function (option) {
    
  },
  scanCutStoreQcode:function() {
    var obj = this;
    if (this.data.storeDisabled) {
      return;
    }
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if (res.result.indexOf("-") == -1) {
          obj.setData({
            cutStoreQcode: "",
            placeholder: "货架二维码不正确",
            storeFocus: true,
            storeDisabled: false
          })
        } else {
          if (obj.data.tailorQcodes.length > 0) {
            var tailorQcode = "tailorQcodes[" + (obj.data.tailorQcodes.length - 1) + "].focus";
            obj.setData({
              [tailorQcode]: true
            })
          } else {
            var tailorQcodes = [{ 'tailorQcodeID': '', 'disabled': false, 'focus': true, 'delShow': false, 'imgShow': false, 'srcUrl': '../../static/img/success1.png' }];
            obj.setData({
              tailorQcodes: tailorQcodes
            })
          }
          obj.setData({
            cutStoreQcode: res.result,
            storeFocus: false,
            storeDisabled: true
          })
        }
      },
      fail(res) {
        obj.clearCutStoreQcode();
      }
    })
  },
  changeCutStoreQcode: function (e) {
    var cutStoreQcode = e.detail.value;
    if (e.detail.keyCode == 10) {
      cutStoreQcode = cutStoreQcode.replace('\n', '');
      this.setData({
        storeFocus: false,
        storeDisabled: true
      });
      if (this.data.tailorQcodes.length > 0) {
        var tailorQcode = "tailorQcodes[" + (this.data.tailorQcodes.length - 1) + "].focus";
        this.setData({
          [tailorQcode]: true
        })
      } else {
        var tailorQcodes = [{ 'tailorQcodeID': '', 'disabled': false, 'focus': true, 'delShow': false, 'imgShow': false, 'srcUrl': '../../static/img/success1.png' }];
        this.setData({
          tailorQcodes: tailorQcodes
        })
      }
    }
    this.setData({
      cutStoreQcode: cutStoreQcode
    })
  },
  clearCutStoreQcode: function () {
    this.setData({
      storeDisabled: false,
      cutStoreQcode: '',
      storeFocus: true
    })
  },
  scanTailorQcode: function (e) {
    var obj = this;
    var index = e.currentTarget.dataset.index;
    var tailorQcode = "";
    if (this.data.tailorQcodes[index].disabled) {
      return;
    }
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        tailorQcode = res.result;
        var tailorQcodes = obj.data.tailorQcodes;
        var isAdd = true;
        for (var i = 0; i < tailorQcodes.length; i++) {
          if (tailorQcodes[i].tailorQcodeID == tailorQcode && index != i) {
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
                  for (var i = 0; i < tailorQcodes.length - 1; i++) {
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
                tailorQcodes[index].tailorQcodeID = tailorQcode;
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
        } else {
          var tailor = "tailorQcodes[" + index + "].tailorQcodeID";
          var focus = "tailorQcodes[" + index + "].focus";
          tailorQcode = '';
          obj.setData({
            [tailor]: tailorQcode,
            [focus]: true
          })
        }
      },
      fail(res) {
        var tailor = "tailorQcodes[" + index + "].tailorQcodeID";
        var focus = "tailorQcodes[" + index + "].focus";
        tailorQcode = '';
        obj.setData({
          [tailor]: tailorQcode,
          [focus]: true
        })
      }
    })
  },
  tailorMoveCursor: function (e) {
    var obj = this;
    var index = e.currentTarget.dataset.index;
    var tailorQcode = e.detail.value;
    var tailor = "tailorQcodes[" + index + "].tailorQcodeID";
    if (e.detail.keyCode == 10) {
      tailorQcode = tailorQcode.replace('\n', '');
      var tailorQcodes = this.data.tailorQcodes;
      var isAdd = true;
      for (var i = 0; i < tailorQcodes.length; i++) {
        if (tailorQcodes[i].tailorQcodeID == tailorQcode && index != i) {
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
                for (var i = 0; i < tailorQcodes.length - 1; i++) {
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
      } else {
        tailorQcode = '';
      }
    }
    this.setData({
      [tailor]: tailorQcode
    })
  },
  delTailorQcode: function (e) {
    var index = e.currentTarget.dataset.index;
    var tailorQcodes = this.data.tailorQcodes;
    tailorQcodes.splice(index, 1);
    tailorQcodes[tailorQcodes.length - 1].focus = true;
    this.setData({
      tailorQcodes: tailorQcodes
    })
  },
  inStore: function (e) {
    var obj = this;
    var cutStoreQcode = this.data.cutStoreQcode
    if (!cutStoreQcode && cutStoreQcode=='') {
      wx.showToast({
        title: '请扫描货架二维码',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    var tailorQcodes = this.data.tailorQcodes;
    var tmptailorQcodes = [];
    for (var i = 0; i < tailorQcodes.length; i++) {
      if (tailorQcodes[i].srcUrl != '../../static/img/fail.png') {
        tmptailorQcodes.push(tailorQcodes[i]);
      }
    }
    if (tmptailorQcodes.length == 0 || tmptailorQcodes.length == 1) {
      wx.showToast({
        title: '请扫描裁片二维码',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetembstorebylocation',
      data: {
        'embStoreLocation': obj.data.cutStoreQcode
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data == 1) {
            wx.showToast({
              title: "您扫描的货架不存在",
              icon: 'none',
              duration: 1000,
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '共有' + (tmptailorQcodes.length - 1) + '扎，确认入库吗?',
              success: function (sm) {
                if (sm.confirm) {
                  var embInStoreJson = {};
                  embInStoreJson.embStoreLocation = obj.data.cutStoreQcode;
                  embInStoreJson.tailors = tmptailorQcodes;
                  wx.request({
                    url: app.globalData.backUrl + '/erp/miniembinstorescaner',
                    data: {
                      'embInStoreJson': JSON.stringify(embInStoreJson)
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded' // 默认值
                    },
                    success: function (res) {
                      if (res.statusCode == 200) {
                        if (res.data == 0) {
                          wx.showToast({
                            title: "入库成功",
                            icon: 'success',
                            duration: 1000
                          })
                          obj.setData({
                            tailorQcodes: [],
                            cutStoreQcode: '',
                            storeFocus: true,
                            storeDisabled: false
                          })
                        } else if (res.data == 1) {
                          wx.showToast({
                            title: "入库失败",
                            image: '../../static/img/error.png',
                            duration: 1000
                          })
                        } else if (res.data == 2) {
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