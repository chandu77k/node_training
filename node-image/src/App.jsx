import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import RoutingFile from './components/RoutingFile'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RoutingFile />
    </>
  )
}

export default App
