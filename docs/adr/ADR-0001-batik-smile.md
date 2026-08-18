# Design System & UI/UX Guidelines
## Project: Batik Smile Nusantara (Headless)

Dokumen ini mendefinisikan *Design System* khusus untuk front-end Batik Smile, memastikan eksekusi kode konsisten, elegan, dan mewakili identitas *brand* "Nusantara Premium".

---

## 1. Visual DNA & Brand Vibe
- **Vibe:** Hangat, Elegan, Ramah, Autentik Nusantara, *High-end Boutique*.
- **Konsep Utama:** *Glassmorphism* halus (bukan tebal), *whitespace* yang sangat lega (mengurangi garis/batas keras), dan *floating/layered UI* (bayangan lembut ala luxury brand).
- **Core Value Visual:** "Senyum" — Interaksi UI (*hover, click, transitions*) harus terasa *smooth*, menyambut (*welcoming*), dan elegan tanpa gerakan yang menyentak.

---

## 2. Global Design Tokens (Tailwind CSS Configuration)

### A. Color Palette
Palet warna ini harus didaftarkan di `tailwind.config.mjs` sebagai *custom properties*:

- **Primary (Etnik Gold / Amber):** 
  - `primary: '#996515'` (Solid Etnik Gold)
  - `primary-light: '#dcb871'`
  - `primary-dark: '#6e450b'`
- **Backgrounds (Warm Ivory & Whites):**
  - `bg-base: '#FDFBF7'` (Warm Ivory, digunakan sebagai warna dasar situs, menggantikan putih murni agar lebih ramah di mata).
  - `bg-paper: '#FFFFFF'` (Untuk kartu/dropdown dengan *shadow*).
- **Text & Neutral (Charcoal / Stone):**
  - `text-main: '#1A1A1A'` (Charcoal Black, lebih elegan dari hitam pekat #000).
  - `text-muted: '#78716c'` (Stone-500, untuk teks deskripsi sekunder).
- **Accent Themes (Digunakan pada Dynamic Collection Themes):**
  - **Navy/Slate (Signature Elegance):** `slate-800` (`#1e293b`), `sky-600` (`#0284c7`).
  - **Emerald/Stone (Essential Daily):** `emerald-700` (`#047857`), `stone-700` (`#44403c`).

### B. Typography
Menggabungkan keanggunan klasik dengan modernitas yang mudah dibaca.
- **Headings (H1 - H4):** `Playfair Display` atau `Cormorant Garamond` (Serif). Karakteristik: Tepi tajam, elegan, jarak huruf proporsional.
- **Body & UI Elements:** `Inter` atau `Plus Jakarta Sans` (Sans-serif). Karakteristik: Bersih, tingkat keterbacaan tinggi untuk ukuran kecil (harga, deskripsi material).

### C. Shadows & Effects (Elevations)
- **Shadow Premium:** `box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05)` (Memberi efek melayang tanpa terlihat kotor/gelap).
- **Glassmorphism:** `backdrop-blur-md` dipadu dengan `bg-white/95` atau `bg-stone-900/90` dengan *border* super tipis `border-white/20`.

---

## 3. Komponen UI (Shadcn & Astro Lucide)

### A. Mega Menu & Navbar
- **Header Background:** Transparan saat di-*scroll* awal, berubah menjadi `bg-white/90 backdrop-blur-md` saat di-*scroll* turun.
- **Dropdown Panel:** Lebar penuh (*mega menu*), tidak muncul instan tapi *fade in* & *slide up* perlahan (`translate-y-2 opacity-0` -> `translate-y-0 opacity-100`).

### B. Product Cards (Bento / Grid)
- **Rasio Foto:** Selalu `4:5` (Vertikal).
- **Border:** Tanpa border (0px).
- **Hover State:** Gambar produk di-*zoom* perlahan (*scale-105 transition-transform duration-700*), memunculkan tombol "Quick Add" secara subtil dari bawah.

### C. Tombol (Buttons)
- **Primary Button:** Warna `bg-[#996515]`, teks putih, sudut *rounded-full* atau *rounded-md* (tidak *sharp*).
- **Hover Button:** Jangan gunakan perubahan warna statis, melainkan efek *brightness* naik atau *overlay shadow* tipis.

---

## 4. Sistem Tema Dinamis (Dynamic Themes)

Untuk mengakomodir hierarki koleksi Sarimbit, komponen halaman (PLP & PDP) wajib mengadopsi salah satu dari 3 tema *prop* berikut:

| Komponen Terdampak | Tema 1: Mahakarya (Gold) | Tema 2: Signature (Navy) | Tema 3: Reguler (Ivory/Stone) |
| :--- | :--- | :--- | :--- |
| **Warna Tombol Beli** | Emas (`bg-amber-600`) | Navy (`bg-slate-800`) | Hitam/Charcoal (`bg-stone-900`) |
| **Label / Badge Status** | `bg-amber-100 text-amber-900` | `bg-slate-100 text-slate-800` | `bg-stone-100 text-stone-800` |
| **Aksen Background (Header/Hero)**| `bg-amber-50` | `bg-slate-50` | `bg-stone-50` |
| **Tipografi Judul** | 100% Serif (*Playfair*) | Serif (*Playfair*) | Sans-serif dominan (*Inter*) |

---

## 5. Mobile & Responsiveness
- **Cart & Menu:** Menggunakan **Sheet (Slide-out Drawer)** dari komponen Shadcn UI. Menggeser layar dengan efek gelap (*overlay dim*) di belakangnya.
- **Sticky Actions:** Pada halaman produk (*Mobile*), tombol "Tambahkan ke Keranjang" dan "Konsultasi WA" harus *fixed* di bagian bawah layar agar mempercepat konversi pengguna.
