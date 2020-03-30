const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    groupList:["请选择组名"],
    index: 0,
    selectedGroup:'',
    tailorQcodes:[],
    tailors:[],
    isOut:2,
    planCount: '',
    actCount: '',
    unCount: '',
    embStoreLocation: '',
    groupName: '',
    packageTotalCount: 0,
    layerTotalSum: 0,
    packageCount:0,
    layerSum:0,
    unPackageCount: 0,
    unLayerSum: 0,
    orderName:''
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
          groupList.push("异常");
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
    if(obj.data.index == 0) {
      wx.showToast({
        title: '请先选择组名',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if(obj.data.isOut == 1) {
      wx.showToast({
        title: '存在错误的裁片信息，请重新操作',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var tailorQcodes = obj.data.tailorQcodes;
        var tailors = obj.data.tailors;
        var tailorQcodeID = res.result;
        wx.request({
          url: app.globalData.backUrl + '/erp/miniemboutsingleprecheck',
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
                  var tailor = res.data.tailor;
                  tailor.embStoreLocation = res.data.embStoreLocation;
                  var isAdd = true;
                  for (var i = 0; i < tailors.length; i++) {
                    if (tailors[i].orderName == tailor.orderName && tailors[i].bedNumber == tailor.bedNumber && tailors[i].jarName == tailor.jarName) {
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
                    tailors.push(tailor);
                    tailorQcodes.push(tailorQcodeID);
                    obj.setData({
                      tailors: tailors,
                      orderName: tailor.orderName,
                      tailorQcodes: tailorQcodes,
                      planCount:'',
                      actCount:'',
                      unCount:'',
                      groupName:''
                    })
                    if (tailors.length > 1 && tailors[0].orderName == tailor.orderName && tailors[0].colorName == tailor.colorName && tailors[0].sizeName == tailor.sizeName && tailors[0].embStoreLocation == tailor.embStoreLocation) {
                      obj.setData({
                        isOut: 1
                      })
                      wx.showToast({
                        title: '款号-颜色-尺码-位置与第一行不对应，本次无法出库！',
                        icon: 'none',
                        duration: 1000
                      });
                    }else if (res.data.embPlan) {
                      var packageCount = obj.data.packageCount;
                      var layerSum = obj.data.layerSum;
                      var packageTotalCount = res.data.packageCount;
                      var layerTotalSum = res.data.layerSum;
                      packageCount += 1;
                      layerSum += res.data.layer;
                      var unPlanNum = res.data.embPlan.planCount - res.data.embPlan.actCount;
                      var isOut = 0;
                      if(layerSum>unPlanNum) {
                        isOut=1;
                        wx.showToast({
                          title: '对不起，已经超数，无法出库',
                          icon: 'none',
                          duration: 1000
                        })
                      }
                      obj.setData({
                        packageTotalCount: packageTotalCount,
                        layerTotalSum: layerTotalSum,
                        packageCount: packageCount,
                        layerSum: layerSum,
                        planCount: res.data.embPlan.planCount,
                        actCount: res.data.embPlan.actCount,
                        unCount: unPlanNum,
                        groupName: res.data.groupName,
                        isOut: isOut,
                        unPackageCount: packageTotalCount - packageCount,
                        unLayerSum: layerTotalSum - layerSum,
                        embStoreLocation: res.data.embStoreLocation
                      })
                    } else {
                      obj.setData({
                        isOut: 1
                      })
                      wx.showToast({
                        title: '对不起，没有安排计划',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }

                } else {
                  wx.showToast({
                    title: '该裁片还未入库，请先入库！',
                    icon: 'none',
                    duration: 1000
                  })
                }
              } else {
                wx.showToast({
                  title: '二维码记录不存在',
                  icon: 'none',
                  duration: 1000
                })
              }

            } else {
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
        })
      }
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
    var tailorQcodes = this.data.tailorQcodes
    if (tailorQcodes.length == 0) {
      wx.showToast({
        title: '请扫描裁片二维码',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.isOut != 0) {
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '共有' + tailorQcodes.length +'扎，确认出库吗?',
      success: function (sm) {
        if (sm.confirm) {
          var embOutStoreJson = {};
          embOutStoreJson.groupName = groupName;
          embOutStoreJson.tailorQcodeIDList = tailorQcodes;
          embOutStoreJson.embStoreLocation = obj.data.embStoreLocation;
          wx.request({
            url: app.globalData.backUrl + '/erp/miniaddemboutstoresinglenew',
            data: embOutStoreJson,
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
                    title: "共有" + res.data.embOutCount+"扎出库成功",
                    icon: 'none',
                    duration: 2000,
                  })
                  obj.setData({
                    tailorQcodes: [],
                    index: 0,
                    selectedGroup: '',
                    tailors: [],
                    isOut: 2,
                    planCount: '',
                    actCount: '',
                    unCount: '',
                    embStoreLocation: '',
                    groupName: '',
                    packageTotalCount: 0,
                    layerTotalSum: 0,
                    packageCount: 0,
                    layerSum: 0,
                    unPackageCount: 0,
                    unLayerSum: 0,
                    orderName: ''
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