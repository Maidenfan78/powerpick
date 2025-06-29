export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      ball_types: {
        Row: {
          game_id: string;
          id: number;
          name: string;
          sort_order: number;
        };
        Insert: {
          game_id: string;
          id?: number;
          name: string;
          sort_order?: number;
        };
        Update: {
          game_id?: string;
          id?: number;
          name?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "ball_types_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
        ];
      };
      draw_results: {
        Row: {
          ball_type_id: number;
          draw_id: number;
          id: number;
          number: number;
        };
        Insert: {
          ball_type_id: number;
          draw_id: number;
          id?: number;
          number: number;
        };
        Update: {
          ball_type_id?: number;
          draw_id?: number;
          id?: number;
          number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "draw_results_ball_type_id_fkey";
            columns: ["ball_type_id"];
            isOneToOne: false;
            referencedRelation: "ball_types";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "draw_results_draw_id_fkey";
            columns: ["draw_id"];
            isOneToOne: false;
            referencedRelation: "draws";
            referencedColumns: ["id"];
          },
        ];
      };
      draws: {
        Row: {
          created_at: string;
          draw_date: string;
          draw_number: number;
          game_id: string;
          id: number;
        };
        Insert: {
          created_at?: string;
          draw_date: string;
          draw_number: number;
          game_id: string;
          id?: number;
        };
        Update: {
          created_at?: string;
          draw_date?: string;
          draw_number?: number;
          game_id?: string;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "draws_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
        ];
      };
      games: {
        Row: {
          created_at: string;
          csv_url: string | null;
          draw_day: string | null;
          draw_time: string | null;
          from_draw_number: number;
          id: string;
          jackpot: number | null;
          logo_url: string | null;
          main_count: number | null;
          main_max: number | null;
          name: string;
          next_draw_time: string | null;
          powerball_max: number | null;
          region: string;
          supp_count: number | null;
          supp_max: number | null;
          time_zone: string | null;
        };
        Insert: {
          created_at?: string;
          csv_url?: string | null;
          draw_day?: string | null;
          draw_time?: string | null;
          from_draw_number: number;
          id?: string;
          jackpot?: number | null;
          logo_url?: string | null;
          main_count?: number | null;
          main_max?: number | null;
          name: string;
          next_draw_time?: string | null;
          powerball_max?: number | null;
          region: string;
          supp_count?: number | null;
          supp_max?: number | null;
          time_zone?: string | null;
        };
        Update: {
          created_at?: string;
          csv_url?: string | null;
          draw_day?: string | null;
          draw_time?: string | null;
          from_draw_number?: number;
          id?: string;
          jackpot?: number | null;
          logo_url?: string | null;
          main_count?: number | null;
          main_max?: number | null;
          name?: string;
          next_draw_time?: string | null;
          powerball_max?: number | null;
          region?: string;
          supp_count?: number | null;
          supp_max?: number | null;
          time_zone?: string | null;
        };
        Relationships: [];
      };
      hot_cold_numbers: {
        Row: {
          game_id: string;
          main_cold: number[];
          main_hot: number[];
          powerball_cold: number[] | null;
          powerball_hot: number[] | null;
          supp_cold: number[] | null;
          supp_hot: number[] | null;
          updated_at: string;
        };
        Insert: {
          game_id: string;
          main_cold: number[];
          main_hot: number[];
          powerball_cold?: number[] | null;
          powerball_hot?: number[] | null;
          supp_cold?: number[] | null;
          supp_hot?: number[] | null;
          updated_at?: string;
        };
        Update: {
          game_id?: string;
          main_cold?: number[];
          main_hot?: number[];
          powerball_cold?: number[] | null;
          powerball_hot?: number[] | null;
          supp_cold?: number[] | null;
          supp_hot?: number[] | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "hot_cold_numbers_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: true;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
