const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records:[],
    orderName:'',
    zIndex:-1,
    bindSource: [],
    c_index:0,
    colorNames: ["全部"],
    s_index: 0,
    sizeNames: ["全部"]
  },
  onLoad: function (option) {
  },
  getOrderName: function (e) {

    var obj = this;
    var orderName = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    if (orderName != "") {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetemborderhint',
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
            for (var i = 0; i < res.data.embOrderNameList.length;i++) {
              newSource.push(res.data.embOrderNameList[i]);
            }
            obj.setData({
              bindSource: newSource,
              orderName: orderName,
              zIndex:1000
            });
          }
        }
      })
    }else {
      obj.setData({
        bindSource: newSource,
        orderName: orderName
      });
    }
  },
  itemtap: function (e) {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetembcolorhint',
      data: {
        orderName: e.target.id
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var colorNames = ["全部"];
        if (res.statusCode == 200 && res.data) {
          for (var i = 0; i < res.data.embColorList.length;i++) {
            colorNames.push(res.data.embColorList[i]);
          }
        }
        obj.setData({
          colorNames: colorNames,
          c_index:0
        });
      }
    })
    this.setData({
      orderName: e.target.id,
      zIndex: -1
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
    wx.request({
      url: app.globalData.backUrl + '/erp/miniembstoragequery',
      data: {
        orderName: obj.data.orderName,
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

})