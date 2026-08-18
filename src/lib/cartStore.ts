// src/lib/cartStore.ts
import { 
  shopifyFetch, 
  getCartQuery, 
  cartCreateMutation, 
  cartLinesAddMutation, 
  cartLinesUpdateMutation, 
  cartLinesRemoveMutation, 
  cartNoteUpdateMutation 
} from './shopify';

export interface CartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      title: string;
      handle: string;
    };
    image?: {
      url: string;
      altText?: string;
    };
  };
}

export interface CartState {
  id: string | null;
  checkoutUrl: string | null;
  totalQuantity: number;
  note: string;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: CartLine[];
  isLoading: boolean;
  isOpen: boolean;
}

const CART_ID_KEY = 'batik_smile_cart_id';

class CartManager {
  private state: CartState = {
    id: null,
    checkoutUrl: null,
    totalQuantity: 0,
    note: '',
    cost: {
      totalAmount: { amount: '0', currencyCode: 'IDR' },
      subtotalAmount: { amount: '0', currencyCode: 'IDR' }
    },
    lines: [],
    isLoading: false,
    isOpen: false
  };

  private listeners: ((state: CartState) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initCart();
    }
  }

  private emit() {
    this.listeners.forEach((listener) => listener({ ...this.state }));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('batik-smile:cart-updated', { detail: this.state }));
    }
  }

  public subscribe(listener: (state: CartState) => void) {
    this.listeners.push(listener);
    listener({ ...this.state });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getState(): CartState {
    return { ...this.state };
  }

  public async fetchCart() {
    return this.initCart();
  }

  public openCart() {
    this.state.isOpen = true;
    this.emit();
  }

  public closeCart() {
    this.state.isOpen = false;
    this.emit();
  }

  public toggleCart() {
    this.state.isOpen = !this.state.isOpen;
    this.emit();
  }

  private async initCart() {
    if (typeof window === 'undefined') return;

    const savedCartId = localStorage.getItem(CART_ID_KEY);
    if (!savedCartId) {
      this.state.isLoading = false;
      this.emit();
      return;
    }

    this.state.isLoading = true;
    this.emit();

    try {
      const { body } = await shopifyFetch<any>({
        query: getCartQuery,
        variables: { cartId: savedCartId }
      });

      if (body?.data?.cart) {
        this.updateStateFromCart(body.data.cart);
      } else {
        localStorage.removeItem(CART_ID_KEY);
        this.state.id = null;
        this.state.lines = [];
        this.state.totalQuantity = 0;
      }
    } catch (e) {
      console.error('Failed to restore cart:', e);
      localStorage.removeItem(CART_ID_KEY);
      this.state.id = null;
      this.state.lines = [];
      this.state.totalQuantity = 0;
    } finally {
      this.state.isLoading = false;
      this.emit();
    }
  }

  private updateStateFromCart(cart: any) {
    if (!cart) return;
    this.state.id = cart.id;
    this.state.checkoutUrl = cart.checkoutUrl;
    this.state.totalQuantity = cart.totalQuantity || 0;
    this.state.note = cart.note || '';
    this.state.cost = cart.cost || {
      totalAmount: { amount: '0', currencyCode: 'IDR' },
      subtotalAmount: { amount: '0', currencyCode: 'IDR' }
    };
    this.state.lines = (cart.lines?.edges || []).map((e: any) => e.node);

    if (cart.id && typeof window !== 'undefined') {
      localStorage.setItem(CART_ID_KEY, cart.id);
    }
  }

  public async addItem(merchandiseId: string, quantity = 1) {
    this.state.isLoading = true;
    this.emit();

    try {
      if (!this.state.id) {
        // Create new cart
        const { body } = await shopifyFetch<any>({
          query: cartCreateMutation,
          variables: {
            input: {
              lines: [{ merchandiseId, quantity }]
            }
          }
        });

        if (body?.data?.cartCreate?.cart) {
          this.updateStateFromCart(body.data.cartCreate.cart);
        }
      } else {
        // Add to existing cart
        const { body } = await shopifyFetch<any>({
          query: cartLinesAddMutation,
          variables: {
            cartId: this.state.id,
            lines: [{ merchandiseId, quantity }]
          }
        });

        if (body?.data?.cartLinesAdd?.cart) {
          this.updateStateFromCart(body.data.cartLinesAdd.cart);
        } else {
          // If cart expired, recreate fresh cart
          const recreate = await shopifyFetch<any>({
            query: cartCreateMutation,
            variables: {
              input: {
                lines: [{ merchandiseId, quantity }]
              }
            }
          });
          if (recreate.body?.data?.cartCreate?.cart) {
            this.updateStateFromCart(recreate.body.data.cartCreate.cart);
          }
        }
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      this.state.isLoading = false;
      this.emit();
    }
  }

  public async updateQuantity(lineId: string, quantity: number) {
    if (!this.state.id) return;
    this.state.isLoading = true;
    this.emit();

    try {
      if (quantity <= 0) {
        await this.removeItem(lineId);
        return;
      }

      const { body } = await shopifyFetch<any>({
        query: cartLinesUpdateMutation,
        variables: {
          cartId: this.state.id,
          lines: [{ id: lineId, quantity }]
        }
      });

      if (body?.data?.cartLinesUpdate?.cart) {
        this.updateStateFromCart(body.data.cartLinesUpdate.cart);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      this.state.isLoading = false;
      this.emit();
    }
  }

  public async removeItem(lineId: string) {
    if (!this.state.id) return;
    this.state.isLoading = true;
    this.emit();

    try {
      const { body } = await shopifyFetch<any>({
        query: cartLinesRemoveMutation,
        variables: {
          cartId: this.state.id,
          lineIds: [lineId]
        }
      });

      if (body?.data?.cartLinesRemove?.cart) {
        this.updateStateFromCart(body.data.cartLinesRemove.cart);
      }
    } catch (error) {
      console.error('Error removing line:', error);
    } finally {
      this.state.isLoading = false;
      this.emit();
    }
  }

  public async updateNote(note: string) {
    if (!this.state.id) return;
    try {
      const { body } = await shopifyFetch<any>({
        query: cartNoteUpdateMutation,
        variables: {
          cartId: this.state.id,
          note
        }
      });
      if (body?.data?.cartNoteUpdate?.cart) {
        this.state.note = note;
        this.emit();
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }
}

export const cartStore = new CartManager();
