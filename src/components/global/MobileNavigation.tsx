import React, { useState, useEffect } from 'react';
import { cartStore, type CartState } from '../../lib/cartStore';

const EXACT_SHOPIFY_MENU = [
  {
    category: '3 Kasta Sarimbit',
    mainHref: '/collections/sarimbit-batik-couple',
    items: [
      { name: '1. Sarimbit Mahakarya Heritage (Sutra Prada)', href: '/collections/sarimbit-mahakarya-heritage', badge: 'Tier 1' },
      { name: '2. Sarimbit Signature Elegance (Tenun Dobby)', href: '/collections/sarimbit-signature-elegance', badge: 'Tier 2' },
      { name: '3. Sarimbit Essential Daily (Katun Primisima)', href: '/collections/sarimbit-essential-daily', badge: 'Tier 3' }
    ]
  },
  {
    category: 'Batik Wanita',
    mainHref: '/collections/batik-wanita',
    items: [
      { name: 'Semua Koleksi Batik Wanita', href: '/collections/batik-wanita', badge: 'Utama' },
      { name: 'Blus Batik Wanita', href: '/collections/blus-batik-wanita' },
      { name: 'Outer Tunik Batik', href: '/collections/outer-tunik-batik' },
      { name: 'Tunik Batik Wanita', href: '/collections/tunik-batik-wanita', badge: 'Favorit' },
      { name: 'Dress Batik Wanita', href: '/collections/dress-batik-wanita' },
      { name: 'Gamis Batik Wanita', href: '/collections/gamis-batik-wanita' },
      { name: 'Outer Batik Wanita', href: '/collections/outer-batik-wanita' },
      { name: 'Blazer Batik Wanita', href: '/collections/blazer-batik-wanita' },
      { name: 'Inner Busana Batik', href: '/collections/inner-busana-batik' },
      { name: 'Kebaya Batik Modern', href: '/collections/kebaya-batik-modern' },
      { name: 'Jarik & Kain Batik', href: '/collections/jarik-kain-batik' },
      { name: 'Daster Batik Solo', href: '/collections/daster-batik-solo' }
    ]
  },
  {
    category: 'Batik Pria',
    mainHref: '/collections/batik-pria',
    items: [
      { name: 'Semua Koleksi Batik Pria', href: '/collections/batik-pria', badge: 'Utama' },
      { name: 'Kemeja Batik Lengan Panjang', href: '/collections/kemeja-batik-lengan-panjang', badge: 'Furing Hero' },
      { name: 'Hem Batik Lengan Pendek', href: '/collections/hem-batik-lengan-pendek' },
      { name: 'Celana Batik Pria', href: '/collections/celana-batik-pria' }
    ]
  },
  {
    category: 'Batik Anak',
    mainHref: '/collections/batik-anak',
    items: [
      { name: 'Semua Koleksi Batik Anak', href: '/collections/batik-anak', badge: 'Utama' },
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
  },
  {
    category: 'Katalog',
    mainHref: '/collections/shop',
    items: [
      { name: 'Semua Katalog Produk', href: '/collections/shop', badge: 'Semua' },
      { name: 'Kain & Bahan Jahit', href: '/collections/kain-batik-bahan-jahit' },
      { name: 'Aksesoris & Oleh-Oleh', href: '/collections/aksesoris-oleh-oleh-semarang' }
    ]
  }
];

export default function MobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('3 Kasta Sarimbit');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const unsubscribe = cartStore.subscribe((state: CartState) => {
      setCartCount(state.totalQuantity || 0);
    });
    return () => unsubscribe();
  }, []);

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search-modal'));
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-40 bg-[#FAF7F2]/95 backdrop-blur-xl border-t border-[#161616]/10 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex justify-around items-center h-16 px-2">
          
          <a href="/" className="flex flex-col items-center gap-1 text-[#161616] hover:text-[#9E4719] transition-colors py-1 px-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="text-[10px] font-sans font-medium">Beranda</span>
          </a>
          
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="flex flex-col items-center gap-1 text-[#161616] hover:text-[#9E4719] transition-colors py-1 px-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect width="7" height="7" x="3" y="3" rx="1"/>
              <rect width="7" height="7" x="14" y="3" rx="1"/>
              <rect width="7" height="7" x="14" y="14" rx="1"/>
              <rect width="7" height="7" x="3" y="14" rx="1"/>
            </svg>
            <span className="text-[10px] font-sans font-medium">Kategori</span>
          </button>

          {/* Search Trigger Button */}
          <button 
            onClick={openSearch} 
            className="flex flex-col items-center gap-1 text-[#161616] hover:text-[#9E4719] transition-colors py-1 px-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <span className="text-[10px] font-sans font-medium">Cari</span>
          </button>

          {/* Direct Link to /cart Page */}
          <a 
            href="/cart" 
            className="flex flex-col items-center gap-1 text-[#9E4719] transition-colors py-1 px-2 relative"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-1 bg-[#9E4719] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
            <span className="text-[10px] font-sans font-bold">Tas</span>
          </a>

          <a 
            href="https://wa.me/6281390888809?text=Halo%20Batik%20Smile,%20saya%20ingin%20konsultasi%20pemesanan%20batik" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-[#25D366] transition-colors py-1 px-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span className="text-[10px] font-sans font-medium">WhatsApp</span>
          </a>

        </div>
      </div>

      {/* Dark Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 backdrop-blur-sm ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Bottom Sheet Menu */}
      <div 
        className={`lg:hidden fixed bottom-0 left-0 w-full h-[88vh] bg-[#FAF7F2] z-50 transition-transform duration-400 ease-out transform rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden ${
          isMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag Handle */}
        <div 
          className="flex flex-col items-center p-3 relative z-10 cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="w-12 h-1.5 bg-[#9E4719]/40 rounded-full mb-1"></div>
          <span className="text-[9px] uppercase tracking-widest text-[#161616]/40 font-semibold">Tutup</span>
        </div>

        {/* Menu Header */}
        <div className="px-6 pb-4 border-b border-[#161616]/10 flex items-center justify-between relative z-10">
          <div>
            <h2 className="font-serif text-2xl text-[#161616]">Kategori Koleksi</h2>
            <p className="font-sans text-xs text-[#9E4719]">Batik Smile Nusantara Sejak 2007</p>
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="w-8 h-8 rounded-full bg-[#9E4719]/10 text-[#9E4719] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Category Pills Tab Bar */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none border-b border-[#161616]/10 relative z-10 bg-[#FAF7F2]">
          {EXACT_SHOPIFY_MENU.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              className={`px-4 py-2 rounded-full font-sans text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.category 
                  ? 'bg-[#9E4719] text-white shadow-sm' 
                  : 'bg-black/5 text-[#161616]/80 hover:bg-[#9E4719]/10'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Menu List of Active Category */}
        <div className="flex-1 overflow-y-auto px-6 py-4 pb-28 relative z-10 divide-y divide-[#161616]/10">
          {EXACT_SHOPIFY_MENU.find(c => c.category === activeCategory)?.items.map((item, idx) => (
            <a 
              key={idx} 
              href={item.href}
              className="py-3.5 flex justify-between items-center group active:text-[#9E4719]"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="font-serif text-base text-[#161616] group-hover:text-[#9E4719] transition-colors">
                {item.name}
              </span>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-[9px] uppercase tracking-wider bg-[#9E4719] text-white px-2 py-0.5 font-bold rounded">
                    {item.badge}
                  </span>
                )}
                <svg className="text-[#9E4719]/60 group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </a>
          ))}

          {/* Custom Tailoring Banner */}
          <div className="pt-6">
            <div className="bg-[#9E4719]/5 p-5 rounded-2xl border border-[#9E4719]/15 text-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#9E4719] font-bold block mb-1">
                Private Atelier
              </span>
              <h4 className="font-serif text-lg text-[#161616] mb-2">
                Jahit Seragam Kustom Tanpa Minimal Order
              </h4>
              <p className="font-sans text-xs text-[#161616]/70 mb-4 leading-relaxed font-light">
                Konsultasikan kebutuhan seragam keluarga atau seragam kantor dengan desainer kami.
              </p>
              <a 
                href="https://wa.me/6281390888809?text=Halo%20Batik%20Smile,%20saya%20ingin%20konsultasi%20jahit%20seragam%20keluarga"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#9E4719] text-white py-2.5 px-6 rounded-full font-sans text-xs font-bold uppercase tracking-wider shadow"
              >
                Konsultasi WhatsApp
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
