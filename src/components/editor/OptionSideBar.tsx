import React, { useState } from 'react'
import { Sidebar, SidebarProvider } from '../ui/sidebar'
import PieceItem from './PieceItem'
import {menuType} from '../../types/menu.ts'
import { useGameEditor } from '@/context/GameEditorContext';

const OptionSideBar = () => {
  const {isPlaying} = useGameEditor();
  const [SelectedMenuId, setSelectedMenuId]=useState(null);
  const sections: menuType[] = [
    { id: '', imageUrl:'', name: 'Fichas'},
    { id: '', imageUrl:'', name: 'Victoria'},
    { id: '', imageUrl:'', name: 'Donaciones'},
  ];

  return (
    <div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {sections.map(sec => (
          <PieceItem gen={sec} bloqueo={isPlaying} selectedID={SelectedMenuId} selection={setSelectedMenuId} /> 


        ))  }
      </div>
    </div>
  )
}

export default OptionSideBar
