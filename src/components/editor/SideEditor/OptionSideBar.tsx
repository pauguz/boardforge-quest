import SideItem from './OptionalSideBars/SideItem.tsx'
import {LucideIcon, Trophy, DollarSign, ChessPawn, UsersIcon, Grid2X2 } from 'lucide-react'
import {menuType} from '../../../types/menu.ts'
import { useGameEditor } from '@/context/GameEditorContext';
import { useGeneralEditor } from '@/context/GeneralEditorContext.tsx'
import { cn } from '@/lib/utils';


const OptionSideBar = () => {
  const {isPlaying} = useGameEditor();
      const {
        selectedMenuIndex: selectedMenuId, setSelectedMenuIndex: setSelectedMenuId
      } = useGeneralEditor();
  const sections: menuType[] = [
    { code: '1', imageUrl: ChessPawn, name: 'Fichas'},
    { code: '2', imageUrl: Grid2X2, name: 'Victoria'},
    { code: '3', imageUrl: UsersIcon, name: 'Jugadores'},
    { code: '4', imageUrl: DollarSign, name: 'Donaciones'},
  ];

  return (
    <div  className="flex flex-col">
      <div className="flex flex-1 flex-col p-2 justify-around">
      {sections.map((sec, ind) => (
          <div 
          key={ind}
          className={cn(
            "rounded-md",
            selectedMenuId === ind && "bg-accent ring-1 ring-primary"
          )}>
          <SideItem  gen={sec} bloqueo={isPlaying}  selection={ ()=> {setSelectedMenuId(ind)}} /> 
          </div>
        ))  }
      </div>
    </div>
  )
}

export default OptionSideBar
