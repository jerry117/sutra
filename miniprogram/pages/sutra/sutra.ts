Page({
  data: {
    // 增加多段经文内容，确保页面可以多次滚动
    content: [
      "如是我闻。一时佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。",
      "尔时，世尊食时著衣持钵，入舍卫大城乞食。",
      "于其城中，依次乞食。有人问：‘何因乞食？’佛微笑不语，示现无上法喜。",
      "佛告比丘：‘诸法因缘生，万象皆空，无常亦无我。’",
      "诸比丘闻佛所说，心生欢喜，纷纷发愿以此法修行。",
      "时日渐晚，夕阳西下，众比丘默然入定，各自沉思佛法精义。",
      "愿诸菩萨持经修行，开法眼，普度众生，共证菩提。"
    ],
    currentIndex: 0,
    isFinished: false
  },

  onReachBottom() {
    const { currentIndex, content, isFinished } = this.data;
    if (currentIndex < content.length - 1) {
      this.setData({
        currentIndex: currentIndex + 1
      });
    } else if (!isFinished) {
      this.setData({ isFinished: true });
      // 阅读结束，返回上一页并调用加一操作（index=1对应金刚经）
      const pages = getCurrentPages();
      if (pages.length >= 2) {
        const prevPage = pages[pages.length - 2];
        if (prevPage && typeof prevPage.addCount === 'function') {
          // 使用 setTimeout 确保页面切换流畅
          setTimeout(() => {
            prevPage.addCount({ currentTarget: { dataset: { index: 1 } } });
            wx.navigateBack();
          }, 100);
        } else {
          wx.navigateBack();
        }
      } else {
        wx.navigateBack();
      }
    }
  }
});