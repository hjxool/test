import vue from "../js/main.js";
const { createApp } = vue;
import { Food, Score, Snake, GameControl } from "./class.js";

createApp({
  data() {
    return {
      gameControl: {
        score: {}
      },
    }
  },
  mounted() {
    this.gameControl = new GameControl()
    // 随等级速度越来越快
    this.timer = setInterval(this.move, 300 - (this.gameControl.score.level - 1) * 30)
    let dom = document.querySelector('.stage')
    this.maxWidth = dom.clientWidth - 10
    this.maxHeight = dom.clientHeight - 10
  },
  methods: {
    move(): void {
      switch (this.gameControl.direction) {
        case 'ArrowLeft':
          // 获取当前坐标 按固定步数累加
          this.gameControl.snake.x -= 10
          if (this.gameControl.snake.x <= 0) {
            this.gameControl.snake.x = 0
            this.gameControl.isLive = false
            clearInterval(this.timer)
          }
          break;
        case 'ArrowRight':
          this.gameControl.snake.x += 10
          if (this.gameControl.snake.x >= this.maxWidth) {
            this.gameControl.snake.x = this.maxWidth
            this.gameControl.isLive = false
            clearInterval(this.timer)
          }
          break;
        case 'ArrowUp':
          this.gameControl.snake.y -= 10
          if (this.gameControl.snake.y <= 0) {
            this.gameControl.snake.y = 0
            this.gameControl.isLive = false
            clearInterval(this.timer)
          }
          break;
        case 'ArrowDown':
          this.gameControl.snake.y += 10
          if (this.gameControl.snake.y >= this.maxHeight) {
            this.gameControl.snake.y = this.maxHeight
            this.gameControl.isLive = false
            clearInterval(this.timer)
          }
          break;
      }
      // 游戏结束后重置
      if (!this.gameControl.isLive) {
        this.gameControl.score.score = 0
        this.gameControl.score.level = 1
      }
      this.isEatFood()
    },
    // 每移动一步检测是否碰到食物
    isEatFood() {
      if (this.gameControl.snake.x === this.gameControl.food.x && this.gameControl.snake.y === this.gameControl.food.y) {
        this.gameControl.food.change()
        this.gameControl.score.addScore()
        this.addBody()
      }
    },
    // 增加身体
    addBody() {
      // 判断方向 在相反方向增加身体
      let b = this.gameControl.snake.body
      let direction: string
      // 特殊情况 当蛇头只有一个时
      if (b.length === 1) {
        switch (this.gameControl.direction) {
          case 'ArrowLeft':
            direction = 'right'
            break;
          case 'ArrowRight':
            direction = 'left'
            break;
          case 'ArrowUp':
            direction = 'down'
            break;
          case 'ArrowDown':
            direction = 'up'
            break;
        }
      } else {

      }
      // 根据身体末尾两节的方向判断
      // if (b[b.length]) {

      // } else {

      // }
      // 增加身体 并定位
      this.gameControl.snake.addBody()

    }
  },
}).mount("#main");
