import { SupabaseClient } from "@supabase/supabase-js";

export const setupJugadoresListener = (
    supabase: SupabaseClient,
    salaId: number,
    datos: any,
    localId: string,
    callbacks: {
      onJugadorChange: () => void;
    }
  ) => {
    const jugadorChannel = supabase.channel(`jugadores:${salaId}`);
  
    jugadorChannel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'jugador',
        filter: `sala_id=eq.${salaId}`,
      },
      (payload) => {
        console.log('👥 CAMBIO EN JUGADORES:', payload);
        callbacks.onJugadorChange();
      }
    ).subscribe();  // Sin await
  
    return jugadorChannel;
  };