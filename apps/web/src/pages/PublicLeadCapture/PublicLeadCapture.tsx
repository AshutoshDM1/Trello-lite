import { useState } from 'react';
import { Send, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePublicCreateLeadMutation } from '@/hooks/useLeads';
import { Link } from 'react-router-dom';
import { Logo } from '@/shared/Logo/Logo';

export default function PublicLeadCapture() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'website',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const submitMutation = usePublicCreateLeadMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg('Please enter your name and email address.');
      return;
    }

    submitMutation.mutate(formData, {
      onSuccess: () => {
        setSubmitted(true);
      },
      onError: (err: any) => {
        setErrorMsg(err.response?.data?.message || 'Failed to submit form. Please try again.');
      },
    });
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      source: 'website',
      notes: '',
    });
    setSubmitted(false);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 md:p-12 relative overflow-hidden select-none">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/10 blur-3xl pointer-events-none rounded-full" />

      {/* Header Bar */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between z-10">
        <Logo size="lg" />

        <Link
          to="/"
          className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to App
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-xl w-full mx-auto my-12 z-10">
        {submitted ? (
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center space-y-6 shadow-lg animate-in zoom-in-95 duration-200">
            <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="size-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Thank You for Reaching Out!
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Your inquiry has been captured successfully. Our team will review your details and
                get back to you shortly.
              </p>
            </div>

            <Button onClick={handleReset} variant="outline" className="mt-4 border-border">
              Submit Another Response
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Get in Touch</h2>
              <p className="text-sm text-muted-foreground">
                Fill out the details below and a representative will connect with you soon.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10 border-input bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-10 border-input bg-background"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-10 border-input bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Company Name</label>
                  <Input
                    type="text"
                    placeholder="Acme Inc."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="h-10 border-input bg-background"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Lead Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="website">Website Form</option>
                  <option value="referral">Referral</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="social_media">Social Media</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Message / Notes</label>
                <textarea
                  rows={3}
                  placeholder="How can we help you?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full h-10 font-semibold gap-2 shadow-sm cursor-pointer mt-2"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="size-4" /> Submit Inquiry
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center text-xs text-muted-foreground z-10 space-y-1">
        <p>
          Built for{' '}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Digital Heroes Training Task
          </a>
        </p>
        <p>&copy; {new Date().getFullYear()} Lead CRM Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
