import { SupabaseClient } from "@supabase/supabase-js";
import { verifyAuthorship } from "./salaService";

export const setupPresenceChannel = (
    supabase: SupabaseClient,
    roomCode: string,
    localId: string,
    setUsers: (userIds: string[]) => void
  ) => {
    const channel = supabase.channel(`room:${roomCode}`, {
      config: { presence: { key: localId } }
    });
  
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const userIds = Object.keys(state);
      setUsers(userIds) 
    });
  
    channel.subscribe(async () => {
      await channel.track({ localId, joined_at: new Date().toISOString() });
    });
  
    
    return channel;
  };