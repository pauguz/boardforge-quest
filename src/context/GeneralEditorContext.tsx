import { PieceType } from '@/types/game';
import React, { createContext, useContext, useState, useCallback } from 'react';

interface GeneralEditorContextType{
  status: 1|2|3;
  tabs: any[];
  selectedTab: number;
  pieceTypes: PieceType[];
  addPieceType: (name: string, imageUrl: string) => void;
  updatePieceType: (id: string, updates: Partial<PieceType>) => void;
  removePieceType: (id: string) => void;

}

const GeneralEditorContext = () => {
  return (
    <div>
      
    </div>
  )
}

export default GeneralEditorContext
