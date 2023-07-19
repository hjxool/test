import vue from "../js/main.js";
const { createApp } = vue;
import { Food, Score } from "./class.js";

createApp({
  data() {
    return {
      food: {},
      panel: {}
    }
  },
  mounted() {
    this.food = new Food()
    this.food.change()
    this.panel = new Score(10, 10)
  },
  methods: {
    fn() {
      this.panel.addScore()
    }
  },
}).mount("#main");
