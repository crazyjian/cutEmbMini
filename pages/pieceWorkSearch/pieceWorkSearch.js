const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records:[],
    orderName:'',
    zIndex:-1,
    bindSource: [],
    c_index:0,
    colorNames: ["全部"],
    s_index: 0,
    sizeNames: ["全部"],
    dateFrom:'',
    dateTo:'',
    clothesVersionNumber:'',
    pieceCountTotal:0,
    salaryTotal:0
  },
  onLoad: function (option) {
    var obj = this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    this.setData({
      dateFrom: Y + '-' + M + '-' + D,
      dateTo: Y + '-' + M + '-' + D
    })
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
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetcolorhint',
      data: {
        orderName: e.target.id
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var colorNames = ["全部"];
        if (res.statusCode == 200 && res.data) {
          for (var i = 0; i<res.data.colorList.length;i++) {
            colorNames.push(res.data.colorList[i].colorName);
          }
        }
        obj.setData({
          colorNames: colorNames,
          c_index:0
        });
      }
    })
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetsizehint',
      data: {
        orderName: e.target.id
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var sizeNames = ["全部"];
        if (res.statusCode == 200 && res.data) {
          for (var i = 0; i < res.data.sizeNameList.length; i++) {
            sizeNames.push(res.data.sizeNameList[i]);
          }
        }
        obj.setData({
          sizeNames: sizeNames,
          s_index: 0
        });
      }
    })
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetversionnumberbyordername',
      data: {
        orderName: e.target.id
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        obj.setData({
          clothesVersionNumber: res.data
        });
      }
    })
    this.setData({
      orderName: e.target.id,
      zIndex: -1
    })
  },
  search:function() {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetdetailproduction',
      data: {
        orderName: obj.data.orderName,
        employeeNumber: app.globalData.employeeNumber,
        from:obj.data.dateFrom,
        to: obj.data.dateTo,
        colorName: obj.data.colorNames[obj.data.c_index],
        sizeName: obj.data.sizeNames[obj.data.s_index]
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          var pieceCountTotal=0;
          var salaryTotal=0;
          for (var i = 0; i<res.data.miniDetailQueryList.length;i++) {
            pieceCountTotal += res.data.miniDetailQueryList[i].pieceCount;
            salaryTotal += res.data.miniDetailQueryList[i].salary;
          }
          obj.setData({
            records: res.data.miniDetailQueryList,
            pieceCountTotal: pieceCountTotal,
            salaryTotal: salaryTotal
          });
        }else {
          obj.setData({
            records: []
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
  },
  getClothesVersionNumber:function(e) {
    var clothesVersionNumber = e.detail.value;
    this.setData({
      clothesVersionNumber: clothesVersionNumber
    })
  },
  bindFromChange: function (e) {
    this.setData({
      dateFrom: e.detail.value
    })
  },
  bindToChange: function (e) {
    this.setData({
      dateTo: e.detail.value
    })
  },
  bindColorChange: function (e) {
    this.setData({
      c_index: e.detail.value
    })
  },
  bindSizeChange: function (e) {
    this.setData({
      s_index: e.detail.value
    })
  },

})