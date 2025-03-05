Page({
  data: {
    // 将内容处理成一篇完整的文章
    content: `
      观自在菩萨，行深般若波罗蜜多时，照见五蕴皆空，度一切苦厄。
      舍利子，色不异空，空不异色；色即是空，空即是色。受、想、行、识，亦复如是。
      舍利子，是诸法空相，不生不灭，不垢不净，不增不减。
      是故空中无色，无受、想、行、识；无眼、耳、鼻、舌、身、意；无色、声、香、味、触、法；
      无眼界，乃至无意识界；无无明，亦无无明尽；乃至无老死，亦无老死尽。
      无苦、集、灭、道；无智亦无得，以无所得故。
      菩提萨埵，依般若波罗蜜多故，心无挂碍；无挂碍故，无有恐怖，远离颠倒梦想，究竟涅槃。
      三世诸佛，依般若波罗蜜多故，得阿耨多罗三藐三菩提。
      故知般若波罗蜜多，是大神咒，是大明咒，是无上咒，是无等等咒，能除一切苦，真实不虚。
      故说般若波罗蜜多咒，即说咒曰：揭谛揭谛，波罗揭谛，波罗僧揭谛，菩提萨婆诃。
    `,
    isFinished: false,
    todayCount: 0
  },

  onLoad() {
    const pages = getCurrentPages();
    if (pages.length >= 2) {
      const prevPage = pages[pages.length - 2];
      if (prevPage && prevPage.data && prevPage.data.scriptures) {
        const xinjin = prevPage.data.scriptures.find(s => s.name === '心经');
        if (xinjin) {
          this.setData({ todayCount: xinjin.count });
        }
      }
    }
  },

  // 完成按钮触发的方法：先调用前一页的 addCount（统计当前心经阅读次数， index 对应 0 ），再返回
  markAsFinished() {
    const pages = getCurrentPages();
    if (pages.length >= 2) {
      const prevPage = pages[pages.length - 2];
      if (prevPage && typeof prevPage.addCount === 'function') {
        // 先调用 addCount 更新数据
        prevPage.addCount({ currentTarget: { dataset: { index: 0 } } });
        
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
  }
});