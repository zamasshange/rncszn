'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Upload, X, Check, Sparkles, Camera, Video, Palette, Users, Star, Image, PenTool, Lightbulb } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/sections/footer';
import { submitApplication, saveApplicationFiles } from '@/lib/applications-db';
import { uploadApplicationFile, isSupabaseConfigured } from '@/lib/supabase';
import type { ApplicationType } from '@/lib/database';

const ROLES: { type: ApplicationType; label: string; icon: React.ElementType; desc: string }[] = [
  { type: 'model', label: 'Model', icon: Camera, desc: 'Walk the runway, shoot editorials, represent the brand.' },
  { type: 'ambassador', label: 'Ambassador', icon: Star, desc: 'Share Renaissance with your audience and community.' },
  { type: 'creator', label: 'Content Creator', icon: PenTool, desc: 'Create compelling content that tells our story.' },
  { type: 'photographer', label: 'Photographer', icon: Image, desc: 'Capture the Renaissance aesthetic through your lens.' },
  { type: 'videographer', label: 'Videographer', icon: Video, desc: 'Bring our vision to life through film and motion.' },
  { type: 'stylist', label: 'Stylist', icon: Sparkles, desc: 'Shape the look and feel of Renaissance campaigns.' },
  { type: 'designer', label: 'Designer', icon: Palette, desc: 'Design the next generation of Renaissance pieces.' },
  { type: 'collaborator', label: 'Creative Collaborator', icon: Lightbulb, desc: 'Bring a unique creative perspective to the movement.' },
];

const STEPS = ['Role', 'Personal', 'Social', 'Details', 'Portfolio', 'Questions', 'Review'];

