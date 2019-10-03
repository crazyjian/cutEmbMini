const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    orderName:'',
    bedNumber:'',
    packageNumber:'',
    colorName:'',
    layerCount:'',
    isShow:false,
    wrongQuantity:'',
    index:0,
    wrong: [],
    btnText: '提交',
    btnFunction: 'addinspection',
    inpsectionJson: {},
    records: []
  },
  onLoad: function (option) {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl +'/erp/minigetonetailorqcodebytailorqcodeid',
      data: {
        tailorQcodeID: option.qrCode,
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data) {
          var array = res.data.split('-');
          //访问正常
          obj.setData({
            orderName:array[0],
            bedNumber: array[2],
            packageNumber: array[7],
            colorName: array[4],
            layerCount: array[6]
          });
          var inpsectionJson = {};
          inpsectionJson.orderName = obj.data.orderName;
          inpsectionJson.bedNumber = obj.data.bedNumber;
          inpsectionJson.packageNumber = obj.data.packageNumber;
          inpsectionJson.layerCount = obj.data.layerCount;
          inpsectionJson.employeeNumber = app.globalData.employeeNumber;
          obj.setData({
            inpsectionJson: inpsectionJson
          })
          wx.request({
            url: app.globalData.backUrl + '/erp/minigetwrongbyordername',
            data: {
              orderName: array[0]
            },
            method: 'GET',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.statusCode == 200) {
                var wrong = [];
                wrong.push({ "wrongCode": 0, "wrongDescription": "请选择问题" });
                for (var i = 0; i < res.data.wrongByOrderName.length; i++) {
                  wrong.push({ 'wrongCode': res.data.wrongByOrderName[i].wrongCode, 'wrongDescription': res.data.wrongByOrderName[i].wrongCode + '-' + res.data.wrongByOrderName[i].wrongDescription });
                }
                //访问正常
                obj.setData({
                  wrong: wrong
                });


              }
            },
            fail: function (res) {
              // console.log(res)
            }
          })
          wx.request({
            url: app.globalData.backUrl + '/erp/minigetpieceworkempinfo',
            data: {
              'orderName': obj.data.orderName,
              'bedNumber': obj.data.bedNumber,
              'packageNumber': obj.data.packageNumber,
              'tailorQcodeID': option.qrCode
            },
            method: 'GET',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.statusCode == 200 && res.data) {
                obj.setData({
                  records: res.data.pieceWorkEmpList,
                });
              }
            },
            fail: function (res) {
              wx.showToast({
                title: "获取工序信息失败",
                image: '../../static/img/error.png',
                duration: 1000,
              })
            }
          });
        } else {
          wx.showToast({
            title: '二维码信息不存在',
            icon: 'none',
            duration: 1000
          })
        }2
      },
      fail: function (res) {
        wx.showToast({
          title: '扫描失败',
          image: '../../static/img/error.png',
          duration: 2000
        })      
      }
    })
  },
  // onUnload: function () {
  //   wx.switchTab({
  //     url: '../index/index'
  //   })
  // },
  scanCode: function (e) {
    var obj = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var qrcode = res.result;
        wx.redirectTo({
          url: "../sampleinspection/sampleinspection?qrCode=" + qrcode
        })
      },
      fail(res) {
        wx.showToast({
          title: '失败',
          image: '../../static/img/error.png',
          duration: 1000
        })
      }
    })
  },
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.inpsectionJson.wrongCode = this.data.wrong[e.detail.value].wrongCode;
    this.setData({
      index: e.detail.value,
      inpsectionJson: this.data.inpsectionJson
    })
  },
  getWrongQuantity:function(e) {
    this.data.inpsectionJson.wrongQuantity = e.detail.value;
    this.setData({
      wrongQuantity: e.detail.value,
      inpsectionJson: this.data.inpsectionJson
    })
  },
  addinspection: function () {
    var obj = this;
    if (obj.data.index == 0) {
      wx.showToast({
        title: '请选择问题',
        image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    if (obj.data.wrongQuantity == '') {
      wx.showToast({
        title: '请输入数量',
        image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    wx.request({
      url: app.globalData.backUrl + '/erp/miniaddsampleinspection',
      data: obj.data.inpsectionJson,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data == 0) {
          obj.setData({
            btnText: '继续扫描',
            btnFunction: 'scanCode',
            orderName: '',
            bedNumber: '',
            packageNumber: '',
            colorName: '',
            layerCount: '',
            wrongQuantity: '',
            index: 0,
            wrong: []
          });
          wx.showToast({
            title: "提交成功",
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: "提交失败",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "提交失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    });
  }
})