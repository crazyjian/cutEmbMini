// pages/login/login.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    backImg: app.globalData.backImg,
    // placeholder:'请扫描工厂二维码',
    placeholder:'请输入工厂编码',
    isShow:false,
    urlCode:'',
    employeeNumber:'',
    passWord:''
  },
  onLoad: function (option) {
    var that = this;
    wx.hideTabBar();
    wx.getStorage({
      key: 'urlCode',
      success(res) {
        that.setData({
          urlCode: res.data
        })
      }
    });
    wx.getStorage({
      key: 'employeeNumber',
      success(res) {
        that.setData({
          employeeNumber: res.data
        })
      }
    });
    wx.getStorage({
      key: 'passWord',
      success(res) {
        that.setData({
          passWord: res.data
        })
      }
    });
  },
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '',
      path: '/pages/login/login',
      success: function (res) {
        // 转发成功

        that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  formSubmit: function (e) {
    // console.log(e.detail.value);
    var qrCode = e.detail.value.qrCode; // 获取当前表单元素输入框内容
    if (!qrCode) {
      wx.showToast({
        title: '请输入编码',
        image: '../../static/img/error.png',
        duration: 1000
      }) 
      return false;
    } else if (qrCode == '1') {
      app.globalData.backUrl = "https://xiangsheng.jingyiclothing.com";
      app.globalData.factoryName = "中山翔胜制衣";
    } else if (qrCode == '2') {
      app.globalData.backUrl = "https://lfm.jingyiclothing.com";
      app.globalData.factoryName = "盐城立福麦";
    } else if (qrCode == '3') {
      app.globalData.backUrl = "https://dy.jingyiclothing.com";
      app.globalData.factoryName = "中山德悦服饰";
    } else if (qrCode == '5') {
      app.globalData.backUrl = "https://cy.jingyiclothing.com";
      app.globalData.factoryName = "中山诚远制衣";
    } else {
      app.globalData.backUrl = "http://192.168.2.124:8080";
      app.globalData.factoryName = "";
    }
    var employeeNumber = e.detail.value.employeeNumber; // 获取当前表单元素输入框内容
    if (!employeeNumber) {
      wx.showToast({
        title: '请输入工号',
        image:'../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    var passWord = e.detail.value.passWord; // 获取当前表单元素输入框内容
    if (!passWord) {
      wx.showToast({
        title: '请输入密码',
        image: '../../static/img/error.png',
        duration: 1000
      })
      return false;
    }
    wx.request({
      url: app.globalData.backUrl + "/erp/minicutemblogin",
      data: {
        employeeNumber: e.detail.value.employeeNumber,
        passWord: e.detail.value.passWord
      },
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200) {
          //访问正常
          if (res.data.flag == 2) {
            wx.showToast({
              title: "工号或密码错误",
              image: '../../static/img/error.png',
              duration: 1000,
            })
          } else if (res.data.flag == 0) {
            app.globalData.employee = res.data.employee;
            app.globalData.employeeNumber = employeeNumber;
            wx.setStorage({
              key: "urlCode",
              data: qrCode
            });
            wx.setStorage({
              key: "employeeNumber",
              data: employeeNumber
            });
            wx.setStorage({
              key: "passWord",
              data: passWord
            });
            wx.showToast({
              title: "登录成功",
              icon: 'success',
              duration: 500,
              success: function () {
                setTimeout(function () {
                  wx.switchTab({ 
                    url: "../emb/emb"
                    })
                }, 500)
              }
            })
          }else{
            wx.showToast({
              title: "无登录权限",
              image: '../../static/img/error.png',
              duration: 1000,
            })
          }
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
  },
  scanCode:function(e){
    var obj = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        // console.log(res);
        var result = res.result;
        var qrCode = "";
        var arr = result.split(',');
        var factoryName = arr[0].toString();
        var ip = arr[1].toString();
        obj.setData({
          placeholder: '扫描成功！',
          isShow:true,
          qrCode: ip
        });
        app.globalData.backUrl = ip;
        app.globalData.factoryName = factoryName;
      },
      fail(res){
        wx.showToast({
          title: '失败',
          image: '../../static/img/error.png',
          duration: 1000
        })
      }
    })
  }
})