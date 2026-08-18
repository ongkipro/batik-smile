# Execution Queue: Batik Smile Nusantara (Headless)

## Phase 1: Setup & Initialization
- [ ] Initialize Astro project with Tailwind CSS v4.
- [ ] Configure Shopify Storefront API client (`shopify.ts` helper) with tokens from `.env`.
- [ ] Implement CSS Variables in `global.css` for Local Touch Colors: Soga Bata (`#C85A17`), Soga Karsa (`#8B3A0A`), Kain Mori (`#FDFBF7`), Malam (`#1A1A1A`).
- [ ] Setup Font imports: Playfair Display (Serif) & Plus Jakarta Sans (Sans-Serif).
- [ ] Apply Global Textures (1-2% subtle noise/mori fiber) to base layout.
- [ ] **Generate/Prepare Traditional SVG Assets**: Siapkan aset SVG *inline* murni untuk ornamen Batik (Kawung, Parang, Truntum) dan divider siluet Tumpal/Keris.

## Phase 2: Layout & Global Components
- [ ] Build Top Announcement Bar (Soga Bata background).
- [ ] Build **Sticky Glassmorphism Header & Mega Menu**:
  - Implementasi *Mega Menu* asimetris: Kolom teks kategori di kanan, *Batik Showcase* dinamis di kiri (foto vertikal 4:5 dengan *watermark* SVG Kawung).
  - Transisi panel meluncur lambat (400ms) dengan efek *frosted glass* di layar utama.
- [ ] Build **Cart Drawer (Tas Belanja)**:
  - Format *slide-out* (500ms ease-out) dengan 40% *dark overlay*.
  - Menampilkan *thumbnail* 4:5, *selector* tipis, dan *divider* SVG Keris.
  - Tambahkan fitur *Order Notes* (Catatan Pesanan).
  - Integrasikan tombol *Checkout* yang melakukan *redirect* otomatis ke URL Shopify Checkout (`checkoutUrl`).
- [ ] Build **Mobile App-like Navigation**:
  - Implementasikan *Sticky Bottom Bar* (Home, Kategori, Tas Belanja, WhatsApp).
  - Implementasikan *Bottom Sheet Drawer* (menu meluncur dari bawah ke atas) dengan *drag handle* bergaya Tumpal/Keris dan *watermark* Kawung SVG.
- [ ] Build Premium Footer dengan Tumpal/Keris divider, 4-column layout, dan Stone Gray text.
- [ ] Create `ProductCard` component dengan rasio 4:5 dan 700ms `scale-105` lookbook hover effect.

## Phase 3: Core Pages & 3-Tier Engine
- [ ] **Dynamic Routing & Shopify Slug Sync**: Pastikan semua URL `/collections/[handle]` dan `/products/[handle]` menarik parameter secara 1:1 dari `handle` metadata Shopify tanpa modifikasi manual di Astro.
- [ ] **Dynamic 3-Tier UI Engine**: Create logic in layouts/components to detect collection tags and dynamically render:
  - **Tier 1 (Mahakarya)**: Charcoal/Dark theme, Gold/Soga Bata accents, dramatic spacing.
  - **Tier 2 (Signature)**: Deep Indigo (Tarum) theme, modern asymmetric layout.
  - **Tier 3 (Essential) & General**: Clean White / Kain Mori theme.
- [ ] **Homepage (Traditional Heritage Showcase)**: 
  - Render **Hero Slider (Carousel)**: Tarik dinamis *cover image* dari 5 Koleksi Utama Shopify (Mahakarya, Couple, dll). Gunakan transisi lambat (*cross-fade* 1000ms), gradasi redup, dan *overlay SVG Kawung*.
  - Render *Brand Intro (Prolog)* di bawah Hero.
  - Render *3-Tier Sarimbit Spotlight* (Bento Grid / susun 3) yang mendemonstrasikan visual berbeda dari Mahakarya, Signature, dan Essential.
  - Render *Lorong Corak* (Grid Explorer) berisi 8-12 produk unggulan berlatar *Kain Mori* dengan tombol "Lihat Seluruh Karya".
  - Render blok *Layanan Kustom (3S 1C 1T 1H)* dan *Pengalaman Showroom 3 Lantai (O2O)* sebelum Footer.
- [ ] **PLP (Product Listing Page)**: Route `/collections/[handle]` dengan *Dynamic UI Engine* berstruktur beda total:
  - **Mahakarya**: *Build Parallax Hero*, *Asymmetrical Grid*, *Borderless Cards* (Gelap).
  - **Signature**: *Build Split-screen Hero*, *3-column Grid*, *Glassmorphism Cards* (Indigo).
  - **Essential/General**: *Build Centered Hero*, *4-column Grid*, *Clean White Canvas*.
  - Tambahkan fitur *"Baca Selengkapnya"* (Expand/Collapse) pada Hero.
  - Implementasikan *"Muat Lebih Banyak Karya" (Load More)* elegan (tanpa *pagination* angka).
  - Tambahkan *Bottom SEO Block* sebelum Footer.
- [ ] **PDP (Product Detail Page)**: Route `/products/[handle]`.
  - **Dynamic 3-Tier PDP Engine**: Render UI/UX struktur yang spesifik:
    - **Mahakarya**: *Charcoal Canvas*, *Floating Borderless Info* dengan teks Emas/Soga.
    - **Signature**: *Indigo/Ivory Canvas*, *Glassmorphism Info Card*.
    - **Essential/General**: *White/Mori Canvas*, *Clean Thin-bordered Info Box*.
  - Render **Galeri Media**: *Mini-thumbnails* vertikal di kiri yang tersinkronisasi presisi dengan *Main Image* besar.
  - Render *Panel Informasi Kanan* (*sticky*) berhias **Ornamen SVG Batik** di sudut/pinggirannya.
  - Render *Pill Buttons* varian dan modal *Size Guide*.
  - Implementasikan tombol *Dual CTA*: Tambah ke Tas (Cart) & Tanya via WhatsApp.
  - Render *Accordion* untuk Filosofi Motif, Detail Material, dan Panduan Perawatan.
  - Render *Cross-selling Section* ("Padukan Dengan") khusus untuk merekomendasikan pasangan Sarimbit.
- [ ] **Static Profile Pages**: `/pages/tentang-kami`, `/pages/layanan-seragam`, `/pages/fasilitas-store`, `/pages/lokasi-toko`.

## Phase 4: Integration & Polish
- [ ] Connect all components to live Shopify GraphQL data.
- [ ] Refine micro-interactions (500-700ms ease-out transitions).
- [ ] SEO Meta tags implementation using localized copywriting ("Koleksi Mahakarya").
- [ ] Final UI/UX review against PRD Local Touch blueprint.
