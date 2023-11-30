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
      deworm_time: "", //上一次体内驱虫时间 自己输入字符串
      vaccine_time: "", //上一次疫苗时间
      detail: "", //特殊要求(喂药、生骨肉等)
    },
    today: "", // 选择时间只能在今天之前
  },
  onLoad(options) {
    this.channel = this.getOpenerEventChannel();
    // 有收到数据说明是编辑 没有则是新增
    this.channel.on("pet_data", (res) => {
      console.log("编辑宠物信息", res);
      // 记录正在编辑的元素位置 待修改或删除时修改对应位置元素
      this.index = res.index;
      // 根据表单页的项取值 过滤不需要的字段 如short
      for (let key in this.data.form) {
        this.data.form[key] = res.data[key];
      }
      this.setData({
        edit: true,
        form: this.data.form,
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
  // 保存布尔选项值
  button(e) {
    let key = e.currentTarget.dataset.key;
    let value = e.currentTarget.dataset.value;
    this.setData({
      [`form.${key}`]: Number(value),
    });
  },
  // 新增、修改宠物信息
  submit(e) {
    let type = e.currentTarget.dataset.type;
    let body = {
      data: this.data.form,
      type,
    };
    if (type === "edit" || type === "del") {
      body.index = this.index;
    }
    this.channel.emit("pet_data", body);
    wx.navigateBack();
  },
});
