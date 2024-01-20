import {
  ROW_LENGTH,
  COL_LENGTH,
  RIGHT,
  LEFT,
  UP,
  DOWN,
  IS_MOBILE,
} from '@/constants'
import { For, createEffect, onCleanup, onMount } from 'solid-js'
import { createSignal } from 'solid-js'
import Snake from '@/classes/snake'
import { Direction, RowCol, SnakeBody } from '@/types'
import Logo from '@/assets/logo.png'
import PlayIcon from '@/assets/play_icon.svg'
import ArrowLeft from '@/assets/arrow_left.svg'
import ArrowRight from '@/assets/arrow_right.svg'
import ArrowUp from '@/assets/arrow_up.svg'
import ArrowDown from '@/assets/arrow_down.svg'

const oppositeDirection = {
  [RIGHT]: LEFT,
  [LEFT]: RIGHT,
  [UP]: DOWN,
  [DOWN]: UP
}

const grid: number[][] = new Array(ROW_LENGTH).fill(new Array(COL_LENGTH).fill(0))

const generateFood = (body: SnakeBody) => {
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

function App() {
  const [snake, setSnake] = createSignal(new Snake())
  const [snakeBody, setSnakeBody] = createSignal(snake().body)
  const [snakeLength, setSnakeLength] = createSignal(snake().length)
  const [food, setFood] = createSignal<RowCol>(generateFood(snakeBody()))
  const [direction, setDirection] = createSignal<Direction>(snake().currentDirection)
  const [intervalId, setIntervalId] = createSignal<NodeJS.Timeout | null>(null)
  const [isGameOver, setIsGameOver] = createSignal(false)

  

  const resetGameState = () => {
    const snake = new Snake()
    setSnake(snake)
    setSnakeBody(snake.body)
    setSnakeLength(snake.length)
    setDirection(snake.currentDirection)
    setFood(generateFood(snake.body))
    setIsGameOver(false)
    setIntervalId(null)
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

  const changeDirection = (direction: Direction) => {
    switch(direction) {
      case UP:
        if(intervalId() !== null && snake().currentDirection !== oppositeDirection[UP])
          setDirection(UP)
        break
      case DOWN:
        if(intervalId() !== null && snake().currentDirection !== oppositeDirection[DOWN])
          setDirection(DOWN)
        break
      case LEFT:
        if(intervalId() !== null && snake().currentDirection !== oppositeDirection[LEFT])
          setDirection(LEFT)
        break
      default:
        if(intervalId() !== null && snake().currentDirection !== oppositeDirection[RIGHT])
          setDirection(RIGHT)
        break
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    switch(event.key) {
      case 'ArrowUp':
        changeDirection(UP)
        break
      case 'ArrowDown':
        changeDirection(DOWN)
        break
      case 'ArrowLeft':
        changeDirection(LEFT)
        break
      case 'ArrowRight':
        changeDirection(RIGHT)
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
    <div class='flex flex-col items-center w-full'>
      <img
        src={Logo}
        alt='logo'
        class='w-[400px] p-6'
      />
      {!IS_MOBILE &&
      <p class='text-sm mb-6'>
        Press arrow keys (↑, →, ↓, ←) to change direction. Press Enter or Space to start and pause.
      </p>
      }

      <div class='py-2 text-sm'>
        Length: {snakeLength()}
      </div>
      <div class='relative flex flex-col w-full lg:w-[unset]'>
        {isGameOver() &&
        <div
          onClick={startTimer}
          class='absolute left-0 right-0 bottom-0 top-0 z-9 bg-black bg-opacity-75 flex flex-col items-center justify-center cursor-pointer'
        >
          <div class='absolute top-[30px] flex flex-col items-center'>
            <div class='text-white text-3xl mb-1'>Game Over</div>
            <div class='text-white mb-1'>Final length: {snakeLength()}</div>
            {IS_MOBILE ?
              <div class='text-white'>Click to play again!</div>
              :
              <div class='text-white'>Click or press Enter or Space to play again!</div>
            }
          </div>
          
          <img
            src={PlayIcon}
            alt='play again'
            class='w-[70px]'
          />
        </div>
        }

        {IS_MOBILE && !isGameOver() && intervalId() === null &&
        <div
          onClick={startTimer}
          class='absolute left-0 right-0 bottom-0 top-0 z-9 bg-black bg-opacity-75 flex flex-col items-center justify-center cursor-pointer'
        >
          <div class='absolute top-[30px] flex flex-col items-center'>
            <div class='text-white text-3xl mb-1'>Click to play!</div>
          </div>
          
          <img
            src={PlayIcon}
            alt='play again'
            class='w-[70px]'
          />
        </div>
        }
        <div
          style={{
            'grid-template-columns': `repeat(${COL_LENGTH}, ${IS_MOBILE ? '1fr' : '15px'})`,
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
                          snakeBody()[JSON.stringify([i(), j()])] ? 'bg-black' : (JSON.stringify([i(), j()]) === JSON.stringify(food()) ? 'bg-purple-500' : 'bg-blue-50')
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
      
      {IS_MOBILE &&
      <div class='flex flex-col gap-[3px] p-8'>
        <button 
          class='flex justify-center'
          onClick={() => changeDirection(UP)}
        >
          <img
            src={ArrowUp}
            alt='arrow up'
            class='w-[50px]'
          />
        </button>
        <div class='flex gap-[50px]'>
          <button
            onClick={() => changeDirection(LEFT)}
          >
            <img
              src={ArrowLeft}
              alt='arrow left'
              class='w-[50px]'
            />
          </button>

          <button
            onClick={() => changeDirection(RIGHT)}
          >
            <img
              src={ArrowRight}
              alt='arrow right'
              class='w-[50px]'
            />
          </button>
        </div>
        <button 
          class='flex justify-center'
          onClick={() => changeDirection(DOWN)}
        >
          <img
            src={ArrowDown}
            alt='arrow down'
            class='w-[50px]'
          />
        </button>
      </div>
      }
    </div>
  )
}

export default App
