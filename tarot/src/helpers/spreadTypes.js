export const spreadTypes = {
  simple: {
    amountCards: 1,
    className: "simple",
    description: "请选择一张牌，这张牌会对您的问题做一个相对简单的判断",
    cardsFeatures: {
      0: "总体判断"
    }
  },
  period: {
    amountCards: 3,
    className: "period",
    description: "选择三张牌组成牌阵，三张牌分别代表过去现在和将来。",
    cardsFeatures: {
      0: "过去",
      1: "现在",
      2: "将来"
    }
  }
};
