class Food {
    element;
    constructor() {
        this.element = document?.getElementById('food') || null;
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
    element = document.getElementById('snake');
    head = this.element.querySelector('div'); // snake标签并没有开启定位 所以子元素是相对外层容易定位
    body = this.element.getElementsByTagName('div');
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
}
export { Food, Score, Snake };
