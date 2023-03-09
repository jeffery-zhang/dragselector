import styles from './index.scss'

class Dragger {
  parentDom: HTMLElement = null
  draggableDom: HTMLDivElement = null
  callback: Function
  initPos: [number, number] = [0, 0]

  constructor(parentDom: HTMLElement, callback: Function) {
    this.parentDom = parentDom
    this.callback = callback

    this.init()
  }

  private getCurrentOffset(event: MouseEvent) {
    let offsetX: number = event.clientX
    let offsetY: number = event.clientY
    const maxX: number = this.parentDom.offsetLeft + this.parentDom.clientWidth
    const maxY: number = this.parentDom.offsetTop + this.parentDom.clientHeight
    const minX: number = this.parentDom.offsetLeft
    const minY: number = this.parentDom.offsetTop

    if (offsetX < minX) {
      offsetX = minX
    } else if (offsetX > maxX) {
      offsetX = maxX
    }

    if (offsetY < minY) {
      offsetY = minY
    } else if (offsetY > maxY) {
      offsetY = maxY
    }

    return [offsetX, offsetY]
  }

  private findInsideElements = () => {
    const allElements = this.parentDom.querySelectorAll('*')
    console.log(Array.from(allElements).filter(i => i.className !== styles.draggableDom));
    const elements = Array.from(allElements).filter(i => i.className !== styles.draggableDom)

    const isSelected = (rect1, rect2) => rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  }

  init() {
    this.parentDom.addEventListener('mousedown', this.onMousedown)
  }

  onStop = () => {
    if (this.draggableDom) {
      this.parentDom.removeChild(this.draggableDom)
    }
    window.removeEventListener('mousemove', this.onDrag)
  }

  onMousedown = (event: MouseEvent) => {
    if (event.button === 0) {
      this.draggableDom = document.createElement('div')
      this.parentDom.appendChild(this.draggableDom)
      this.draggableDom.className = styles.draggableDom

      this.initPos = [event.clientX, event.clientY]

      window.addEventListener('mousemove', this.onDrag)
      window.addEventListener('mouseup', this.onStop)
    }
  }

  onDrag = (event: MouseEvent) => {
    const [x, y] = this.getCurrentOffset(event)
    if (x < this.initPos[0]) {
      this.draggableDom.style.left = `${x}px`
      this.draggableDom.style.width = `${this.initPos[0] - x}px`
    } else {
      this.draggableDom.style.left = `${this.initPos[0]}px`
      this.draggableDom.style.width = `${x - this.initPos[0]}px`
    }

    if (y < this.initPos[1]) {
      this.draggableDom.style.top = `${y}px`
      this.draggableDom.style.height = `${this.initPos[1] - y}px`
    } else {
      this.draggableDom.style.top = `${this.initPos[1]}px`
      this.draggableDom.style.height = `${y - this.initPos[1]}px`
    }

    this.findInsideElements()
  }

  destroy() {
    this.parentDom.removeEventListener('mousedown', this.onMousedown)
    window.removeEventListener('mouseup', this.onStop)
  }

}

export default Dragger

const root = document.getElementById('root')
console.log(root.offsetLeft);

const dragger = new Dragger(root, () => {})
