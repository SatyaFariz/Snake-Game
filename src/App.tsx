import Desktop from '@/Desktop'
import Mobile from '@/Mobile'

function App() {

  return (
    <>
      {window.innerWidth <= 640 ?
      <Desktop/>
      :
      <Desktop/>
      }
    </>
  )
}

export default App
