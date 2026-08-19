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
}

export default function CollectionFilterView({ initialProducts, collectionTitle, collectionHandle }: Props) {
  const defaultTier = collectionHandle.includes('mahakarya')
    ? 'mahakarya'
    : collectionHandle.includes('signature')
      ? 'signature'
      : collectionHandle.includes('essential')
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

  return (
    <div>
      
      {/* FILTER & SORT CONTROLS BAR (Shadcn-Inspired Clean UI) */}
      <div className="sticky top-16 lg:top-20 z-30 w-full py-3.5 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Left: Quick Tier Pills (Desktop & Mobile Scroll) */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 md:pb-0">
              <span className="text-xs uppercase tracking-wider font-bold text-neutral-500 mr-1 hidden sm:inline-block">
                Kasta:
              </span>

              {[
                { id: 'all', label: 'Semua Kasta' },
                { id: 'mahakarya', label: 'Tier 1: Mahakarya', color: 'border-[#C5A059]' },
                { id: 'signature', label: 'Tier 2: Signature', color: 'border-blue-700' },
                { id: 'essential', label: 'Tier 3: Essential', color: 'border-[#9E4719]' }
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`h-9 px-3.5 rounded-full font-sans text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                    selectedTier === tier.id
                      ? 'bg-[#9E4719] text-white border-[#9E4719] shadow-sm'
                      : 'bg-white text-[#121212] border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
                  }`}
                >
                  {tier.id === 'mahakarya' && <span className="w-2 h-2 rounded-full bg-[#C5A059]" />}
                  {tier.id === 'signature' && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                  {tier.id === 'essential' && <span className="w-2 h-2 rounded-full bg-[#9E4719]" />}
                  <span>{tier.label}</span>
                </button>
              ))}
            </div>

            {/* Right: Search, Filter Trigger, Sort Select */}
            <div className="flex items-center gap-2.5 justify-between md:justify-end">
              
              {/* Live Search inside Collection */}
              <div className="relative w-44 sm:w-56">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari dalam koleksi..."
                  className="w-full h-9 pl-8 pr-3 bg-neutral-100 hover:bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-[#9E4719] rounded-xl text-xs font-sans text-[#121212] outline-none transition-all"
                />
                <svg className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-xs font-bold text-neutral-400 hover:text-neutral-700">
                    ✕
                  </button>
                )}
              </div>

              {/* Mobile Filter Sheet Button */}
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className={`h-9 px-3.5 rounded-xl font-sans text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeFilterCount > 0
                    ? 'bg-[#9E4719] text-white border-[#9E4719]'
                    : 'bg-white text-[#121212] border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-[#9E4719] text-[10px] font-extrabold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Shadcn-Styled Sort Select */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 pl-3 pr-8 bg-white border border-neutral-200 hover:border-neutral-400 rounded-xl text-xs font-sans font-bold text-[#121212] outline-none cursor-pointer appearance-none transition-colors"
                >
                  <option value="featured">Rekomendasi</option>
                  <option value="price-asc">Harga: Termurah</option>
                  <option value="price-desc">Harga: Tertinggi</option>
                  <option value="title-asc">Nama: A - Z</option>
                </select>
                <svg className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-3 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

            </div>

          </div>

          {/* Secondary Filter Dropdown Drawer (Collapsible) */}
          {isMobileFilterOpen && (
            <div className="mt-3 pt-3 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
              
              {/* Category Filter */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
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
                          ? 'bg-[#9E4719] text-white border-[#9E4719] font-bold'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
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
                          ? 'bg-[#9E4719] text-white border-[#9E4719] font-bold'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
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
                  className="px-4 py-2 text-xs font-bold text-red-700 hover:text-red-900 underline cursor-pointer"
                >
                  Reset Semua Filter ({activeFilterCount})
                </button>
              </div>

            </div>
          )}

          {/* Active Filter Badges */}
          {activeFilterCount > 0 && (
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-neutral-500 font-medium">Filter Aktif:</span>

              {selectedTier !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-bold text-[#121212]">
                  Kasta: {selectedTier.toUpperCase()}
                  <button onClick={() => setSelectedTier('all')} className="text-neutral-400 hover:text-black">✕</button>
                </span>
              )}

              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-bold text-[#121212]">
                  Kategori: {selectedCategory.toUpperCase()}
                  <button onClick={() => setSelectedCategory('all')} className="text-neutral-400 hover:text-black">✕</button>
                </span>
              )}

              {selectedPriceRange !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-bold text-[#121212]">
                  Harga: {selectedPriceRange}
                  <button onClick={() => setSelectedPriceRange('all')} className="text-neutral-400 hover:text-black">✕</button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-bold text-[#121212]">
                  Kata Kunci: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="text-neutral-400 hover:text-black">✕</button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-[#9E4719] hover:underline ml-1"
              >
                Hapus Semua
              </button>
            </div>
          )}

        </div>
      </div>

      {/* RESULT COUNT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex justify-between items-center text-xs sm:text-sm text-neutral-600">
        <span className="font-medium">
          Menampilkan <strong>{filteredProducts.length}</strong> karya busana
          {filteredProducts.length !== initialProducts.length && ` (dari total ${initialProducts.length} produk)`}
        </span>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-[#121212] font-semibold mb-2">Tidak Ada Produk Sesuai Filter</h3>
            <p className="font-sans text-xs sm:text-sm text-neutral-500 mb-6">
              Silakan atur ulang kriteria kasta, kategori, atau rentang harga untuk melihat koleksi lainnya.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-3 bg-[#9E4719] hover:bg-[#7A320C] text-white font-sans text-xs uppercase tracking-wider font-bold rounded-xl shadow-md transition-all cursor-pointer"
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
                ? { label: 'Mahakarya', bg: 'bg-[#C5A059]', text: 'text-[#121212]' }
                : tier === 'signature'
                  ? { label: 'Signature', bg: 'bg-[#1E3A8A]', text: 'text-white' }
                  : { label: 'Essential', bg: 'bg-[#9E4719]', text: 'text-white' };

              return (
                <a
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="group block bg-white rounded-2xl border border-[#161616]/10 p-3 sm:p-3.5 shadow-sm hover:shadow-md hover:border-[#9E4719]/40 transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-100 mb-3 rounded-xl border border-neutral-100">
                    
                    {/* Tier / Discount Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                      <span className={`${tierBadge.bg} ${tierBadge.text} text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-sm`}>
                        {tierBadge.label}
                      </span>
                      {hasDiscount && (
                        <span className="bg-[#9E4719] text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-sm">
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
                      <span className="block w-full text-center bg-white/95 backdrop-blur text-[#121212] text-xs uppercase tracking-wider font-bold py-2 shadow-md hover:bg-[#9E4719] hover:text-white transition-colors rounded-lg">
                        Lihat Detail Produk
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col text-left px-1">
                    <span className="font-sans text-[11px] uppercase tracking-wider text-[#9E4719] font-bold mb-1 block">
                      {material}
                    </span>

                    <h3 className="font-sans text-[13px] sm:text-[14px] font-bold text-[#121212] group-hover:text-[#9E4719] transition-colors leading-[1.35] line-clamp-2 min-h-[2.7em] mb-2">
                      {product.title}
                    </h3>

                    <div className="flex items-baseline gap-2 mt-auto pt-1 border-t border-neutral-100">
                      <p className="font-sans text-sm sm:text-base font-extrabold text-[#9E4719] tracking-tight">
                        Rp {minPrice.toLocaleString('id-ID')}
                      </p>
                      {hasDiscount && (
                        <span className="font-sans text-xs line-through text-neutral-400 font-normal">
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
