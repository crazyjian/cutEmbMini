const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    groupList:["请选择组名"],
    index: 0,
    selectedGroup:'',
    tailorQcodes: [{ 'tailorQcodeID': '', 'disabled': false, 'focus': true, 'delShow': false, 'imgShow': false, 'srcUrl': '../../static/img/success1.png' }]
  },
  onLoad: function (option) {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetallgroupname',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data) {
          //访问正常
          var groupList = obj.data.groupList;
          for (var i = 0; i < res.data.groupList.length;i++) {
            groupList.push(res.data.groupList[i]);
          }
          obj.setData({
            groupList: groupList
          });
        }else {
          wx.showToast({
            title: '获取组名失败',
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '获取组名失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var tailorQcode = "tailorQcodes[" + (this.data.tailorQcodes.length - 1) + "].focus";
    this.setData({
      [tailorQcode]: true,
      index: e.detail.value,
      selectedGroup: this.data.groupList[e.detail.value]
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
        for (var i = 0; i < tailorQcodes.length-1; i++) {
          if (tailorQcodes[i].tailorQcodeID == tailorQcode) {
            isAdd = false;
            wx.showToast({
              title: '扫描裁片重复',
              icon: 'none',
              duration: 1000
            })
            break;
          }
          // tailorQcodes[i].disabled = true;
          // tailorQcodes[i].focus = false;
          // tailorQcodes[i].delShow = true;
          // tailorQcodes[i].imgShow = true;
        }
        if (isAdd) {
          tailorQcodes.push({ 'tailorQcodeID': '', 'disabled': false, 'focus': true, 'delShow': false, 'imgShow': false, 'srcUrl': '../../static/img/success1.png' });
          obj.setData({
            tailorQcodes: tailorQcodes
          })
          wx.request({
            url: app.globalData.backUrl + '/erp/minigetothertailorbytailorqcodeid',
            data: {
              'tailorQcodeID': tailorQcode
            },
            method: 'GET',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (response) {
              if (response.statusCode == 200) {
                if (response.data.otherTailor) {
                  for (var i = 0; i < tailorQcodes.length - 2; i++) {
                    if (tailorQcodes[i].srcUrl == '../../static/img/fail.png') {
                      continue;
                    } else if (tailorQcodes[i].colorName != response.data.otherTailor.colorName || tailorQcodes[i].sizeName != response.data.otherTailor.sizeName) {
                      tailorQcodes[index].srcUrl = '../../static/img/warn.png';
                    }
                    break;
                  }
                  tailorQcodes[index].colorName = response.data.otherTailor.colorName;
                  tailorQcodes[index].sizeName = response.data.otherTailor.sizeName;
                } else {
                  tailorQcodes[index].srcUrl = '../../static/img/fail.png';
                }
                tailorQcodes[index].tailorQcodeID = tailorQcode;
                tailorQcodes[index].disabled = true;
                tailorQcodes[index].focus = false;
                tailorQcodes[index].delShow = true;
                tailorQcodes[index].imgShow = true;
                // tailorQcodes.push({ 'tailorQcodeID': '', 'disabled': false, 'focus': true, 'delShow': false, 'imgShow': false, 'srcUrl': '../../static/img/success1.png' });
                obj.setData({
                  tailorQcodes: tailorQcodes
                })
              } else {
                wx.showToast({
                  title: "服务发生错误",
                  image: '../../static/img/error.png',
                  duration: 1000,
                })
                tailorQcodes.splice(tailorQcodes.length - 1, 1);
                tailorQcodes[index].tailorQcodeID = '';
                tailorQcodes[index].focus = true;
                tailorQcodes[index].disabled = false;
                obj.setData({
                  tailorQcodes: tailorQcodes
                })
              }
            },
            fail: function (res) {
              wx.showToast({
                title: "服务连接失败",
                image: '../../static/img/error.png',
                duration: 1000,
              })
              tailorQcodes.splice(tailorQcodes.length - 1, 1);
              tailorQcodes[index].tailorQcodeID = '';
              tailorQcodes[index].focus = true;
              tailorQcodes[index].disabled = false;
              obj.setData({
                tailorQcodes: tailorQcodes
              })
            }
          });
        } else {
          tailorQcodes[index].tailorQcodeID = '';
          tailorQcodes[index].focus = true;
          tailorQcodes[index].disabled = false;
          obj.setData({
            tailorQcodes: tailorQcodes
          })
        }
      },
      fail(res) {
        tailorQcodes[index].tailorQcodeID = '';
        tailorQcodes[index].focus = true;
        tailorQcodes[index].disabled = false;
        obj.setData({
          tailorQcodes: tailorQcodes
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
      for (var i = 0; i < tailorQcodes.length-1; i++) {
        if (tailorQcodes[i].tailorQcodeID == tailorQcode) {
          isAdd = false;
          wx.showToast({
            title: '扫描裁片重复',
            icon: 'none',
            duration: 1000
          })
          break;
        }
        // tailorQcodes[i].disabled = true;
        // tailorQcodes[i].focus = false;
        // tailorQcodes[i].delShow = true;
        // tailorQcodes[i].imgShow = true;
      }
      if (isAdd) {
        tailorQcodes.push({ 'tailorQcodeID': '', 'disabled': false, 'focus': true, 'delShow': false, 'imgShow': false, 'srcUrl': '../../static/img/success1.png' });
        obj.setData({
          tailorQcodes: tailorQcodes
        })
        wx.request({
          url: app.globalData.backUrl + '/erp/minigetothertailorbytailorqcodeid',
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
                for (var i = 0; i < tailorQcodes.length - 2; i++) {
                  if (tailorQcodes[i].srcUrl == '../../static/img/fail.png') {
                    continue;
                  } else if (tailorQcodes[i].colorName != response.data.otherTailor.colorName || tailorQcodes[i].sizeName != response.data.otherTailor.sizeName) {
                    tailorQcodes[index].srcUrl = '../../static/img/warn.png';
                  }
                  break;
                }
                tailorQcodes[index].colorName = response.data.otherTailor.colorName;
                tailorQcodes[index].sizeName = response.data.otherTailor.sizeName;
              } else {
                tailorQcodes[index].srcUrl = '../../static/img/fail.png';
              }
              tailorQcodes[index].disabled = true;
              tailorQcodes[index].focus = false;
              tailorQcodes[index].delShow = true;
              tailorQcodes[index].imgShow = true;
              // tailorQcodes.push({ 'tailorQcodeID': '', 'disabled': false, 'focus': true, 'delShow': false, 'imgShow': false, 'srcUrl': '../../static/img/success1.png' });
              obj.setData({
                tailorQcodes: tailorQcodes
              })
            } else {
              wx.showToast({
                title: "服务器发生错误",
                image: '../../static/img/error.png',
                duration: 1000,
              })
              tailorQcodes.splice(tailorQcodes.length - 1, 1);
              tailorQcodes[index].tailorQcodeID = '';
              tailorQcodes[index].focus = true;
              tailorQcodes[index].disabled = false;
              obj.setData({
                tailorQcodes: tailorQcodes
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: "服务连接失败",
              image: '../../static/img/error.png',
              duration: 1000,
            })
            tailorQcodes.splice(tailorQcodes.length - 1, 1);
            tailorQcodes[index].tailorQcodeID = '';
            tailorQcodes[index].focus = true;
            tailorQcodes[index].disabled = false;
            obj.setData({
              tailorQcodes: tailorQcodes
            })
          }
        });
      } else {
        tailorQcodes[index].tailorQcodeID = '';
        tailorQcodes[index].focus = true;
        tailorQcodes[index].disabled = false;
        obj.setData({
          tailorQcodes: tailorQcodes
        })
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
  outStore: function (e) {
    var obj = this;
    var groupName = this.data.selectedGroup;
    if (groupName == "" || groupName =="请选择组名") {
      wx.showToast({
        title: '请选择组名',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    var tailorQcodes = this.data.tailorQcodes;
    var tmptailorQcodes = [];
    for (var i = 0; i < tailorQcodes.length; i++) {
      if (tailorQcodes[i].srcUrl != '../../static/img/fail.png' && tailorQcodes[i].tailorQcodeID != "") {
        tmptailorQcodes.push(tailorQcodes[i].tailorQcodeID);
      }
    }
    if (tmptailorQcodes.length == 0) {
      wx.showToast({
        title: '请扫描裁片二维码',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '确认出库吗?',
      success: function (sm) {
        if (sm.confirm) {
          var otherOutStoreJson = {};
          otherOutStoreJson.groupName = groupName;
          otherOutStoreJson.tailorQcode = tmptailorQcodes;
          wx.request({
            url: app.globalData.backUrl + '/erp/miniotheroutstore',
            data: {
              'otherOutStoreJson': JSON.stringify(otherOutStoreJson)
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              if (res.statusCode == 200) {
                if (res.data == 1) {
                  wx.showToast({
                    title: "出库失败",
                    image: '../../static/img/error.png',
                    duration: 1000,
                  })
                } else if (res.data == 0) {
                  wx.showToast({
                    title: "出库成功",
                    icon: 'success',
                    duration: 1000,
                  })
                  obj.setData({
                    tailorQcodes: [{ 'tailorQcodeID': '', 'disabled': false, 'focus': true, 'delShow': false, 'imgShow': false, 'srcUrl': '../../static/img/success1.png' }],
                    index: 0
                  })
                } 
              }else {
                wx.showToast({
                  title: "出库失败",
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
      }
    })
  }
})