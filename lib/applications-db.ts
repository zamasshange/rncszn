// Applications database layer — Supabase with localStorage fallback
import { Application, ApplicationFile, ApplicationNote, ApplicationStatus, ApplicationType, StatusHistoryEntry } from './database';
import { supabase, isSupabaseConfigured } from './supabase';

// ============================================================
// ROW MAPPING
// ============================================================
function mapApplication(row: Record<string, unknown>): Application {
  return {
    id: row.id as string,
    applicationNumber: row.application_number as string,
    type: row.type as ApplicationType,
    status: row.status as ApplicationStatus,
    fullName: row.full_name as string,
    email: row.email as string,
    phone: row.phone as string | null,
    country: row.country as string | null,
    city: row.city as string | null,
    dateOfBirth: row.date_of_birth as string | null,
    gender: row.gender as string | null,
    instagram: row.instagram as string | null,
    tiktok: row.tiktok as string | null,
    youtube: row.youtube as string | null,
    portfolioWebsite: row.portfolio_website as string | null,
    extraFields: (row.extra_fields as Record<string, unknown>) || {},
    whyJoin: row.why_join as string | null,
    whatMakesUnique: row.what_makes_unique as string | null,
    whatContribute: row.what_contribute as string | null,
    aboutYourself: row.about_yourself as string | null,
    reviewedBy: row.reviewed_by as string | null,
    internalNotes: (row.internal_notes as string) || '',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapFile(row: Record<string, unknown>): ApplicationFile {
  return {
    id: row.id as string,
    applicationId: row.application_id as string,
    fileType: row.file_type as ApplicationFile['fileType'],
    fileUrl: row.file_url as string,
    fileName: row.file_name as string | null,
    createdAt: row.created_at as string,
  };
}

function mapNote(row: Record<string, unknown>): ApplicationNote {
  return {
    id: row.id as string,
    applicationId: row.application_id as string,
    note: row.note as string,
    author: row.author as string,
    createdAt: row.created_at as string,
  };
}

function mapStatusHistory(row: Record<string, unknown>): StatusHistoryEntry {
  return {
    id: row.id as string,
    applicationId: row.application_id as string,
    oldStatus: row.old_status as string | null,
    newStatus: row.new_status as string,
    note: row.note as string | null,
    changedBy: row.changed_by as string,
    createdAt: row.created_at as string,
  };
}

// ============================================================
// SUPABASE OPERATIONS
// ============================================================
export async function getApplications(filter?: { type?: ApplicationType; status?: ApplicationStatus }): Promise<Application[]> {
  if (!supabase) return getLocalApplications(filter);
  let query = supabase.from('applications').select('*').order('created_at', { ascending: false });
  if (filter?.type) query = query.eq('type', filter.type);
  if (filter?.status) query = query.eq('status', filter.status);
  const { data, error } = await query;
  if (error) { console.error('getApplications error:', error.message); return []; }
  return (data || []).map(mapApplication);
}

export async function getApplicationById(id: string): Promise<Application | null> {
  if (!supabase) return getLocalApplicationById(id);
  const { data, error } = await supabase.from('applications').select('*').eq('id', id).single();
  if (error) return null;
  const app = mapApplication(data as Record<string, unknown>);
  // Fetch related data
  const [files, notes, history] = await Promise.all([
    supabase.from('application_files').select('*').eq('application_id', id).order('created_at'),
    supabase.from('application_notes').select('*').eq('application_id', id).order('created_at', { ascending: false }),
    supabase.from('application_status_history').select('*').eq('application_id', id).order('created_at'),
  ]);
  app.files = (files.data || []).map(mapFile);
  app.notes = (notes.data || []).map(mapNote);
  app.statusHistory = (history.data || []).map(mapStatusHistory);
  return app;
}

export async function getAcceptedApplications(): Promise<Application[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('status', 'accepted')
    .order('updated_at', { ascending: false });
  if (error) { console.error('getAcceptedApplications error:', error.message); return []; }
  const apps = (data || []).map(mapApplication);
  // Fetch files for showcase
  for (const app of apps) {
    const { data: files } = await supabase
      .from('application_files')
      .select('*')
      .eq('application_id', app.id)
      .order('created_at');
    app.files = (files || []).map(mapFile);
  }
  return apps;
}

export async function submitApplication(application: Omit<Application, 'id' | 'applicationNumber' | 'createdAt' | 'updatedAt' | 'status' | 'reviewedBy' | 'internalNotes' | 'files' | 'notes' | 'statusHistory'>): Promise<Application | null> {
  if (!supabase) return submitLocalApplication(application);

  const insertData = {
    type: application.type,
    status: 'pending',
    full_name: application.fullName,
    email: application.email,
    phone: application.phone,
    country: application.country,
    city: application.city,
    date_of_birth: application.dateOfBirth,
    gender: application.gender,
    instagram: application.instagram,
    tiktok: application.tiktok,
    youtube: application.youtube,
    portfolio_website: application.portfolioWebsite,
    extra_fields: application.extraFields,
    why_join: application.whyJoin,
    what_makes_unique: application.whatMakesUnique,
    what_contribute: application.whatContribute,
    about_yourself: application.aboutYourself,
  };

  const { data, error } = await supabase
    .from('applications')
    .insert(insertData)
    .select()
    .single();

  if (error) { console.error('submitApplication error:', error.message); return null; }
  return mapApplication(data as Record<string, unknown>);
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus, note?: string): Promise<boolean> {
  if (!supabase) return false;

  // Get current status
  const { data: current } = await supabase.from('applications').select('status').eq('id', id).single();
  const oldStatus = current?.status || 'pending';

  const { error } = await supabase.from('applications').update({ status }).eq('id', id);
  if (error) { console.error('updateApplicationStatus error:', error.message); return false; }

  // Log status change
  await supabase.from('application_status_history').insert({
    application_id: id,
    old_status: oldStatus,
    new_status: status,
    note: note || null,
  });

  return true;
}

export async function addApplicationNote(applicationId: string, note: string, author: string = 'Admin'): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('application_notes').insert({
    application_id: applicationId,
    note,
    author,
  });
  return !error;
}

export async function saveApplicationFiles(applicationId: string, files: { fileType: string; fileUrl: string; fileName: string | null }[]): Promise<boolean> {
  if (!supabase) return false;
  const inserts = files.map(f => ({
    application_id: applicationId,
    file_type: f.fileType,
    file_url: f.fileUrl,
    file_name: f.fileName,
  }));
  const { error } = await supabase.from('application_files').insert(inserts);
  return !error;
}

export async function deleteApplication(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('applications').delete().eq('id', id);
  return !error;
}

export async function getApplicationStats(): Promise<{ total: number; pending: number; accepted: number; rejected: number; byType: Record<string, number> }> {
  if (!supabase) return { total: 0, pending: 0, accepted: 0, rejected: 0, byType: {} };

  const { data, error } = await supabase.from('applications').select('status, type');
  if (error || !data) return { total: 0, pending: 0, accepted: 0, rejected: 0, byType: {} };

  const stats = {
    total: data.length,
    pending: data.filter(d => d.status === 'pending').length,
    accepted: data.filter(d => d.status === 'accepted').length,
    rejected: data.filter(d => d.status === 'rejected').length,
    byType: {} as Record<string, number>,
  };

  for (const d of data) {
    stats.byType[d.type] = (stats.byType[d.type] || 0) + 1;
  }

  return stats;
}

// ============================================================
// LOCAL STORAGE FALLBACK
// ============================================================
const APP_STORAGE_KEY = 'renaissance_applications';

function getLocalApplications(filter?: { type?: ApplicationType; status?: ApplicationStatus }): Application[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(APP_STORAGE_KEY);
  let apps: Application[] = stored ? JSON.parse(stored) : [];
  if (filter?.type) apps = apps.filter(a => a.type === filter.type);
  if (filter?.status) apps = apps.filter(a => a.status === filter.status);
  return apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function getLocalApplicationById(id: string): Application | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(APP_STORAGE_KEY);
  const apps: Application[] = stored ? JSON.parse(stored) : [];
  return apps.find(a => a.id === id) || null;
}

function submitLocalApplication(application: Omit<Application, 'id' | 'applicationNumber' | 'createdAt' | 'updatedAt' | 'status' | 'reviewedBy' | 'internalNotes' | 'files' | 'notes' | 'statusHistory'>): Application | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(APP_STORAGE_KEY);
  const apps: Application[] = stored ? JSON.parse(stored) : [];

  const newApp: Application = {
    ...application,
    id: `app_${Date.now()}`,
    applicationNumber: `RNC-${String(apps.length + 1).padStart(5, '0')}`,
    status: 'pending',
    reviewedBy: null,
    internalNotes: '',
    files: [],
    notes: [],
    statusHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  apps.push(newApp);
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(apps));
  return newApp;
}
