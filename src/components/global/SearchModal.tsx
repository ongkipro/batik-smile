import React, { useState, useEffect, useRef } from 'react';
import { shopifyFetch, getProductsQuery } from '../../lib/shopify';

interface ProductItem {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  tags: string[];
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [results, setResults] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen to open search event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    window.addEventListener('open-search-modal', handleOpen);
    return () => window.removeEventListener('open-search-modal', handleOpen);
  }, []);

  // Fetch initial product catalog for instant predictive search
  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      setIsLoading(true);
      shopifyFetch({
        query: getProductsQuery,
        variables: { first: 100 }
      })
        .then(({ body }) => {
          const prods = (body as any)?.data?.products?.edges?.map((e: any) => e.node) || [];
          setAllProducts(prods);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load search catalog:', err);
          setIsLoading(false);
        });
    }
  }, [isOpen, allProducts.length]);

  // Live filter results based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = allProducts.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchTags = (p.tags || []).some((t) => t.toLowerCase().includes(q));
      const matchHandle = p.handle.toLowerCase().includes(q);
      return matchTitle || matchTags || matchHandle;
    });

    setResults(filtered);
  }, [query, allProducts]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md animate-fade-in">
      
      {/* Background click to close */}
      <div 
        className="absolute inset-0 z-0" 
        onClick={() => setIsOpen(false)} 
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-3xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#161616]/10 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#161616]/10 flex items-center gap-3 bg-white">
          <svg className="w-5 h-5 text-[#9E4719] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari motif batik, kemeja pria, blus wanita, sarimbit, atau sutra..."
            className="flex-1 bg-transparent border-none outline-none font-sans text-sm sm:text-base text-[#161616] placeholder:text-[#161616]/40"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#161616]/40 hover:text-[#161616] text-xs font-bold px-2 py-1"
            >
              Hapus
            </button>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-[#9E4719] hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Quick Search Tags (When Query is Empty) */}
        {!query.trim() && (
          <div className="p-6 bg-[#FAF7F2] overflow-y-auto">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#9E4719] block mb-3">
              Pencarian Populer:
            </span>
            <div className="flex flex-wrap gap-2 mb-6">
              {['Sarimbit Mahakarya', 'Kemeja Pria Furing', 'Tunik Batik', 'Blus Batik Wanita', 'Tenun Dobby', 'Batik Anak', 'Kain Primisima'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-[#161616]/10 text-xs font-medium text-[#161616]/80 hover:border-[#9E4719] hover:text-[#9E4719] hover:bg-[#9E4719]/5 transition-all shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[#161616]/10 flex items-center justify-between text-xs text-[#161616]/60">
              <span>Tekan <strong>ESC</strong> untuk menutup</span>
              <a href="/collections/shop" onClick={() => setIsOpen(false)} className="text-[#9E4719] font-semibold hover:underline">
                Buka Seluruh Katalog →
              </a>
            </div>
          </div>
        )}

        {/* Search Results List */}
        {query.trim() && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-[#161616]/10">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-[#161616]/60">
                <div className="inline-block animate-spin w-5 h-5 border-2 border-[#9E4719] border-t-transparent rounded-full mb-2"></div>
                <p>Mencari koleksi batik...</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="pb-3 text-xs text-[#161616]/60">
                  Ditemukan <strong>{results.length}</strong> karya busana untuk kata kunci "<em>{query}</em>":
                </div>
                {results.map((product) => {
                  const img = product.images?.edges?.[0]?.node?.url || "https://cdn.shopify.com/s/files/1/0813/3224/0441/collections/banner_shop_all_1786007684766.jpg?v=1786007711";
                  const price = parseInt(product.priceRange?.minVariantPrice?.amount || '0').toLocaleString('id-ID');
                  
                  return (
                    <a
                      key={product.id}
                      href={`/products/${product.handle}`}
                      onClick={() => setIsOpen(false)}
                      className="py-3 flex items-center gap-4 group hover:bg-[#9E4719]/5 px-3 rounded-lg transition-colors"
                    >
                      <div className="w-14 h-16 rounded overflow-hidden bg-black/5 flex-shrink-0 border border-black/5">
                        <img src={img} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans font-semibold text-[13px] sm:text-[14px] text-[#121212] group-hover:text-[#9E4719] truncate transition-colors leading-snug">
                          {product.title}
                        </h4>
                        <span className="text-[13px] font-bold text-[#9E4719]">
                          Rp {price}
                        </span>
                      </div>
                      <svg className="w-4 h-4 text-[#161616]/30 group-hover:text-[#9E4719] group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  );
                })}
              </>
            ) : (
              <div className="py-12 text-center text-xs text-[#161616]/60 space-y-2">
                <p className="font-serif text-lg text-[#161616]">Karya Tidak Ditemukan</p>
                <p>Tidak ada hasil untuk "<em>{query}</em>". Coba kata kunci lain seperti <em>kemeja</em>, <em>tunik</em>, atau <em>sarimbit</em>.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
