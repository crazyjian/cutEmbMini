const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    groupList:["请选择组名"],
    index: 0,
    selectedGroup:'',
    tailorQcode:'',
    isShowTailor:false,
    tailor:'',
    embStoreLocation:'',
    groupName:'',
    planCount:'',
    actCount:'',
    unCount:'',
    packageCount:'',
    layerSum:'',
    isOut:2
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
    this.setData({
      index: e.detail.value,
      selectedGroup: this.data.groupList[e.detail.value]
    })
  },
  scanTailor:function(){
    var obj = this;
    if(this.data.index==0) {
      wx.showToast({
        title: '请先选择组名',
        icon: 'none',
        duration: 1000
      })
    }else {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          if (obj.data.tailorQcode && isOut==0) {
            wx.showToast({
              title: '只需扫描一扎',
              icon: 'none',
              duration: 1000
            })
          }else {
            var tailorQcodeID = res.result;
            obj.setData({
              isShowTailor: false,
              tailor: '',
              embStoreLocation: '',
              groupName: '',
              planCount: '',
              actCount: '',
              unCount: '',
              packageCount: '',
              layerSum: '',
              isOut: 2
            })
            wx.request({
              url: app.globalData.backUrl + '/erp/miniemboutprecheck',
              data: {
                groupName: obj.data.selectedGroup,
                tailorQcodeID: tailorQcodeID
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: function (res) {
                // console.log(res.data);
                if (res.statusCode == 200) {
                  if (res.data.tailor) {
                    if (res.data.embStoreLocation) {
                      obj.setData({
                        tailorQcode: tailorQcodeID,
                        isShowTailor: true,
                        tailor: res.data.tailor,
                        packageCount: res.data.packageCount,
                        layerSum: res.data.layerSum,
                        embStoreLocation: res.data.embStoreLocation,
                        groupName: obj.data.selectedGroup
                      })
                      if (res.data.isOut!=undefined) {
                        obj.setData({
                          isOut: res.data.isOut
                        })
                        if (res.data.embPlan) {
                          obj.setData({
                            planCount: res.data.embPlan.planCount,
                            actCount: res.data.embPlan.actCount,
                            unCount: res.data.embPlan.planCount - res.data.embPlan.actCount
                          })
                        }
                        if (res.data.isOut == 1) {
                          wx.showToast({
                            title: '对不起，已经超数，无法出库',
                            icon: 'none',
                            duration: 1000
                          })
                        }
                      }else {
                        obj.setData({
                          isOut: 1
                        })
                        wx.showToast({
                          title: '对不起，没有安排计划',
                          icon: 'none',
                          duration: 1000
                        })
                      }
                    
                    }else {
                      wx.showToast({
                        title: '该裁片还未入库，请先入库！',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }else {
                    wx.showToast({
                      title: '二维码记录不存在',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                  
                }else {
                  obj.setData({
                    isOut: 1
                  })
                  wx.showToast({
                    title: "服务器发生异常",
                    image: '../../static/img/error.png',
                    duration: 1000,
                  })
                }
              },
              fail: function (res) {
                obj.setData({
                  isOut: 1
                })
                wx.showToast({
                  title: "服务器发生异常",
                  image: '../../static/img/error.png',
                  duration: 1000,
                })
              }
            })
          }
        }
      })
    }
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
    var tailorQcode = this.data.tailorQcode
    if (!tailorQcode) {
      wx.showToast({
        title: '请扫描裁片二维码',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if(this.data.isOut!=0) {
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '确认出库吗?',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: app.globalData.backUrl + '/erp/miniaddemboutstorenew',
            data: {
              groupName: groupName,
              tailorQcodeID: tailorQcode,
              embStoreLocation: obj.data.embStoreLocation
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              if (res.statusCode == 200) {
                if (res.data.result == 1) {
                  wx.showToast({
                    title: "出库失败",
                    image: '../../static/img/error.png',
                    duration: 1000,
                  })
                } else if (res.data.result == 0) {
                  wx.showToast({
                    title: res.data.embStoreLocation + "共有" + res.data.embOutCount+"扎出库成功",
                    icon: 'none',
                    duration: 3000,
                  })
                  obj.clearAll();
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
  },
  clearAll:function() {
    this.setData({
      index: 0,
      selectedGroup: '',
      tailorQcode: '',
      isShowTailor: false,
      tailor: '',
      embStoreLocation: '',
      groupName: '',
      planCount: '',
      actCount: '',
      unCount: '',
      packageCount: '',
      layerSum: '',
      isOut: 2
    })
  }
})