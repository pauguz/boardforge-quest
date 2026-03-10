import { PieceType } from '@/types/game';
import React from 'react'
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import {  Trash2 } from "lucide-react";
import { menuType } from '@/types/menu';

interface PieceItemProps {
    gen: PieceType|menuType;
    bloqueo: boolean;
    selection: (id: string) => void;
    selectedID: any;
    remotion?: (id: string) => void;
  }

const PieceItem = ({gen, bloqueo, selection, selectedID, remotion= null}: PieceItemProps) => {
  return (
    <div
    onDoubleClick={() => !bloqueo && selection(gen.id)}
    className={cn(
      "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-accent transition-colors",
      selectedID === gen.id && "bg-accent ring-1 ring-primary"
    )}
  >
    <img src={gen.imageUrl} alt={gen.name} className="w-8 h-8 object-contain rounded" />
    <span className="text-sm truncate flex-1">{gen.name}</span>
    {(!bloqueo && remotion) && (
      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100"
        onClick={e => { e.stopPropagation(); remotion(gen.id); }}>
        <Trash2 className="w-3 h-3" />
      </Button>
    )}
  </div>
  )
}

export default PieceItem
