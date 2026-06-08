'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/sections/footer'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="bg-background">
      <Navbar />

      <section className="mx-auto max-w-[1400px] px-5 pt-32 md:px-8 md:pt-40">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <a href="/" className="hover:text-foreground">Home</a>
          <span>/</span>
          <span className="text-foreground">Contact</span>
        </div>
        <h1 className="mt-6 text-balance font-serif text-5xl font-light leading-[0.95] text-foreground md:text-7xl">
          Get in Touch
        </h1>
        <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          Have a question, collaboration idea, or press inquiry? We would love to hear from you.
        </p>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div className="space-y-8">
            {[
              { icon: MapPin, title: 'Visit Us', lines: ['90 Rivonia Road', 'Sandton, Johannesburg', 'Gauteng 2196, South Africa'] },
              { icon: Mail, title: 'Email', lines: ['hello@renaissance.co.za', 'press@renaissance.co.za'] },
              { icon: Phone, title: 'Phone', lines: ['+27 10 123 4567'] },
              { icon: Clock, title: 'Hours', lines: ['Mon – Fri: 9am – 6pm SAST', 'Sat: 10am – 4pm SAST'] },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border">
                  <item.icon className="size-4 text-foreground" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.title}</p>
                  {item.lines.map((line) => (
                    <p key={line} className="mt-1 text-sm text-foreground">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            {submitted ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border p-12 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-foreground/10 mb-4">
                  <Mail className="size-6 text-foreground" />
                </div>
                <h3 className="font-serif text-2xl text-foreground">Message Sent</h3>
                <p className="mt-2 text-sm text-muted-foreground">Thank you for reaching out. We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border p-8">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-foreground"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-foreground"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border-b border-border bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-foreground"
                    placeholder="What is this about?"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full resize-none border-b border-border bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-foreground"
                    placeholder="Tell us more..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-foreground py-4 text-xs uppercase tracking-[0.18em] text-background transition-colors hover:bg-foreground/90"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
