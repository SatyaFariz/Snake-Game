import Desktop from '@/Desktop'

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
