class Food {
    element;
    snake;
    constructor() {
        this.element = document?.getElementById('food');
        this.snake = new Snake();
    }
    get x() {
        return this.element?.offsetLeft;
    }
    get y() {
        return this.element?.offsetTop;
    }
    change() {
        // 随机生成的位置0~max-10
        // 位置必须是10px的倍数
        let dom = document.querySelector('.stage');
        let maxWidth = dom.clientWidth - 10;
        let maxHeight = dom.clientHeight - 10;
        let left = Math.round(Math.random() * Math.floor(maxWidth / 10)) * 10;
        let top = Math.round(Math.random() * Math.floor(maxHeight / 10)) * 10;
        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';
        // 不能和蛇身体重叠 位置重叠就重新生成
        for (let i = 0; i < this.snake.body.length; i++) {
            let t = this.snake.body[i];
            if (t.offsetLeft === left && t.offsetTop === top) {
                this.change();
                break;
            }
        }
    }
}
class Score {
    // 设置默认值及类型
    score = 0;
    level = 1;
    maxLevel;
    upScore;
    constructor(max, up) {
        this.maxLevel = max;
        this.upScore = up;
    }
    addScore() {
        this.score++;
        // 每10分升一级
        if (this.score % this.upScore === 0) {
            this.levelUp();
        }
    }
    levelUp() {
        if (this.level < this.maxLevel) {
            this.level++;
        }
    }
}
class Snake {
    element;
    head;
    body;
    constructor() {
        this.element = document.getElementById('snake');
        this.head = this.element.querySelector('div'); // snake标签并没有开启定位 所以子元素是相对外层容易定位
        this.body = this.element.getElementsByTagName('div');
    }
    get x() {
        return this.head.offsetLeft;
    }
    get y() {
        return this.head.offsetTop;
    }
    set x(val) {
        this.head.style.left = val + 'px';
    }
    set y(val) {
        this.head.style.top = val + 'px';
    }
    // 当吃到食物 增加身体
    addBody() {
        let body = document.createElement('div');
        this.element.appendChild(body);
        // console.log(this.body) // 看下是否增加完就立即能看到节点变化 答:可以
    }
}
class GameControl {
    direction = '';
    snake;
    food;
    score;
    isLive = true;
    constructor() {
        this.snake = new Snake();
        this.food = new Food();
        this.score = new Score(10, 1);
        this.init();
    }
    init() {
        document.addEventListener('keydown', this.move.bind(this));
        this.food.change(); //临时
    }
    move(event) {
        // ArrowRight ArrowDown ArrowLeft ArrowUp
        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowUp':
                this.direction = event.key;
                break;
        }
    }
}
export { Food, Score, Snake, GameControl };
