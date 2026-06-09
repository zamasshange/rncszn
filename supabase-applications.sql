-- ============================================================
-- RENAISSANCE Talent Platform — Applications Database
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. APPLICATIONS
CREATE TABLE applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_number text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('model','ambassador','creator','photographer','videographer','stylist','designer','collaborator')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','under_review','shortlisted','interview','accepted','rejected')),
  -- Personal info
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  city text,
  date_of_birth date,
  gender text,
  -- Social media
  instagram text,
  tiktok text,
  youtube text,
  portfolio_website text,
  -- Type-specific fields (JSON)
  extra_fields jsonb DEFAULT '{}',
  -- Questions
  why_join text,
  what_makes_unique text,
  what_contribute text,
  about_yourself text,
  -- Meta
  reviewed_by text,
  internal_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. APPLICATION FILES
CREATE TABLE application_files (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  file_type text NOT NULL CHECK (file_type IN ('image','pdf','video','headshot','fullbody','additional')),
  file_url text NOT NULL,
  file_name text,
  created_at timestamptz DEFAULT now()
);

-- 3. APPLICATION NOTES (internal admin notes)
CREATE TABLE application_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  note text NOT NULL,
  author text DEFAULT 'Admin',
  created_at timestamptz DEFAULT now()
);

-- 4. STATUS HISTORY
CREATE TABLE application_status_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  old_status text,
  new_status text NOT NULL,
  note text,
  changed_by text DEFAULT 'Admin',
  created_at timestamptz DEFAULT now()
);

-- INDEXES
CREATE INDEX idx_applications_type ON applications(type);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_number ON applications(application_number);
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_application_files_app ON application_files(application_id);
CREATE INDEX idx_application_notes_app ON application_notes(application_id);
CREATE INDEX idx_status_history_app ON application_status_history(application_id);

-- RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;

-- Public insert (anyone can apply)
CREATE POLICY "applications_public_insert" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "applications_public_select" ON applications FOR SELECT USING (status = 'accepted');

-- Admin full access
CREATE POLICY "applications_admin_select" ON applications FOR SELECT USING (true);
CREATE POLICY "applications_admin_update" ON applications FOR UPDATE USING (true);
CREATE POLICY "applications_admin_delete" ON applications FOR DELETE USING (true);

CREATE POLICY "files_admin_select" ON application_files FOR SELECT USING (true);
CREATE POLICY "files_admin_insert" ON application_files FOR INSERT WITH CHECK (true);
CREATE POLICY "files_admin_delete" ON application_files FOR DELETE USING (true);

CREATE POLICY "notes_admin_select" ON application_notes FOR SELECT USING (true);
CREATE POLICY "notes_admin_insert" ON application_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "notes_admin_update" ON application_notes FOR UPDATE USING (true);
CREATE POLICY "notes_admin_delete" ON application_notes FOR DELETE USING (true);

CREATE POLICY "history_admin_select" ON application_status_history FOR SELECT USING (true);
CREATE POLICY "history_admin_insert" ON application_status_history FOR INSERT WITH CHECK (true);

-- STORAGE BUCKET for application files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('application-files', 'application-files', true, 52428800,
  ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','application/pdf','video/mp4','video/quicktime','video/webm']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "app-files-public-read" ON storage.objects FOR SELECT USING (bucket_id = 'application-files');
CREATE POLICY "app-files-upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'application-files');

-- TRIGGER for updated_at
CREATE TRIGGER trg_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- AUTO-GENERATE application number
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.application_number := 'RNC-' || LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(application_number FROM 5) AS INTEGER), 0), 0) + 1 FROM applications), 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_application_number
  BEFORE INSERT ON applications
  FOR EACH ROW
  WHEN (NEW.application_number IS NULL)
  EXECUTE FUNCTION generate_application_number();

-- DONE
SELECT 'Renaissance Talent Platform tables created successfully!' AS result;
