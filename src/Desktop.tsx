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
import { Direction } from '@/types'

const oppositeDirection = {
  [RIGHT]: LEFT,
  [LEFT]: RIGHT,
  [UP]: DOWN,
  [DOWN]: UP
}

const grid = new Array(ROW_LENGTH_DESKTOP).fill(new Array(COL_LENGTH_DESKTOP).fill(0))

function Desktop() {
  const [snake, setSnake] = createSignal(new Snake())
  const [snakeBody, setSnakeBody] = createSignal(snake().body)
  const [snakeLength, setSnakeLength] = createSignal(snake().length)
  const [direction, setDirection] = createSignal(IS_MOBILE ? DOWN : RIGHT)
  const [intervalId, setIntervalId] = createSignal<NodeJS.Timeout | null>(null)

  const startTimer = () => {
    const id = setInterval(() => {
      const { length, body } = snake().moveOneStep(direction() as Direction)
      setSnakeBody(body)
      setSnakeLength(length)
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
                          snakeBody()[JSON.stringify([i(), j()])] ? 'bg-black' : 'bg-pink-300'
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
