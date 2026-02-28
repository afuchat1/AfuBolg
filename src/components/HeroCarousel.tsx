import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImg1 from "@/assets/hero-tech-1.jpg";
import heroImg2 from "@/assets/hero-tech-2.jpg";
import heroImg3 from "@/assets/hero-tech-3.jpg";

interface SlideArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
}

const fallbackSlides = [
  { id: "", title: "Welcome to AfuBlog", excerpt: "The official tech newsroom for AfuChat — delivering AI insights, product updates, and the future of technology.", category: "Featured", author: "AfuChat", date: new Date().toISOString() },
  { id: "", title: "AI-Powered Writing Platform", excerpt: "Write, publish, and share your tech stories with the world. Powered by intelligent tools that help you create professional content.", category: "Platform", author: "AfuChat", date: new Date().toISOString() },
  { id: "", title: "Join the Community", excerpt: "Be part of a growing network of tech writers, developers, and innovators shaping the conversation around artificial intelligence.", category: "Community", author: "AfuChat", date: new Date().toISOString() },
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
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {/* Background images */}
      {heroImages.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: current === i ? 1 : 0 }}
        >
          <img
            src={img}
            alt=""
            className="w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 sm:px-12 lg:px-20">
        <div className="max-w-3xl">
          <span className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-primary mb-4">
            {slide.category}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] text-foreground mb-4">
            {slide.id ? (
              <Link to={`/article/${slide.id}`} className="text-foreground no-underline hover:text-primary transition-colors">
                {slide.title}
              </Link>
            ) : slide.title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed mb-6">
            {slide.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{slide.author}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <time>{new Date(slide.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/60 transition-all rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/60 transition-all rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-0.5 rounded-full transition-all duration-500 ${
              current === i ? "w-8 bg-primary" : "w-4 bg-muted-foreground/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