export default function JoinPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    type: '' as ApplicationType | '',
    fullName: '', email: '', phone: '', country: '', city: '', dateOfBirth: '', gender: '',
    instagram: '', tiktok: '', youtube: '', portfolioWebsite: '',
    extraFields: {} as Record<string, string>,
    files: [] as { fileType: string; fileUrl: string; fileName: string | null; preview?: string }[],
    whyJoin: '', whatMakesUnique: '', whatContribute: '', aboutYourself: '',
  });

  const update = useCallback((field: string, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateExtra = useCallback((key: string, value: string) => {
    setForm(prev => ({ ...prev, extraFields: { ...prev.extraFields, [key]: value } }));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      let url: string | null = null;
      if (isSupabaseConfigured()) {
        url = await uploadApplicationFile(file, form.type || 'general');
      }
      if (!url) {
        url = URL.createObjectURL(file);
      }
      setForm(prev => ({
        ...prev,
        files: [...prev.files, { fileType, fileUrl: url!, fileName: file.name, preview: file.type.startsWith('image/') ? url! : undefined }],
      }));
    }
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setForm(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const app = await submitApplication({
        type: form.type as ApplicationType,
        fullName: form.fullName, email: form.email, phone: form.phone || null,
        country: form.country || null, city: form.city || null,
        dateOfBirth: form.dateOfBirth || null, gender: form.gender || null,
        instagram: form.instagram || null, tiktok: form.tiktok || null,
        youtube: form.youtube || null, portfolioWebsite: form.portfolioWebsite || null,
        extraFields: form.extraFields,
        whyJoin: form.whyJoin || null, whatMakesUnique: form.whatMakesUnique || null,
        whatContribute: form.whatContribute || null, aboutYourself: form.aboutYourself || null,
      });
      if (app && form.files.length > 0) {
        await saveApplicationFiles(app.id, form.files.map(f => ({ fileType: f.fileType, fileUrl: f.fileUrl, fileName: f.fileName })));
      }
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return !!form.type;
      case 1: return !!form.fullName && !!form.email;
      case 2: return true;
      case 3: return true;
      case 4: return true;
      case 5: return !!form.whyJoin;
      case 6: return true;
      default: return true;
    }
  };

  if (submitted) {
    return (
      <main className="bg-background min-h-screen">
        <Navbar />
        <section className="flex items-center justify-center min-h-screen px-5 pt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
            <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-6">
              <Check className="size-10 text-foreground" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">Application Submitted</h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Thank you for applying to Renaissance. Our team will review your application and contact you if selected.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-xs uppercase tracking-[0.18em] text-background hover:bg-foreground/90 transition-colors">
              Back to Home
            </Link>
          </motion.div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 md:pt-36 pb-12 md:pb-20 px-5 md:px-8">
        <div className="mx-auto max-w-[1400px] text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Join the Movement
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-tight">
            BECOME PART OF<br />
            <span className="chrome-text italic">RENAISSANCE</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            We are building a creative movement. Apply to join our community of models, creators, and visionaries.
          </motion.p>
        </div>
      </section>

      {/* Progress */}
      <div className="max-w-3xl mx-auto px-5 md:px-8 mb-10">
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`h-1 w-full rounded-full transition-all duration-500 ${i <= step ? 'bg-foreground' : 'bg-border'}`} />
              <span className={`text-[9px] uppercase tracking-wider hidden sm:block ${i <= step ? 'text-foreground' : 'text-muted-foreground/50'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-5 md:px-8 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
          >
            {/* Step 0: Role Selection */}
            {step === 0 && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-light mb-2">Choose Your Path</h2>
                <p className="text-sm text-muted-foreground mb-8">Select the role that best describes your creative vision.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLES.map(role => {
                    const Icon = role.icon;
                    const selected = form.type === role.type;
                    return (
                      <button key={role.type} onClick={() => update('type', role.type)}
                        className={`flex items-start gap-4 p-5 rounded-xl border text-left transition-all duration-300 ${selected ? 'border-foreground bg-foreground/[0.03]' : 'border-border hover:border-foreground/30'}`}>
                        <div className={`p-2.5 rounded-lg shrink-0 ${selected ? 'bg-foreground text-background' : 'bg-foreground/5 text-foreground/60'}`}>
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${selected ? 'text-foreground' : 'text-foreground/80'}`}>{role.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{role.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 1: Personal */}
            {step === 1 && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-light mb-2">Personal Information</h2>
                <p className="text-sm text-muted-foreground mb-8">Tell us about yourself.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name *" value={form.fullName} onChange={v => update('fullName', v)} full />
                  <Input label="Email *" type="email" value={form.email} onChange={v => update('email', v)} />
                  <Input label="Phone" type="tel" value={form.phone} onChange={v => update('phone', v)} />
                  <Input label="Country" value={form.country} onChange={v => update('country', v)} />
                  <Input label="City" value={form.city} onChange={v => update('city', v)} />
                  <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={v => update('dateOfBirth', v)} />
                  <Select label="Gender" value={form.gender} onChange={v => update('gender', v)} options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} />
                </div>
              </div>
            )}

            {/* Step 2: Social */}
            {step === 2 && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-light mb-2">Social Media</h2>
                <p className="text-sm text-muted-foreground mb-8">Share your online presence.</p>
                <div className="space-y-4">
                  <Input label="Instagram" value={form.instagram} onChange={v => update('instagram', v)} placeholder="@username" />
                  <Input label="TikTok" value={form.tiktok} onChange={v => update('tiktok', v)} placeholder="@username" />
                  <Input label="YouTube" value={form.youtube} onChange={v => update('youtube', v)} placeholder="Channel URL" />
                  <Input label="Portfolio Website" value={form.portfolioWebsite} onChange={v => update('portfolioWebsite', v)} placeholder="https://..." />
                </div>
              </div>
            )}

            {/* Step 3: Type-specific Details */}
            {step === 3 && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-light mb-2">
                  {form.type === 'model' ? 'Model Details' : `${ROLES.find(r => r.type === form.type)?.label || ''} Details`}
                </h2>
                <p className="text-sm text-muted-foreground mb-8">Additional information for your application type.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {form.type === 'model' && (<>
                    <Input label="Height (cm)" value={form.extraFields.height || ''} onChange={v => updateExtra('height', v)} />
                    <Input label="Clothing Size" value={form.extraFields.clothingSize || ''} onChange={v => updateExtra('clothingSize', v)} />
                    <Input label="Shoe Size" value={form.extraFields.shoeSize || ''} onChange={v => updateExtra('shoeSize', v)} />
                    <Input label="Experience" value={form.extraFields.experience || ''} onChange={v => updateExtra('experience', v)} placeholder="e.g. 2 years" />
                    <Input label="Availability" value={form.extraFields.availability || ''} onChange={v => updateExtra('availability', v)} full placeholder="e.g. Weekends, full-time" />
                  </>)}
                  {form.type === 'ambassador' && (<>
                    <Input label="Follower Count" value={form.extraFields.followerCount || ''} onChange={v => updateExtra('followerCount', v)} />
                    <Input label="Engagement Rate (%)" value={form.extraFields.engagementRate || ''} onChange={v => updateExtra('engagementRate', v)} />
                    <Input label="Content Niche" value={form.extraFields.contentNiche || ''} onChange={v => updateExtra('contentNiche', v)} full />
                    <Input label="Audience Demographics" value={form.extraFields.audienceDemographics || ''} onChange={v => updateExtra('audienceDemographics', v)} full placeholder="e.g. 18-25, predominantly female, South Africa" />
                  </>)}
                  {form.type === 'creator' && (<>
                    <Input label="Specialization" value={form.extraFields.specialization || ''} onChange={v => updateExtra('specialization', v)} placeholder="e.g. Fashion, Beauty" />
                    <Input label="Years of Experience" value={form.extraFields.yearsExperience || ''} onChange={v => updateExtra('yearsExperience', v)} />
                    <Input label="Portfolio Link" value={form.extraFields.creatorPortfolio || ''} onChange={v => updateExtra('creatorPortfolio', v)} full />
                  </>)}
                  {['photographer', 'videographer', 'stylist', 'designer', 'collaborator'].includes(form.type || '') && (<>
                    <Input label="Specialization" value={form.extraFields.specialization || ''} onChange={v => updateExtra('specialization', v)} />
                    <Input label="Years of Experience" value={form.extraFields.yearsExperience || ''} onChange={v => updateExtra('yearsExperience', v)} />
                    <Input label="Portfolio Link" value={form.extraFields.creatorPortfolio || ''} onChange={v => updateExtra('creatorPortfolio', v)} full />
                  </>)}
                </div>
              </div>
            )}

            {/* Step 4: Portfolio Upload */}
            {step === 4 && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-light mb-2">Portfolio</h2>
                <p className="text-sm text-muted-foreground mb-8">Upload images, PDFs, or videos to showcase your work.</p>

                {form.type === 'model' && (
                  <div className="space-y-4 mb-6">
                    <FileUpload label="Headshot" accept="image/*" onUpload={e => handleFileUpload(e, 'headshot')} />
                    <FileUpload label="Full Body Photo" accept="image/*" onUpload={e => handleFileUpload(e, 'fullbody')} />
                  </div>
                )}

                <FileUpload label="Portfolio / Additional Files" accept="image/*,application/pdf,video/*" multiple onUpload={e => handleFileUpload(e, 'image')} />

                {form.files.length > 0 && (
                  <div className="mt-6 space-y-2">
                    {form.files.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-foreground/[0.02] border border-border">
                        {f.preview ? (
                          <img src={f.preview} alt="" className="w-12 h-12 rounded object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-foreground/5 flex items-center justify-center">
                            <Upload className="size-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{f.fileName}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{f.fileType}</p>
                        </div>
                        <button onClick={() => removeFile(i)} className="p-1 text-muted-foreground hover:text-foreground">
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Questions */}
            {step === 5 && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-light mb-2">Your Story</h2>
                <p className="text-sm text-muted-foreground mb-8">Tell us why Renaissance speaks to you.</p>
                <div className="space-y-5">
                  <TextArea label="Why do you want to join Renaissance? *" value={form.whyJoin} onChange={v => update('whyJoin', v)} rows={3} />
                  <TextArea label="What makes you unique?" value={form.whatMakesUnique} onChange={v => update('whatMakesUnique', v)} rows={3} />
                  <TextArea label="What can you contribute to the brand?" value={form.whatContribute} onChange={v => update('whatContribute', v)} rows={3} />
                  <TextArea label="Tell us about yourself" value={form.aboutYourself} onChange={v => update('aboutYourself', v)} rows={3} />
                </div>
              </div>
            )}

            {/* Step 6: Review */}
            {step === 6 && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-light mb-2">Review & Submit</h2>
                <p className="text-sm text-muted-foreground mb-8">Please review your application before submitting.</p>

                <div className="space-y-6">
                  <ReviewSection title="Role">
                    <p className="text-sm font-medium">{ROLES.find(r => r.type === form.type)?.label}</p>
                  </ReviewSection>

                  <ReviewSection title="Personal">
                    <ReviewRow label="Name" value={form.fullName} />
                    <ReviewRow label="Email" value={form.email} />
                    <ReviewRow label="Phone" value={form.phone} />
                    <ReviewRow label="Location" value={[form.city, form.country].filter(Boolean).join(', ')} />
                  </ReviewSection>

                  <ReviewSection title="Social">
                    <ReviewRow label="Instagram" value={form.instagram} />
                    <ReviewRow label="TikTok" value={form.tiktok} />
                    <ReviewRow label="Portfolio" value={form.portfolioWebsite} />
                  </ReviewSection>

                  <ReviewSection title="Files">
                    <p className="text-sm text-muted-foreground">{form.files.length} file(s) uploaded</p>
                  </ReviewSection>

                  <ReviewSection title="Your Story">
                    <p className="text-xs text-muted-foreground italic leading-relaxed">{form.whyJoin || '—'}</p>
                  </ReviewSection>
                </div>

                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <button onClick={prev} disabled={step === 0} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ArrowLeft className="size-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button onClick={next} disabled={!canProceed()} className="flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-xs uppercase tracking-[0.18em] text-background hover:bg-foreground/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              Continue <ArrowRight className="size-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting || !canProceed()} className="flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-xs uppercase tracking-[0.18em] text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors">
              {submitting ? 'Submitting...' : 'Submit Application'} <Sparkles className="size-4" />
            </button>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ============================================================
// Form Components
// ============================================================
function Input({ label, value, onChange, type = 'text', placeholder, full }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-foreground/[0.02] border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all" />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-foreground/[0.02] border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all">
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
        className="w-full px-4 py-2.5 bg-foreground/[0.02] border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all resize-none" />
    </div>
  );
}

function FileUpload({ label, accept, multiple, onUpload }: { label: string; accept: string; multiple?: boolean; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-foreground/30 transition-colors">
        <Upload className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Click to upload</span>
        <input type="file" accept={accept} multiple={multiple} onChange={onUpload} className="hidden" />
      </label>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl border border-border">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{title}</p>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string | undefined | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}
