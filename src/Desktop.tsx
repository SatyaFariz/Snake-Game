import {
  ROW_LENGTH_DESKTOP,
  COL_LENGTH_DESKTOP,
  RIGHT,
  LEFT,
  UP,
  DOWN,
  IS_MOBILE,
} from '@/constants'
import { For, createEffect, onCleanup, onMount } from 'solid-js'
import { createSignal } from 'solid-js'
import Snake from '@/classes/snake'
import { Direction, RowCol } from '@/types'

const INITIAL_SNAKE_DIRECTION = IS_MOBILE ? DOWN : RIGHT

const oppositeDirection = {
  [RIGHT]: LEFT,
  [LEFT]: RIGHT,
  [UP]: DOWN,
  [DOWN]: UP
}

const grid: number[][] = new Array(ROW_LENGTH_DESKTOP).fill(new Array(COL_LENGTH_DESKTOP).fill(0))

const generateFood = (body: { [key: string]: true }) => {
  const rowCols: RowCol[] = []
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      const rowCol: RowCol = [i, j]
      if(!body[JSON.stringify([i, j])]) {
        rowCols.push(rowCol)
      }
    }
  }
  const randomIndex = Math.floor(Math.random() * rowCols.length)
  return rowCols[randomIndex]
}

function Desktop() {
  const [snake, setSnake] = createSignal(new Snake())
  const [snakeBody, setSnakeBody] = createSignal(snake().body)
  const [snakeLength, setSnakeLength] = createSignal(snake().length)
  const [food, setFood] = createSignal<RowCol>(generateFood(snakeBody()))
  const [direction, setDirection] = createSignal<Direction>(INITIAL_SNAKE_DIRECTION)
  const [intervalId, setIntervalId] = createSignal<NodeJS.Timeout | null>(null)
  const [isGameOver, setIsGameOver] = createSignal(false)

  

  const resetGameState = () => {
    const snake = new Snake()
    setSnake(snake)
    setSnakeBody(snake.body)
    setSnakeLength(snake.length)
    setDirection(INITIAL_SNAKE_DIRECTION)
    setFood(generateFood(snake.body))
    setIsGameOver(false)
  }

  const startTimer = () => {
    if(isGameOver()) resetGameState()

    const id = setInterval(() => {
      try {
        const { length, body, isFoodEaten } = snake().moveOneStep(direction(), food())
        setSnakeBody(body)
        setSnakeLength(length)
        if(isFoodEaten) {
          setFood(generateFood(body))
        }
      } catch(e) {
        setIsGameOver(true)
        stopTimer()
      }
    }, 130)
    setIntervalId(id)
  }

  const stopTimer = () => {
    clearInterval(intervalId() as NodeJS.Timeout)
    setIntervalId(null)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        if(direction() !== oppositeDirection[UP])
          setDirection(UP)
        break
      case 'ArrowDown':
        if(direction() !== oppositeDirection[DOWN])
          setDirection(DOWN)
        break
      case 'ArrowLeft':
        if(direction() !== oppositeDirection[LEFT])
          setDirection(LEFT)
        break
      case 'ArrowRight':
        if(direction() !== oppositeDirection[RIGHT])
          setDirection(RIGHT)
        break
      case 'Enter':
        if(intervalId() !== null) stopTimer()
        else startTimer()
        break
      case ' ':
          if(intervalId() !== null) stopTimer()
          else startTimer()
          break
      default:
        break
    }
  }

  onCleanup(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  createEffect(() => {
    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (intervalId()) {
        clearInterval(intervalId() as NodeJS.Timeout)
      }
    }
  })

  return (
    <div>
      
      <div class='flex justify-center w-full'>
        <div
          style={{
            'grid-template-columns': `repeat(${COL_LENGTH_DESKTOP}, 15px)`,
          }}
          class='grid'
        >
          <For each={grid}>
            {(rows, i) => {
              return (
                <For each={rows}>
                  {(_, j) => {
                    return (
                      <div 
                        class={[
                          'aspect-square', 
                          snakeBody()[JSON.stringify([i(), j()])] ? 'bg-black' : (JSON.stringify([i(), j()]) === JSON.stringify(food()) ? 'bg-red-500' : 'bg-pink-300')
                        ].join(' ')}
                      >

                      </div>
                    )
                  }}
                </For>
              )
            }}
          </For>
        </div>
      </div>

      <div class='flex gap-4'>

        <button onClick={startTimer} disabled={intervalId() !== null}>
        Start
        </button>
        <button onClick={stopTimer} disabled={intervalId() === null}>
          Stop
        </button>
      </div>
      
    </div>
  )
}

export default Desktop
