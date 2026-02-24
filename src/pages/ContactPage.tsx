import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { toast } from "sonner";
import { Send } from "lucide-react";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

          <h1 className="font-heading text-4xl font-bold tracking-tight">Get in Touch</h1>
          <p className="mt-3 text-muted-foreground">
            Have a story tip, feedback, or partnership inquiry? We'd love to hear from you.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-secondary text-foreground px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-secondary text-foreground px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full bg-secondary text-foreground px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="w-full bg-secondary text-foreground px-3 py-2 text-sm outline-none resize-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send size={14} />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="mt-12 space-y-4 text-sm text-muted-foreground">
            <div className="h-px bg-muted" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-primary mb-2">General</h3>
                <p>hello@afublog.com</p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-primary mb-2">Press</h3>
                <p>press@afublog.com</p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-primary mb-2">Careers</h3>
                <p>careers@afublog.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
