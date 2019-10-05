const app = getApp()
Page({
  data: {
    originPassWord:'',
    newPassWord:'',
    newSecondPassWord: ''
  },
  getOriginPassWord:function(e) {
    this.setData({
      originPassWord:e.detail.value
    })
  },
  getNewPassWord: function (e) {
    this.setData({
      newPassWord: e.detail.value
    })
  },
  getNewSecondPassWord: function (e) {
    this.setData({
      newSecondPassWord: e.detail.value
    })
  },
  updatePassWord:function(e) {
    if (this.data.originPassWord=="") {
      wx.showToast({
        title: '请输入原密码',
        icon: 'none',
        // image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    if (this.data.originPassWord != app.globalData.employee.passWord) {
      wx.showToast({
        title: '原密码输入错误',
        icon: 'none',
        // image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    if (this.data.newPassWord == '') {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none',
        // image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    if (this.data.newSecondPassWord == '') {
      wx.showToast({
        title: '请再次输入新密码',
        icon: 'none',
        // image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    } 
    if (this.data.newSecondPassWord != this.data.newPassWord) {
      wx.showToast({
        title: '两次输入新密码不对',
        icon: 'none',
        // image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    var obj = this;
    wx.showModal({
      title: '提示',
      content: '确定修改密码吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: app.globalData.backUrl + '/erp/miniupdatepassword',
            data: {
              employeeNumber: app.globalData.employeeNumber,
              passWord: obj.data.newSecondPassWord
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.statusCode == 200 && res.data == 0) {
                wx.showToast({
                  title: "修改成功",
                  icon: 'success',
                  duration: 1000,
                  success: function () {
                    app.globalData.employee.passWord = obj.data.newSecondPassWord;
                  }
                })
              } else {
                wx.showToast({
                  title: "修改失败",
                  image: '../../static/img/error.png',
                  duration: 1000,
                })
              }
            },
            fail: function (res) {
              wx.showToast({
                title: "修改失败",
                image: '../../static/img/error.png',
                duration: 1000,
              })
            }
          })
        }
      }
    })
  }

})