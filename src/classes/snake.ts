import { 
  IS_MOBILE, 
  ROW_LENGTH_DESKTOP,
  COL_LENGTH_DESKTOP,
  RIGHT,
  LEFT,
  UP,
  DOWN
} from '@/constants'
import { Direction, RowCol } from '@/types'
import ListNode from '@/classes/listnode'

export default class Snake {
  private list: ListNode<RowCol> | null = null
  public body: { [key: string]: true } = {}
  public length: number = 0

  constructor() {
    if(!IS_MOBILE) {
      const verticalCenter = Math.floor(ROW_LENGTH_DESKTOP / 2)
      this.list = new ListNode([verticalCenter, 2])
      this.list.next = new ListNode([verticalCenter, 1])
      this.list.next.next = new ListNode([verticalCenter, 0])

      let node: ListNode<RowCol> | null = this.list
      while(node) {
        this.body[JSON.stringify(node.data)] = true
        this.length++

        node = node.next
      }
    }
  }

  removeTail() {
    let current = this.list
    let previous: ListNode<RowCol> | null = null

    while (current?.next) {
      previous = current
      current = current.next
    }

    if(previous?.next) {
      delete this.body[JSON.stringify(previous.next.data)]
      previous.next = null
      this.length--
    }
  }

  appendHead(rowCol: RowCol) {
    const newBody = new ListNode(rowCol)
    newBody.next = this.list
    this.list = newBody
    this.body[JSON.stringify(rowCol)] = true
    this.length++
  }

  moveOneStep(direction: Direction, food: RowCol) {
    const [currentRow, currentCol] = this.list?.data as RowCol
    const nextRowCol: { [key: string]: RowCol } = {
      [RIGHT]: currentCol === COL_LENGTH_DESKTOP - 1 ? [currentRow, 0] : [currentRow, currentCol + 1],
      [LEFT]: currentCol === 0 ? [currentRow, COL_LENGTH_DESKTOP - 1]: [currentRow, currentCol - 1],
      [UP]: currentRow === 0 ? [ROW_LENGTH_DESKTOP - 1, currentCol] : [currentRow - 1, currentCol],
      [DOWN]: currentRow === ROW_LENGTH_DESKTOP - 1 ? [0, currentCol] : [currentRow + 1, currentCol]
    }

    let isFoodEaten = false
    const nextRowColStr = JSON.stringify(nextRowCol[direction])
    if(nextRowColStr !== JSON.stringify(food)) {
      this.removeTail()
    } else {
      isFoodEaten = true
    }

    if(this.body[nextRowColStr]) {
      // game over
      throw new Error()
    }

    this.appendHead(nextRowCol[direction])

    return { 
      body: { ...this.body }, 
      length: this.length,
      isFoodEaten
    }
  }

}