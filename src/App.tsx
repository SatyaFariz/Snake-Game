import Desktop from "@/Desktop"
import Mobile from "@/Mobile"

function App() {

  return (
    <>
      {window.innerWidth <= 640 ?
      <Mobile/>
      :
      <Desktop/>
      }
    </>
  )
}

export default App
