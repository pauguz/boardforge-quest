import SideItem from './SideItem.tsx'
import {LucideIcon, Trophy, DollarSign, ChessPawn, UsersIcon, Grid2X2 } from 'lucide-react'
import {menuType} from '../../../types/menu.ts'
import { useGameEditor } from '@/context/GameEditorContext';
import { useGeneralEditor } from '@/context/GeneralEditorContext.tsx'


const OptionSideBar = () => {
  const {isPlaying} = useGameEditor();
      const {
        selectedMenuId, setSelectedMenuId
      } = useGeneralEditor();
  const sections: menuType[] = [
    { id: '1', imageUrl: ChessPawn, name: 'Fichas'},
    { id: '2', imageUrl: Grid2X2, name: 'Victoria'},
    { id: '3', imageUrl: UsersIcon, name: 'Jugadores'},
    { id: '4', imageUrl: DollarSign, name: 'Donaciones'},
  ];

  return (
    <div  className="flex flex-col">
      <div className="flex flex-1 flex-col p-2 justify-around">
      {sections.map(sec => (
          <SideItem key={sec.id} gen={sec} bloqueo={isPlaying} selectedID={selectedMenuId} selection={setSelectedMenuId} /> 
        ))  }
      </div>
    </div>
  )
}

export default OptionSideBar
