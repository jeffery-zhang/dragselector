import styles from './index.css'

export interface DragSelectorOptions {
  callback?: (results: HTMLElement[], elementsWithoutDragger?: HTMLElement[]) => void
  deep?: boolean
} 

// default callback
const defaultCallback = (results: HTMLElement[], elementsWithoutDragger?: HTMLElement[]) => {
  results.forEach(ele => {
    ele.style.boxShadow = '0 0 10px 3px rgba(0, 153, 255, 0.5)'
  })

  if (!elementsWithoutDragger) return
  const diff = elementsWithoutDragger.filter(ele => !results.includes(ele))

  diff.forEach(ele => {
    ele.style.boxShadow = 'none'
  })
}

class Dragger {
  parentDom: HTMLElement = null // father dom
  options: DragSelectorOptions
  draggableDom: HTMLDivElement = null // selection box
  initPos: [number, number] = [0, 0] // initial position of mouse

  constructor(
    parentDom: HTMLElement,
    options?: DragSelectorOptions
  ) {
    this.parentDom = parentDom
    // Mix the incoming 'options' with the default 'options'
    this.options = {
      callback: defaultCallback,
      deep: false,
      ...options,
    }

    this.init()
  }

  // Get current mouse position and restrict it within the bounds of the parent element
  private getCurrentXY(event: MouseEvent): [number, number] {
    let x: number = event.clientX
    let y: number = event.clientY

    // The maximum and minimum values of the selection box position during mouse selection
    const maxX: number = this.parentDom.offsetLeft + this.parentDom.clientWidth
    const maxY: number = this.parentDom.offsetTop + this.parentDom.clientHeight
    const minX: number = this.parentDom.offsetLeft
    const minY: number = this.parentDom.offsetTop

    if (x < minX) {
      x = minX
    } else if (x > maxX) {
      x = maxX
    }

    if (y < minY) {
      y = minY
    } else if (y > maxY) {
      y = maxY
    }

    return [x, y]
  }

  // Find elements in the parent element that are selected by the selection box, and return both the selected and all elements
  private findInsideElements = (): [HTMLElement[], HTMLElement[]] => {
    let allElements: NodeListOf<HTMLElement> | HTMLCollectionOf<HTMLElement>
    if (this.options.deep) { // deep = true, use querySelectorAll to find all children
      allElements = this.parentDom.querySelectorAll('*')
    } else { // deep = false, use children to find children in first level
      allElements = this.parentDom.children as HTMLCollectionOf<HTMLElement>
    }
    // all children without the selection box
    const elementsWithoutDragger = Array.from(allElements).filter(i => i.className !== styles.draggableDom)

    // Determine whether an element is within the selected range
    const isSelected = (rect1: DOMRect, rect2: DOMRect) => rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top

    const results: HTMLElement[] = elementsWithoutDragger.filter(ele => isSelected(this.draggableDom.getBoundingClientRect(), ele.getBoundingClientRect()))

    return [results, elementsWithoutDragger]
  }

  // bind 'mousedown' listener
  private init() {
    this.parentDom.addEventListener('mousedown', this.onMousedown)
  }

  // callback of 'mouseup' event
  private onStop = () => {
    if (this.draggableDom) {
      const [results, elementsWithoutDragger] = this.findInsideElements()
      // 
      this.options.callback(results, elementsWithoutDragger)
      this.parentDom.removeChild(this.draggableDom)
      this.draggableDom = null
    }
    window.removeEventListener('mousemove', this.onDrag)
  }

  private onMousedown = (event: MouseEvent) => {
    // mouse left button
    if (event.button === 0) {
      // create selection box
      this.draggableDom = document.createElement('div')
      this.parentDom.appendChild(this.draggableDom)
      this.draggableDom.className = styles.draggableDom
      // Get the mouse position when 'mousedown' event is triggered
      this.initPos = [event.clientX, event.clientY]
      // Create a small selection box and execute the callback, to implement the effect of selecting the target by clicking the mouse
      this.draggableDom.style.left = `${event.clientX}px`
      this.draggableDom.style.top = `${event.clientY}px`
      this.draggableDom.style.width = '0.5px'
      this.draggableDom.style.height = '0.5px'

      const [results, elementsWithoutDragger] = this.findInsideElements()
      this.options.callback(results, elementsWithoutDragger)

      window.addEventListener('mousemove', this.onDrag)
      window.addEventListener('mouseup', this.onStop)
    }
  }

  // callback of 'mousemove' event
  private onDrag = (event: MouseEvent) => {
    const [x, y] = this.getCurrentXY(event)
    // Update the width and height of the selection box based on the mouse position
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

    const [results, elementsWithoutDragger] = this.findInsideElements()

    this.options.callback(results, elementsWithoutDragger)
  }

  // You can call the 'destroy' function in the instance to remove the 'mousedown' and 'mouseup' events
  destroy() {
    this.parentDom.removeEventListener('mousedown', this.onMousedown)
    window.removeEventListener('mouseup', this.onStop)
  }
}

export default Dragger
