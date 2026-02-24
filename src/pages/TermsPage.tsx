import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container max-w-3xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />
          <h1 className="font-heading text-4xl font-bold tracking-tight">Terms of Service</h1>
          <div className="mt-8 space-y-6 text-foreground/90 leading-relaxed text-sm">
            <p><em>Last updated: February 24, 2026</em></p>
            <h2 className="font-heading text-xl font-semibold mt-8">1. Acceptance of Terms</h2>
            <p>By accessing and using AfuBlog, you accept and agree to be bound by these terms and conditions. If you do not agree, please do not use our website.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">2. Intellectual Property</h2>
            <p>All content published on AfuBlog, including articles, images, and graphics, is the property of AfuBlog or its content creators and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without explicit permission.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">3. User Accounts</h2>
            <p>When you create an account, you are responsible for maintaining the confidentiality of your credentials and for all activities under your account.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">4. Content Guidelines</h2>
            <p>Users with content creation privileges agree to publish accurate, original content that does not infringe on third-party rights, contain defamatory material, or violate applicable laws.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">5. Limitation of Liability</h2>
            <p>AfuBlog provides content for informational purposes only. We make no warranties about the accuracy or completeness of content and shall not be liable for any decisions made based on our publications.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">6. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of AfuBlog constitutes acceptance of updated terms.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
