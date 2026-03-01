import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FileText, ShieldCheck, UserCircle, MessageSquare, AlertTriangle, RefreshCw } from "lucide-react";

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-4xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />

          <div className="mt-8 mb-12 text-center space-y-4">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl text-foreground">
              Terms of Service
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
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    By accessing and using AfuBlog, you accept and agree to be bound by these terms.
                  </p>
                </div>
              </section>

              <div className="h-px bg-border" />

              <section className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-3">2. Intellectual Property</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    All content published on AfuBlog is protected by copyright laws.
                  </p>
                </div>
              </section>

              <div className="h-px bg-border" />

              <section className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit">
                    <UserCircle className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-3">3. User Accounts</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    You are responsible for maintaining the confidentiality of your credentials.
                  </p>
                </div>
              </section>

              <div className="h-px bg-border" />

              <section className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-3">4. Content Guidelines</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Users agree to publish accurate, original content that does not infringe on third-party rights.
                  </p>
                </div>
              </section>

              <div className="h-px bg-border" />

              <section className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-3">5. Limitation of Liability</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    AfuBlog provides content for informational purposes only.
                  </p>
                </div>
              </section>

              <div className="h-px bg-border" />

              <section className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit">
                    <RefreshCw className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-3">6. Changes to Terms</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    We reserve the right to modify these terms at any time.
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
      <PageFooter pageName="Terms of Service" relatedLinks={[{ label: "Home", href: "/" }, { label: "Privacy", href: "/privacy" }]} />
    </div>
  );
};

export default TermsPage;
