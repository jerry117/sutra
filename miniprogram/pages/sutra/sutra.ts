Page({
  data: {
    // 按照实际图片命名格式修改路径
    imageUrls: Array.from({ length: 34 }, (_, i) => 
      `../../images/sutra/wxpg/${i + 1}.jpg`
    ),
    isFinished: false,
    todayCount: 0
  },

  onLoad() {
    const pages = getCurrentPages();
    if (pages.length >= 2) {
      const prevPage = pages[pages.length - 2];
      if (prevPage && prevPage.data && prevPage.data.scriptures) {
        const sutra = prevPage.data.scriptures.find(s => s.name === '金刚经');
        if (sutra) {
          this.setData({ todayCount: sutra.count });
        }
      }
    }
  },

  onUnload() {
    if (this.data.isFinished) {
      // 阅读结束，返回上一页并调用加一操作（index=1对应金刚经）
      const pages = getCurrentPages();
      if (pages.length >= 2) {
        const prevPage = pages[pages.length - 2];
        if (prevPage && typeof prevPage.addCount === 'function') {
          prevPage.addCount({ currentTarget: { dataset: { index: 1 } } });
        }
      }
    }
  },

  markAsFinished() {
    const pages = getCurrentPages();
    if (pages.length >= 2) {
      const prevPage = pages[pages.length - 2];
      if (prevPage && typeof prevPage.addCount === 'function') {
        // 先调用 addCount 更新数据
        prevPage.addCount({ currentTarget: { dataset: { index: 1 } } });
        
        // 更新当前页面的今日计数显示
        this.setData({
          isFinished: true,
          todayCount: this.data.todayCount + 1
        });

        // 延迟 800 毫秒后返回，让用户能看到数字变化
        setTimeout(() => {
          wx.navigateBack();
        }, 800);
      }
    }
  },

  imageError(e) {
    const index = e.currentTarget.dataset.index;
    console.error(`第${index + 1}页图片加载失败`, e);
    wx.showToast({
      title: `第${index + 1}页加载失败`,
      icon: 'none'
    });
  }
});