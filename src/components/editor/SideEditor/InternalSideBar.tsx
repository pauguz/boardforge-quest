import { useGeneralEditor } from '@/context/GeneralEditorContext';
import React from 'react'
import { useState } from 'react';
import { PieceSidebar } from './PieceSidebar';
import BoxSideBar from './BoxSideBar';

const BARS = {
  '1': PieceSidebar,
  '2': BoxSideBar,
  '3': BoxSideBar,
  '4': BoxSideBar
};

const InternalSideBar = () => {
    const {
      selectedMenuId, setSelectedMenuId
    } = useGeneralEditor();
    const Render= BARS[selectedMenuId] || PieceSidebar;

  return (
    <Render key={selectedMenuId} />
  )
}

export default InternalSideBar
