'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Search, Filter, X, Clock, CheckCircle, XCircle, Eye, FileText, MessageSquare, ArrowLeft, Save, Send, Star, AlertTriangle, Users, AtSign, Globe, Calendar, MapPin, Briefcase } from 'lucide-react';
import { getApplications, getApplicationById, updateApplicationStatus, addApplicationNote, getApplicationStats, deleteApplication } from '@/lib/applications-db';
import type { Application, ApplicationStatus, ApplicationType } from '@/lib/database';

const TYPE_LABELS: Record<string, string> = { model: 'Model', ambassador: 'Ambassador', creator: 'Creator', photographer: 'Photographer', videographer: 'Videographer', stylist: 'Stylist', designer: 'Designer', collaborator: 'Collaborator' };
const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  under_review: { label: 'Under Review', bg: 'bg-blue-100', text: 'text-blue-700' },
  shortlisted: { label: 'Shortlisted', bg: 'bg-purple-100', text: 'text-purple-700' },
  interview: { label: 'Interview', bg: 'bg-orange-100', text: 'text-orange-700' },
  accepted: { label: 'Accepted', bg: 'bg-green-100', text: 'text-green-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-700' },
};

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>{children}</div>;
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0, byType: {} as Record<string, number> });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selected, setSelected] = useState<Application | null>(null);
  const [noteText, setNoteText] = useState('');

  const load = async () => {
    setLoading(true);
    const [appList, appStats] = await Promise.all([getApplications(), getApplicationStats()]);
    setApps(appList);
    setStats(appStats);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openDetail = async (app: Application) => {
    const full = await getApplicationById(app.id);
    setSelected(full || app);
  };

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await updateApplicationStatus(id, status);
    await load();
    if (selected?.id === id) {
      const full = await getApplicationById(id);
      setSelected(full);
    }
  };

  const handleAddNote = async () => {
    if (!selected || !noteText.trim()) return;
    await addApplicationNote(selected.id, noteText.trim());
    setNoteText('');
    const full = await getApplicationById(selected.id);
    setSelected(full);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this application?')) return;
    await deleteApplication(id);
    setSelected(null);
    await load();
  };

  const filtered = apps.filter(a => {
    if (filterType !== 'all' && a.type !== filterType) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (search && !a.fullName.toLowerCase().includes(search.toLowerCase()) && !a.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (selected) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="size-4" /> Back to Applications
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{selected.fullName}</h1>
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${STATUS_CONFIG[selected.status]?.bg} ${STATUS_CONFIG[selected.status]?.text}`}>
                      {STATUS_CONFIG[selected.status]?.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{selected.applicationNumber} · {TYPE_LABELS[selected.type]} · {selected.email}</p>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(['under_review', 'shortlisted', 'interview', 'accepted', 'rejected'] as ApplicationStatus[]).map(s => (
                  <button key={s} onClick={() => handleStatusChange(selected.id, s)}
                    disabled={selected.status === s}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${selected.status === s ? 'opacity-40 cursor-not-allowed border-gray-200' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`}>
                    {STATUS_CONFIG[s]?.label}
                  </button>
                ))}
              </div>

              {/* Personal Info */}
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Personal Information</h3>
              <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                <InfoRow icon={MapPin} label="Location" value={[selected.city, selected.country].filter(Boolean).join(', ')} />
                <InfoRow icon={Calendar} label="Date of Birth" value={selected.dateOfBirth} />
                <InfoRow icon={AtSign} label="Gender" value={selected.gender} />
                <InfoRow icon={Globe} label="Phone" value={selected.phone} />
              </div>

              {/* Social */}
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Social Media</h3>
              <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                <InfoRow icon={AtSign} label="Instagram" value={selected.instagram} />
                <InfoRow icon={AtSign} label="TikTok" value={selected.tiktok} />
                <InfoRow icon={AtSign} label="YouTube" value={selected.youtube} />
                <InfoRow icon={Globe} label="Portfolio" value={selected.portfolioWebsite} />
              </div>

              {/* Extra Fields */}
              {Object.keys(selected.extraFields || {}).length > 0 && (<>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{TYPE_LABELS[selected.type]} Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                  {Object.entries(selected.extraFields).map(([key, val]) => (
                    <InfoRow key={key} icon={Briefcase} label={key.replace(/([A-Z])/g, ' $1').trim()} value={String(val)} />
                  ))}
                </div>
              </>)}

              {/* Questions */}
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Application Answers</h3>
              <div className="space-y-4 mb-6">
                <AnswerBlock label="Why join Renaissance?" value={selected.whyJoin} />
                <AnswerBlock label="What makes you unique?" value={selected.whatMakesUnique} />
                <AnswerBlock label="What can you contribute?" value={selected.whatContribute} />
                <AnswerBlock label="About yourself" value={selected.aboutYourself} />
              </div>

              {/* Files */}
              {selected.files && selected.files.length > 0 && (<>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Uploaded Files ({selected.files.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selected.files.map(f => (
                    <a key={f.id} href={f.fileUrl} target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-gray-200 overflow-hidden hover:border-gray-400 transition-colors">
                      {f.fileUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                        <img src={f.fileUrl} alt={f.fileName || ''} className="w-full aspect-square object-cover" />
                      ) : (
                        <div className="w-full aspect-square bg-gray-50 flex items-center justify-center">
                          <FileText className="size-8 text-gray-400" />
                        </div>
                      )}
                      <div className="p-2">
                        <p className="text-xs truncate">{f.fileName || 'File'}</p>
                        <p className="text-[10px] text-gray-400 uppercase">{f.fileType}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </>)}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notes */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageSquare className="size-4" /> Internal Notes
              </h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {(selected.notes || []).map(n => (
                  <div key={n.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{n.note}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{n.author} · {new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
                {(!selected.notes || selected.notes.length === 0) && (
                  <p className="text-xs text-gray-400">No notes yet.</p>
                )}
              </div>
              <div className="flex gap-2">
                <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a note..."
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                <button onClick={handleAddNote} disabled={!noteText.trim()} className="px-3 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">
                  <Save className="size-4" />
                </button>
              </div>
            </Card>

            {/* Status History */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="size-4" /> Status History
              </h3>
              <div className="space-y-2">
                {(selected.statusHistory || []).map(h => (
                  <div key={h.id} className="flex items-start gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${STATUS_CONFIG[h.newStatus]?.bg.replace('100', '500')}`} />
                    <div>
                      <p>{h.oldStatus ? `${STATUS_CONFIG[h.oldStatus]?.label} → ` : ''}{STATUS_CONFIG[h.newStatus]?.label}</p>
                      <p className="text-gray-400">{new Date(h.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {(!selected.statusHistory || selected.statusHistory.length === 0) && (
                  <p className="text-xs text-gray-400">No history yet.</p>
                )}
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="p-5 border-red-200">
              <h3 className="text-sm font-semibold text-red-600 mb-2">Danger Zone</h3>
              <button onClick={() => handleDelete(selected.id)} className="w-full px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                Delete Application
              </button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-500 text-sm">Manage talent applications and recruitment</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total} icon={Users} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="text-yellow-600" />
        <StatCard title="Accepted" value={stats.accepted} icon={CheckCircle} color="text-green-600" />
        <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="text-red-600" />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black">
            <option value="all">All Types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black">
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Location</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Instagram</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Date</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(app => (
                  <tr key={app.id} onClick={() => openDetail(app)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">{app.fullName}</p>
                      <p className="text-xs text-gray-500">{app.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{TYPE_LABELS[app.type]}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">{[app.city, app.country].filter(Boolean).join(', ') || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 hidden sm:table-cell">{app.instagram || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_CONFIG[app.status]?.bg} ${STATUS_CONFIG[app.status]?.text}`}>
                        {STATUS_CONFIG[app.status]?.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 hidden md:table-cell">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-right">
                      <Eye className="size-4 text-gray-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number; icon: React.ElementType; color?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${color || 'text-gray-900'}`}>{value}</p>
        </div>
        <Icon className="size-8 text-gray-300" />
      </div>
    </Card>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <Icon className="size-3.5 text-gray-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-[10px] text-gray-400 uppercase">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}

function AnswerBlock({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-1">{label}</p>
      <p className="text-sm text-gray-700 leading-relaxed">{value || '—'}</p>
    </div>
  );
}
