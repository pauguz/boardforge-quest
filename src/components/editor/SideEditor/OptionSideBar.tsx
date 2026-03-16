import React, { useState } from 'react'
import { Sidebar, SidebarProvider } from '../../ui/sidebar.tsx'
import SideItem from './SideItem.tsx'
import {LucideIcon, Trophy, DollarSign, ChessPawn } from 'lucide-react'
import {menuType} from '../../../types/menu.ts'
import { useGameEditor } from '@/context/GameEditorContext';

const OptionSideBar = () => {
  const {isPlaying} = useGameEditor();
  const [SelectedMenuId, setSelectedMenuId]=useState(null);
  const sections: menuType[] = [
    { id: '', imageUrl: ChessPawn, name: 'Fichas'},
    { id: '', imageUrl: Trophy, name: 'Victoria'},
    { id: '', imageUrl: DollarSign, name: 'Donaciones'},
  ];

  return (
    <div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {sections.map(sec => (
          <SideItem gen={sec} bloqueo={isPlaying} selectedID={SelectedMenuId} selection={setSelectedMenuId} /> 


        ))  }
      </div>
    </div>
  )
}

export default OptionSideBar
