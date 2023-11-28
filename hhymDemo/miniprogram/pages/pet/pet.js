Page({
  data: {
    edit: false, //false表示新增 true表示编辑
    form: {
      name: "", //名字
      age: "", //岁数 校验数字
      gender: 0, //性别 0母 1公
      breed: "", //品种
      character: "", //性格
      sterile: false, //是否绝育
      ear_mite: 0, //是否有耳螨
      disease: 0, //是否携带鼻支等传染病
      detail: "", //特殊要求(喂药、生骨肉等)
      inner_deworm_time: "", //上一次体内驱虫时间 时间戳
      out_deworm_time: "", //上一次体外驱虫时间 时间戳
      vaccine_time: "", //上一次疫苗事件 时间戳
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
  // 失去焦点保存值
  save_value(e) {
    let key = e.currentTarget.dataset.key;
    this.setData({
      [`form.${key}`]: e.detail.value,
    });
  },
});
