'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AtSign, ExternalLink } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/sections/footer';
import { getAcceptedApplications } from '@/lib/applications-db';
import type { Application, ApplicationType } from '@/lib/database';

const TYPE_LABELS: Record<string, string> = {
  model: 'Model', ambassador: 'Ambassador', creator: 'Creator',
  photographer: 'Photographer', videographer: 'Videographer',
  stylist: 'Stylist', designer: 'Designer', collaborator: 'Collaborator',
};

// Founding faces of Renaissance — always displayed
const FOUNDED_FACES: Array<{
  name: string;
  type: ApplicationType;
  city: string;
  country: string;
  instagram: string;
  instagramUrl: string;
  image: string;
}> = [
  {
    name: 'Taheera Koekemoer',
    type: 'model',
    city: '',
    country: 'South Africa',
    instagram: '@taheera._.k',
    instagramUrl: 'https://www.instagram.com/taheera._.k/',
    image: '/placeholder-user.jpg',
  },
  {
    name: 'Riley Doherty',
    type: 'model',
    city: '',
    country: '',
    instagram: '@_rileydoherty',
    instagramUrl: 'https://www.instagram.com/_rileydoherty/',
    image: '/placeholder-user.jpg',
  },
  {
    name: 'Pretty Hunn Pride',
    type: 'creator',
    city: '',
    country: '',
    instagram: '@prettyhunnpride',
    instagramUrl: 'https://www.instagram.com/prettyhunnpride/',
    image: '/placeholder-user.jpg',
  },
  {
    name: 'Wham!!',
    type: 'model',
    city: '',
    country: '',
    instagram: '@yems_him',
    instagramUrl: 'https://www.instagram.com/yems_him/',
    image: '/placeholder-user.jpg',
  },
  {
    name: 'Zee Santana',
    type: 'model',
    city: '',
    country: '',
    instagram: '@mouthfullofzee.santana',
    instagramUrl: 'https://www.instagram.com/mouthfullofzee.santana/',
    image: '/placeholder-user.jpg',
  },
];

export default function RenaissanceFacesPage() {
  const [dbTalent, setDbTalent] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    getAcceptedApplications().then(data => { setDbTalent(data); setLoading(false); });
  }, []);

  // Merge founding faces with any accepted DB applications
  const allTalent = [
    ...FOUNDED_FACES.map((f, i) => ({
      id: `founding-${i}`,
      applicationNumber: `RNC-F${i + 1}`,
      type: f.type,
      status: 'accepted' as const,
      fullName: f.name,
      email: '',
      phone: null, country: f.country || null, city: f.city || null,
      dateOfBirth: null, gender: null,
      instagram: f.instagram, tiktok: null, youtube: null,
      portfolioWebsite: f.instagramUrl, extraFields: {},
      whyJoin: null, whatMakesUnique: null, whatContribute: null, aboutYourself: null,
      reviewedBy: null, internalNotes: '',
      createdAt: '', updatedAt: '',
      files: [{ id: `file-${i}`, applicationId: `founding-${i}`, fileType: 'headshot' as const, fileUrl: f.image, fileName: null, createdAt: '' }],
      notes: [], statusHistory: [],
    })),
    ...dbTalent,
  ];

  const filtered = filter === 'all' ? allTalent : allTalent.filter(t => t.type === filter);
  const types = Array.from(new Set(allTalent.map(t => t.type)));

  return (
    <main className="bg-background min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-12 md:pb-16 px-5 md:px-8">
        <div className="mx-auto max-w-[1400px] text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
            The Community
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-tight">
            RENAISSANCE<br />
            <span className="chrome-text italic">FACES</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            The visionaries, creators, and talent shaping the future of fashion through Renaissance.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      {types.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            <FilterButton label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
            {types.map(t => (
              <FilterButton key={t} label={TYPE_LABELS[t] || t} active={filter === t} onClick={() => setFilter(t)} />
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-8 pb-20">
        {loading ? (
          <div className="py-20 text-center text-sm text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-sm">No talent showcased yet.</p>
            <Link href="/join" className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-foreground hover:text-foreground/70 transition-colors">
              Join Renaissance <ExternalLink className="size-3" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((person, i) => {
              const mainImage = person.files?.find(f => f.fileType === 'headshot')?.fileUrl || person.files?.find(f => f.fileType === 'image')?.fileUrl || '/placeholder-user.jpg';
              return (
                <motion.div key={person.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <div className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-muted">
                    <Image src={mainImage} alt={person.fullName} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">{TYPE_LABELS[person.type]}</span>
                      <h3 className="text-lg font-medium text-white mt-1">{person.fullName}</h3>
                      {[person.city, person.country].filter(Boolean).length > 0 && (
                        <p className="text-xs text-white/60 mt-0.5">{[person.city, person.country].filter(Boolean).join(', ')}</p>
                      )}
                      <div className="flex items-center gap-3 mt-3">
                        {person.instagram && (
                          <a href={`https://instagram.com/${person.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                            <AtSign className="size-4" />
                          </a>
                        )}
                        {person.portfolioWebsite && (
                          <a href={person.portfolioWebsite} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                            <ExternalLink className="size-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-8 pb-20">
        <div className="rounded-3xl border border-border p-10 md:p-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">Want to be featured?</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">Apply to join Renaissance and become part of our creative community.</p>
          <Link href="/join" className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-xs uppercase tracking-[0.18em] text-background hover:bg-foreground/90 transition-colors">
            Apply Now <ExternalLink className="size-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground border border-border'}`}>
      {label}
    </button>
  );
}
