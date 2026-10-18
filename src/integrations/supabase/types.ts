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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          interests: string[]
          name: string
          notes: string | null
          phone: string | null
          preferred_date: string
          preferred_time: string
          status: string
          visit_address: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          interests?: string[]
          name: string
          notes?: string | null
          phone?: string | null
          preferred_date: string
          preferred_time: string
          status?: string
          visit_address?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          interests?: string[]
          name?: string
          notes?: string | null
          phone?: string | null
          preferred_date?: string
          preferred_time?: string
          status?: string
          visit_address?: string | null
        }
        Relationships: []
      }
      cars: {
        Row: {
          body_type: string | null
          colour: string | null
          created_at: string
          description: string | null
          doors: number | null
          engine: string | null
          features: string[]
          fuel: string | null
          id: string
          make: string
          mileage: number | null
          model: string
          photos: string[]
          price: number | null
          published: boolean
          status: string
          title: string
          transmission: string | null
          year: number | null
        }
        Insert: {
          body_type?: string | null
          colour?: string | null
          created_at?: string
          description?: string | null
          doors?: number | null
          engine?: string | null
          features?: string[]
          fuel?: string | null
          id?: string
          make: string
          mileage?: number | null
          model: string
          photos?: string[]
          price?: number | null
          published?: boolean
          status?: string
          title: string
          transmission?: string | null
          year?: number | null
        }
        Update: {
          body_type?: string | null
          colour?: string | null
          created_at?: string
          description?: string | null
          doors?: number | null
          engine?: string | null
          features?: string[]
          fuel?: string | null
          id?: string
          make?: string
          mileage?: number | null
          model?: string
          photos?: string[]
          price?: number | null
          published?: boolean
          status?: string
          title?: string
          transmission?: string | null
          year?: number | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          company: string | null
          created_at: string
          email: string
          fabric_notes: string | null
          garment_type: string
          id: string
          logo_placement: string | null
          logo_url: string | null
          message: string | null
          name: string
          phone: string | null
          quantity: number | null
          sizes: string | null
          specification: Json
          status: string
          stitching_notes: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          fabric_notes?: string | null
          garment_type: string
          id?: string
          logo_placement?: string | null
          logo_url?: string | null
          message?: string | null
          name: string
          phone?: string | null
          quantity?: number | null
          sizes?: string | null
          specification?: Json
          status?: string
          stitching_notes?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          fabric_notes?: string | null
          garment_type?: string
          id?: string
          logo_placement?: string | null
          logo_url?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          quantity?: number | null
          sizes?: string | null
          specification?: Json
          status?: string
          stitching_notes?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_enquiries: {
        Row: {
          budget: string | null
          created_at: string
          desired_vehicle: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          vehicle_id: string | null
          vehicle_title: string | null
        }
        Insert: {
          budget?: string | null
          created_at?: string
          desired_vehicle: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          vehicle_id?: string | null
          vehicle_title?: string | null
        }
        Update: {
          budget?: string | null
          created_at?: string
          desired_vehicle?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          vehicle_id?: string | null
          vehicle_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_enquiries_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
