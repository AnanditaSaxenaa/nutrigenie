import { useState } from 'react'
import './App.css'
import { Theme } from "@radix-ui/themes";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   
    <Theme accentColor="crimson" radius="large"></Theme>
      <RouterProvider router={router} />
    
    </>
  )
}

export default App
