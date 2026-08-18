import React, { useState, useEffect } from 'react';

interface Slide {
  id: string;
  tagline: string;
  title: string;
  subtitle: string;
  description: string;
  tierBadge: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    id: 'mahakarya',
    tierBadge: 'Kasta Tertinggi • Sutra Prada',
    tagline: 'Sejak 2007 • Semarang & Solo',
    title: 'Sarimbit Mahakarya',
    subtitle: 'Keagungan Sutra & Prada Emas Murni',
    description: 'Mahakarya sutra ATBM eksklusif berpadu canting prada emas murni, dipersembahkan khusus untuk momen sakral resepsi pernikahan keluarga terhormat.',
    ctaText: 'Eksplorasi Mahakarya',
    ctaLink: '/collections/sarimbit-mahakarya-heritage',
    image: 'https://cdn.shopify.com/s/files/1/0813/3224/0441/collections/banner_batik_couple_1785995932731_51f1e349-35df-4896-b08d-6290f84897d9.jpg?v=1786005734'
  },
  {
    id: 'signature',
    tierBadge: 'Koleksi Desainer • Tenun Dobby',
    tagline: 'Filosofi Modern • Butik Semarang',
    title: 'Signature Elegance',
    subtitle: 'Kemewahan Tekstur Dobby & Tarum Navy',
    description: 'Sentuhan tenun dobby premium bertekstur dan katun primisima berlapis furing hero halus, memancarkan wibawa dan keanggunan kontemporer.',
    ctaText: 'Lihat Signature',
    ctaLink: '/collections/sarimbit-signature-elegance',
    image: 'https://cdn.shopify.com/s/files/1/0813/3224/0441/collections/banner_batik_couple_1785995932731_d8691b10-ece8-4430-a8c6-d184fa0c467a.jpg?v=1786004716'
  },
  {
    id: 'essential',
    tierBadge: 'Keluarga Harmonis • Katun Primisima',
    tagline: 'Kenyamanan Harian & Hari Raya',
    title: 'Essential Daily',
    subtitle: 'Kehangatan Kasih Keluarga Tercinta',
    description: 'Pilihan sarimbit katun primisima yang sejuk, breathable, dan lembut dengan corak klasik harmonis, merajut kebersamaan keluarga di setiap langkah.',
    ctaText: 'Jelajahi Essential',
    ctaLink: '/collections/sarimbit-essential-daily',
    image: 'https://cdn.shopify.com/s/files/1/0813/3224/0441/collections/banner_batik_couple_1785995932731_7d17a644-177e-4489-bcf6-490c3c74d39f.jpg?v=1786005749'
  },
  {
    id: 'all',
    tierBadge: 'Koleksi Lengkap • Pria, Wanita & Anak',
    tagline: 'O2O Showroom 3 Lantai Semarang',
    title: 'Mahakarya Batik Smile',
    subtitle: 'Ragam Corak Busana Nusantara',
    description: 'Temukan ratusan busana batik siap pakai, blus wanita, tunik, kemeja furing, hingga layanan jahit kustom tanpa minimal order.',
    ctaText: 'Lihat Semua Katalog',
    ctaLink: '/collections/shop',
    image: 'https://cdn.shopify.com/s/files/1/0813/3224/0441/collections/banner_shop_all_1786007684766.jpg?v=1786007711'
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <section 
      className="relative w-full h-[88vh] lg:h-[92vh] overflow-hidden bg-[#0D0D0D] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with Cross-Fade */}
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center transform transition-transform duration-[8000ms] ease-out"
            style={{ transform: idx === current ? 'scale(1.03)' : 'scale(1.08)' }}
          />

          {/* Luxury Editorial Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent hidden lg:block" />
        </div>
      ))}

      {/* Slide Content (Editorial Layout) */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end lg:justify-center pb-24 lg:pb-0">
        <div className="max-w-3xl text-left">
          
          {/* Gold Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#C5A059]/40 mb-4 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#C5A059]">
              {SLIDES[current].tierBadge}
            </span>
          </div>

          {/* Subtitle Tagline */}
          <p className="font-sans text-xs lg:text-sm uppercase tracking-[0.25em] text-[#E0C58A] font-semibold mb-2">
            {SLIDES[current].tagline}
          </p>

          {/* Main Title (Cormorant Garamond Couture Headline) */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-white mb-2 leading-[1.12] tracking-tight">
            {SLIDES[current].title}
          </h1>
          <h2 className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#FAF7F2] mb-5 font-light leading-[1.25]">
            {SLIDES[current].subtitle}
          </h2>

          {/* Description */}
          <p className="font-sans text-xs sm:text-sm text-white/90 leading-[1.65] max-w-xl mb-8 line-clamp-3 font-light">
            {SLIDES[current].description}
          </p>

          {/* Luxury CTA Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={SLIDES[current].ctaLink}
              className="inline-flex items-center justify-center px-8 py-4 bg-[#9E4719] hover:bg-[#7A320C] text-white font-sans text-xs uppercase tracking-[0.22em] font-bold transition-all duration-300 shadow-2xl hover:shadow-[#9E4719]/40 hover:-translate-y-0.5 rounded"
            >
              {SLIDES[current].ctaText}
              <svg className="ml-2.5 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="/pages/tentang-kami"
              className="inline-flex items-center justify-center px-7 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 font-sans text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 hover:-translate-y-0.5 rounded"
            >
              Filosofi Brand
            </a>
          </div>

        </div>
      </div>

      {/* Navigation Arrows (Desktop) */}
      <button
        onClick={prevSlide}
        aria-label="Slide Sebelumnya"
        className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 bg-black/40 hover:bg-[#9E4719] hover:border-[#9E4719] text-white items-center justify-center backdrop-blur-md transition-all duration-300"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        aria-label="Slide Berikutnya"
        className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 bg-black/40 hover:bg-[#9E4719] hover:border-[#9E4719] text-white items-center justify-center backdrop-blur-md transition-all duration-300"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Slide Indicators & Counter (01 / 04) */}
      <div className="absolute bottom-8 left-0 w-full z-30 flex justify-center items-center gap-4">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(idx)}
            aria-label={`Pindah ke slide ${slide.title}`}
            className="group flex items-center gap-2 py-2"
          >
            <div
              className={`h-[2px] transition-all duration-500 ${
                idx === current ? 'w-10 bg-[#C5A059]' : 'w-3 bg-white/30 group-hover:bg-white/60'
              }`}
            />
            {idx === current && (
              <span className="font-sans text-[11px] text-[#C5A059] tracking-[0.2em] font-semibold">
                0{idx + 1}
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
