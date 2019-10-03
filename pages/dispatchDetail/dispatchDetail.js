const app = getApp()
Page({
  data: {
    records:[],
    orderName:'',
    zIndex:-1,
    groupName:'',
    isShow:true,
    bindSource: []
  },
  onLoad: function (option) {
    var obj = this;
    if (app.globalData.employee.role == 'root') {
      obj.setData({
        isShow: false
      })
    }else {
      obj.setData({
        isShow: true,
        groupName: app.globalData.employee.groupName
      })
    }
  },
  getOrderName: function (e) {

    var obj = this;
    var orderName = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    if (orderName != "") {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetorderhint',
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
            for (var i = 0; i < res.data.orderNameList.length;i++) {
              newSource.push(res.data.orderNameList[i].orderName);
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
    if (app.globalData.employee.role == 'root') {
      obj.setData({
        isShow: false
      })
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetdispatchbyorder',
        data: {
          orderName: obj.data.orderName
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res.statusCode == 200 && res.data) {
            let recordsNew = [];
            for (let i = 0; i < res.data.dispatchListOrderName.length; i++) {
              recordsNew.push({
                employee: res.data.dispatchListOrderName[i].employeeNumber+'-'+res.data.dispatchListOrderName[i].employeeName,
                procedureName: res.data.dispatchListOrderName[i].procedureName,
                dispatchID: res.data.dispatchListOrderName[i].dispatchID
              });
            }
            obj.setData({
              records: recordsNew
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
    } else{
      obj.setData({
        isShow: true
      })
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetdispatchbyordergroup',
        data: {
          orderName: obj.data.orderName,
          groupName:obj.data.groupName
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res.statusCode == 200 && res.data) {
            let recordsNew = [];
            for (let i = 0; i < res.data.dispatchListOrderGroup.length; i++) {
              recordsNew.push({
                employee: res.data.dispatchListOrderGroup[i].employeeNumber + '-' + res.data.dispatchListOrderGroup[i].employeeName,
                procedureName: res.data.dispatchListOrderGroup[i].procedureName,
                dispatchID: res.data.dispatchListOrderGroup[i].dispatchID
              });
            }
            obj.setData({
              records: recordsNew
            });
          }
        },
        fail: function () {
          wx.showToast({
            title: "服务连接失败",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
      });
    }
  },
  getGroupName:function(e) {
    var groupName = e.detail.value;
    this.setData({
      groupName: groupName
    })
  },
  delDisPatch: function (e) {
    var obj = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          var dispatchID = e.target.dataset.value;
          wx.request({
            url: app.globalData.backUrl + '/erp/minideletedispatch',
            data: {
              dispatchID: dispatchID
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.statusCode == 200 && res.data == 0) {
                wx.showToast({
                  title: "删除成功",
                  icon: 'success',
                  duration: 1000,
                  success: function () {
                    obj.search();
                  }
                })
              } else {
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
  }

})