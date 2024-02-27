Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    place_name: "好好养猫纯猫寄养酒店",
    address: "武侯区南华路",
  },
  methods: {
    // 跳转地图页面
    turn_to_map() {
      wx.openLocation({
        latitude: 30.54716, // 纬度
        longitude: 104.03735, // 经度
        name: "成都市", // 地点名称
        address: "好好养猫纯猫寄养酒店", // 地址的详细说明
        scale: 20, // 缩放比例
      })
        .then((res) => {
          console.log("打开地图成功");
        })
        .catch((err) => {
          console.log("打开地图失败", err);
        });
    },
    // 拨打电话
    phone_call() {
      wx.makePhoneCall({
        phoneNumber: "18190694903",
      });
    },
  },
});
