import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
          <h1 className="font-heading text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <div className="mt-8 space-y-6 text-foreground/90 leading-relaxed text-sm">
            <p><em>Last updated: February 24, 2026</em></p>
            <h2 className="font-heading text-xl font-semibold mt-8">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, submit a contact form, or subscribe to our newsletter.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">2. How We Use Information</h2>
            <p>We use the information we collect to operate and improve AfuBlog, send you updates, respond to your questions, and analyze usage patterns.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">4. Cookies</h2>
            <p>AfuBlog uses cookies to enhance your experience. You can disable cookies through your browser settings.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">5. Security</h2>
            <p>We implement appropriate security measures to protect your personal information.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">6. Contact</h2>
            <p>Questions? Contact us at <span className="text-primary">privacy@afuchat.com</span>.</p>
          </div>
        </div>
      </main>
      <PageFooter pageName="Privacy Policy" relatedLinks={[{ label: "Home", href: "/" }, { label: "Terms", href: "/terms" }]} />
    </div>
  );
};

export default PrivacyPage;
