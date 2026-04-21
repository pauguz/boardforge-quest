import { PieceType } from '@/types/game';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';


interface GeneralEditorContextType {
  status: 1|2|3;  //Editando/Cargando/Donante
  setStatus: (st:1|2|3)=>void;
  //tabs: any[];
  selectedTab: number;
  setSelectedTab: (t:number) => void;
  pieceTypes: PieceType[];
  addPieceType: (name: string, imageUrl: string, imageFile:File) => void;
  updatePieceType: (id: string, updates: Partial<PieceType>) => void;
  removePieceType: (id: string) => void;
  selectedPieceTypeCode: string | null;
  setSelectedPieceTypeCode: (id: string | null) => void;
  selectedMenuId: string | null;
  setSelectedMenuId: (id: string | null) => void;
  lastRemoval: { payload: any; id: number } | null;

}

const Ctx = createContext<GeneralEditorContextType | null>(null);

export function useGeneralEditor() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGeneralEditor must be inside GeneralEditorProvider');
  return ctx;
}



const GeneralEditorProvider = ({ children }: { children: React.ReactNode }) => {
    const [status, setStatus] = useState<1|2|3>(1);
    const [lastRemoval, setLastRemoval] = useState<{ payload: any; id: number } | null>(null);
    const [selectedPieceTypeCode, setSelectedPieceTypeCode] = useState<string | null>(null);
    const [selectedMenuId, setSelectedMenuId] = useState<string | null>('1');
    const [pieceTypes, setPieceTypes] = useState<PieceType[]>([]);
    const [selectedTab, setSelectedTab] = useState<number>(0);

    const triggerAction = (data: any) => {
      // Usamos un ID o Timestamp para que incluso si el 'data' es igual, 
      // el useEffect del hijo detecte un cambio real.
      setLastRemoval({ payload: data, id: Date.now() });
    };

    const addPieceType = useCallback((name: string, imageUrl: string, imageFile:File) => {
      setPieceTypes(prev => [...prev, {
        code: crypto.randomUUID(), name, imageUrl, movements: [], captureMode: 'indian', imageFile
      }]);
    }, []);

    const updatePieceType = useCallback((id: string, updates: Partial<PieceType>) => {
      setPieceTypes(prev => prev.map(pt => pt.code === id ? { ...pt, ...updates } : pt));
    }, []);

    const removePieceType = useCallback((id: string) => {
      setPieceTypes(prev => prev.filter(pt => pt.code !== id));
      triggerAction(id);
    }, []);
    


  
  return (
    <Ctx.Provider value={{selectedMenuId, setSelectedMenuId, selectedPieceTypeCode , setSelectedPieceTypeCode,
      updatePieceType, addPieceType, removePieceType, pieceTypes, status, setStatus,
      selectedTab, setSelectedTab, lastRemoval
     }}>
      {children}
    </Ctx.Provider>
  )
}

export default GeneralEditorProvider
