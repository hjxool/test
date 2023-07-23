import vue from "../js/main.js";
const { createApp } = vue;
import { GameControl } from "./class.js";
createApp({
    data() {
        return {
            gameControl: {
                score: { level: Number },
            },
        };
    },
    mounted() {
        this.gameControl = new GameControl();
        // this.timer = setInterval(this.move, 300);
        let dom = document.querySelector(".stage");
        this.maxWidth = dom.clientWidth - 10;
        this.maxHeight = dom.clientHeight - 10;
        console.log(this.maxHeight);
    },
    methods: {
        move() {
            // 游戏结束后重置
            if (!this.gameControl.isLive) {
                this.gameControl.score.score = 0;
                this.gameControl.score.level = 1;
                clearInterval(this.timer);
                return;
            }
            this.is_body();
            this.move_body(); // 先移动身体再移动蛇头
            switch (this.gameControl.direction) {
                case "ArrowLeft":
                    // 获取当前坐标 按固定步数累加
                    this.gameControl.snake.x -= 10;
                    if (this.gameControl.snake.x <= 0) {
                        this.gameControl.snake.x = 0;
                        this.gameControl.isLive = false;
                        this.fix_body("ArrowLeft");
                    }
                    break;
                case "ArrowRight":
                    this.gameControl.snake.x += 10;
                    if (this.gameControl.snake.x >= this.maxWidth) {
                        this.gameControl.snake.x = this.maxWidth;
                        this.gameControl.isLive = false;
                        this.fix_body("ArrowRight");
                    }
                    break;
                case "ArrowUp":
                    this.gameControl.snake.y -= 10;
                    if (this.gameControl.snake.y <= 0) {
                        this.gameControl.snake.y = 0;
                        this.gameControl.isLive = false;
                        this.fix_body("ArrowUp");
                    }
                    break;
                case "ArrowDown":
                    this.gameControl.snake.y += 10;
                    if (this.gameControl.snake.y >= this.maxHeight) {
                        this.gameControl.snake.y = this.maxHeight;
                        this.gameControl.isLive = false;
                        this.fix_body("ArrowDown");
                    }
                    break;
            }
            this.isEatFood();
        },
        // 每移动一步检测是否碰到食物
        isEatFood() {
            if (this.gameControl.snake.x === this.gameControl.food.x && this.gameControl.snake.y === this.gameControl.food.y) {
                this.gameControl.food.change();
                this.gameControl.score.addScore();
                this.addBody();
            }
        },
        // 撞墙修正头部位置后更改身体位置
        fix_body(direction) {
            let t;
            switch (direction) {
                case "ArrowLeft":
                    t = 10 - this.gameControl.snake.body[1].offsetLeft;
                    for (let i = 1; i < this.gameControl.snake.body.length; i++) {
                        this.gameControl.snake.body[i].style.left = this.gameControl.snake.body[i].offsetLeft + t + "px";
                    }
                    break;
                case "ArrowRight":
                    t = this.gameControl.snake.body[1].offsetLeft - (this.gameControl.snake.x - 10);
                    for (let i = 1; i < this.gameControl.snake.body.length; i++) {
                        this.gameControl.snake.body[i].style.left = this.gameControl.snake.body[i].offsetLeft - t + "px";
                    }
                    break;
                case "ArrowUp":
                    t = 10 - this.gameControl.snake.body[1].offsetTop;
                    for (let i = 1; i < this.gameControl.snake.body.length; i++) {
                        this.gameControl.snake.body[i].style.top = this.gameControl.snake.body[i].offsetTop + t + "px";
                    }
                    break;
                case "ArrowDown":
                    t = this.gameControl.snake.body[1].offsetTop - (this.gameControl.snake.y - 10);
                    for (let i = 1; i < this.gameControl.snake.body.length; i++) {
                        this.gameControl.snake.body[i].style.top = this.gameControl.snake.body[i].offsetTop - t + "px";
                    }
                    break;
            }
        },
        // 是否碰到身体
        is_body() {
            // 长度大于4才有可能碰到自己身体
            if (this.gameControl.snake.body.length > 4) {
                let obj;
                switch (this.gameControl.direction) {
                    case "ArrowLeft":
                        obj = { x: this.gameControl.snake.x - 10, y: this.gameControl.snake.y };
                        break;
                    case "ArrowRight":
                        obj = { x: this.gameControl.snake.x + 10, y: this.gameControl.snake.y };
                        break;
                    case "ArrowUp":
                        obj = { x: this.gameControl.snake.x, y: this.gameControl.snake.y - 10 };
                        break;
                    case "ArrowDown":
                        obj = { x: this.gameControl.snake.x, y: this.gameControl.snake.y + 10 };
                        break;
                }
                for (let i = 4; i < this.gameControl.snake.body.length; i++) {
                    let t = this.gameControl.snake.body[i];
                    if (t.offsetLeft == obj.x && t.offsetTop == obj.y) {
                        this.gameControl.isLive = false;
                        clearInterval(this.timer);
                        break;
                    }
                }
            }
        },
        // 增加身体
        addBody() {
            // 判断方向 在相反方向增加身体
            let b = this.gameControl.snake.body;
            let direction;
            if (b.length === 1) {
                // 特殊情况 当蛇头只有一个时
                switch (this.gameControl.direction) {
                    case "ArrowLeft":
                        direction = "right";
                        break;
                    case "ArrowRight":
                        direction = "left";
                        break;
                    case "ArrowUp":
                        direction = "down";
                        break;
                    case "ArrowDown":
                        direction = "up";
                        break;
                }
            }
            else {
                // 根据身体末尾两节的方向判断
                let pre = b[b.length - 2];
                let last = b[b.length - 1];
                if (last.offsetLeft === pre.offsetLeft) {
                    // 上或下
                    let offset = pre.offsetTop - last.offsetTop;
                    if (offset > 0) {
                        // 前一个大于后一个则是上
                        // 边界判断 往上添加是否可行
                        if (last.offsetTop < 10) {
                            // 不可行则判断左右是否可行
                            if (last.offsetLeft < 10) {
                                // 说明蛇贴左侧墙
                                direction = "right";
                            }
                            else {
                                direction = "left";
                            }
                        }
                        else {
                            direction = "up";
                        }
                    }
                    else {
                        // 尾部朝下
                        if (this.maxHeight - last.offsetTop < 10) {
                            if (last.offsetLeft < 10) {
                                // 说明蛇贴左侧墙
                                direction = "right";
                            }
                            else {
                                direction = "left";
                            }
                        }
                        else {
                            direction = "down";
                        }
                    }
                }
                else {
                    // 左或右
                    let offset = pre.offsetLeft - last.offsetLeft;
                    if (offset > 0) {
                        // 前一个大于后一个则是左
                        // 边界判断 往左添加是否可行
                        if (last.offsetLeft < 10) {
                            // 不可行则判断左右是否可行
                            if (last.offsetTop < 10) {
                                // 说明蛇贴左侧墙
                                direction = "down";
                            }
                            else {
                                direction = "up";
                            }
                        }
                        else {
                            direction = "left";
                        }
                    }
                    else {
                        // 尾部朝右
                        if (this.maxWidth - last.offsetLeft < 10) {
                            if (last.offsetTop < 10) {
                                // 说明蛇贴上侧墙
                                direction = "down";
                            }
                            else {
                                direction = "up";
                            }
                        }
                        else {
                            direction = "right";
                        }
                    }
                }
            }
            // 增加身体
            this.gameControl.snake.addBody();
            // 定位
            switch (direction) {
                case "left":
                    b[b.length - 1].style.left = b[b.length - 2].offsetLeft - 10 + "px";
                    b[b.length - 1].style.top = b[b.length - 2].offsetTop + "px";
                    break;
                case "right":
                    b[b.length - 1].style.left = b[b.length - 2].offsetLeft + 10 + "px";
                    b[b.length - 1].style.top = b[b.length - 2].offsetTop + "px";
                    break;
                case "up":
                    b[b.length - 1].style.left = b[b.length - 2].offsetLeft + "px";
                    b[b.length - 1].style.top = b[b.length - 2].offsetTop - 10 + "px";
                    break;
                case "down":
                    b[b.length - 1].style.left = b[b.length - 2].offsetLeft + "px";
                    b[b.length - 1].style.top = b[b.length - 2].offsetTop + 10 + "px";
                    break;
            }
        },
        // 身体移动 从后往前遍历依次把前一个元素的定位赋值给当前
        move_body() {
            let list = this.gameControl.snake.body;
            for (let i = list.length - 1; i > 0; i--) {
                list[i].style.left = list[i - 1].offsetLeft + "px";
                list[i].style.top = list[i - 1].offsetTop + "px";
            }
        },
    },
    watch: {
        "gameControl.score.level": {
            handler() {
                console.log(`level:${this.gameControl.score.level}`);
                clearInterval(this.timer);
                // 随等级速度越来越快
                this.timer = setInterval(this.move, 300 - (this.gameControl.score.level - 1) * 30);
            },
        },
    },
}).mount("#main");
