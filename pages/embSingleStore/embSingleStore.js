const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records:[],
    versionNumber:'',
    orderName:'',
    zIndex1:-1,
    zIndex2: -1,
    bindSource: [],
    c_index:0,
    colorNames: ["全部"],
    s_index: 0,
    sizeNames: ["全部"],
    isHide: true,
    windowHeight: 0,
    detailRecords: [],
    packageCount: 0,
    layerSum: 0,
    location: ""
  },
  onLoad: function (option) {
  },
  getClothesVersionNumber: function (e) {
    this.setData({
      zIndex2: -1
    })
    var obj = this;
    var versionNumber = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    if (versionNumber != "") {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetorderandversionbysubversion',
        data: {
          subVersion: versionNumber
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          // console.log(res.data);
          if (res.statusCode == 200 && res.data) {
            obj.setData({
              bindSource: res.data.data,
              versionNumber: versionNumber,
              zIndex1:1000
            });
          }
        }
      })
    }else {
      obj.setData({
        bindSource: newSource,
        versionNumber: versionNumber
      });
    }
  },
  getOrderName: function (e) {
    this.setData({
      zIndex1: -1
    })
    var obj = this;
    var orderName = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    if (orderName != "") {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetorderandversionbysuborder',
        data: {
          subOrderName: orderName
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          // console.log(res.data);
          if (res.statusCode == 200 && res.data) {
            obj.setData({
              bindSource: res.data.data,
              orderName: orderName,
              zIndex2: 1000
            });
          }
        }
      })
    } else {
      obj.setData({
        bindSource: newSource,
        orderName: orderName
      });
    }
  },
  itemtap: function (e) {
    var obj = this;
    this.setData({
      versionNumber: e.currentTarget.dataset.version,
      orderName: e.currentTarget.dataset.order,
      zIndex1: -1,
      zIndex2: -1
    });
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetembcolorhint',
      data: {
        orderName: e.currentTarget.dataset.order
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var colorNames = ["全部"];
        if (res.statusCode == 200 && res.data) {
          for (var i = 0; i < res.data.embColorList.length; i++) {
            colorNames.push(res.data.embColorList[i]);
          }
        }
        obj.setData({
          colorNames: colorNames,
          c_index: 0
        });
      }
    })
  },
  search:function() {
    var obj = this;
    var colorName = obj.data.colorNames[obj.data.c_index];
    if (colorName == "全部") {
      colorName = "";
    }
    var sizeName = obj.data.sizeNames[obj.data.s_index];
    if (sizeName == "全部") {
      sizeName = "";
    }
    var orderName = obj.data.orderName;
    if (orderName == "请选择款号") {
      orderName = "";
    }
    wx.request({
      url: app.globalData.backUrl + '/erp/miniembstoragequery',
      data: {
        orderName: orderName,
        colorName: colorName,
        sizeName: sizeName
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          obj.setData({
            records: res.data.queryResult,
          });
        }else {
          obj.setData({
            records: []
          });
        }
      },
      fail:function() {
        wx.showToast({
          title: "服务连接失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    });
  },
  bindColorChange: function (e) {
    var obj = this;
    obj.setData({
      c_index: e.detail.value
    })
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetembsizehint',
      data: {
        orderName: obj.data.orderName,
        colorName: obj.data.colorNames[obj.data.c_index]
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var sizeNames = ["全部"];
        if (res.statusCode == 200 && res.data) {
          for (var i = 0; i < res.data.embSizeList.length; i++) {
            sizeNames.push(res.data.embSizeList[i]);
          }
        }
        obj.setData({
          sizeNames: sizeNames,
          s_index: 0
        });
      }
    })
  },
  bindSizeChange: function (e) {
    this.setData({
      s_index: e.detail.value
    })
  },
  recordDetail: function (e) {
    var obj = this;
    var params = e.currentTarget.dataset.value;
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight - 40,
      isHide: false
    })
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetembstoragebyordercolorsizelocation',
      data: params,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          obj.setData({
            detailRecords: res.data.embStorageList,
            packageCount: res.data.packageCount,
            layerSum: res.data.layerSum,
            location: params.embStoreLocation
          })
        }
      }
    })
  },
  cancel: function (e) {
    this.setData({
      isHide: true,
      detailRecords: [],
      packageCount: 0,
      layerSum: 0,
      location: ""
    })
  }

})