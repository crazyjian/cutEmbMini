const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records:[],
    orderName:'',
    zIndex:-1,
    bindSource: []
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
    this.setData({
      orderName: e.target.id,
      zIndex: -1
    })
  },
  search:function() {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/miniqueryembleak',
      data: {
        orderName: obj.data.orderName,
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