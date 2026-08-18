import React, { useState, useEffect } from 'react';
import { cartStore, type CartState } from '../../lib/cartStore';

export default function CartDrawer() {
  const [state, setState] = useState<CartState>(cartStore.getState());
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    const unsubscribe = cartStore.subscribe((newState) => {
      setState(newState);
      setNoteInput(newState.note || '');
    });
    return () => unsubscribe();
  }, []);

  const handleNoteBlur = () => {
    if (noteInput !== state.note) {
      cartStore.updateNote(noteInput);
    }
  };

  const handleCheckout = () => {
    if (state.checkoutUrl) {
      window.location.href = state.checkoutUrl;
    }
  };

  const subtotalFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(parseFloat(state.cost.subtotalAmount.amount || '0'));

  return (
    <>
      {/* Dark Backdrop Blur Overlay (40%) */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-500 ease-out backdrop-blur-sm ${
          state.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => cartStore.closeCart()}
      />

      {/* Slide-out Drawer Panel (Right to Left) */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#FDFBF7] z-50 shadow-2xl transition-transform duration-500 ease-out transform flex flex-col border-l border-[#C85A17]/20 ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#C85A17]/15 bg-[#FDFBF7]">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl text-[#1A1A1A]">Tas Belanja</h2>
            {state.totalQuantity > 0 && (
              <span className="bg-[#C85A17] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {state.totalQuantity}
              </span>
            )}
          </div>
          <button 
            onClick={() => cartStore.closeCart()} 
            className="text-[#1A1A1A]/70 hover:text-[#C85A17] transition-colors p-1"
            aria-label="Tutup Keranjang"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {/* Loading Overlay */}
        {state.isLoading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-[#C85A17]/30 overflow-hidden z-20">
            <div className="w-full h-full bg-[#C85A17] animate-pulse"></div>
          </div>
        )}

        {/* Body: Cart Line Items */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#C85A17]/10">
          {state.lines.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#C85A17]/10 text-[#C85A17] flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">Tas Belanja Anda Kosong</h3>
              <p className="font-sans text-xs text-[#1A1A1A]/60 max-w-xs mb-6">
                Mari jelajahi koleksi sarimbit dan busana batik tradisional kami.
              </p>
              <a 
                href="/collections/shop" 
                onClick={() => cartStore.closeCart()}
                className="px-6 py-3 bg-[#C85A17] text-white font-sans text-xs uppercase tracking-widest font-bold rounded shadow hover:bg-[#8B3A0A] transition-colors"
              >
                Mulai Belanja
              </a>
            </div>
          ) : (
            state.lines.map((line) => {
              const linePrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
              }).format(parseFloat(line.merchandise.price.amount || '0'));

              const imgUrl = line.merchandise.image?.url || 'https://cdn.shopify.com/s/files/1/0813/3224/0441/collections/banner_shop_all_1786007684766.jpg?v=1786007711';

              return (
                <div key={line.id} className="py-4 flex gap-4 items-start group">
                  {/* Thumbnail 4:5 */}
                  <div className="w-20 aspect-[4/5] rounded bg-black/5 overflow-hidden flex-shrink-0 border border-black/5">
                    <img src={imgUrl} alt={line.merchandise.product.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <a 
                      href={`/products/${line.merchandise.product.handle}`} 
                      className="font-serif text-sm font-medium text-[#1A1A1A] hover:text-[#C85A17] transition-colors line-clamp-2"
                    >
                      {line.merchandise.product.title}
                    </a>
                    
                    {line.merchandise.title !== 'Default Title' && (
                      <span className="font-sans text-[11px] text-[#1A1A1A]/60 block mt-0.5">
                        Ukuran: <strong>{line.merchandise.title}</strong>
                      </span>
                    )}

                    <div className="font-sans text-xs font-semibold text-[#C85A17] mt-1.5">
                      {linePrice}
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#C85A17]/30 rounded bg-white">
                        <button 
                          onClick={() => cartStore.updateQuantity(line.id, line.quantity - 1)}
                          disabled={state.isLoading}
                          className="px-2.5 py-1 text-xs text-[#1A1A1A] hover:bg-[#C85A17]/10 disabled:opacity-30"
                          aria-label="Kurangi Jumlah"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 text-xs font-sans font-bold text-[#1A1A1A]">
                          {line.quantity}
                        </span>
                        <button 
                          onClick={() => cartStore.updateQuantity(line.id, line.quantity + 1)}
                          disabled={state.isLoading}
                          className="px-2.5 py-1 text-xs text-[#1A1A1A] hover:bg-[#C85A17]/10 disabled:opacity-30"
                          aria-label="Tambah Jumlah"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => cartStore.removeItem(line.id)}
                        disabled={state.isLoading}
                        className="text-[11px] text-red-600/70 hover:text-red-700 font-sans uppercase tracking-wider underline disabled:opacity-30"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout Action */}
        {state.lines.length > 0 && (
          <div className="p-6 bg-white border-t border-[#C85A17]/15 space-y-4 shadow-lg">
            
            {/* SVG Keris/Tumpal Divider */}
            <div className="flex justify-center text-[#C85A17]/25 mb-1">
              <svg width="60" height="12" viewBox="0 0 60 12" fill="currentColor">
                <path d="M30 0L35 12H25L30 0Z" />
                <rect x="0" y="5" width="20" height="2" />
                <rect x="40" y="5" width="20" height="2" />
              </svg>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center font-sans">
              <span className="text-[#1A1A1A] font-medium uppercase tracking-widest text-xs">Total Pembelian</span>
              <span className="font-serif text-2xl font-bold text-[#C85A17]">{subtotalFormatted}</span>
            </div>

            {/* Catatan Pesanan / Seragam Khusus */}
            <div>
              <label htmlFor="cart-order-notes" className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/70 font-bold mb-1 block">
                Catatan Pesanan / Instruksi Jahit Kustom
              </label>
              <textarea 
                id="cart-order-notes" 
                rows={2} 
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                onBlur={handleNoteBlur}
                className="w-full text-xs font-sans border border-[#C85A17]/20 rounded bg-[#FDFBF7] p-2.5 focus:outline-none focus:border-[#C85A17] transition-colors" 
                placeholder="Misal: Mohon furing warna hitam / size kustom..."
              />
            </div>

            {/* Checkout Button (Direct to encrypted Shopify Checkout URL) */}
            <button 
              onClick={handleCheckout}
              disabled={state.isLoading || !state.checkoutUrl}
              className="w-full bg-[#C85A17] text-white py-4 text-xs uppercase tracking-[0.2em] font-bold rounded shadow-lg hover:bg-[#8B3A0A] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>Lanjut ke Pembayaran (Shopify)</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Trust Badge */}
            <p className="text-center text-[10px] text-[#1A1A1A]/60 uppercase tracking-widest font-sans">
              Layanan 3S 1C 1T 1H • Transaksi Aman via Shopify
            </p>
          </div>
        )}
      </div>
    </>
  );
}
