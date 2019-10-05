const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    employeeName: '',
    employeeNumber: '',
    role:'',
    hasUserInfo:false,
    factoryName:''
  },
  onLoad: function (option) {
    this.setData({
      employeeName: app.globalData.employee.employeeName,
      employeeNumber: app.globalData.employee.employeeNumber,
      factoryName:app.globalData.factoryName
    })
    if (app.globalData.employee.role == 'root') {
      this.setData({
        role:'管理员',
      })
    } else if (app.globalData.employee.role == 'role1') {
      this.setData({
        role: '车工',
      })
    } else if (app.globalData.employee.role == 'role2') {
      this.setData({
        role: '生产主管',
      })
    } else if (app.globalData.employee.role == 'role3') {
      this.setData({
        role: '质检',
      })
    } else if (app.globalData.employee.role == 'role4') {
      this.setData({
        role: '抽检',
      })
    } else if (app.globalData.employee.role == 'role5') {
      this.setData({
        role: '仓储管理',
      })
    } 
  },
  loginOut:function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.redirectTo({
            url: "../login/login"
          })
        }
      }
    })
  },
  updatePassWord:function() {
    wx.navigateTo({
      url: "../password/password"
    })
  },
  showEmployeeInfo: function () {
    wx.navigateTo({
      url: "../employee/employee"
    })
  }
})