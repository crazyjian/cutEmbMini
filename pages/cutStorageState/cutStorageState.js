const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records: [],
    rows:[]
  },
  onLoad: function () {
    var obj = this;
    this.getData();
  },
  getData:function() {
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
          var record = [];
          for (var i = 0; i < res.data.storageStateList.length;i++) {
            var locations = res.data.storageStateList[i].storehouseLocation.split("-");
            if (i!=0 && rows.indexOf(locations[0])==-1) {
              records.push(record);
              record = [];
              tmp = {};
            }
            tmp.col = locations[1];
            var sum = "sum" + locations[2];
            var status = "status" + locations[2];
            tmp[sum] = res.data.storageStateList[i].storageCount;
            var radio = res.data.storageStateList[i].storageCount / res.data.storageStateList[i].storagePlanCount;
            if(radio<0.3) {
              tmp[status] = "rgb(45,202,147)";
            }else if(0.3<=radio<=0.9) {
              tmp[status] = "rgb(217,202,23)";
            }else {
              tmp[status] = "rgb(206,39,60)";
            }
            if (locations[2] == 3) {
              record.push(tmp);
              tmp = {};
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
  onPullDownRefresh: function () {
    this.getData();
    wx.stopPullDownRefresh();
  },
})