var util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records:[],
  },
  onLoad: function (option) {
    this.initList();
  },
  initList:function() {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetpieceworkempthismonth',
      data: {
        employeeNumber: app.globalData.employeeNumber
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data) {
          var records = [];
          for (var i = 0; i < res.data.pieceWorkEmpThisMonth.length;i++) {
            var record = {};
            var item = res.data.pieceWorkEmpThisMonth[i];
            record.detail = "订单号:" + item.orderName + " 床号:" + item.bedNumber + " 扎号:" + item.packageNumber + " 颜色:" + item.colorName + " 件数:" + item.layerCount;
            record.time = util.formatDate(item.createTime);
            records.push(record);
          }
          obj.setData({
            records: records
          });
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "获取数据失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    });
  }

})