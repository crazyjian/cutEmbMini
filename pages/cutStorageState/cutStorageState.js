const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records: [],
    rows:[],
    switchStatus:true,
    showStorgeName:'裁片',
  },
  onLoad: function () {
    var obj = this;
    wx.showToast({ title: '加载中', icon: 'loading', duration: 10000 });
    this.getCutStorageData();
  },
  getCutStorageData:function() {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetstoragestate',
      data: {
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data) {
          var rows = [];
          var records = [];
          var tmp = {};
          tmp.sumList = [];
          tmp.statusList = [];
          var record = [];
          for (var i = 0; i < res.data.storageStateList.length;i++) {
            var locations = res.data.storageStateList[i].storehouseLocation.split("-");
            if (i!=0 && rows.indexOf(locations[0])==-1) {
              records.push(record);
              record = [];
              tmp = {};
              tmp.sumList = [];
              tmp.statusList = [];
            }
            tmp.col = locations[1];
            tmp.floor = res.data.storageStateList[i].floor;
            tmp.sumList.push(res.data.storageStateList[i].storageCount);
            var radio = res.data.storageStateList[i].storageCount / res.data.storageStateList[i].storagePlanCount;
            if(radio<0.3) {
              tmp.statusList.push("rgb(45,202,147)");
            }else if(0.3<=radio<=0.9) {
              tmp.statusList.push("rgb(217,202,23)");
            }else {
              tmp.statusList.push("rgb(206,39,60)");
            }
            if (locations[2] == res.data.storageStateList[i].floor) {
              record.push(tmp);
              tmp = {};
              tmp.sumList = [];
              tmp.statusList = [];
            }
            if (i == res.data.storageStateList.length-1) {
              records.push(record);
            }
            if (rows.indexOf(locations[0]) != -1) {
              continue;
            }
            rows.push(locations[0]);
          }
          obj.setData({
            rows:rows,
            records:records
          })

        } else {
          wx.showToast({
            title: "获取数据失败",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
        wx.hideToast()
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
  getEmbStorageData: function () {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetembstoragestate',
      data: {
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data) {
          var rows = [];
          var records = [];
          var tmp = {};
          tmp.sumList = [];
          tmp.statusList = [];
          var record = [];
          for (var i = 0; i < res.data.embStorageStateList.length; i++) {
            var locations = res.data.embStorageStateList[i].embStoreLocation.split("-");
            if (i != 0 && rows.indexOf(locations[0]) == -1) {
              records.push(record);
              record = [];
              tmp = {};
              tmp.sumList = [];
              tmp.statusList = [];
            }
            tmp.col = locations[1];
            tmp.floor = res.data.embStorageStateList[i].floor;
            tmp.sumList.push(res.data.embStorageStateList[i].embStorageCount);
            var radio = res.data.embStorageStateList[i].embStorageCount / res.data.embStorageStateList[i].embPlanCount;
            if (radio < 0.3) {
              tmp.statusList.push("rgb(45,202,147)");
            } else if (0.3 <= radio <= 0.9) {
              tmp.statusList.push("rgb(217,202,23)");
            } else {
              tmp.statusList.push("rgb(206,39,60)");
            }
            if (locations[2] == res.data.embStorageStateList[i].floor) {
              record.push(tmp);
              tmp = {};
              tmp.sumList = [];
              tmp.statusList = [];
            }
            if (i == res.data.embStorageStateList.length - 1) {
              records.push(record);
            }
            if (rows.indexOf(locations[0]) != -1) {
              continue;
            }
            rows.push(locations[0]);
          }
          obj.setData({
            rows: rows,
            records: records
          })

        } else {
          wx.showToast({
            title: "获取数据失败",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
        wx.hideToast()

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
  switchChange:function(e) {
    wx.showToast({ title: '加载中', icon: 'loading', duration: 10000 });
    if (e.detail.value) {
      this.getCutStorageData();
      this.setData({
        switchStatus: e.detail.value,
        showStorgeName:'裁片'
      })
    }else {
      this.getEmbStorageData();
      this.setData({
        switchStatus: e.detail.value,
        showStorgeName: '衣胚'
      })
    }
  },
  onPullDownRefresh: function () {
    if (this.data.switchStatus) {
      this.getCutStorageData();
    }else {
      this.getEmbStorageData();
    }
    wx.stopPullDownRefresh();
  },
})