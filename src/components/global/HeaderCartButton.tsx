import React, { useState, useEffect } from 'react';
import { cartStore, type CartState } from '../../lib/cartStore';

export default function HeaderCartButton() {
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    // Subscribe to global reactive cartStore
    const unsubscribe = cartStore.subscribe((state: CartState) => {
      setTotalQuantity(state.totalQuantity || 0);
    });
    return () => unsubscribe();
  }, []);

  return (
    <a
      href="/cart"
      aria-label={`Tas Belanja (${totalQuantity} item)`}
      className="relative p-2.5 rounded-full text-[#161616] hover:text-[#9E4719] hover:bg-black/5 transition-all flex items-center justify-center"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {totalQuantity > 0 && (
        <span className="absolute top-1 right-1 bg-[#9E4719] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
          {totalQuantity}
        </span>
      )}
    </a>
  );
}
