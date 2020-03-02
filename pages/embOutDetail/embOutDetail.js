const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records:[],
    dateFrom:'',
    dateTo:''
  },
  onLoad: function (option) {
    var obj = this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    this.setData({
      dateFrom: Y + '-' + M + '-' + D,
      dateTo: Y + '-' + M + '-' + D
    })
  },
  search:function() {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetemboutdetail',
      data: {
        fromDate:obj.data.dateFrom,
        toDate: obj.data.dateTo
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          if (res.data.embOutDetailList.length==0) {
            wx.showToast({
              title: "没有数据",
              icon: 'none',
              duration: 1000,
            })
          }else {
            obj.setData({
              records: res.data.embOutDetailList
            });
          }
        }else {
          obj.setData({
            records: []
          });
          wx.showToast({
            title: "查询失败",
            image: '../../static/img/error.png',
            duration: 1000,
          })
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
  bindFromChange: function (e) {
    this.setData({
      dateFrom: e.detail.value
    })
  },
  bindToChange: function (e) {
    this.setData({
      dateTo: e.detail.value
    })
  }
})