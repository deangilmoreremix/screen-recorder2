import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  project_id: string;
  url: string;
  filename: string;
  created_at: string;
}

export async function uploadVideo(file: Blob, fileName: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('videos')
    .upload(fileName, file, {
      contentType: 'video/webm',
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('videos')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function getVideoUrl(path: string): Promise<string> {
  const { data } = supabase.storage
    .from('videos')
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function createProject(name: string, description?: string): Promise<Project> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name,
      description,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProjects(): Promise<Project[]> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function saveVideoToProject(
  projectId: string,
  videoUrl: string,
  fileName: string
): Promise<Video> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('videos')
    .insert({
      project_id: projectId,
      url: videoUrl,
      filename: fileName,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export interface ProcessExportParams {
  videoUrl: string;
  format?: 'mp4' | 'webm' | 'mov';
  quality?: 'low' | 'medium' | 'high';
}

export async function callProcessExport(params: ProcessExportParams): Promise<{ url: string }> {
  const { data, error } = await supabase.functions.invoke('process-export', {
    body: params,
  });

  if (error) throw error;
  return data;
}