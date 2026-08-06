import React, { useEffect } from 'react'
import { LogoReturn } from "@/components/ui/mini/logo-return";
import { TabCreator, TabEntry } from '../ui/mini/tab-entry';
import { useNavigate } from "react-router-dom";
import { getOrCreateAnonymousUser } from '@/utils/auth';


const SelectBar = () => {
    const navigate =useNavigate()
    useEffect(() => {
      getOrCreateAnonymousUser().then(id => console.log("User ID:", id));
    }, []);

  return (
    <div style={{display:'flex'}}>
        <LogoReturn/>
        <div className="h-5 w-px bg-border" />
        <TabEntry isActive={true} title="Principal" func={() => {}}/>
        <div className="h-5 w-px bg-border" />
        <TabCreator/>
    </div>
  )
}

export default SelectBar
