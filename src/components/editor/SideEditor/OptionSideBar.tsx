import React, { useState } from 'react'
import { Sidebar, SidebarProvider } from '../../ui/sidebar.tsx'
import SideItem from './SideItem.tsx'
import {LucideIcon, Trophy, DollarSign, ChessPawn, UsersIcon } from 'lucide-react'
import {menuType} from '../../../types/menu.ts'
import { useGameEditor } from '@/context/GameEditorContext';

const OptionSideBar = () => {
  const {isPlaying} = useGameEditor();
  const [SelectedMenuId, setSelectedMenuId]=useState(null);
  const sections: menuType[] = [
    { id: '', imageUrl: ChessPawn, name: 'Fichas'},
    { id: '', imageUrl: Trophy, name: 'Victoria'},
    { id: '', imageUrl: UsersIcon, name: 'Jugadores'},
    { id: '', imageUrl: DollarSign, name: 'Donaciones'},
  ];

  return (
    <div  className="flex flex-col">
      <div className="flex flex-1 flex-col p-2 justify-around">
      {sections.map(sec => (
          <SideItem gen={sec} bloqueo={isPlaying} selectedID={SelectedMenuId} selection={setSelectedMenuId} /> 
        ))  }
      </div>
    </div>
  )
}

export default OptionSideBar
