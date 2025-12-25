import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='bg-slate-400  h-60 flex-3 text-4xl'>
      Hello Wolrd
    </div>
    </>
  )
}

export default App
