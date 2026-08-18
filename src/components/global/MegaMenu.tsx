import React, { useState, useRef } from 'react';

interface SubCategory {
  name: string;
  href: string;
  badge?: string;
}

interface MenuSection {
  title: string;
  handle: string;
  badge?: string;
  image: string;
  description: string;
  allHref: string;
  subcategories: SubCategory[];
}

const SHOPIFY_MENU: Record<string, MenuSection> = {
  'Batik Wanita': {
    title: 'Koleksi Busana Wanita',
    handle: 'batik-wanita',
    badge: '11 Kategori',
    image: 'https://cdn.shopify.com/s/files/1/0813/3224/0441/collections/banner_batik_wanita_1785995697669_9a5b3a31-645a-4386-be86-42d87e07663e.jpg?v=1786004400',
    description: 'Ragam busana batik wanita anggun dari blus modern, tunik, gamis primisima, hingga kebaya encim brokat.',
    allHref: '/collections/batik-wanita',
    subcategories: [
      { name: 'Blus Batik Wanita', href: '/collections/blus-batik-wanita' },
      { name: 'Outer Tunik Batik', href: '/collections/outer-tunik-batik' },
      { name: 'Tunik Batik Wanita', href: '/collections/tunik-batik-wanita', badge: 'Favorit' },
      { name: 'Dress Batik Wanita', href: '/collections/dress-batik-wanita' },
      { name: 'Gamis Batik Wanita', href: '/collections/gamis-batik-wanita' },
      { name: 'Outer Batik Wanita', href: '/collections/outer-batik-wanita' },
      { name: 'Blazer Batik Wanita', href: '/collections/blazer-batik-wanita', badge: 'Formal' },
      { name: 'Inner Busana Batik', href: '/collections/inner-busana-batik' },
      { name: 'Kebaya Batik Modern', href: '/collections/kebaya-batik-modern' },
      { name: 'Jarik & Kain Batik', href: '/collections/jarik-kain-batik' },
      { name: 'Daster Batik Solo', href: '/collections/daster-batik-solo' }
    ]
  },
  'Batik Pria': {
    title: 'Koleksi Busana Pria',
    handle: 'batik-pria',
    badge: 'Lapis Furing Hero',
    image: 'https://cdn.shopify.com/s/files/1/0813/3224/0441/collections/banner_batik_pria_1785995886986_54ad5168-3619-4b88-9abc-ad7b8721b86f.jpg?v=1786006769',
    description: 'Kemeja batik pria furing halus, hem santai motif dobby, dan celana panjang sirwal berwibawa.',
    allHref: '/collections/batik-pria',
    subcategories: [
      { name: 'Kemeja Batik Lengan Panjang', href: '/collections/kemeja-batik-lengan-panjang', badge: 'Best Seller' },
      { name: 'Hem Batik Lengan Pendek', href: '/collections/hem-batik-lengan-pendek' },
      { name: 'Celana Batik Pria', href: '/collections/celana-batik-pria' }
    ]
  },
  'Sarimbit (3 Kasta)': {
    title: '3 Kasta Sarimbit Keluarga',
    handle: 'sarimbit-batik-couple',
    badge: '3 Kasta Utama',
    image: 'https://cdn.shopify.com/s/files/1/0813/3224/0441/collections/banner_batik_couple_1785995932731_51f1e349-35df-4896-b08d-6290f84897d9.jpg?v=1786005734',
    description: 'Tiga tingkatan mahakarya sarimbit untuk pernikahan, pesta, dan kebersamaan keluarga.',
    allHref: '/collections/sarimbit-batik-couple',
    subcategories: [
      { name: '1. Sarimbit Mahakarya Heritage (Sutra Prada)', href: '/collections/sarimbit-mahakarya-heritage', badge: 'Tier 1 • Sutra' },
      { name: '2. Sarimbit Signature Elegance (Tenun Dobby)', href: '/collections/sarimbit-signature-elegance', badge: 'Tier 2 • Dobby' },
      { name: '3. Sarimbit Essential Daily (Katun Primisima)', href: '/collections/sarimbit-essential-daily', badge: 'Tier 3 • Katun' }
    ]
  },
  'Batik Anak': {
    title: 'Koleksi Batik Anak',
    handle: 'batik-anak',
    badge: '10 Kategori Anak',
    image: 'https://cdn.shopify.com/s/files/1/0813/3224/0441/collections/banner_batik_anak_1785995908867_72946c1f-4bb2-4024-8785-5df1807d7224.jpg?v=1786004481',
    description: 'Busana batik nyaman untuk putra & putri tercinta serta setelan adat Jawa tradisional.',
    allHref: '/collections/batik-anak',
    subcategories: [
      { name: 'Blus Batik Anak Cewek', href: '/collections/blus-batik-anak-cewek' },
      { name: 'Gamis Batik Anak', href: '/collections/gamis-batik-anak' },
      { name: 'Dress Batik Anak', href: '/collections/dress-batik-anak' },
      { name: 'Kebaya Batik Anak', href: '/collections/kebaya-batik-anak' },
      { name: 'Jarik Anak', href: '/collections/jarik-anak' },
      { name: 'Babydoll Batik Anak', href: '/collections/babydoll-batik-anak' },
      { name: 'Hem Batik Anak Cowo', href: '/collections/hem-batik-anak-cowo' },
      { name: 'Surjan Batik Anak', href: '/collections/surjan-batik-anak' },
      { name: 'Blangkon Tradisional', href: '/collections/blangkon-tradisional', badge: 'Adat Jawa' },
      { name: 'Sarung Batik Anak', href: '/collections/sarung-batik-anak' }
    ]
  }
};

