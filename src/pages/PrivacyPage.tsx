import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container max-w-3xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
          <h1 className="font-heading text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <div className="mt-8 space-y-6 text-foreground/90 leading-relaxed text-sm">
            <p><em>Last updated: February 24, 2026</em></p>
            <h2 className="font-heading text-xl font-semibold mt-8">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, submit a contact form, or subscribe to our newsletter. This may include your name, email address, and any messages you send us.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">2. How We Use Information</h2>
            <p>We use the information we collect to operate and improve AfuBlog, send you updates and newsletters you've subscribed to, respond to your comments and questions, and analyze usage patterns to improve user experience.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties. We may share information with service providers who assist in operating our website, provided they agree to keep it confidential.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">4. Cookies</h2>
            <p>AfuBlog uses cookies to enhance your experience. You can choose to disable cookies through your browser settings, though this may affect site functionality.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">5. Security</h2>
            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
            <h2 className="font-heading text-xl font-semibold mt-8">6. Contact</h2>
            <p>If you have questions about this privacy policy, please contact us at <span className="text-primary">privacy@afublog.com</span>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
