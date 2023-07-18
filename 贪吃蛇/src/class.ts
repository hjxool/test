class Food {
  element: HTMLElement
  constructor() {
    this.element = document?.getElementById('food') || null
  }
  get x() {
    return this.element.offsetLeft
  }
  get y() {
    return this.element.offsetTop
  }
  change() {
    // 随机生成的位置0~max-10
    // 位置必须是10px的倍数
    let dom = document.querySelector('.stage')
    let maxWidth = dom.clientWidth - 10
    let maxHeight = dom.clientHeight - 10
    let left = Math.round(Math.random() * Math.floor(maxWidth / 10)) * 10
    let top = Math.round(Math.random() * Math.floor(maxHeight / 10)) * 10
    this.element.style.left = left + 'px'
    this.element.style.top = top + 'px'
  }
}
class Score {
  // 设置默认值及类型
  private _score = 0
  private _level = 1
  get level(): number {
    console.log('duqu')
    return this._level
  }
  set level(val) {
    console.log('shezhi')
    this._level = val
  }
  get score() {
    return this._score
  }
  set score(val) {
    this._score = val
  }
}
export { Food, Score }