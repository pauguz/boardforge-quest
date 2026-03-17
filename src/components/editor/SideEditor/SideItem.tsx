import { PieceType } from '@/types/game';
import React from 'react';
import { Button } from '../../ui/button';
import { cn } from '@/lib/utils';
import { Trash2 } from "lucide-react";
import { menuType } from '@/types/menu';
import { Tooltip } from '@radix-ui/react-tooltip';

interface SideItemProps {
  gen: PieceType | menuType;
  bloqueo: boolean;
  selection: (id: string) => void;
  selectedID: any;
  remotion?: (id: string) => void | null;
}

const SideItem = ({ gen, bloqueo, selection, selectedID, remotion = null }: SideItemProps) => {
  
  const isPiece = 'captureMode' in gen;

  return (
    <div
      onClick={() => !bloqueo && selection(gen.id)}
      className={cn(
        "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-accent transition-colors",
        selectedID === gen.id && "bg-accent ring-1 ring-primary"
      )}
    >
      {isPiece ? (
        <>        
        <img src={gen.imageUrl as string} alt={gen.name} className="w-8 h-8 object-contain rounded" />
        <span className="text-sm truncate flex-1">{gen.name}</span>
        </>

      ) : (
        (() => { const Icon = gen.imageUrl; 

          return  <div title={gen.name}>          
            <Icon className="w-8 h-8 text-muted-foreground"  />
            </div>
        })()
      )}

      
      {(!bloqueo && remotion) && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 opacity-50 hover:opacity-100"
          onClick={e => { e.stopPropagation(); remotion(gen.id); }}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};

export default SideItem;