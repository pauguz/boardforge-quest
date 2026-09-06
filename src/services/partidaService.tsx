import { BoardPiece } from "@/types/game";
import { SupabaseClient } from "@supabase/supabase-js";

export const setupPartidaListener = (
    supabase: SupabaseClient,
    salaId: number,
    codigoToIndex: Record<string, number>,
    callbacks: {
      onJuegoIniciado: () => void;
      onPartidaChange: (updateData: any) => void;
    }
  ) => {
    const partidaChannel = supabase.channel(`partida:${salaId}`);
  
    partidaChannel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'partida',
        filter: `sala_id=eq.${salaId}`,
      },
      (payload) => {
        console.log('🔥 CAMBIO EN PARTIDA:', payload);
        
        const nuevaPartida = payload.new;
        if (!nuevaPartida) return;
  
        callbacks.onJuegoIniciado();
  
        const tablero =
          typeof nuevaPartida.tablero === 'string'
            ? JSON.parse(nuevaPartida.tablero)
            : nuevaPartida.tablero;
  
        const pieces: BoardPiece[] = tablero.map((entry: any) => ({
          pieceTypeIndex: codigoToIndex[entry.code] ?? 0,
          player: entry.player,
          row: entry.row,
          col: entry.col,
        }));
  
        callbacks.onPartidaChange({
          pieces,
          turn: nuevaPartida.turn,
          winner: nuevaPartida.winner,
        });
      }
    ).subscribe((status) => {
      console.log('📡 PARTIDA CHANNEL STATUS:', status);
    });
  
    return partidaChannel;
  };