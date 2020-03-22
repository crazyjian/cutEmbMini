const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records:[],
    versionNumber:'',
    zIndex:-1,
    bindSource: [],
    c_index:0,
    colorNames: ["全部"],
    s_index: 0,
    sizeNames: ["全部"],
    orderNames:["请选择款号"],
    o_index:0,
    isHide: true,
    windowHeight: 0,
    detailRecords: [],
    packageCount: 0,
    layerSum: 0,
    location:""
  },
  onLoad: function (option) {
  },
  getClothesVersionNumber: function (e) {

    var obj = this;
    var versionNumber = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    if (versionNumber != "") {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetversionhint',
        data: {
          versionNumber: versionNumber
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          // console.log(res.data);
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i < res.data.versionList.length;i++) {
              newSource.push(res.data.versionList[i]);
            }
            obj.setData({
              bindSource: newSource,
              versionNumber: versionNumber,
              zIndex:1000
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
  itemtap: function (e) {
    var obj = this;
    this.setData({
      versionNumber: e.target.id,
      zIndex: -1
    })
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetorderbyversion',
      data: {
        clothesVersionNumber: e.target.id
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var orderNames = ["请选择款号"];
        if (res.statusCode == 200 && res.data) {
          for (var i = 0; i < res.data.orderList.length; i++) {
            orderNames.push(res.data.orderList[i]);
          }
        }
        obj.setData({
          orderNames: orderNames,
          o_index: 0
        });
      }
    })
  },
  bindOrderChange:function(e) {
    var obj = this;
    obj.setData({
      o_index: e.detail.value
    })
    if(e.detail.value == 0) {
      var colorNames = ["全部"];
      var sizeNames = ["全部"];
      obj.setData({
        colorNames: colorNames,
        sizeNames: sizeNames,
        c_index: 0,
        s_index: 0
      });
    }else {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetstoragecolorhint',
        data: {
          orderName: obj.data.orderNames[obj.data.o_index]
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          var colorNames = ["全部"];
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i < res.data.storageColorList.length; i++) {
              colorNames.push(res.data.storageColorList[i]);
            }
          }
          obj.setData({
            colorNames: colorNames,
            c_index: 0
          });
        }
      })
    }
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
    var orderName = obj.data.orderNames[obj.data.o_index];
    if(orderName == "请选择款号") {
      orderName = "";
    }
    wx.request({
      url: app.globalData.backUrl + '/erp/miniquerycutstoragebyorder',
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
            records: res.data.cutStorageQueryList,
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
      url: app.globalData.backUrl + '/erp/minigetstoragesizehint',
      data: {
        orderName: obj.data.orderNames[obj.data.o_index],
        colorName: obj.data.colorNames[obj.data.c_index]
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var sizeNames = ["全部"];
        if (res.statusCode == 200 && res.data) {
          for (var i = 0; i < res.data.storageSizeList.length; i++) {
            sizeNames.push(res.data.storageSizeList[i]);
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
  recordDetail:function(e) {
    var obj = this;
    var params = e.currentTarget.dataset.value;
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight - 40,
      isHide:false
    })
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetstoragebyordercolorsizelocation',
      data: params,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          obj.setData({
            detailRecords: res.data.storageList,
            packageCount: res.data.packageCount,
            layerSum: res.data.layerSum,
            location: params.storehouseLocation
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
      location:""
    })
  }

})