const app = getApp()
Page({
  data: {
    records:[],
  },
  onLoad: function (option) {
    this.initList();
  },
  delPieceWork:function(e) {
    var obj = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          var pieceWorkId = e.target.dataset.value;
          wx.request({
            url: app.globalData.backUrl + '/erp/minideletepiecework',
            data: {
              pieceWorkID: pieceWorkId
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.statusCode == 200 && res.data==0) {
                wx.showToast({
                  title: "删除成功",
                  icon: 'success',
                  duration: 1000,
                  success: function () {
                    obj.initList();
                  }
                })
              }else {
                wx.showToast({
                  title: "删除失败",
                  image: '../../static/img/error.png',
                  duration: 1000,
                })
              }
            },
            fail: function (res) {
              wx.showToast({
                title: "删除失败",
                image: '../../static/img/error.png',
                duration: 1000,
              })
            }
          });
        }
      }
    })
  },
  initList:function() {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetpieceworkemptoday',
      // url: 'http://192.168.0.101:8080/minigetpieceworkemptoday',
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
            records: res.data.pieceWorkEmpToday,
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