//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  //事件处理函数

  onLoad: function (option) {
  },
  cutInStore: function () {
    wx.redirectTo({
      url: "../cutInStore/cutInStore"
    })
  },
  cutOutStore: function () {
    wx.redirectTo({
      url: "../cutOutStore/cutOutStore"
    })
  },
  cutChangeStore:function(){
    wx.redirectTo({
      url: "../cutChangeStore/cutChangeStore"
    })
  },
  cutMatch:function(){
    var obj = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var matchJson = {};
        matchJson.tailorQcode = new Array(res.result);
        wx.request({
          url: app.globalData.backUrl + '/erp/minigetmatch',
          data: {
            'matchJson': JSON.stringify(matchJson)
          },
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            // console.log(res.data);
            if (res.statusCode == 200) {
              if(res.data && res.data.length>0) {
                wx.showToast({
                  title: '裁片位置：' + res.data[0],
                  icon: 'none',
                  duration: 5000
                })
              }else {
                wx.showToast({
                  title: "没有查询到位置信息",
                  image: '../../static/img/error.png',
                  duration: 1000,
                })
              }
            }else {
              wx.showToast({
                title: "服务发生异常",
                image: '../../static/img/error.png',
                duration: 1000,
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: "服务连接失败",
              image: '../../static/img/error.png',
              duration: 1000,
            })
          }
        })
      }
    })
  },
  cutSingleStore:function() {
    wx.navigateTo({
      url: "../cutSingleStore/cutSingleStore"
    })
  },
  embInStore:function() {
    wx.redirectTo({
      url: "../embInStore/embInStore"
    })
  },
  embOutStore: function () {
    wx.redirectTo({
      url: "../embOutStore/embOutStore"
    })
  },
  embSingleStore:function() {
    wx.navigateTo({
      url: "../embSingleStore/embSingleStore"
    })
  },
  embOutSum:function(){
    wx.navigateTo({
      url: "../embOutSum/embOutSum"
    })
  },
  embOutDetail:function(){
    wx.navigateTo({
      url: "../embOutDetail/embOutDetail"
    })
  }
})
