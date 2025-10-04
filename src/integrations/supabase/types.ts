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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      listings: {
        Row: {
          access_road_width: number | null
          address: string | null
          alley_width: number | null
          area: number
          balcony_direction: string | null
          ceiling_height: number | null
          created_at: string
          custom_attributes: Json | null
          depth: number | null
          description: string | null
          district: string
          existing_structures: string | null
          expected_move_in_date: string | null
          facade_width: number | null
          featured: boolean | null
          fire_protection: boolean | null
          floor_load: number | null
          floor_number: number | null
          house_direction: string | null
          id: string
          image_url: string | null
          infrastructure: string | null
          interior_status: string | null
          land_direction: string | null
          land_type: string | null
          legal_status: string | null
          num_bathrooms: number | null
          num_bedrooms: number | null
          num_floors: number | null
          planning_info: string | null
          price: number
          project_name: string | null
          property_type_slug: string
          purpose: string
          service_costs: number | null
          title: string
          transport_access: string | null
          updated_at: string
          verified: boolean | null
          views_count: number | null
        }
        Insert: {
          access_road_width?: number | null
          address?: string | null
          alley_width?: number | null
          area: number
          balcony_direction?: string | null
          ceiling_height?: number | null
          created_at?: string
          custom_attributes?: Json | null
          depth?: number | null
          description?: string | null
          district: string
          existing_structures?: string | null
          expected_move_in_date?: string | null
          facade_width?: number | null
          featured?: boolean | null
          fire_protection?: boolean | null
          floor_load?: number | null
          floor_number?: number | null
          house_direction?: string | null
          id?: string
          image_url?: string | null
          infrastructure?: string | null
          interior_status?: string | null
          land_direction?: string | null
          land_type?: string | null
          legal_status?: string | null
          num_bathrooms?: number | null
          num_bedrooms?: number | null
          num_floors?: number | null
          planning_info?: string | null
          price: number
          project_name?: string | null
          property_type_slug: string
          purpose: string
          service_costs?: number | null
          title: string
          transport_access?: string | null
          updated_at?: string
          verified?: boolean | null
          views_count?: number | null
        }
        Update: {
          access_road_width?: number | null
          address?: string | null
          alley_width?: number | null
          area?: number
          balcony_direction?: string | null
          ceiling_height?: number | null
          created_at?: string
          custom_attributes?: Json | null
          depth?: number | null
          description?: string | null
          district?: string
          existing_structures?: string | null
          expected_move_in_date?: string | null
          facade_width?: number | null
          featured?: boolean | null
          fire_protection?: boolean | null
          floor_load?: number | null
          floor_number?: number | null
          house_direction?: string | null
          id?: string
          image_url?: string | null
          infrastructure?: string | null
          interior_status?: string | null
          land_direction?: string | null
          land_type?: string | null
          legal_status?: string | null
          num_bathrooms?: number | null
          num_bedrooms?: number | null
          num_floors?: number | null
          planning_info?: string | null
          price?: number
          project_name?: string | null
          property_type_slug?: string
          purpose?: string
          service_costs?: number | null
          title?: string
          transport_access?: string | null
          updated_at?: string
          verified?: boolean | null
          views_count?: number | null
        }
        Relationships: []
      }
      property_types: {
        Row: {
          created_at: string
          filter_metadata: Json
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          filter_metadata?: Json
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          filter_metadata?: Json
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
