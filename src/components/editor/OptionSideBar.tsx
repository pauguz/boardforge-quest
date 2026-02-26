import React from 'react'
import { Sidebar, SidebarProvider } from '../ui/sidebar'

const OptionSideBar = () => {
    console.log("Provider montado");
  return (
    <div>
    <SidebarProvider>
      <Sidebar/>
    </SidebarProvider>
    </div>
  )
}

export default OptionSideBar
