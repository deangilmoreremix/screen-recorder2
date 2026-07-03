export interface UserApiKeys {
  supabase: {
    anonKey: string;
    serviceRoleKey: string;
  };
  openai: string;
  anthropic: string;
  custom: Record<string, string>;
}

export type ApiKeyField = keyof Omit<UserApiKeys, 'custom'>;
