import React from 'react'
import { LogoReturn } from "@/components/ui/mini/logo-return";
import { TabCreator, TabEntry } from '../ui/mini/tab-entry';
import { useNavigate } from "react-router-dom";


const SelectBar = () => {
    const navigate =useNavigate()

  return (
    <div style={{display:'flex', alignItems: 'stretch'}}>
        <LogoReturn/>
        <div className="h-5 w-px bg-border" />
        <TabEntry/>
        <div className="h-5 w-px bg-border" />
        <TabCreator/>
    </div>
  )
}

export default SelectBar
