interface Scripture {
  name: string;
  count: number;
  total: number;
}

Page<{}, {
  scriptures: Scripture[];
  currentDate: string;
  isLogin: boolean;
  userInfo: WechatMiniprogram.UserInfo | null;
}>({
  data: {
    scriptures: [
      { name: '心经', count: 0, total: 0 },
      { name: '金刚经', count: 0, total: 0 }
    ],
    currentDate: new Date().toLocaleDateString(),
    isLogin: false,
    userInfo: null
  },

  onLoad() {
    // 检查登录状态
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          this.getUserInfo();
        }
      }
    });
  },

  handleLogin() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({
          isLogin: true,
          userInfo: res.userInfo
        });
        // 可以将用户信息保存到本地存储
        wx.setStorageSync('userInfo', res.userInfo);
      },
      fail: (err) => {
        console.error('登录失败:', err);
        wx.showToast({
          title: '登录失败',
          icon: 'error'
        });
      }
    });
  },

  getUserInfo() {
    // 获取缓存的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        isLogin: true,
        userInfo: userInfo
      });
    }
  },

  // 增加阅读次数
  addCount(this: WechatMiniprogram.Page.TrivialInstance, e: WechatMiniprogram.BaseEvent) {
    const index = +e.currentTarget.dataset.index;
    if (isNaN(index) || index < 0 || index >= this.data.scriptures.length) {
      console.error('Invalid index:', index);
      return;
    }

    let scriptures = this.data.scriptures;
    scriptures[index].count++;
    scriptures[index].total++;
    this.setData({
      scriptures: scriptures
    });
  },

  // 重置当天阅读次数（仅重置当天计数，不影响总计数）
  resetCount(this: WechatMiniprogram.Page.TrivialInstance) {
    const scriptures = this.data.scriptures.map(scripture => ({
      ...scripture,
      count: 0
    }));

    this.setData({
      scriptures,
      currentDate: new Date().toLocaleDateString()
    });
  },

  // 在 methods 中添加
  goToSutra() {
    wx.navigateTo({
      url: '/pages/sutra/sutra'
    });
  }
});