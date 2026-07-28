import { PieceType } from '@/types/game';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';


interface GeneralEditorContextType {
  status: 1|2|3;
  setStatus: (st:1|2|3) => void;
  selectedTab: number;
  setSelectedTab: (t:number) => void;
  pieceTypes: PieceType[];
  addPieceType: (name: string, imageUrl: string) => void;
  updatePieceType: (index: number, updates: Partial<PieceType>) => void;
  removePieceType: (index: number) => void;
  selectedPieceTypeIndex: number | null;
  setSelectedPieceTypeIndex: (index: number | null) => void;
  selectedMenuIndex: number | null;
  setSelectedMenuIndex: (id: number | null) => void;
  lastRemoval: { payload: any; id: number } | null;
}


interface GeneralEditorContextType {

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
    const [selectedPieceTypeIndex, setSelectedPieceTypeIndex] = useState<number | null>(null);
    const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(0);
    const [pieceTypes, setPieceTypes] = useState<PieceType[]>([]);
    const [selectedTab, setSelectedTab] = useState<number>(0);

    const triggerAction = (data: any) => {
      // Usamos un ID o Timestamp para que incluso si el 'data' es igual, 
      // el useEffect del hijo detecte un cambio real.
      setLastRemoval({ payload: data, id: Date.now() });
    };

    const addPieceType = useCallback((name: string, imageUrl: string) => {
      setPieceTypes(prev => [...prev, {
        code: crypto.randomUUID(), name, imageUrl, moves: [], captura_modo: 'ind',simbolo: name[0] 
      }]);
    }, []);

    const updatePieceType = useCallback((index: number, updates: Partial<PieceType>) => {
      setPieceTypes(prev => prev.map((pt, i) => i === index ? { ...pt, ...updates } : pt));
    }, []);
    
    const removePieceType = useCallback((index: number) => {
      console.log("Removing piece type at index:", index);
      setPieceTypes(prev => prev.filter((_, i) => i !== index));
      setSelectedPieceTypeIndex(prev => {
        if (prev === null || prev < index) return prev;   // no afectado
        if (prev === index) return null;                  // eliminaste la seleccionada
        return prev - 1;                                  // ajusta si estaba después
      });
    }, []);
    


  
  return (
    <Ctx.Provider value={{selectedMenuIndex: selectedMenuIndex, setSelectedMenuIndex: setSelectedMenuIndex, selectedPieceTypeIndex , setSelectedPieceTypeIndex,
      updatePieceType, addPieceType, removePieceType, pieceTypes, status, setStatus,
      selectedTab, setSelectedTab, lastRemoval
     }}>
      {children}
    </Ctx.Provider>
  )
}

export default GeneralEditorProvider
