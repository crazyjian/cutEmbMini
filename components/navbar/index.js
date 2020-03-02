var app = getApp()
Component({
  data: {
    statusBarHeight: '',
    titleBarHeight: '',
    isShowHome: true
  },
  properties: {
    //属性值可以在组件使用时指定
    title: {
      type: String,
      value: '计件'
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() {
      let pageContext = getCurrentPages()
      if (pageContext.length > 1) {
        this.setData({
          isShowHome: false
        })
      } else {
        this.setData({
          isShowHome: true
        })
      }
    }
  },
  attached() {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      titleBarHeight: app.globalData.titleBarHeight
    })
  },
  methods: {}
})