Page({
  data: {
    edit: false, //false表示新增 true表示编辑
    form: {
      name: "", //名字
      age: "", //岁数 校验数字
      gender: 0, //性别 0母 1公
      breed: "", //品种
      character: "", //性格
      ear_mite: 0,//耳螨
      disease: 0, //是否带病
      detail: "", //喂药要求
    },
  },
  onLoad(options) {
    this.channel = this.getOpenerEventChannel();
    // 有收到数据说明是编辑 没有则是新增
    this.channel.on("pet_data", (data) => {
      console.log("收到", data);
      this.setData({
        edit: true,
      });
    });
  },
});
