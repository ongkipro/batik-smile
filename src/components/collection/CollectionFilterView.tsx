import React, { useState, useMemo } from 'react';

export interface ProductItem {
  id: string;
  title: string;
  handle: string;
  tags?: string[];
  productType?: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
}

interface Props {
  initialProducts: ProductItem[];
  collectionTitle: string;
  collectionHandle: string;
  theme?: 'mahakarya' | 'signature' | 'essential' | 'default';
}

export default function CollectionFilterView({
  initialProducts,
  collectionTitle,
  collectionHandle,
  theme = 'default'
}: Props) {
  const detectedTheme = theme !== 'default' 
    ? theme 
    : collectionHandle.includes('mahakarya') 
      ? 'mahakarya' 
      : collectionHandle.includes('signature') 
        ? 'signature' 
        : collectionHandle.includes('essential') 
          ? 'essential' 
          : 'default';

  const defaultTier = detectedTheme === 'mahakarya' 
    ? 'mahakarya' 
    : detectedTheme === 'signature' 
      ? 'signature' 
      : detectedTheme === 'essential' 
        ? 'essential' 
        : 'all';

  const [selectedTier, setSelectedTier] = useState<string>(defaultTier);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Determine Tier from tags & title
  const getProductTier = (product: ProductItem): 'mahakarya' | 'signature' | 'essential' => {
    const text = `${product.title} ${(product.tags || []).join(' ')}`.toLowerCase();
    if (text.includes('sutra') || text.includes('mahakarya') || text.includes('tier 1')) return 'mahakarya';
    if (text.includes('dobby') || text.includes('signature') || text.includes('tier 2')) return 'signature';
    return 'essential';
  };

  // Determine Material Label
  const getMaterialLabel = (product: ProductItem): string => {
    const text = `${product.title} ${(product.tags || []).join(' ')}`.toLowerCase();
    if (text.includes('sutra')) return 'Sutra Prada Emas';
    if (text.includes('dobby')) return 'Tenun Dobby';
    if (text.includes('primisima') || text.includes('katun')) return 'Katun Primisima';
    return 'Batik Nusantara';
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Tier Filter
        if (selectedTier !== 'all') {
          const tier = getProductTier(p);
          if (tier !== selectedTier) return false;
        }

        // Category Filter
        if (selectedCategory !== 'all') {
          const text = `${p.title} ${(p.tags || []).join(' ')}`.toLowerCase();
          if (selectedCategory === 'sarimbit' && !text.includes('sarimbit') && !text.includes('couple') && !text.includes('pasangan')) return false;
          if (selectedCategory === 'pria' && !text.includes('pria') && !text.includes('kemeja') && !text.includes('hem') && !text.includes('celana')) return false;
          if (selectedCategory === 'wanita' && !text.includes('wanita') && !text.includes('blus') && !text.includes('tunik') && !text.includes('gamis') && !text.includes('kebaya') && !text.includes('daster')) return false;
          if (selectedCategory === 'anak' && !text.includes('anak') && !text.includes('surjan') && !text.includes('blangkon')) return false;
        }

        // Price Range Filter
        const price = parseInt(p.priceRange?.minVariantPrice?.amount || '0');
        if (selectedPriceRange === 'under-250' && price >= 250000) return false;
        if (selectedPriceRange === '250-500' && (price < 250000 || price > 500000)) return false;
        if (selectedPriceRange === 'above-500' && price <= 500000) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchTag = (p.tags || []).some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchTag) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = parseInt(a.priceRange?.minVariantPrice?.amount || '0');
        const priceB = parseInt(b.priceRange?.minVariantPrice?.amount || '0');

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        return 0; // featured default
      });
  }, [initialProducts, selectedTier, selectedCategory, selectedPriceRange, sortBy, searchQuery]);

  const activeFilterCount = (selectedTier !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedPriceRange !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedTier('all');
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  // Theme-specific UI Tokens
  const isMahakaryaTheme = detectedTheme === 'mahakarya';
  const isSignatureTheme = detectedTheme === 'signature';
  const isEssentialTheme = detectedTheme === 'essential';

  const styles = isMahakaryaTheme
    ? {
        bodyBg: 'bg-[#0D0D0D] text-[#FAF7F2]',
        filterBarBg: 'bg-[#141414]/95 border-[#C5A059]/30 text-white',
        pillDefault: 'bg-[#1C1C1C] text-amber-200/90 border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#2A261C]',
        pillActive: 'bg-gradient-to-r from-[#C5A059] to-[#9A7730] text-[#0A0907] border-[#C5A059] shadow-lg font-extrabold',
        searchBg: 'bg-[#1E1E1E] text-white border-[#C5A059]/30 focus:border-[#C5A059] placeholder-amber-200/40',
        selectBg: 'bg-[#1E1E1E] text-[#FAF7F2] border-[#C5A059]/30 hover:border-[#C5A059]',
        cardBg: 'bg-[#161616] border-[#C5A059]/30 hover:border-[#C5A059] hover:shadow-[0_0_30px_rgba(197,160,89,0.22)]',
        cardTitle: 'text-white font-serif group-hover:text-[#E0C58A]',
        cardMaterial: 'text-[#C5A059]',
        cardPrice: 'text-[#E0C58A]',
        cardPriceBorder: 'border-[#C5A059]/20',
        hoverBtn: 'bg-gradient-to-r from-[#C5A059] to-[#9A7730] text-[#0A0907]',
        countColor: 'text-amber-200/80',
        activeBadgeBg: 'bg-[#1E1E1E] border-[#C5A059]/40 text-amber-200'
      }
    : isSignatureTheme
      ? {
          bodyBg: 'bg-[#060D1A] text-white',
          filterBarBg: 'bg-[#0A162B]/95 border-blue-500/30 text-white',
          pillDefault: 'bg-[#0E1F3B] text-blue-200/90 border-blue-400/30 hover:border-blue-400 hover:bg-[#152B52]',
          pillActive: 'bg-[#1E3A8A] text-white border-blue-400 shadow-lg font-extrabold',
          searchBg: 'bg-[#0E1F3B] text-white border-blue-400/30 focus:border-blue-400 placeholder-blue-300/40',
          selectBg: 'bg-[#0E1F3B] text-white border-blue-400/30 hover:border-blue-400',
          cardBg: 'bg-[#0B1528] border-blue-500/30 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(30,58,138,0.35)]',
          cardTitle: 'text-white font-sans group-hover:text-blue-300',
          cardMaterial: 'text-blue-300',
          cardPrice: 'text-white',
          cardPriceBorder: 'border-blue-500/20',
          hoverBtn: 'bg-[#1E3A8A] text-white',
          countColor: 'text-blue-200/80',
          activeBadgeBg: 'bg-[#0E1F3B] border-blue-400/40 text-blue-200'
        }
      : {
          bodyBg: 'bg-[#FAF7F2] text-[#121212]',
          filterBarBg: 'bg-white/95 border-neutral-200 text-[#121212]',
          pillDefault: 'bg-white text-[#121212] border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50',
          pillActive: 'bg-[#9E4719] text-white border-[#9E4719] shadow-sm font-extrabold',
          searchBg: 'bg-neutral-100 text-[#121212] border-neutral-200 focus:border-[#9E4719] placeholder-neutral-400',
          selectBg: 'bg-white text-[#121212] border-neutral-200 hover:border-neutral-400',
          cardBg: 'bg-white border-[#161616]/10 hover:border-[#9E4719]/40 hover:shadow-md',
          cardTitle: 'text-[#121212] font-sans group-hover:text-[#9E4719]',
          cardMaterial: 'text-[#9E4719]',
          cardPrice: 'text-[#9E4719]',
          cardPriceBorder: 'border-neutral-100',
          hoverBtn: 'bg-[#9E4719] text-white',
          countColor: 'text-neutral-600',
          activeBadgeBg: 'bg-neutral-100 border-neutral-300 text-[#121212]'
        };

  return (
    <div className={styles.bodyBg}>
      
      {/* FILTER & SORT CONTROLS BAR */}
      <div className={`sticky top-16 lg:top-20 z-30 w-full py-3.5 backdrop-blur-md border-b shadow-sm transition-all ${styles.filterBarBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Left: Quick Tier Pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 md:pb-0">
              <span className={`text-xs uppercase tracking-wider font-bold mr-1 hidden sm:inline-block ${isMahakaryaTheme ? 'text-amber-400' : isSignatureTheme ? 'text-blue-300' : 'text-neutral-500'}`}>
                Kasta:
              </span>

              {[
                { id: 'all', label: 'Semua Kasta' },
                { id: 'mahakarya', label: 'Tier 1: Mahakarya', dot: 'bg-[#C5A059]' },
                { id: 'signature', label: 'Tier 2: Signature', dot: 'bg-blue-600' },
                { id: 'essential', label: 'Tier 3: Essential', dot: 'bg-[#9E4719]' }
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`h-9 px-3.5 rounded-full font-sans text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                    selectedTier === tier.id
                      ? styles.pillActive
                      : styles.pillDefault
                  }`}
                >
                  {tier.dot && <span className={`w-2 h-2 rounded-full ${tier.dot}`} />}
                  <span>{tier.label}</span>
                </button>
              ))}
            </div>

            {/* Right: Search, Filter Trigger, Sort Select */}
            <div className="flex items-center gap-2.5 justify-between md:justify-end">
              
              {/* Live Search */}
              <div className="relative w-44 sm:w-56">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari dalam koleksi..."
                  className={`w-full h-9 pl-8 pr-3 rounded-xl text-xs font-sans outline-none transition-all border ${styles.searchBg}`}
                />
                <svg className="w-3.5 h-3.5 absolute left-2.5 top-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-xs font-bold opacity-60 hover:opacity-100">
                    ✕
                  </button>
                )}
              </div>

              {/* Mobile Filter Sheet Button */}
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className={`h-9 px-3.5 rounded-xl font-sans text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeFilterCount > 0
                    ? styles.pillActive
                    : styles.pillDefault
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-extrabold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Select */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`h-9 pl-3 pr-8 rounded-xl text-xs font-sans font-bold outline-none cursor-pointer appearance-none transition-colors border ${styles.selectBg}`}
                >
                  <option value="featured" className="bg-[#1E1E1E] text-white">Rekomendasi</option>
                  <option value="price-asc" className="bg-[#1E1E1E] text-white">Harga: Termurah</option>
                  <option value="price-desc" className="bg-[#1E1E1E] text-white">Harga: Tertinggi</option>
                  <option value="title-asc" className="bg-[#1E1E1E] text-white">Nama: A - Z</option>
                </select>
                <svg className="w-3.5 h-3.5 absolute right-2.5 top-3 pointer-events-none opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

            </div>

          </div>

          {/* Secondary Filter Dropdown Drawer */}
          {isMobileFilterOpen && (
            <div className="mt-3 pt-3 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
              
              {/* Category Filter */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-75 block mb-1">
                  Kategori Busana
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'sarimbit', label: 'Sarimbit / Pasangan' },
                    { id: 'pria', label: 'Kemeja & Hem Pria' },
                    { id: 'wanita', label: 'Blus & Gamis Wanita' },
                    { id: 'anak', label: 'Anak-Anak' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border ${
                        selectedCategory === cat.id
                          ? styles.pillActive
                          : styles.pillDefault
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-75 block mb-1">
                  Rentang Harga
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'under-250', label: '< Rp 250rb' },
                    { id: '250-500', label: 'Rp 250rb - 500rb' },
                    { id: 'above-500', label: '> Rp 500rb' }
                  ].map((price) => (
                    <button
                      key={price.id}
                      onClick={() => setSelectedPriceRange(price.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border ${
                        selectedPriceRange === price.id
                          ? styles.pillActive
                          : styles.pillDefault
                      }`}
                    >
                      {price.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filter Summary & Reset */}
              <div className="flex flex-col justify-end items-start sm:items-end">
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 text-xs font-bold text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Reset Semua Filter ({activeFilterCount})
                </button>
              </div>

            </div>
          )}

          {/* Active Filter Badges */}
          {activeFilterCount > 0 && (
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <span className="text-xs opacity-75 font-medium">Filter Aktif:</span>

              {selectedTier !== 'all' && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles.activeBadgeBg}`}>
                  Kasta: {selectedTier.toUpperCase()}
                  <button onClick={() => setSelectedTier('all')} className="opacity-60 hover:opacity-100">✕</button>
                </span>
              )}

              {selectedCategory !== 'all' && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles.activeBadgeBg}`}>
                  Kategori: {selectedCategory.toUpperCase()}
                  <button onClick={() => setSelectedCategory('all')} className="opacity-60 hover:opacity-100">✕</button>
                </span>
              )}

              {selectedPriceRange !== 'all' && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles.activeBadgeBg}`}>
                  Harga: {selectedPriceRange}
                  <button onClick={() => setSelectedPriceRange('all')} className="opacity-60 hover:opacity-100">✕</button>
                </span>
              )}

              {searchQuery && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles.activeBadgeBg}`}>
                  Kata Kunci: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="opacity-60 hover:opacity-100">✕</button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-amber-400 hover:underline ml-1"
              >
                Hapus Semua
              </button>
            </div>
          )}

        </div>
      </div>

      {/* RESULT COUNT */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex justify-between items-center text-xs sm:text-sm ${styles.countColor}`}>
        <span className="font-medium">
          Menampilkan <strong>{filteredProducts.length}</strong> karya busana
          {filteredProducts.length !== initialProducts.length && ` (dari total ${initialProducts.length} produk)`}
        </span>
      </div>

      {/* THEMED PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 opacity-50">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-semibold mb-2">Tidak Ada Produk Sesuai Filter</h3>
            <p className="font-sans text-xs sm:text-sm opacity-70 mb-6">
              Silakan atur ulang kriteria kasta, kategori, atau rentang harga untuk melihat koleksi lainnya.
            </p>
            <button
              onClick={resetAllFilters}
              className={`px-6 py-3 font-sans text-xs uppercase tracking-wider font-bold rounded-xl shadow-md transition-all cursor-pointer ${styles.pillActive}`}
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const prodImg = product.images?.edges?.[0]?.node?.url || "https://cdn.shopify.com/s/files/1/0813/3224/0441/collections/banner_shop_all_1786007684766.jpg?v=1786007711";
              const minPrice = parseInt(product.priceRange?.minVariantPrice?.amount || '0');
              const comparePrice = parseInt(product.compareAtPriceRange?.maxVariantPrice?.amount || '0');
              const hasDiscount = comparePrice > minPrice;
              const tier = getProductTier(product);
              const material = getMaterialLabel(product);

              const tierBadge = tier === 'mahakarya'
                ? { label: 'Mahakarya', bg: 'bg-gradient-to-r from-[#C5A059] to-[#9A7730]', text: 'text-[#0A0907]' }
                : tier === 'signature'
                  ? { label: 'Signature', bg: 'bg-[#1E3A8A]', text: 'text-white' }
                  : { label: 'Essential', bg: 'bg-[#9E4719]', text: 'text-white' };

              return (
                <a
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className={`group block rounded-2xl p-3 sm:p-3.5 shadow-sm transition-all duration-300 border ${styles.cardBg}`}
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-black/20 mb-3 rounded-xl border border-white/10">
                    
                    {/* Tier / Discount Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                      <span className={`${tierBadge.bg} ${tierBadge.text} text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded shadow-sm`}>
                        {tierBadge.label}
                      </span>
                      {hasDiscount && (
                        <span className="bg-red-700 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-sm">
                          Diskon
                        </span>
                      )}
                    </div>

                    <img
                      src={prodImg}
                      alt={product.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Quick View Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-2.5 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden lg:block">
                      <span className={`block w-full text-center py-2 shadow-md text-xs uppercase tracking-wider font-bold transition-all rounded-lg ${styles.hoverBtn}`}>
                        Lihat Detail Produk
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col text-left px-1">
                    <span className={`font-sans text-[11px] uppercase tracking-wider font-bold mb-1 block ${styles.cardMaterial}`}>
                      {material}
                    </span>

                    <h3 className={`font-bold transition-colors leading-[1.35] line-clamp-2 min-h-[2.7em] mb-2 text-[13px] sm:text-[14px] ${styles.cardTitle}`}>
                      {product.title}
                    </h3>

                    <div className={`flex items-baseline gap-2 mt-auto pt-1.5 border-t ${styles.cardPriceBorder}`}>
                      <p className={`font-sans text-sm sm:text-base font-extrabold tracking-tight ${styles.cardPrice}`}>
                        Rp {minPrice.toLocaleString('id-ID')}
                      </p>
                      {hasDiscount && (
                        <span className="font-sans text-xs line-through opacity-50 font-normal">
                          Rp {comparePrice.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
