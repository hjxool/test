Page({
  data: {
    form: {
      name: "", //联系人
      phone: "", //手机号
      weChat: "", //微信号
      pet: [], //住店宠物
      start: "", //日期
      end: "", //日期
      room: "", //房间
      know_form: "", //从何知道好好养猫家
    },
  },
  onLoad(options) {
    this.app = getApp();
    this.setData({
      "form.pet": [{ name: "嘟嘟", short: "嘟" }],
    });
  },
});
