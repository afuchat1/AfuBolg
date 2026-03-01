import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Info, Target, Cpu, Mail } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-5xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

          <div className="mt-8 text-center space-y-4">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-6xl text-foreground">
              About AfuBlog
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The official news, updates, and insights platform for your AI-powered conversational assistant.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card text-card-foreground p-8 rounded-2xl border shadow-sm flex flex-col items-start gap-4 transition-all hover:shadow-md">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Info className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Who We Are</h2>
              <p className="text-muted-foreground leading-relaxed">
                AfuBlog is the official news and updates platform for{" "}
                <a href="https://afuchat.com" className="text-primary font-medium hover:underline" target="_blank" rel="noopener noreferrer">AfuChat.com</a>{" "}
                — your AI-powered conversational assistant. We share product updates, industry insights,
                and the latest developments in AI technology.
              </p>
            </div>

            <div className="bg-card text-card-foreground p-8 rounded-2xl border shadow-sm flex flex-col items-start gap-4 transition-all hover:shadow-md">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We keep our community informed about the latest features, improvements, and breakthroughs
                happening at AfuChat. From new AI capabilities to platform updates, AfuBlog is your
                go-to source for everything AfuChat.
              </p>
            </div>

            <div className="bg-card text-card-foreground p-8 rounded-2xl border shadow-sm flex flex-col items-start gap-4 transition-all hover:shadow-md md:col-span-2 md:flex-row md:items-center">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <Cpu className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold mb-2">Powered by AfuChat</h2>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>AfuChat.com</strong> is an AI-powered platform that helps users with conversations,
                  content creation, code assistance, and more. Our blog is managed by the AfuChat editorial
                  team and uses AI to categorize and organize content automatically.
                </p>
              </div>
            </div>

            <div className="bg-card text-card-foreground p-8 rounded-2xl border shadow-sm flex flex-col items-center text-center gap-4 transition-all hover:shadow-md md:col-span-2">
              <div className="p-3 bg-primary/10 rounded-full mb-2">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Have feedback or a story tip? Visit our{" "}
                <a href="/contact" className="text-primary font-medium hover:underline">contact page</a> or reach out at{" "}
                <span className="font-mono bg-muted px-2 py-1 rounded text-foreground">hello@afuchat.com</span>.
              </p>
            </div>
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
