export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      juego: {
        Row: {
          alto: unknown
          ancho: unknown
          creador_id: string | null
          dispin: Json | null
          id: number
          magnitud: number | null
          nombre: string | null
          public: unknown
          updated_at: string | null
        }
        Insert: {
          alto?: unknown
          ancho?: unknown
          creador_id?: string | null
          dispin?: Json | null
          id?: number
          magnitud?: number | null
          nombre?: string | null
          public?: unknown
          updated_at?: string | null
        }
        Update: {
          alto?: unknown
          ancho?: unknown
          creador_id?: string | null
          dispin?: Json | null
          id?: number
          magnitud?: number | null
          nombre?: string | null
          public?: unknown
          updated_at?: string | null
        }
        Relationships: []
      }
      jugador: {
        Row: {
          id: number
          mensaje: string | null
          posicion: number | null
          sala_id: number | null
        }
        Insert: {
          id?: number
          mensaje?: string | null
          posicion?: number | null
          sala_id?: number | null
        }
        Update: {
          id?: number
          mensaje?: string | null
          posicion?: number | null
          sala_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fksala"
            columns: ["sala_id"]
            isOneToOne: false
            referencedRelation: "ludisala"
            referencedColumns: ["sala_id"]
          },
          {
            foreignKeyName: "fksala"
            columns: ["sala_id"]
            isOneToOne: false
            referencedRelation: "sala"
            referencedColumns: ["id"]
          },
        ]
      }
      sala: {
        Row: {
          codigo: string | null
          creador_id: string | null
          created_at: string | null
          enjuego: unknown
          id: number
          ip: string | null
          juego_id: number | null
          turn: number | null
        }
        Insert: {
          codigo?: string | null
          creador_id?: string | null
          created_at?: string | null
          enjuego?: unknown
          id?: number
          ip?: string | null
          juego_id?: number | null
          turn?: number | null
        }
        Update: {
          codigo?: string | null
          creador_id?: string | null
          created_at?: string | null
          enjuego?: unknown
          id?: number
          ip?: string | null
          juego_id?: number | null
          turn?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fkjuego"
            columns: ["juego_id"]
            isOneToOne: false
            referencedRelation: "juego"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      ludisala: {
        Row: {
          alto: unknown
          ancho: unknown
          codigo: string | null
          created_at: string | null
          enjuego: unknown
          ip: string | null
          magnitud: number | null
          nombre_juego: string | null
          public: unknown
          sala_id: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      count_my_rooms: { Args: never; Returns: number }
      create_game: {
        Args: {
          p_alto: unknown
          p_ancho: unknown
          p_magnitud: number
          p_nombre: string
          p_public: unknown
        }
        Returns: {
          alto: unknown
          ancho: unknown
          creador_id: string | null
          dispin: Json | null
          id: number
          magnitud: number | null
          nombre: string | null
          public: unknown
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "juego"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      create_room: {
        Args: { p_codigo: string; p_ip: string; p_juego_id: number }
        Returns: {
          codigo: string | null
          creador_id: string | null
          created_at: string | null
          enjuego: unknown
          id: number
          ip: string | null
          juego_id: number | null
          turn: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "sala"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      create_room_with_game: {
        Args: {
          p_alto: unknown
          p_ancho: unknown
          p_codigo: string
          p_ip: string
          p_nombre: string
        }
        Returns: {
          codigo: string | null
          creador_id: string | null
          created_at: string | null
          enjuego: unknown
          id: number
          ip: string | null
          juego_id: number | null
          turn: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "sala"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      debug_headers: { Args: never; Returns: Json }
      is_owner: { Args: { room_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
