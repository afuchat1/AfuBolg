import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Database, Activity, Share2, Cookie, Shield, Mail } from "lucide-react";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-4xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

          <div className="mt-8 mb-12 text-center space-y-4">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl text-foreground">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: <span className="font-medium text-foreground">February 24, 2026</span>
            </p>
          </div>

          <div className="bg-card text-card-foreground p-8 md:p-12 rounded-3xl border shadow-sm">
            <div className="space-y-12">

              <section className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit">
                    <Database className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-3">1. Information We Collect</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    We collect information you provide directly to us, such as when you create an account, submit a contact form, or subscribe to our newsletter.
                  </p>
                </div>
              </section>

              <div className="h-px bg-border" />

              <section className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-3">2. How We Use Information</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    We use the information we collect to operate and improve AfuBlog, send you updates, respond to your questions, and analyze usage patterns.
                  </p>
                </div>
              </section>

              <div className="h-px bg-border" />

              <section className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit">
                    <Share2 className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-3">3. Information Sharing</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    We do not sell, trade, or otherwise transfer your personal information to third parties.
                  </p>
                </div>
              </section>

              <div className="h-px bg-border" />

              <section className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit">
                    <Cookie className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-3">4. Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    AfuBlog uses cookies to enhance your experience. You can disable cookies through your browser settings.
                  </p>
                </div>
              </section>

              <div className="h-px bg-border" />

              <section className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-3">5. Security</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    We implement appropriate security measures to protect your personal information.
                  </p>
                </div>
              </section>

              <div className="h-px bg-border" />

              <section className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-3">6. Contact</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Questions? Contact us at <a href="mailto:privacy@afuchat.com" className="font-medium text-primary hover:underline">privacy@afuchat.com</a>.
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
      <PageFooter pageName="Privacy Policy" relatedLinks={[{ label: "Home", href: "/" }, { label: "Terms", href: "/terms" }]} />
    </div>
  );
};

export default PrivacyPage;
