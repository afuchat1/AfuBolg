import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container max-w-3xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
            About AfuBlog
          </h1>

          <div className="mt-8 space-y-6 text-foreground/90 leading-relaxed">
            <p>
              AfuBlog is an independent digital publication dedicated to delivering insightful, 
              well-researched journalism on the topics that shape our world — from technology and 
              science to markets, energy, and policy.
            </p>

            <h2 className="font-heading text-2xl font-semibold mt-10">Our Mission</h2>
            <p>
              We believe in the power of clear, honest reporting. In an era of information overload, 
              AfuBlog cuts through the noise to bring you stories that matter, written with depth 
              and nuance. Our commitment is to accuracy, context, and analysis that helps you 
              understand not just what happened, but why it matters.
            </p>

            <h2 className="font-heading text-2xl font-semibold mt-10">What We Cover</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li><span className="text-primary font-medium">Technology</span> — AI, quantum computing, electric aviation, and the innovations shaping tomorrow</li>
              <li><span className="text-primary font-medium">Markets</span> — Global financial analysis, central bank policy, and investment trends</li>
              <li><span className="text-primary font-medium">Science</span> — Breakthrough research in medicine, physics, and environmental science</li>
              <li><span className="text-primary font-medium">Energy</span> — The transition to renewable energy and sustainable infrastructure</li>
              <li><span className="text-primary font-medium">Policy</span> — Climate agreements, regulation, and the policy decisions that affect us all</li>
              <li><span className="text-primary font-medium">Economy</span> — Remote work, housing, labor markets, and economic transformation</li>
            </ul>

            <h2 className="font-heading text-2xl font-semibold mt-10">Our Team</h2>
            <p>
              AfuBlog is powered by a team of experienced journalists, analysts, and subject-matter 
              experts. We combine traditional editorial rigor with AI-assisted research tools to 
              deliver content that is both timely and thoroughly vetted.
            </p>

            <h2 className="font-heading text-2xl font-semibold mt-10">Contact Us</h2>
            <p>
              Have a story tip, feedback, or just want to say hello? Visit our{" "}
              <a href="/contact">contact page</a> or reach out at{" "}
              <span className="text-primary">hello@afublog.com</span>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
