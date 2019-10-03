const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    date:'',
    dayPackageCount:'',
    dayPieceCount: '',
    daySumSalary: '',
    monthPackageCount: '',
    monthPieceCount: '',
    monthSumSalary: ''
  },
  onShow: function () {
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
      date: Y + '年' + M + '月' + D + '日'
    })
    wx.request({
      url: app.globalData.backUrl +'/erp/minigettodaysummary',
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
          obj.setData({
            dayPackageCount: res.data.packageCount+'扎',
            dayPieceCount: res.data.pieceCount+'件',
            daySumSalary: res.data.sumSalary+'元'
          })
        }else {
          wx.showToast({
            title: "获取数据失败",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "获取数据失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    })
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetthismonthsummary',
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
          obj.setData({
            monthPackageCount: res.data.packageCount + '扎',
            monthPieceCount: res.data.pieceCount + '件',
            monthSumSalary: res.data.sumSalary + '元'
          })
        } else {
          wx.showToast({
            title: "获取数据失败",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "获取数据失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    })
  },
  getpieceworkemptoday:function() {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role1' || app.globalData.employee.role == 'role3') {
      wx.navigateTo({
        url: "../dayPieceWork/dayPieceWork"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  getpiecework: function () {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role1' || app.globalData.employee.role == 'role3') {
      wx.navigateTo({
        url: "../pieceWorkSearch/pieceWorkSearch"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  getDispatchDetail:function() {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role2') {
      wx.navigateTo({
        url: "../dispatchDetail/dispatchDetail"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  getInspectionDetail: function () {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role3') {
      wx.navigateTo({
        url: "../inspectionDetail/inspectionDetail"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  getSampleinspectionDetail: function () {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role4') {
      wx.navigateTo({
        url: "../sampleinspectionDetail/sampleinspectionDetail"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  getProcedureDetail: function () {
    if (app.globalData.employee.role != 'role1' && app.globalData.employee.role != 'role3') {
      wx.navigateTo({
        url: "../procedureDetail/procedureDetail"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
})