import { 
  RIGHT,
  LEFT,
  UP,
  DOWN
} from '@/constants'

export type RowCol = [number, number]
export type Direction = typeof RIGHT | typeof LEFT | typeof UP | typeof DOWN
export type SnakeBody = { [key: string]: true }