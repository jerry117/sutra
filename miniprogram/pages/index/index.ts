interface Scripture {
  name: string;
  count: number;  // 今日计数
  total: number;  // 总计数
  dailyCounts: { [date: string]: number };  // 每天的计数记录
}

Page<{}, {
  scriptures: Scripture[];
  currentDate: string;
  isLogin: boolean;
  userInfo: WechatMiniprogram.UserInfo | null;
}>({
  data: {
    scriptures: [
      { name: '心经', count: 0, total: 0, dailyCounts: {} },
      { name: '金刚经', count: 0, total: 0, dailyCounts: {} }
    ],
    currentDate: new Date().toLocaleDateString(),
    isLogin: false,
    userInfo: null
  },

  onLoad() {
    const today = new Date().toLocaleDateString();
    const storedDate = wx.getStorageSync('currentDate');
    // 尝试获取已保存的 scriptures 数据
    let scriptures = wx.getStorageSync('scriptures') || [
      { name: '心经', count: 0, total: 0, dailyCounts: {} },
      { name: '金刚经', count: 0, total: 0, dailyCounts: {} }
    ];

    // 确保每个经文都有 dailyCounts 属性
    scriptures = scriptures.map(scripture => ({
      ...scripture,
      dailyCounts: scripture.dailyCounts || {}
    }));
    
    // 如果是新的一天，重置当天计数，但保留总计数和历史记录
    if (!storedDate || storedDate !== today) {
      scriptures = scriptures.map(scripture => ({
        ...scripture,
        count: 0
      }));
      wx.setStorageSync('currentDate', today);
    }

    this.setData({
      currentDate: today,
      scriptures: scriptures
    });
    wx.setStorageSync('scriptures', scriptures);
    
    // 检查登录状态
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          this.getUserInfo();
        }
      }
    });
  },

  addCount(this: WechatMiniprogram.Page.TrivialInstance, e: WechatMiniprogram.BaseEvent) {
    const index = +e.currentTarget.dataset.index;
    if (isNaN(index) || index < 0 || index >= this.data.scriptures.length) {
      console.error('Invalid index:', index);
      return;
    }
    
    const today = new Date().toLocaleDateString();
    const scriptures = [...this.data.scriptures];
    const scripture = scriptures[index];
    
    // 确保 dailyCounts 存在
    if (!scripture.dailyCounts) {
      scripture.dailyCounts = {};
    }

    // 更新当天计数
    scripture.count = (scripture.count || 0) + 1;
    
    // 更新每日记录
    scripture.dailyCounts[today] = (scripture.dailyCounts[today] || 0) + 1;
    
    // 更新总计数（所有天数的总和）
    scripture.total = Object.values(scripture.dailyCounts)
      .reduce((sum, count) => sum + (count || 0), 0);
    
    this.setData({ scriptures });
    // 同步更新存储
    wx.setStorageSync('scriptures', scriptures);
  },

  // 重置当天阅读次数（仅重置当天计数，不影响总计数）
  resetCount(this: WechatMiniprogram.Page.TrivialInstance) {
    const today = new Date().toLocaleDateString();
    const scriptures = this.data.scriptures.map(scripture => ({
      ...scripture,
      count: 0,
      dailyCounts: {
        ...scripture.dailyCounts,
        [today]: 0
      }
    }));
    
    this.setData({
      scriptures,
      currentDate: today
    });
    wx.setStorageSync('currentDate', today);
    wx.setStorageSync('scriptures', scriptures);
  },

  goToSutra() {
    wx.navigateTo({
      url: '/pages/sutra/sutra'
    });
  },

  goToXinjin() {
    wx.navigateTo({
      url: '/pages/xinjin/xinjin'
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
  }
});