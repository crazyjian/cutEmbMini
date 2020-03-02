//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isHide:true,
    location:""
  },
  //事件处理函数

  onLoad: function (option) {
  },
  cutInStore: function () {
    wx.navigateTo({
      url: "../cutInStore/cutInStore"
    })
  },
  cutOutStore: function () {
    wx.navigateTo({
      url: "../cutOutStore/cutOutStore"
    })
  },
  cutChangeStore:function(){
    wx.navigateTo({
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
                // wx.showToast({
                //   title: '裁片位置：' + res.data[0],
                //   icon: 'none',
                //   duration: 5000
                // })
                obj.setData({
                  isHide: false,
                  location: res.data[0]
                })
              }else {
                wx.showToast({
                  title: "没有查询到位置信息",
                  icon: "none",
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
  confirm:function() {
    this.setData({
      isHide:true,
      location:""
    })
  },
  cutSingleStore:function() {
    wx.navigateTo({
      url: "../cutSingleStore/cutSingleStore"
    })
  },
  embInStore:function() {
    wx.navigateTo({
      url: "../embInStore/embInStore"
    })
  },
  embOutStore: function () {
    wx.navigateTo({
      url: "../embOutStore/embOutStore"
    })
  },
  embSingleOutStore: function () {
    wx.navigateTo({
      url: "../embSingleOutStore/embSingleOutStore"
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
  },
  cutStorageState:function(){
    wx.navigateTo({
      url: "../cutStorageState/cutStorageState"
    })
  },
  embStorageState:function(){
    wx.navigateTo({
      url: "../embStorageState/embStorageState"
    })
  },
  cutSingleInStore:function(){
    wx.navigateTo({
      url: "../cutSingleInStore/cutSingleInStore"
    })
  },
  otherOutStore: function () {
    wx.navigateTo({
      url: "../otherOutStore/otherOutStore"
    })
  },
  otherInStore: function () {
    wx.navigateTo({
      url: "../otherInStore/otherInStore"
    })
  },
  otherStoreSearch: function () {
    wx.navigateTo({
      url: "../otherStoreSearch/otherStoreSearch"
    })
  }
})
