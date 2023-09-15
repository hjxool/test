Page({
  data: {},
  onLoad(options) {
    this.channel = this.getOpenerEventChannel();
    this.channel.on("pet_data", (data) => {
      console.log("收到", data);
    });
  },
});
