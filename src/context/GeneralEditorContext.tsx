import { PieceType } from '@/types/game';
import React, { createContext, useContext, useState, useCallback } from 'react';


interface GeneralEditorContextType {
  status: 1|2|3|4;  //Editando/Cargando/Mostrando
  setStatus: (st:1|2|3|4)=>void;
  //tabs: any[];
  selectedTab: number;
  setSelectedTab: (t:number) => void;
  pieceTypes: PieceType[];
  addPieceType: (name: string, imageUrl: string) => void;
  updatePieceType: (id: string, updates: Partial<PieceType>) => void;
  removePieceType: (id: string) => void;
  selectedPieceTypeId: string | null;
  setSelectedPieceTypeId: (id: string | null) => void;
  selectedMenuId: string | null;
  setSelectedMenuId: (id: string | null) => void;
}

const Ctx = createContext<GeneralEditorContextType | null>(null);

export function useGeneralEditor() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGeneralEditor must be inside GeneralEditorProvider');
  return ctx;
}

const GeneralEditorProvider = ({ children }: { children: React.ReactNode }) => {
    const [status, setStatus] = useState<1|2|3|4>(1);
    const [selectedPieceTypeId, setSelectedPieceTypeId] = useState<string | null>(null);
    const [selectedMenuId, setSelectedMenuId] = useState<string | null>('1');
    const [pieceTypes, setPieceTypes] = useState<PieceType[]>([]);
    const [selectedTab, setSelectedTab] = useState<number>(0);

    const addPieceType = useCallback((name: string, imageUrl: string) => {
      setPieceTypes(prev => [...prev, {
        id: crypto.randomUUID(), name, imageUrl, movements: [], captureMode: 'indian',
      }]);
    }, []);

    const updatePieceType = useCallback((id: string, updates: Partial<PieceType>) => {
      setPieceTypes(prev => prev.map(pt => pt.id === id ? { ...pt, ...updates } : pt));
    }, []);

    const removePieceType = useCallback((id: string) => {
      setPieceTypes(prev => prev.filter(pt => pt.id !== id));
    }, []);
    

  
  return (
    <Ctx.Provider value={{selectedMenuId, setSelectedMenuId, selectedPieceTypeId, setSelectedPieceTypeId,
      updatePieceType, addPieceType, removePieceType, pieceTypes, status, setStatus,
      selectedTab, setSelectedTab,
     }}>
      {children}
    </Ctx.Provider>
  )
}

export default GeneralEditorProvider
