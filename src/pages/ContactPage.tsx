import { useState } from "react";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import { toast } from "sonner";
import { Send, Mail, Briefcase, Megaphone } from "lucide-react";

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
      setName(""); setEmail(""); setSubject(""); setMessage("");
      setSending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-6xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

            {/* Left Column: Info */}
            <div className="flex flex-col justify-center">
              <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-6xl text-foreground">
                Get in Touch
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                Have a story tip, feedback, or partnership inquiry? We'd love to hear from you. Fill out the form and our team will get back to you shortly.
              </p>

              <div className="mt-12 space-y-6">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border shadow-sm transition-all hover:shadow-md">
                  <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-1">General Inquiries</h3>
                    <p className="text-muted-foreground font-medium">hello@afuchat.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border shadow-sm transition-all hover:shadow-md">
                  <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                    <Megaphone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-1">Press & Media</h3>
                    <p className="text-muted-foreground font-medium">press@afuchat.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border shadow-sm transition-all hover:shadow-md">
                  <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-1">Careers</h3>
                    <p className="text-muted-foreground font-medium">careers@afuchat.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="bg-card text-card-foreground p-8 md:p-10 rounded-3xl border shadow-lg xl:p-12">
              <h2 className="text-2xl font-bold font-heading mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-secondary/50 border border-input text-foreground px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-secondary/50 border border-input text-foreground px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full bg-secondary/50 border border-input text-foreground px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className="w-full bg-secondary/50 border border-input text-foreground px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
                    placeholder="Tell us a little more about your inquiry..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Send className="w-5 h-5" />
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>
      <PageFooter
        pageName="Contact"
        relatedLinks={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
      />
    </div>
  );
};

export default ContactPage;
