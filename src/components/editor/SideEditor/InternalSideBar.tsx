import { useGeneralEditor } from '@/context/GeneralEditorContext';
import React from 'react'
import { useState } from 'react';

const InternalSideBar = ({menu:string}) => {
    const {
      selectedMenuId, setSelectedMenuId
    } = useGeneralEditor();
    const handleChange = () => {
    
      };
  return (
    <>
      
    </>
  )
}

export default InternalSideBar