export default function MegaMenu() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMouseEnterTab = (tabName: string) => {
    clearCloseTimeout();
    setActiveTab(tabName);
  };

  const handleMouseLeaveTab = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveTab(null);
    }, 220);
  };

  const handleMouseEnterDropdown = () => {
    clearCloseTimeout();
  };

  const handleMouseLeaveDropdown = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveTab(null);
    }, 220);
  };

  const handleTabClick = (e: React.MouseEvent, tabName: string, allHref: string) => {
    if (activeTab === tabName) {
      window.location.href = allHref;
    } else {
      setActiveTab(tabName);
    }
  };

  const activeSection = activeTab ? SHOPIFY_MENU[activeTab] : null;
  const isSarimbit = activeTab === 'Sarimbit (3 Kasta)';

  return (
    <div 
      className="relative flex items-center justify-center h-full"
      onMouseLeave={handleMouseLeaveTab}
    >
      {/* Overlay Backdrop Blur */}
      <div 
        className={`fixed inset-0 top-[72px] lg:top-[80px] bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-300 ease-out pointer-events-none ${
          activeTab ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      <nav className="h-full flex items-center justify-center gap-2 xl:gap-5 relative z-40">
        {Object.keys(SHOPIFY_MENU).map((tabName) => {
          const section = SHOPIFY_MENU[tabName];
          const isActive = activeTab === tabName;
          const displayName = tabName === 'Sarimbit (3 Kasta)' ? 'Sarimbit' : tabName;
          return (
            <div 
              key={tabName} 
              className="h-full flex items-center" 
              onMouseEnter={() => handleMouseEnterTab(tabName)}
            >
              <button
                type="button"
                onClick={(e) => handleTabClick(e, tabName, section.allHref)}
                className={`font-sans text-[11px] xl:text-[12px] uppercase tracking-[0.14em] font-semibold transition-all py-6 px-2.5 flex items-center gap-1.5 whitespace-nowrap group ${
                  isActive ? 'text-[#9E4719]' : 'text-[#161616] hover:text-[#9E4719]'
                }`}
              >
                <span className="relative">
                  {displayName}
                  <span className={`absolute -bottom-1 left-0 w-full h-[1.5px] bg-[#9E4719] transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </span>
                <svg 
                  className={`w-3 h-3 transition-transform duration-300 ${isActive ? 'rotate-180 text-[#9E4719]' : 'text-[#161616]/30'}`} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          );
        })}

        <a 
          href="/collections/shop" 
          className="font-sans text-[11px] xl:text-[12px] uppercase tracking-[0.14em] font-semibold text-[#161616] hover:text-[#9E4719] transition-all py-6 px-2.5 whitespace-nowrap relative group"
        >
          <span>Katalog</span>
          <span className="absolute bottom-5 left-2.5 right-2.5 h-[1.5px] bg-[#9E4719] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </a>
      </nav>

      {/* Hover Bridge */}
      {activeTab && (
        <div 
          className="fixed top-[65px] lg:top-[75px] left-0 w-full h-5 z-40 bg-transparent"
          onMouseEnter={handleMouseEnterDropdown}
        />
      )}

      {/* Mega Menu Dropdown Panel */}
      <div 
        className={`fixed top-[72px] lg:top-[80px] left-1/2 -translate-x-1/2 w-[min(960px,94vw)] bg-[#FAF7F2] border border-[#161616]/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out overflow-hidden flex origin-top z-50 rounded-b-2xl ${
          activeTab ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible pointer-events-none'
        }`}
        onMouseEnter={handleMouseEnterDropdown}
        onMouseLeave={handleMouseLeaveDropdown}
      >
        {activeSection && (
          <>
            {/* Sisi Kiri: Showcase Banner */}
            <div className="w-[320px] bg-[#141414] relative p-7 flex flex-col justify-end group overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
              <img 
                src={activeSection.image} 
                alt={activeSection.title} 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-60"
              />

              <div className="relative z-20">
                {activeSection.badge && (
                  <span className="text-[#C5A059] text-[9px] font-bold tracking-[0.25em] uppercase mb-2 inline-block px-2.5 py-1 bg-black/70 border border-[#C5A059]/40 backdrop-blur-sm rounded">
                    {activeSection.badge}
                  </span>
                )}
                <h3 className="text-[#FAF7F2] font-serif text-2xl mb-2 leading-tight">
                  {activeSection.title}
                </h3>
                <p className="text-[#FAF7F2]/70 text-xs font-sans leading-relaxed mb-4 line-clamp-3">
                  {activeSection.description}
                </p>
                <a 
                  href={activeSection.allHref} 
                  onClick={() => setActiveTab(null)}
                  className="inline-flex items-center text-[#C5A059] border-b border-[#C5A059] pb-0.5 text-xs uppercase tracking-widest font-semibold hover:text-white transition-colors"
                >
                  Buka Koleksi {activeTab.replace(' (3 Kasta)', '')}
                  <svg className="w-3.5 h-3.5 ml-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Sisi Kanan: Subkategori Grid */}
            <div className="flex-1 p-7 bg-[#FAF7F2] flex flex-col justify-between">
              <div>
                <div className="border-b border-[#161616]/10 pb-3 mb-4 flex items-center justify-between">
                  <span className="font-serif text-lg text-[#161616] font-medium">
                    {isSarimbit ? 'Pilihan 3 Kasta Sarimbit' : `Subkategori ${activeTab}`}
                  </span>
                  <a 
                    href={activeSection.allHref} 
                    onClick={() => setActiveTab(null)}
                    className="text-xs font-sans text-[#9E4719] hover:underline font-semibold tracking-wider uppercase"
                  >
                    Buka Semua →
                  </a>
                </div>

                {isSarimbit ? (
                  // Khusus Sarimbit: Tampilan 3 Kasta
                  <div className="space-y-3">
                    {activeSection.subcategories.map((sub, idx) => (
                      <a
                        key={idx}
                        href={sub.href}
                        onClick={() => setActiveTab(null)}
                        className="group flex items-center justify-between p-3.5 rounded-lg border border-[#161616]/10 bg-white hover:border-[#9E4719] hover:bg-[#9E4719]/5 transition-all shadow-sm"
                      >
                        <div>
                          <span className="font-serif text-base font-medium text-[#161616] group-hover:text-[#9E4719] block transition-colors">
                            {sub.name}
                          </span>
                          <span className="text-[11px] font-sans text-[#161616]/60 block mt-0.5">
                            {idx === 0 ? 'Kemewahan sutra ATBM & prada emas murni untuk resepsi' : idx === 1 ? 'Sentuhan tenun dobby & furing hero untuk pesta' : 'Katun primisima sejuk & nyaman untuk sekeluarga'}
                          </span>
                        </div>
                        {sub.badge && (
                          <span className="text-[9px] uppercase tracking-wider bg-[#9E4719] text-white px-2 py-1 font-bold rounded flex-shrink-0 ml-3">
                            {sub.badge}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                ) : (
                  // Kategori Biasa: 2 Kolom Grid
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 max-h-[300px] overflow-y-auto pr-2">
                    {activeSection.subcategories.map((sub, idx) => (
                      <a
                        key={idx}
                        href={sub.href}
                        onClick={() => setActiveTab(null)}
                        className="group flex items-center justify-between py-1.5 px-2.5 rounded hover:bg-[#9E4719]/10 transition-colors cursor-pointer"
                      >
                        <span className="font-sans text-xs text-[#161616]/85 group-hover:text-[#9E4719] font-medium group-hover:translate-x-1 transition-transform truncate">
                          {sub.name}
                        </span>
                        {sub.badge && (
                          <span className="text-[8px] uppercase tracking-wider bg-[#9E4719] text-white px-1.5 py-0.5 font-bold rounded flex-shrink-0 ml-1">
                            {sub.badge}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Custom Note */}
              <div className="mt-5 pt-3 border-t border-[#161616]/10 flex items-center justify-between bg-[#9E4719]/5 p-3 rounded-lg border border-[#9E4719]/15">
                <span className="text-[11px] font-sans text-[#161616]">
                  <strong className="text-[#9E4719]">Private Atelier:</strong> Jahit kustom & seragam tanpa minimal order
                </span>
                <a 
                  href="https://wa.me/628123456789?text=Halo%20Batik%20Smile,%20saya%20ingin%20konsultasi%20jahit%20seragam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#9E4719] hover:underline whitespace-nowrap ml-2"
                >
                  Konsultasi WA →
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
