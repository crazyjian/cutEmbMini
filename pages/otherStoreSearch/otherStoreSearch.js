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
    partNames: ["全部"],
    p_index:0,
    orderNames:["请选择款号"],
    o_index:0,
    tailorCount:'',
    inCount:'',
    outCount:''
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
      var partNames = ["全部"];
      obj.setData({
        colorNames: colorNames,
        sizeNames: sizeNames,
        partNames: partNames,
        c_index: 0,
        s_index: 0,
        p_index: 0
      });
    }else {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetotherpartnamesbyordername',
        data: {
          orderName: obj.data.orderNames[obj.data.o_index]
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          var partNames = ["全部"];
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i < res.data.otherPartNameList.length; i++) {
              partNames.push(res.data.otherPartNameList[i]);
            }
          }
          obj.setData({
            partNames: partNames,
            p_index: 0
          });
        }
      })
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetcolorhint',
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
            for (var i = 0; i < res.data.colorList.length; i++) {
              colorNames.push(res.data.colorList[i].colorName);
            }
          }
          obj.setData({
            colorNames: colorNames,
            c_index: 0
          });
        }
      })
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetsizehint',
        data: {
          orderName: obj.data.orderNames[obj.data.o_index]
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          var sizeNames = ["全部"];
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i < res.data.sizeNameList.length; i++) {
              sizeNames.push(res.data.sizeNameList[i]);
            }
          }
          obj.setData({
            sizeNames: sizeNames,
            s_index: 0
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
    var partName = obj.data.partNames[obj.data.p_index];
    if (partName == "全部") {
      partName = "";
    }
    var orderName = obj.data.orderNames[obj.data.o_index];
    if(orderName == "请选择款号") {
      wx.showToast({
        title: '请选择款号',
        image: '../../static/img/error.png',
        duration: 1000
      })
      return false;
    }
    wx.request({
      url: app.globalData.backUrl + '/erp/minisearchotherstorage',
      data: {
        orderName: orderName,
        colorName: colorName,
        sizeName: sizeName,
        partName: partName
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          if (res.data.otherStorageSize>1000) {
            wx.showToast({
              title: "数据过多，只展示1000条数据",
              icon: 'none',
              duration: 2000,
            })
          }
          obj.setData({
            records: res.data.otherStorageList,
            tailorCount: res.data.tailorCount,
            inCount: res.data.inCount,
            outCount: res.data.outCount
          });
        }else {
          obj.setData({
            records: [],
            tailorCount: '',
            inCount: '',
            outCount: ''
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
  },
  bindSizeChange: function (e) {
    this.setData({
      s_index: e.detail.value
    })
  },
  bindPartChange: function (e) {
    this.setData({
      p_index: e.detail.value
    })
  }

})