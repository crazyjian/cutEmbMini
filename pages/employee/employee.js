const app = getApp()
Page({
  data: {
    employee:null
  },
  onLoad:function() {
    this.setData({
      employee: app.globalData.employee
    })
  }

})