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
    producerName:'',
    pieceInfo:'计件成功',
    pieceWorkJson:'',
    isHide: true,
    qrCode: '',
    sizeName: ''
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
          
          var pieceWorkJson = {};
          pieceWorkJson.orderName = array[0];
          pieceWorkJson.bedNumber = array[2];
          pieceWorkJson.packageNumber = array[7];
          pieceWorkJson.colorName = array[4];
          pieceWorkJson.sizeName = array[5];
          pieceWorkJson.layerCount = array[6];
          pieceWorkJson.employeeNumber = app.globalData.employeeNumber;
          pieceWorkJson.tailorQcodeID = option.qrCode;
          obj.setData({
            orderName: array[0],
            bedNumber: array[2],
            packageNumber: array[7],
            colorName: array[4],
            layerCount: array[6],
            sizeName: array[5],
            pieceWorkJson: JSON.stringify(pieceWorkJson)
          });
          
          wx.request({
            url: app.globalData.backUrl + '/erp/minigetprocedureinfobyorderemp',
            data: {
              orderName: obj.data.orderName,
              employeeNumber: app.globalData.employeeNumber
            },
            method: 'GET',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.data.procedureInfoEmpList.length == 0) {
                obj.setData({
                  isShow: true,
                  pieceInfo: '无工序信息，请联系生产主管'
                })
              }else {
                var producerName = '';
                for (var i = 0; i < res.data.procedureInfoEmpList.length; i++) {
                  producerName += res.data.procedureInfoEmpList[i].procedureCode + '-' + res.data.procedureInfoEmpList[i].procedureNumber + '-' + res.data.procedureInfoEmpList[i].procedureName + ' ';
                }
                obj.setData({
                  producerName: producerName
                });
                wx.request({
                  url: app.globalData.backUrl + '/erp/minicheckpieceworknew',
                  data: {
                    pieceWorkJson: obj.data.pieceWorkJson
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  success: function (res) {
                    // console.log(res.data);
                    if (res.data == 0) {
                      wx.request({
                        url: app.globalData.backUrl + '/erp/miniaddpieceworkbatch',
                        data: {
                          pieceWorkJson: obj.data.pieceWorkJson
                        },
                        method: 'POST',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        success: function (res) {
                          // console.log(res.data);
                          if (res.statusCode == 200 && res.data == 0) {
                            obj.setData({
                              isShow: true,
                              pieceInfo: '计件成功'
                            })
                          } else {
                            obj.setData({
                              isShow: true,
                              pieceInfo: '计件失败'
                            })
                          }
                        }, fail: function (e) {
                          obj.setData({
                            isShow: true,
                            pieceInfo: '计件失败'
                          })
                        }
                      });
                    } else if (res.data == 1) {
                      wx.showToast({
                        title: "重复计件",
                        image: '../../static/img/error.png',
                        duration: 1000,
                      })
                    } else {
                      wx.request({
                        url: app.globalData.backUrl + '/erp/miniaddpieceworkbatch',
                        data: {
                          pieceWorkJson: obj.data.pieceWorkJson
                        },
                        method: 'POST',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        success: function (res) {
                          // console.log(res.data);
                          if (res.statusCode == 200 && res.data == 0) {
                            obj.setData({
                              isShow: true,
                              pieceInfo: '计件成功'
                            })
                          } else {
                            obj.setData({
                              isShow: true,
                              pieceInfo: '计件失败'
                            })
                          }
                        }, fail: function (e) {
                          obj.setData({
                            isShow: true,
                            pieceInfo: '计件失败'
                          })
                        }
                      });
                      wx.showToast({
                        title: "部分已计件",
                        icon: 'none',
                        duration: 1000,
                      })
                    }
                  },
                  fail: function (res) {
                    wx.showToast({
                      title: "服务器错误",
                      image: '../../static/img/error.png',
                      duration: 1000,
                    })
                  }
                });
                
              }
            }
          });

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
                title: "获取员工信息失败",
                image: '../../static/img/error.png',
                duration: 1000,
              })
            }
          });
        }else {
          wx.showToast({
            title: '二维码信息不存在',
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '获取信息失败',
          image: '../../static/img/error.png',
          duration: 1000
        })
      }
    })
  },
  // onUnload: function () {
  //   wx.switchTab({
  //     url: '../index/index'
  //   })
  // },
  hand: function (e) {
    this.setData({
      isHide: false
    })
  },
  cancel: function (e) {
    this.setData({
      isHide: true,
      qrCode: ''
    })
  },
  setQrCodeValue: function (e) {
    this.setData({
      qrCode: e.detail.value
    })
  },
  confirm: function (e) {
    var qrCode = this.data.qrCode
    if (!qrCode) {
      wx.showToast({
        title: '请输入二维码',
        image: '../../static/img/error.png',
        duration: 1000
      })
      return false;
    }
    this.setData({
      isHide: true,
      qrCode: ''
    })
    wx.redirectTo({
      url: "../hand/hand?qrCode=" + qrCode
    })
  }
})