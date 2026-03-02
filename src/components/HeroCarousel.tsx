import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImg1 from "@/assets/hero-tech-1.jpg";
import heroImg2 from "@/assets/hero-tech-2.jpg";
import heroImg3 from "@/assets/hero-tech-3.jpg";

interface SlideArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
}

const fallbackSlides: SlideArticle[] = [
  { slug: "", title: "Welcome to AfuBlog", excerpt: "The official tech newsroom for AfuChat — delivering AI insights, product updates, and the future of technology.", category: "Featured", author: "AfuChat", date: new Date().toISOString() },
  { slug: "", title: "AI-Powered Writing Platform", excerpt: "Write, publish, and share your tech stories with the world. Powered by intelligent tools.", category: "Platform", author: "AfuChat", date: new Date().toISOString() },
  { slug: "", title: "Join the Community", excerpt: "Be part of a growing network of tech writers, developers, and innovators.", category: "Community", author: "AfuChat", date: new Date().toISOString() },
];

const heroImages = [heroImg1, heroImg2, heroImg3];

const HeroCarousel = ({ articles }: { articles?: SlideArticle[] }) => {
  const slides = articles && articles.length > 0 ? articles : fallbackSlides;
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, slides.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, slides.length, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full aspect-[16/7] min-h-[420px] max-h-[680px] overflow-hidden bg-muted">
      {heroImages.map((img, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-700 ease-in-out" style={{ opacity: current === i ? 1 : 0 }}>
          <img src={img} alt="" className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-white/70 mb-3">{slide.category}</span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] text-white mb-4">
            {slide.slug ? (
              <Link to={`/article/${slide.slug}`} className="text-white hover:text-white/80 transition-colors">{slide.title}</Link>
            ) : slide.title}
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-lg leading-relaxed mb-6">{slide.excerpt}</p>
          {slide.slug && (
            <Link to={`/article/${slide.slug}`} className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 text-sm font-semibold rounded-full hover:bg-white/90 transition-colors">
              Read More
            </Link>
          )}
        </div>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all rounded-full" aria-label="Previous slide">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all rounded-full" aria-label="Next slide">
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-6 left-6 sm:left-10 lg:left-16 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className={`h-1 rounded-full transition-all duration-500 ${current === i ? "w-10 bg-white" : "w-5 bg-white/30"}`} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
