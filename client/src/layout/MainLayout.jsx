import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/navbar'

const MainLayout = () => {
  return (
    <div>
        <Navbar/>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout

// outlet ke andar jo kuch bhi higa wo App.js ke childern me show hoga