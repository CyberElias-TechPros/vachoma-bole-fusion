export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      collection_designs: {
        Row: {
          collection_id: string
          design_id: string
        }
        Insert: {
          collection_id: string
          design_id: string
        }
        Update: {
          collection_id?: string
          design_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_designs_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "fashion_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_designs_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "fashion_designs"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_order_submissions: {
        Row: {
          additional_notes: string | null
          budget: number
          created_at: string | null
          custom_size: Json | null
          delivery_address: Json
          description: string
          email: string
          fabric_preferences: string | null
          id: string
          name: string
          order_type: string
          other_order_type: string | null
          phone: string
          reference_images: string[] | null
          size: string
          status: string | null
          timeline: string
          updated_at: string | null
        }
        Insert: {
          additional_notes?: string | null
          budget: number
          created_at?: string | null
          custom_size?: Json | null
          delivery_address: Json
          description: string
          email: string
          fabric_preferences?: string | null
          id?: string
          name: string
          order_type: string
          other_order_type?: string | null
          phone: string
          reference_images?: string[] | null
          size: string
          status?: string | null
          timeline: string
          updated_at?: string | null
        }
        Update: {
          additional_notes?: string | null
          budget?: number
          created_at?: string | null
          custom_size?: Json | null
          delivery_address?: Json
          description?: string
          email?: string
          fabric_preferences?: string | null
          id?: string
          name?: string
          order_type?: string
          other_order_type?: string | null
          phone?: string
          reference_images?: string[] | null
          size?: string
          status?: string | null
          timeline?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          business_name: string | null
          created_at: string | null
          email: string | null
          fashion_customer: boolean | null
          food_customer: boolean | null
          full_name: string
          id: string
          measurements: Json | null
          notes: string | null
          phone: string | null
          preferences: Json | null
          profile_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          business_name?: string | null
          created_at?: string | null
          email?: string | null
          fashion_customer?: boolean | null
          food_customer?: boolean | null
          full_name: string
          id?: string
          measurements?: Json | null
          notes?: string | null
          phone?: string | null
          preferences?: Json | null
          profile_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string | null
          created_at?: string | null
          email?: string | null
          fashion_customer?: boolean | null
          food_customer?: boolean | null
          full_name?: string
          id?: string
          measurements?: Json | null
          notes?: string | null
          phone?: string | null
          preferences?: Json | null
          profile_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          business_type: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          business_type: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          business_type?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      fashion_collections: {
        Row: {
          cover_image: string | null
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          name: string
          release_date: string | null
          season: string | null
          updated_at: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          name: string
          release_date?: string | null
          season?: string | null
          updated_at?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          name?: string
          release_date?: string | null
          season?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fashion_designs: {
        Row: {
          category: string
          created_at: string | null
          description: string
          design_images: string[]
          designer_id: string | null
          id: string
          name: string
          price: number
          status: string
          technical_specs: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          design_images: string[]
          designer_id?: string | null
          id?: string
          name: string
          price: number
          status: string
          technical_specs?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          design_images?: string[]
          designer_id?: string | null
          id?: string
          name?: string
          price?: number
          status?: string
          technical_specs?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fashion_designs_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fashion_inventory: {
        Row: {
          cost_per_unit: number
          created_at: string | null
          id: string
          location: string | null
          name: string
          quantity: number
          reorder_point: number
          supplier_id: string | null
          type: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          cost_per_unit: number
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          quantity: number
          reorder_point: number
          supplier_id?: string | null
          type: string
          unit: string
          updated_at?: string | null
        }
        Update: {
          cost_per_unit?: number
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          quantity?: number
          reorder_point?: number
          supplier_id?: string | null
          type?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fashion_order_items: {
        Row: {
          description: string
          design_id: string | null
          id: string
          measurements: Json | null
          notes: string | null
          order_id: string
          quantity: number
          status: string
          unit_price: number
        }
        Insert: {
          description: string
          design_id?: string | null
          id?: string
          measurements?: Json | null
          notes?: string | null
          order_id: string
          quantity: number
          status: string
          unit_price: number
        }
        Update: {
          description?: string
          design_id?: string | null
          id?: string
          measurements?: Json | null
          notes?: string | null
          order_id?: string
          quantity?: number
          status?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fashion_order_items_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "fashion_designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fashion_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "fashion_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      fashion_orders: {
        Row: {
          created_at: string | null
          customer_id: string
          due_date: string | null
          id: string
          notes: string | null
          payment_status: string
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_status: string
          status: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_status?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fashion_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      food_inventory: {
        Row: {
          cost_per_unit: number
          created_at: string | null
          expiry_date: string | null
          id: string
          location: string | null
          name: string
          quantity: number
          reorder_point: number
          supplier_id: string | null
          type: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          cost_per_unit: number
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          location?: string | null
          name: string
          quantity: number
          reorder_point: number
          supplier_id?: string | null
          type: string
          unit: string
          updated_at?: string | null
        }
        Update: {
          cost_per_unit?: number
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          location?: string | null
          name?: string
          quantity?: number
          reorder_point?: number
          supplier_id?: string | null
          type?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      food_order_items: {
        Row: {
          id: string
          menu_item_id: string
          menu_item_name: string
          notes: string | null
          order_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          id?: string
          menu_item_id: string
          menu_item_name: string
          notes?: string | null
          order_id: string
          quantity: number
          unit_price: number
        }
        Update: {
          id?: string
          menu_item_id?: string
          menu_item_name?: string
          notes?: string | null
          order_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "food_order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "food_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      food_orders: {
        Row: {
          created_at: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          delivery_address: string | null
          delivery_fee: number | null
          id: string
          notes: string | null
          order_type: string
          payment_status: string
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          id?: string
          notes?: string | null
          order_type: string
          payment_status: string
          status: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          id?: string
          notes?: string | null
          order_type?: string
          payment_status?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      food_specials: {
        Row: {
          available: boolean | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          image_url: string | null
          menu_item_id: string | null
          name: string
          price: number
          start_date: string
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          image_url?: string | null
          menu_item_id?: string | null
          name: string
          price: number
          start_date: string
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          image_url?: string | null
          menu_item_id?: string | null
          name?: string
          price?: number
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_specials_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      income_categories: {
        Row: {
          business_type: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          business_type: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          business_type?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          allergens: string[] | null
          available: boolean | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          name: string
          nutritional_info: Json | null
          price: number
          updated_at: string | null
        }
        Insert: {
          allergens?: string[] | null
          available?: boolean | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          name: string
          nutritional_info?: Json | null
          price: number
          updated_at?: string | null
        }
        Update: {
          allergens?: string[] | null
          available?: boolean | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          name?: string
          nutritional_info?: Json | null
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          business_type: string
          category_id: string
          created_at: string | null
          date: string
          description: string
          id: string
          payment_method: string
          reference: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          business_type: string
          category_id: string
          created_at?: string | null
          date: string
          description: string
          id?: string
          payment_method: string
          reference?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          business_type?: string
          category_id?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          payment_method?: string
          reference?: string | null
          type?: string
          updated_at?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
