import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SEOHead title="About" description="Learn about AfuBlog — the official blog for AfuChat.com, your AI-powered conversational assistant. Discover our mission and team." url="https://stark-news-flow.lovable.app/about" keywords="about AfuChat, AfuBlog team, AI chatbot company, AfuChat mission" />
      <main className="flex-1 py-10">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">About AfuBlog</h1>
          <div className="mt-8 space-y-6 text-foreground/90 leading-relaxed">
            <p>
              AfuBlog is the official news and updates platform for{" "}
              <a href="https://afuchat.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AfuChat.com</a>{" "}
              — your AI-powered conversational assistant. We share product updates, industry insights,
              and the latest developments in AI technology.
            </p>
            <h2 className="font-heading text-2xl font-semibold mt-10">Our Mission</h2>
            <p>
              We keep our community informed about the latest features, improvements, and breakthroughs
              happening at AfuChat. From new AI capabilities to platform updates, AfuBlog is your
              go-to source for everything AfuChat.
            </p>
            <h2 className="font-heading text-2xl font-semibold mt-10">Powered by AfuChat</h2>
            <p>
              <strong>AfuChat.com</strong> is an AI-powered platform that helps users with conversations,
              content creation, code assistance, and more. Our blog is managed by the AfuChat editorial
              team and uses AI to categorize and organize content automatically.
            </p>
            <h2 className="font-heading text-2xl font-semibold mt-10">Contact Us</h2>
            <p>
              Have feedback or a story tip? Visit our{" "}
              <a href="/contact">contact page</a> or reach out at{" "}
              <span className="text-primary">hello@afuchat.com</span>.
            </p>
          </div>
        </div>
      </main>
      <PageFooter
        pageName="About"
        relatedLinks={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
          { label: "Privacy", href: "/privacy" },
        ]}
      />
    </div>
  );
};

export default AboutPage;
