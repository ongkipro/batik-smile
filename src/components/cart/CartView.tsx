import React, { useState, useEffect } from 'react';
import { cartStore, type CartState, type CartLine } from '../../lib/cartStore';

export default function CartView() {
  const [cartState, setCartState] = useState<CartState>(cartStore.getState());
  const [isClient, setIsClient] = useState(false);
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isUpdatingNote, setIsUpdatingNote] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Subscribe to store updates
    const unsubscribe = cartStore.subscribe((state) => {
      setCartState({ ...state });
      if (state.note !== undefined && state.note !== null) {
        setNote(state.note);
      }
    });

    // Listen to custom window events for cross-component sync
    const handleCartEvent = (e: CustomEvent<CartState>) => {
      if (e.detail) {
        setCartState({ ...e.detail });
      }
    };
    window.addEventListener('batik-smile:cart-updated', handleCartEvent as EventListener);

    // Trigger initial background sync
    cartStore.init();

    return () => {
      unsubscribe();
      window.removeEventListener('batik-smile:cart-updated', handleCartEvent as EventListener);
    };
  }, []);

  const handleQuantityChange = async (lineId: string, currentQty: number, delta: number) => {
    const nextQty = currentQty + delta;
    setUpdatingLineId(lineId);
    try {
      if (nextQty <= 0) {
        await cartStore.removeItem(lineId);
      } else {
        await cartStore.updateQuantity(lineId, nextQty);
      }
    } catch (e) {
      console.error("Gagal mengubah kuantitas:", e);
    } finally {
      setUpdatingLineId(null);
    }
  };

  const handleRemove = async (lineId: string) => {
    setUpdatingLineId(lineId);
    try {
      await cartStore.removeItem(lineId);
    } catch (e) {
      console.error("Gagal menghapus produk:", e);
    } finally {
      setUpdatingLineId(null);
    }
  };

  const handleSaveNote = async () => {
    if (note === cartState.note) return;
    setIsUpdatingNote(true);
    try {
      await cartStore.updateNote(note);
    } catch (e) {
      console.error("Gagal menyimpan catatan:", e);
    } finally {
      setIsUpdatingNote(false);
    }
  };

  if (!isClient) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-3 border-[#9E4719] border-t-transparent rounded-full mb-3" />
        <p className="font-sans text-sm text-[#404040]">Memuat tas belanja Anda...</p>
      </div>
    );
  }

  const lines = cartState.lines || [];
  const totalQuantity = cartState.totalQuantity || 0;
  const rawSubtotal = cartState.cost?.subtotalAmount?.amount ? parseInt(cartState.cost.subtotalAmount.amount) : 0;
  const subtotalStr = rawSubtotal.toLocaleString('id-ID');

  // Show loading spinner if actively fetching and no items yet
  if (cartState.isLoading && lines.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-3 border-[#9E4719] border-t-transparent rounded-full mb-3" />
        <p className="font-sans text-sm text-[#404040]">Memuat tas belanja Anda...</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#9E4719]/10 text-[#9E4719] flex items-center justify-center mx-auto mb-5 shadow-sm">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#121212] font-semibold mb-3">Tas Belanja Anda Kosong</h2>
        <p className="font-sans text-sm text-[#404040] leading-relaxed mb-8">
          Belum ada busana batik pilihan yang Anda masukkan ke tas belanja. Jelajahi katalog mahakarya kami untuk menemukan busana seragam dan sarimbit keluarga.
        </p>
        <a
          href="/collections/shop"
          className="inline-flex items-center justify-center px-8 py-4 bg-[#9E4719] hover:bg-[#7A320C] text-white font-sans text-sm uppercase tracking-wider font-bold rounded-xl shadow-xl transition-all hover:scale-105"
        >
          Mulai Belanja Batik
          <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      
      {/* Kolom Kiri: Daftar Produk di Tas Belanja (7/12) */}
      <div className="lg:col-span-7 space-y-6">

        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <span className="font-serif text-xl sm:text-2xl text-[#121212] font-semibold">
            Item Pilihan ({totalQuantity})
          </span>
          <a href="/collections/shop" className="text-xs sm:text-sm font-sans text-[#9E4719] hover:underline font-bold tracking-wide">
            + Tambah Produk Lain
          </a>
        </div>

        {/* Line Items List */}
        <div className="divide-y divide-neutral-200">
          {lines.map((item: CartLine) => {
            const merchandise = item.merchandise;
            const product = merchandise?.product;
            const imgUrl = merchandise?.image?.url || "https://cdn.shopify.com/s/files/1/0813/3224/0441/collections/banner_shop_all_1786007684766.jpg?v=1786007711";
            const unitPrice = parseInt(merchandise?.price?.amount || '0').toLocaleString('id-ID');
            const lineTotal = parseInt(item.cost?.totalAmount?.amount || '0').toLocaleString('id-ID');
            const isUpdatingThis = updatingLineId === item.id;

            return (
              <div key={item.id} className={`py-5 sm:py-6 flex gap-4 sm:gap-6 items-start transition-opacity ${isUpdatingThis ? 'opacity-40' : 'opacity-100'}`}>
                
                {/* Product Thumbnail (4:5 Ratio) */}
                <a href={`/products/${product?.handle}`} className="w-20 sm:w-24 aspect-[4/5] rounded-2xl overflow-hidden bg-black/5 flex-shrink-0 border border-neutral-200 shadow-sm block">
                  <img src={imgUrl} alt={product?.title || merchandise?.title} className="w-full h-full object-cover" />
                </a>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <a href={`/products/${product?.handle}`} className="font-sans text-sm sm:text-base text-[#121212] hover:text-[#9E4719] font-bold leading-snug line-clamp-2 transition-colors block mb-1">
                    {product?.title || merchandise?.title}
                  </a>

                  {merchandise?.title && merchandise.title !== 'Default Title' && (
                    <span className="inline-block mt-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-neutral-100 text-[#121212] border border-neutral-200">
                      Ukuran: {merchandise.title}
                    </span>
                  )}

                  <p className="font-sans text-xs sm:text-sm text-[#555555] mt-1.5">
                    Harga Satuan: <strong>Rp {unitPrice}</strong>
                  </p>

                  {/* Quantity Counter & Line Total */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border-2 border-neutral-300 rounded-xl bg-white overflow-hidden shadow-sm">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        disabled={isUpdatingThis}
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-base font-bold text-neutral-700 hover:bg-[#9E4719] hover:text-white transition-colors cursor-pointer"
                        aria-label="Kurangi Jumlah"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-bold font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        disabled={isUpdatingThis}
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-base font-bold text-neutral-700 hover:bg-[#9E4719] hover:text-white transition-colors cursor-pointer"
                        aria-label="Tambah Jumlah"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-sans text-base sm:text-lg font-extrabold text-[#9E4719] block">
                        Rp {lineTotal}
                      </span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={isUpdatingThis}
                        className="text-xs text-red-600 hover:text-red-800 underline mt-1 font-semibold cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Order Notes Textarea */}
        <div className="pt-6 border-t border-neutral-200">
          <label htmlFor="cart-note" className="font-sans text-xs sm:text-sm uppercase tracking-wider font-bold text-[#121212] block mb-1.5">
            Catatan Khusus Pesanan / Request Penjahit (Opsional)
          </label>
          <p className="text-xs text-[#555555] mb-2 font-normal">
            Tuliskan instruksi penyesuaian panjang baju, request kartu ucapan kado, atau pesan khusus:
          </p>
          <textarea
            id="cart-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={handleSaveNote}
            placeholder="Contoh: Tolong disesuaikan panjang kemeja menjadi 75cm, atau request kartu ucapan kado..."
            className="w-full p-4 bg-white border-2 border-neutral-200 rounded-2xl text-xs sm:text-sm font-sans text-[#121212] focus:outline-none focus:border-[#9E4719] shadow-sm"
          />
          {isUpdatingNote && (
            <span className="text-xs text-[#9E4719] font-bold mt-1.5 block">Menyimpan catatan ke pesanan...</span>
          )}
        </div>

      </div>

      {/* Kolom Kanan: Ringkasan Pesanan & Checkout Handoff (5/12 - Sticky) */}
      <div className="lg:col-span-5 lg:sticky lg:top-24">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xl space-y-6">
          
          <h3 className="font-serif text-2xl text-[#121212] pb-3 border-b border-neutral-200 font-semibold">
            Ringkasan Pesanan
          </h3>

          <div className="space-y-3 font-sans text-xs sm:text-sm">
            <div className="flex justify-between text-[#333333]">
              <span>Total Item ({totalQuantity} potong)</span>
              <strong className="text-[#121212]">Rp {subtotalStr}</strong>
            </div>
            <div className="flex justify-between text-[#333333]">
              <span>Lapisan Furing Katun Hero</span>
              <span className="text-emerald-700 font-bold">Sudah Termasuk (Gratis)</span>
            </div>
            <div className="flex justify-between text-[#333333]">
              <span>Ongkos Kirim</span>
              <span className="text-neutral-600 font-medium">Dihitung saat Checkout Resmi</span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex justify-between items-baseline">
            <span className="font-serif text-xl font-bold text-[#121212]">Total Akhir</span>
            <span className="font-sans text-3xl sm:text-4xl font-extrabold text-[#9E4719]">
              Rp {subtotalStr}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {cartState.checkoutUrl ? (
              <a
                href={cartState.checkoutUrl}
                className="w-full py-4.5 px-6 bg-[#9E4719] hover:bg-[#7A320C] text-white font-sans text-sm sm:text-base uppercase tracking-wider font-bold rounded-2xl shadow-xl hover:shadow-[#9E4719]/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Lanjut ke Pembayaran</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ) : (
              <button
                disabled
                className="w-full py-4 px-6 bg-neutral-300 text-neutral-500 font-sans text-sm uppercase tracking-wider font-bold rounded-2xl cursor-not-allowed text-center"
              >
                Memuat Checkout...
              </button>
            )}

            <a
              href={`https://wa.me/6281390888809?text=${encodeURIComponent(`Halo Batik Smile, saya ingin memesan produk dari tas belanja saya (Total Rp ${subtotalStr}). Mohon dibantu konfirmasi & pembayarannya.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-sans text-xs sm:text-sm uppercase tracking-wider font-bold rounded-2xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>Pesan Cepat via WhatsApp CS</span>
            </a>
          </div>

          <div className="pt-4 border-t border-neutral-200 space-y-2.5 text-xs text-[#555555]">
            <div className="flex items-center gap-2">
              <span className="text-[#9E4719] font-bold">✓</span>
              <span>Enkripsi Pembayaran Resmi Shopify Checkout 256-bit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#9E4719] font-bold">✓</span>
              <span>Garansi Pas Ukuran • Standar Pelayanan 3S 1C 1T 1H</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#9E4719] font-bold">✓</span>
              <span>Pengiriman Seluruh Indonesia (JNE, SiCepat, J&T, POS)</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
