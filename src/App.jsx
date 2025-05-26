import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CreateDiary from './pages/create-diary'
import SideMenu from './components/side-menu'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <div className="flex min-h-screen w-screen bg-red-100">
      <SideMenu />
      <div className="flex-1 relative  p-8 bg-white-100 max-h-[100vh]">
        <Outlet />
      </div>
    </div>
  )
}

export default App
