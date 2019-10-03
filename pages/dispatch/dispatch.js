const app = getApp()
Page({
  data: {
    listData: [],
    records:[],
    isCheckAll:false,
    selectRecords:[],
    procedures: ['请选择您的工序号'],
    index:0,
    orderName:'',
    zIndex: -1,
    bindSource: []//绑定到页面的数据，根据用户输入动态变化
  },
  onLoad: function (option) {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetemployeebygroup',
      data: {
        groupName: app.globalData.employee.groupName
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data) {
          // console.log(res.data.groupEmployeeList)
          let recordsNew = [];
          for (let i=0;i<res.data.groupEmployeeList.length;i++) {
            recordsNew.push({
              isSelect: false, // 每条记录默认没有选中
              employeeName: res.data.groupEmployeeList[i].employeeName,
              employeeNumber: res.data.groupEmployeeList[i].employeeNumber
            });
          }
          obj.setData({
            listData: res.data.groupEmployeeList,
            records: recordsNew
          });
        }
      }
    });
  },
  checkAll:function(e) {
    var selected = e.target.dataset.checks?false:true;
    this.setData({
      isCheckAll:selected
    })
    var selectRecords = [];
    if(selected) {
      for (let i = 0; i < this.data.records.length; i++) {
        this.data.records[i].isSelect = true;
        selectRecords.push({
          employeeName: this.data.records[i].employeeName,
          employeeNumber: this.data.records[i].employeeNumber
        })
      }
    }else {
      for (let i = 0; i < this.data.records.length; i++) {
        this.data.records[i].isSelect = false;
      }
    }
    this.setData({
      selectRecords: selectRecords,
      records:this.data.records
    })
  },
  check:function(e) {
    var index = e.target.dataset.index;
    var selectRecords = this.data.selectRecords;
    var selected = !this.data.records[index].isSelect;
    if(selected) {
      selectRecords.push({ 
        employeeName: this.data.records[index].employeeName,
        employeeNumber: this.data.records[index].employeeNumber
      });
    }else {
      let indexId = 0;
      for (let i = 0; i < this.data.selectRecords.length; i++) {
        if (this.data.selectRecords[i].employeeNumber == this.data.records[index].employeeNumber) {
          indexId = i;
          break;
        }
      }
      selectRecords.splice(indexId, 1);
    }
    this.data.records[index].isSelect = selected;
    this.setData({
      selectRecords: selectRecords,
      records: this.data.records
    })
  },
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  getProcedures:function(e) {
    var obj = this;
    var orderName = this.data.orderName;
    // console.log(orderName)
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetprocedureinfobyorder',
      data: {
        orderName: orderName,
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data) {
          var procedures = [];
          if (res.data.procedureInfoList.length == 0) {
            procedures.push('查无工序号');
          }else
            procedures.push('请选择您的工序号');
          for (let i=0; i<res.data.procedureInfoList.length;i++) {
            var info = res.data.procedureInfoList[i];
            procedures.push(info.procedureCode + "-" + info.procedureNumber + "-" + info.procedureName);
          }
          obj.setData({
            procedures: procedures,
            index:0
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "获取工序号失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
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
              zIndex: 1000
            });
            obj.getProcedures();
          }
        }
      })
    }else {
      obj.setData({
        bindSource: newSource,
        orderName: orderName
      });
      obj.getProcedures();
    }
  },
  itemtap: function (e) {
    this.setData({
      orderName: e.target.id,
      bindSource: [],
      zIndex: -1
    })
    this.getProcedures();
  },
  addDispatch:function(e) {
    var obj = this;
    if (this.data.orderName=="") {
      wx.showToast({
        title: '请输入订单号',
        image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    if (this.data.index == 0) {
      wx.showToast({
        title: '请选择工序号',
        image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    if (this.data.selectRecords.length == 0) {
      wx.showToast({
        title: '请选择员工',
        image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    } 
    var dispatchJson = {};
    dispatchJson.orderName = this.data.orderName;
    dispatchJson.emp = this.data.selectRecords;
    dispatchJson.groupName = app.globalData.employee.groupName;
    // dispatchJson.groupName = '质检';
    dispatchJson.procedureInfo = this.data.procedures[this.data.index];
    wx.request({
      url: app.globalData.backUrl + '/erp/miniadddispatchbatch',
      data: {
        dispatchJson: JSON.stringify(dispatchJson)
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data==0) {
          wx.showToast({
            title: "提交成功",
            icon: 'success',
            duration: 1000
          })
          var selectRecords = [];
          for (let i = 0; i < obj.data.records.length; i++) {
            obj.data.records[i].isSelect = false;
          }
          obj.setData({
            orderName:'',
            procedures: ['请选择您的工序号'],
            index: 0,
            isCheckAll: false,
            selectRecords: selectRecords,
            records: obj.data.records
          })
        }else {
          wx.showToast({
            title: "提交失败",
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