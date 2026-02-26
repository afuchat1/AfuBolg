import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />
          <h1 className="font-heading text-4xl font-bold tracking-tight">Terms of Service</h1>
          <div className="mt-8 space-y-6 text-foreground/90 leading-relaxed text-sm">
            <p><em>Last updated: February 24, 2026</em></p>
            <h2 className="font-heading text-xl font-semibold mt-8">1. Acceptance of Terms</h2>
            <p>By accessing and using AfuBlog, you accept and agree to be bound by these terms.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">2. Intellectual Property</h2>
            <p>All content published on AfuBlog is protected by copyright laws.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your credentials.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">4. Content Guidelines</h2>
            <p>Users agree to publish accurate, original content that does not infringe on third-party rights.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">5. Limitation of Liability</h2>
            <p>AfuBlog provides content for informational purposes only.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">6. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time.</p>
          </div>
        </div>
      </main>
      <PageFooter pageName="Terms of Service" relatedLinks={[{ label: "Home", href: "/" }, { label: "Privacy", href: "/privacy" }]} />
    </div>
  );
};

export default TermsPage;
