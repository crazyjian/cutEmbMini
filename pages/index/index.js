//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    backImg: app.globalData.backImg,
    isHide:true,
    qrCode:''
  },
  //事件处理函数
  
  onLoad: function (option) {
    wx.showTabBar();
  },
  scanCode: function (e) {
    var obj = this;
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role1' || app.globalData.employee.role == 'role3') {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          // console.log(res);
          wx.redirectTo({
            url: "../scanPiece/scanPiece?qrCode=" + res.result
          })
        },
        // fail(res) {
        //   wx.showToast({
        //     title: '失败',
        //     image: '../../static/img/error.png',
        //     duration: 1000
        //   })
        // }
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  dispatch: function (e) {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role2') {
      wx.navigateTo({
        url: "../dispatch/dispatch"
      })
    }else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  inspection: function (e) {
    var obj = this;
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role2' || app.globalData.employee.role == 'role3') {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          // console.log(res);
          wx.redirectTo({
            url: "../inspection/inspection?qrCode=" + res.result
          })
        },
        // fail(res) {
        //   wx.showToast({
        //     title: '失败',
        //     image: '../../static/img/error.png',
        //     duration: 1000
        //   })
        // }
      })
    }else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  sampleinspection: function (e) {
    var obj = this;
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role4') {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          // console.log(res);
          wx.redirectTo({
            url: "../sampleinspection/sampleinspection?qrCode=" + res.result
          })
        },
        // fail(res) {
        //   wx.showToast({
        //     title: '失败',
        //     image: '../../static/img/error.png',
        //     duration: 1000
        //   })
        // }
      })
    }else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  hand:function(e) {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role1' || app.globalData.employee.role == 'role3') {
      this.setData({
        isHide:false
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  cancel:function(e) {
    this.setData({
      isHide: true,
      qrCode:''
    })
  },
  setQrCodeValue:function(e) {
    this.setData({
      qrCode: e.detail.value
    })
  },
  confirm:function(e) {
    var qrCode = this.data.qrCode
    if (!qrCode) {
      wx.showToast({
        title: '请输入二维码',
        image: '../../static/img/error.png',
        duration: 1000
      })
      return false;
    }
    this.setData({
      isHide: true,
      qrCode: ''
    })
    wx.redirectTo({
      url: "../hand/hand?qrCode=" + qrCode
    })
  },
  yipei:function() {
    wx.navigateTo({
      url: "../emb/emb"
    })
  }
})
