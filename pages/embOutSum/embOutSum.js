const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records:[],
    versionNumber:'',
    zIndex:-1,
    bindSource: [],
    orderNames: ["请选择款号"],
    o_index: 0
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
  bindOrderChange: function (e) {
    var obj = this;
    obj.setData({
      o_index: e.detail.value
    })
  },
  search:function() {
    var obj = this;
    var orderName = obj.data.orderNames[obj.data.o_index];
    if (orderName == "请选择款号") {
      orderName = "";
    }
    wx.request({
      url: app.globalData.backUrl + '/erp/miniqueryembleak',
      data: {
        orderName: orderName,
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          var records = [];
          for(var colorKey in res.data) {
            for(var sizeKey in res.data[colorKey]) {
              var item = {};
              item.colorName = colorKey;
              item.sizeName = sizeKey;
              item.planCount = res.data[colorKey][sizeKey].planCount;
              item.actualCount = res.data[colorKey][sizeKey].actualCount;
              item.contrastCount = res.data[colorKey][sizeKey].contrastCount;
              records.push(item);
            }
          }
          obj.setData({
            records: records
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
  }

})