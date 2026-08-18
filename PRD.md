# Product Requirements Document (PRD)
## Project: Batik Smile Nusantara (Headless E-Commerce)

### 1. Overview
Batik Smile Nusantara adalah brand fashion batik asal Semarang (sejak 2007) yang berfokus pada pakaian ready-to-wear, seragam custom (tanpa minimum order), dan koleksi eksklusif (Sarimbit, Sutra, dll). 
Project ini bertujuan untuk membangun *Headless E-Commerce Front-End* yang elegan, super cepat, dan premium menggunakan Astro dan Shopify Storefront API.

### 2. UI/UX & Visual Blueprint: Tradisi & Karya Nusantara (Local Touch)

Berdasarkan identitas "Batik Smile Nusantara", desain UI/UX tidak boleh terasa seperti toko online *corporate* atau *western minimalis*. Kita harus memancarkan kehangatan budaya lokal, apresiasi terhadap mahakarya pengrajin, dan estetika Jawa/Nusantara yang elegan.

#### A. Palet Warna Tradisional (Warna Alam Batik)
- **Primary / Brand Identity (Base Color)**
  - **Soga Bata / Terracotta Orange (`#C85A17`)**: Warna dasar brand Batik Smile. Menggambarkan warna soga alami dari kulit kayu tingi. Digunakan untuk CTA buttons, badges, dan aksen interaktif.
  - **Soga Karsa (Deep Brownish Orange - `#8B3A0A`)**: Digunakan untuk *hover state* pada tombol utama dan elemen aksen yang membutuhkan kontras lebih gelap.
- **Backgrounds (Surface & Layout)**
  - **Kain Mori / Warm Ivory (`#FDFBF7`)**: Background utama website. Tidak sepenuhnya solid, idealnya menggunakan efek *noise* sangat halus atau tekstur serat mori (kain katun membatik).
  - **Pure White (`#FFFFFF`)**: Background *product card* dan *drawer* agar detail produk (terutama foto) tidak terdistraksi.
- **Typography & Ink**
  - **Malam (Charcoal Black - `#1A1A1A`)**: Teks utama (Headlines, title produk). Mewakili warna malam/lilin batik yang tegas.
  - **Sogan Kelabu (`#5C5552`)**: Teks sekunder (deskripsi produk, meta text).
- **Dynamic Collection Accents**
  - **Tarum (Deep Indigo - `#1E3A8A`)**: Aksen kontras elegan.
  - **Soga Klasik (Rich Maroon - `#7F1D1D`)**: Aksen untuk mahakarya klasik.

#### B. Ornamen & Tekstur Kultural (Premium Local Touch)
- **Tekstur Serat Tenun / Mori**: Area *background* yang luas tidak boleh dibiarkan kosong "*flat*". Tambahkan overlay tekstur serat kain dengan opasitas 1% hingga 2% untuk kesan "tersentuh tangan pengrajin" (*handcrafted*).
- **Watermark & Ornamen SVG Klasik**: Wajib mengimplementasikan aset **SVG murni** untuk motif *Kawung*, *Parang*, atau *Truntum*. SVG ini dirender sebagai *watermark* berskala besar di belakang Hero Banner, atau sebagai *pattern background* halus (opacity 3-5%, *mix-blend-multiply*) di area transisi.
- **Divider Keris / Tumpal**: Mengganti garis lurus standar dengan ornamen pembatas (divider) SVG tipis berukir siluet tumpal asimetris atau lengkung keris di area pemisah section (footer, antar koleksi). Penggunaan SVG menjamin garis tetap tajam (*crisp*) meski di-zoom.

#### C. Arsitektur Visual 3-Tier (Sarimbit & Halaman Produk)
Koleksi Sarimbit memiliki 3 *tier* kasta yang **wajib memiliki tampilan visual (tema) yang sepenuhnya berbeda secara keseluruhan** (dari *Hero Banner*, *background body*, tipografi aksen, hingga ornamen), dan **halaman produk (PDP) untuk masing-masing tier juga harus merender UI yang mengikuti visual koleksinya**:
1. **Mahakarya Heritage (Kasta Tertinggi - Sutra)**:
   - **Vibe**: Sangat mewah, eksklusif, sakral (seperti galeri seni Keraton).
   - **Visual**: Warna gelap mendominasi (*Charcoal* & *Soga Karsa*), menggunakan *watermark* Prada emas/Soga Bata murni, *font* ukuran besar dengan spasi dramatis, dan *shadows* paling tebal/elegan. *Product page* terasa seperti melihat artefak.
2. **Signature Elegance (Premium - Dobby)**:
   - **Vibe**: Elegan, modern, *tailored* (seperti butik desainer).
   - **Visual**: Perpaduan *Deep Indigo (Tarum)* dengan *Warm Ivory*. Bersih, *layout* asimetris modern, ornamen minimalis. *Product page* fokus pada *zoom* tekstur kain tenun Dobby.
3. **Essential Daily (Menengah - Katun/Keluarga)**:
   - **Vibe**: Hangat, ramah, kekeluargaan.
   - **Visual**: Terang dan lapang. Didominasi warna *Warm Ivory*, *Soft Soga*, dan *green/earth tones*. *Product page* difokuskan pada fungsionalitas, kenyamanan, dan tabel ukuran untuk sekeluarga.
4. **General & Default Categories (Pria, Wanita, Anak, Aksesoris, dll)**:
   - **Vibe**: *Clean*, modern, butik premium.
   - **Visual**: Background dominan *Pure White* (`#FFFFFF`) dipadu *Warm Ivory*, menjaga fokus murni pada warna-warni corak batik produk. Secara *pattern* (rasio gambar 4:5, tipografi, struktur grid, animasi *hover*, bayangan/shadows), mengikuti pakem yang **sama persis** dengan arsitektur utama agar konsistensi desain keseluruhan tetap terjaga.

#### D. Tipografi & Kontras Hierarki (Haute Couture & High-Legibility Standard)

Untuk menghindari tipografi yang tumpang tindih (*line-height collision*) dan teks pudar (*low-contrast opacity*), sistem tipografi Batik Smile diatur dengan aturan baku berikut:

1. **Font Stacks**:
   - **Display / Editorial Headlines (H1, H2, H3)**: `Cormorant Garamond`, `serif` (Bobot: 400 Regular, 500 Medium, 600 SemiBold). Menghadirkan wibawa, keanggunan keraton, dan nuansa adiluhung Nusantara.
   - **Product Titles, Pricing, Navigation, Body & UI**: `Plus Jakarta Sans`, `sans-serif` (Bobot: 400 Regular, 500 Medium, 600 SemiBold, 700 Bold). Menjamin keterbacaan super tajam (*razor-sharp legibility*) di semua resolusi layar ponsel maupun desktop.

2. **Kontras & Hirarki Judul Produk vs Harga**:
   - **Judul Produk (Product Card Title)**: Menggunakan `font-sans font-medium text-[13px] sm:text-[14px] text-[#121212] leading-[1.4] line-clamp-2 min-h-[2.8em]`. Dilarang menggunakan font serif tipis pada kartu produk katalog karena rentan kabur dan bertabrakan pada 2 baris teks.
   - **Harga Jual Aktif (Active Price)**: Menggunakan `font-sans font-bold text-[14px] sm:text-[15px] text-[#9E4719] tracking-tight`. Warna Soga Keraton yang tegas dan tebal langsung membedakan harga dari judul produk.
   - **Harga Coret (Compare-at Price)**: Menggunakan `font-sans text-xs text-[#8C827A] line-through font-normal`.
   - **Badge Diskon**: Menggunakan `bg-[#9E4719] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded`.

3. **Standar Kontras & Keterbacaan (WCAG AAA Compliant)**:
   - Teks utama pada latar terang (`#FAF7F2` / `#FFFFFF`): Wajib menggunakan Charcoal Obsidian `#121212` atau `#1A1A1A` (Rasio kontras > 12:1).
   - Teks sekunder & deskripsi: Wajib menggunakan Deep Slate `#3E3E3E` atau `#4A4A4A` (Rasio kontras > 7:1). Dilarang keras menggunakan `opacity-40` atau `text-black/30` pada informasi penting.
   - Teks pada latar gelap (`#121212` / `#0F172A`): Wajib menggunakan Warm Linen `#FAF7F2` atau `#FFFFFF` untuk judul, dan `#D4CECE` untuk deskripsi.

4. **Line-Height & Anti-Overlap Invariant**:
   - Judul Display Besar (H1/H2): `leading-[1.15]` hingga `leading-[1.25]`.
   - Judul Kartu & Subtitle: `leading-[1.4]`.
   - Body & Paragraf Narasi: `leading-[1.65]` hingga `leading-[1.75]`.
   - Setiap elemen teks wajib memiliki spasi vertikal (*margin-bottom*) eksplisit minimal `0.25rem` hingga `0.75rem` untuk mencegah tabrakan visual antar baris (*descenders & ascenders collision*).

#### E. Layout, Grid, & Animasi (Anggun & Kalem)
- **Rasio Lookbook**: Foto produk wajib menggunakan rasio vertikal **4:5** untuk menonjolkan jatuhnya kain pada tubuh (elegan).
- **Whitespace / Spasi Ruang**: Sangat lega. Memberi ruang "napas" agar corak batik pada produk tidak saling menabrak dan memusingkan mata (`py-20` atau `py-24` antar blok).
- **Animasi (Membatik Perlahan)**: Transisi *state* tidak boleh cepat/kasar. Gunakan `500ms` hingga `700ms` *ease-out* untuk *hover* foto (seolah perlahan mendekat ke detail kain) dan *fade-in* transisi halaman.

#### F. Konsep Header & Footer (Navigasi Butik)
- **Top Announcement Bar**: Pita kecil di paling atas berwarna *Soga Bata / Terracotta*, menampilkan pesan otoritas (misal: "Sejak 2007 • Melayani Seragam Kustom").
- **Header (Navigasi Utama)**:
  - Mengusung gaya *Sticky Glassmorphism* (menempel di atas saat *scroll* dengan efek *backdrop-blur* transparan).
  - Logo berada di tengah (*centered*) atau kiri presisi, menu teks elegan tanpa tombol kotak tebal.
  - *Mega Menu* atau *Drawer* (keranjang/menu mobile) meluncur dari samping (*slide-out*) dengan efek *overlay* gelap (opasitas 40%) di latar belakang, memakan waktu `500ms ease-in-out`.
  - Menggunakan *icon* bergaris tipis (*stroke-width 1.5px*) untuk Search, Cart, dan Account agar tidak *chunky*.
- **Footer (Jangkar Halaman)**:
  - Berada di atas *background Soft Neutral* (`#FAFAFA`) atau *Warm Ivory*.
  - Pemisah antara *body* dan *footer* menggunakan ornamen *divider* motif Keris/Tumpal sangat tipis.
  - Layout berkolom lega (4 kolom) untuk: Filosofi Brand, Navigasi Koleksi, Layanan Pelanggan (3S 1C 1T 1H), dan *Newsletter/Sosmed*.
  - Tipografi di footer menggunakan *Stone Gray* berukuran kecil (14px) agar rapi, tidak mendominasi.

#### G. Tone of Voice (Copywriting)
- Hindari istilah "*Best Seller*" atau "*Category*".
- Gunakan bahasa serapan Nusantara yang elegan: **"Koleksi Mahakarya"**, **"Ragam Corak"**, **"Karya Terbaru"**, **"Apresiasi Budaya"**.

#### H. Arsitektur Halaman Beranda (Homepage Tradisional)
Homepage disusun dengan alur (*flow*) vertikal layaknya sebuah "Lorong Galeri Seni" dari atas ke bawah:

**1. Hero Section (Elegant Collection Slider)**
   - Menggunakan sistem *Image Slider* berdurasi lambat dengan efek *cross-fade* (misal: 1000ms) agar terasa eksklusif, bukan *slide* cepat yang mengganggu mata.
   - Secara dinamis menarik foto *cover* dari **5 Koleksi Utama** Shopify. Foto-foto ini memamerkan tata letak *(setting)* visual khusus dari panduan fotografi Batik Smile:
     - *Slide 1 (Mahakarya)*: Menampilkan *Outdoor Heritage* berlatar ikon sejarah Semarang (Klenteng Sam Poo Kong / Lawang Sewu).
     - *Slide 2 (Signature)*: Menampilkan *Indoor Klasik-Modern* (pintu kayu jati ukir, tirai putih, lantai marmer).
   - **Visual Kultural**: Di setiap *slide*, disertakan **SVG Watermark Kawung** raksasa yang menyatu dengan foto menggunakan efek *multiply*.
   - **Gradasi & Teks**: Dilapisi *vignette* atau gradasi gelap halus dari bawah agar teks judul Serif (*Playfair Display*) terbaca tajam dengan *badge* "Sejak 2007 • Semarang".

**2. Brand Intro (Prolog Filosofi)**
   - Sebuah blok kalimat singkat namun berwibawa tepat di bawah *Hero*. Menggunakan huruf *Serif* berukuran menengah untuk menyampaikan esensi "Batik Smile Nusantara Sejak 2007", dipadu tekstur latar *Kain Mori* tipis.

**3. Koleksi Unggulan (3-Tier Sarimbit Spotlight)**
   - Tiga *section* bersusun (*Bento Grid*) yang mendemonstrasikan ruang eksklusif untuk 3 kasta Sarimbit (Mahakarya, Signature, Essential). Tiap blok memiliki warna latar (*theme*) yang sepenuhnya berbeda sesuai kastanya.

**4. Lorong Corak (Horizontal / Grid Explorer)**
   - Karena *store* memuat ratusan produk, area ini membatasi hanya **8-12 produk unggulan** berbentuk grid 4-kolom super rapi di atas kanvas putih/ivory.
   - Diakhiri dengan tombol pipih "*Lihat Seluruh Karya*" untuk mengarahkan pengguna ke halaman koleksi lengkap (agar *homepage* tidak *lagging*).

**5. Apresiasi Pengrajin & Layanan Kustom (3S 1C 1T 1H)**
   - Blok visual terpadu sebelum *Footer* yang menonjolkan foto *zoom-in* tekstur benang sutra atau canting, sekaligus mempromosikan layanan unggulan: **"Jahit Custom & Seragam Tanpa Minimal Order"**.
   - Menampilkan pilar filosofi pelayanan: *Senyum, Salam, Sapa, Cepat, Tanggap, & Melayani dengan Hati*.

**6. Pengalaman Showroom 3 Lantai (O2O - Online to Offline)**
   - Sebentuk blok *banner* atau kartu informasi yang mengundang pelanggan online ke *store* fisik (Pamularsih & Banyumanik) yang memiliki 3 lantai (Lantai 1: *Ready to Wear*, Lantai 2: *Kain & Sutra*, Lantai 3: *Kerajinan/Oleh-oleh Semarang*).

#### I. Arsitektur Halaman Koleksi (PLP - Product Listing Page)
Halaman spesifik kategori memiliki *Dynamic UI Engine*. **Khusus untuk 3 Koleksi Sarimbit, halamannya wajib dirakit menggunakan komponen UI/UX dan struktur *layout* yang secara fundamental berbeda total dari atas (Hero) sampai bawah:**

1. **Sarimbit Mahakarya (Galeri Artefak)**:
   - **Hero**: Layout teks asimetris dengan *parallax scrolling*. Foto Hero melebar *full-bleed*.
   - **Background**: *Charcoal/Black* pekat dengan watermark SVG Emas/Soga Bata.
   - **Product Grid**: Kolom asimetris (misal: 2 kolom diselingi 1 foto besar). *Product Card* tanpa garis batas (*borderless*), menyatu dengan kegelapan.
2. **Sarimbit Signature (Butik Modern)**:
   - **Hero**: Layout terbelah (*Split-screen*), teks di kiri, gambar *zoom-in* tekstur di kanan.
   - **Background**: *Deep Indigo* berpadu *Ivory* membentuk siluet *card* berlapis (*layering*).
   - **Product Grid**: Grid 3-kolom tegas dengan *Product Card* bergaya *glassmorphism* atau *soft shadow*.
3. **Sarimbit Essential & Kategori Umum (Katalog Nyaman)**:
   - **Hero**: Header *centered* klasik, bersih, dan terang.
   - **Background**: *Pure White* atau *Kain Mori* rapi tanpa distraksi.
   - **Product Grid**: Grid presisi 4-kolom standar, sangat optimal untuk *browsing* jumlah produk yang masif.

**Fitur Fungsional Wajib untuk Semua PLP (Namun dirender sesuai temanya):**
- **Deskripsi Read More**: Teks panjang di Hero harus bisa di-*expand/collapse* agar tidak merusak visual *above the fold*.
- **Sticky Filter**: Bar tipis menyertai *scroll* ke bawah untuk *sortir* (ukuran, motif).
- **Load More / Infinite Scroll**: Mutlak menggunakan tombol "Muat Karya" atau otomatis *scroll*, **bukan** pagination angka bergaya *marketplace*.
- **Bottom SEO Block**: Paragraf panjang spesifik SEO disembunyikan elegan di dasar halaman sebelum Footer.

#### J. Arsitektur Halaman Produk (PDP - Product Detail Page)
Halaman spesifik produk (*Product Detail Page*) terikat mutlak pada *Dynamic UI Engine*. **Tampilan UI/UX halaman produk wajib berubah secara fundamental mengikuti 3 kasta Sarimbit:**
- **PDP Mahakarya**: Latar *Charcoal/Black* elegan. Panel informasi tidak menggunakan boks, melainkan teks Serif Emas/Soga yang mengambang menyatu dengan latar (*borderless floating info*).
- **PDP Signature**: Latar *Deep Indigo* & *Ivory*. Panel informasi dirender dalam bentuk kartu kaca (*glassmorphism card*) yang elegan di atas corak Indigo.
- **PDP Essential / Umum**: Latar *Pure White/Mori*. Panel informasi menggunakan struktur garis batas (*thin borders*) yang *clean* dan fungsional.

Secara fungsionalitas, seluruh PDP akan memiliki struktur fitur berikut:

1. **Galeri Media (Synchronized Mini-Thumbnails)**
   - Di *desktop*, halaman dibagi secara elegan. Kolom paling kiri memuat rentetan *mini-thumbnails* vertikal. Kolom tengah menampilkan *Main Image* besar. Saat *scroll* turun atau *thumbnail* diklik, foto utama akan tersinkronisasi presisi. Tidak perlu *Lightbox/Zoom-in* yang mengganggu *flow* antarmuka, cukup mengandalkan foto resolusi tinggi berukuran besar.
2. **Panel Informasi Eksklusif & Ornamen (Sisi Kanan)**
   - Menempel (*sticky*) saat layar di-*scroll*. Sudut atau pinggiran panel ini dihiasi **Ornamen SVG Batik** (seperti siluet Parang/Kawung yang sangat samar) untuk memperkuat nuansa butik tradisional.
   - **Hirarki Judul & Harga**: Judul produk besar (Serif), diikuti *badge* material (misal: "Sutra Prada"), lalu harga elegan.
   - **Navigasi Varian (Warna & Ukuran)**: *Pill buttons* yang elegan alih-alih *dropdown* standar. Wajib menyertakan *link* **"Panduan Ukuran (Size Guide)"** yang membuka *modal/drawer* agar pelanggan tidak ragu memilih ukuran.
   - **Dual CTA (Call to Action)**: Tombol solid "*Tambah ke Tas*" (warna *Soga Bata*) dan tombol sekunder (garis luar/outline) "*Tanya via WhatsApp*" (karena *buyer* Indonesia sangat menyukai jalur *chat* untuk konsultasi ukuran/seragam).
3. **Akordion Filosofi & Perawatan**
   - Area di bawah tombol *cart* berisi menu *accordion* estetik yang bisa dibuka/tutup:
     - **Filosofi Motif**: Menceritakan makna corak batik (misal: Kawung bermakna kesucian).
     - **Detail Material**: Menyebutkan keunggulan kain dan lapisan furing interior.
     - **Panduan Perawatan**: Edukasi cara mencuci batik tulis/cap agar awet (misal: cuci dengan lerak, jangan jemur).
4. **Cross-Selling: "Padukan Dengan" / "Koleksi Serupa"**
   - Menampilkan *slider* atau *grid* rekomendasi produk. Sangat krusial untuk **Sarimbit**, apabila pelanggan sedang melihat Kemeja Pria, area ini wajib menyarankan Tunik Wanita/Gamis Anak pasangannya untuk mendorong pembelian paket keluarga.

#### K. Arsitektur Keranjang Belanja (Cart Drawer)
Untuk menjaga alur belanja (*flow*) yang mulus ala butik premium, fitur keranjang tidak dilempar ke halaman baru (`/cart`), melainkan menggunakan format **Cart Drawer (Slide-out Panel)** yang muncul dari sisi kanan layar.

1. **Panel Drawer & Visual**
   - Meluncur masuk dengan durasi `500ms ease-out`, dilatarbelakangi *overlay* layar utama yang meredup 40%.
   - Menggunakan penamaan elegan: **"Tas Belanja"** atau **"Karya Pilihan Anda"**.
   - Background panel *Warm Ivory* / *Clean White* dengan ornamen *divider SVG* motif keris di bagian total harga.
2. **Detail Produk di Keranjang**
   - Menampilkan *thumbnail* produk ber-rasio 4:5.
   - Judul produk (*Serif*), Varian (*Size/Warna*), dan *selector* kuantitas `( - 1 + )` yang bergaris sangat tipis.
3. **Catatan Khusus (Order Notes)**
   - Wajib menyediakan kolom teks *Catatan Pesanan* yang langsung terkirim ke *Cart Attributes* Shopify. Ini sangat vital bagi konsumen yang memesan seragam kustom atau meminta ukuran spesial.
4. **Keamanan & Transisi Checkout Shopify**
   - Area bawah menampilkan *Trust Badges* kecil ("Layanan Pelanggan 3S 1C 1T 1H" / "Kualitas Premium Sejak 2007").
   - Tombol utama berwarna *Soga Bata* bertuliskan **"Selesaikan Pesanan"** atau **"Lanjut ke Pembayaran"**.
   - Saat tombol ini diklik, pelanggan akan langsung diarahkan (*redirect*) menuju URL *Checkout* bawaan **Shopify** (`checkoutUrl`) yang aman dan terenkripsi. Semua transaksi, ongkir, dan pembayaran diselesaikan di sistem Shopify.

#### L. Arsitektur Routing & Sinkronisasi Slug Metadata
Sistem URL/Routing website *Headless* ini **wajib patuh 100% pada metadata bawaan Shopify**. Astro tidak diperbolehkan melakukan *generate slug* atau modifikasi teks secara manual di ranah *frontend*.
- URL Halaman Koleksi (`/collections/[slug]`) akan menarik *value* murni dari metadata `collection.handle` Shopify via GraphQL.
- URL Halaman Produk (`/products/[slug]`) akan menarik *value* murni dari metadata `product.handle` Shopify via GraphQL.
- Keuntungan: Hal ini memastikan konsistensi mutlak antara *dashboard* Shopify Paduka dengan *website Headless* saat menangani SEO, integrasi katalog Google/Meta Ads, dan pencarian produk.

#### M. Arsitektur Mega Menu (Navigasi Kultural)
Agar tidak terlihat seperti *dropdown* kaku toko grosir, menu navigasi utama saat di-*hover* akan berubah menjadi panggung etalase elegan:
1. **Transisi Memukau**: Saat *mouse* diarahkan ke "Ragam Corak" atau "Koleksi Sarimbit", layar belakang akan meredup (blur kaca / *frosted glass*), dan *Mega Menu* meluncur turun dengan sangat lambat (*slide-down* 400ms *ease-out*).
2. **Tata Letak Asimetris**:
   - **Sisi Kanan (Kolom Teks)**: Daftar subkategori (Blus, Tunik, Kemeja) tersusun rapi dengan *font* Sans-Serif. Pemisah antar kolom tidak menggunakan garis biasa, melainkan garis ornamen lurus sangat tipis berwarna *Soga Bata*. Judul kolom menggunakan *Serif* (Playfair).
   - **Sisi Kiri (Batik Showcase)**: Wajib menampilkan 1 foto *portrait* (rasio 4:5) *Masterpiece* terbaru (misal: model memakai Sarimbit Mahakarya) yang ditarik dinamis dari *Featured Collection*. Foto ini dibayangi oleh *Watermark* SVG Kawung di sudutnya, menembakkan impresi "Tradisional Mewah" dalam detik pertama.
3. **Efek Interaksi**: Jika sebuah kategori teks di-*hover*, foto *Showcase* di sebelah kiri dapat berubah secara *seamless* menyesuaikan kategorinya.

#### N. Arsitektur Mobile (App-like Experience)
Pengalaman pengguna di *smartphone* tidak sekadar layar *desktop* yang diperkecil (*responsive*), melainkan dirancang dengan UX layaknya *Native Mobile App*:
1. **Bottom Navigation Bar (Tab Bawah)**
   - Header atas dibuat sangat minimalis (hanya Logo dan Search).
   - Layar bawah dikunci oleh *Sticky Bottom Bar* semi-transparan (*glassmorphism*) berisi menu cepat seperti aplikasi: *Home*, *Ragam Corak*, *Tas Belanja*, dan *Chat WhatsApp*.
2. **Bottom Sheet Navigation (Menu Meluncur dari Bawah)**
   - Menghindari menu *hamburger* kuno yang meluncur dari kiri/kanan. Jika pengguna mengetuk "Ragam Corak" di *Bottom Bar*, panel menu utama akan meluncur cepat dari **bawah ke atas** (*slide-up bottom sheet*).
   - Panel menu ini memiliki sudut atas membulat (*rounded top corners*).
3. **Sentuhan Kultural pada Mobile Menu**
   - Garis penarik menu (*drag handle*) di bagian atas *Bottom Sheet* didesain menyerupai gagang Keris atau lengkung Tumpal.
   - Area *background* dalam panel menu disisipi *watermark* SVG Batik transparan agar tidak kehilangan jiwa tradisionalnya meski berbalut UI super modern.

### 3. Tech Stack
- **Framework**: Astro (Static Site Generation / Hybrid Server).
- **Backend/Commerce Engine**: Shopify Storefront API (GraphQL).
- **Styling**: Tailwind CSS (Native).
- **UI Components**: Shadcn UI (React) untuk interaksi kompleks (Dialog/Modal, Accordion, Sheet/Drawer untuk Cart & Mobile Menu).
- **State Management (Cart)**: React Context / Nano Stores / Custom Events.
- **Deployment**: Vercel / Cloudflare Pages.

### 4. Core Features & Pages
1. **Global Layout**:
   - **Mega Menu / Navbar**: Dropdown elegan dan kompleks dengan struktur hierarki kategori persis seperti rancangan sebelumnya:
     - **Wanita (11 Kategori)**: Blus Batik, Outer Tunik, Tunik Modern (Ritsleting), Dress Batik, Gamis Primisima, Outer & Cardigan, Blazer Formal, Inner Busana, Kebaya Encim Brokat, Jarik & Bawahan, Daster Santung.
     - **Pria (3 Kategori)**: Kemeja Lengan Panjang (Furing), Hem Lengan Pendek (Dobby/Lurik), Celana Batik (Panjang/Sirwal).
     - **Sarimbit (3 Tingkatan)**: Sarimbit Mahakarya Heritage (Eksklusif/Sutra), Sarimbit Signature Elegance (Premium/Dobby), Sarimbit Essential Daily (Keluarga/Katun).
     - **Anak-Anak**: Cewek (Blus, Gamis, Dress, Kebaya, Jarik, Babydoll) & Laki-laki (Hem, Surjan, Blangkon, Sarung).
     - **Layanan Khusus**: Jahit Seragam Kustom.
     - **Tentang Kami**: Profil & Sejarah, Fasilitas Showroom, Lokasi & Kontak.
   - **Top Announcement Bar**: Lokasi Outlet, Kontak WA, Jam Buka.
   - **Footer**: Link navigasi lengkap, tagline 3S 1C 1T 1H, garansi mutlak.
2. **Beranda (Homepage) - Konsep Layout**:
   - **Hero Section**: *Split-screen* atau *Full-width Banner* elegan yang memadukan foto model berlatar arsitektur klasik (dengan senyum ramah) dan *headline* tipografi Serif yang berkarakter.
   - **Value Proposition Bar**: Bar minimalis yang menonjolkan USP: "Sejak 2007", "Tanpa Minimal Order", dan "Pelayanan 3S 1C 1T 1H".
   - **Bento Grid / Featured Categories**: Tata letak asimetris (seperti majalah mode) untuk menavigasi ke Wanita, Pria, dan Jahit Seragam.
   - **Tiered Sarimbit Showcase**: Seksi khusus bergaya *editorial* untuk memamerkan 3 tingkatan Sarimbit.
3. **Katalog Produk (PLP - Collection Page)**:
   - **Grid Lookbook**: Produk ditampilkan dalam grid dengan rasio foto vertikal 4:5 yang lega (banyak *whitespace*), dengan efek melayang super halus saat *hover*.
   - **Filter Drawer**: Filter interaktif (Shadcn UI) yang menyelinap dari samping tanpa merusak komposisi *grid* produk.
   - **Sistem 3 Tema Visual (Dynamic Collection Themes)**:
     1. **Tema Mahakarya (Gold/Amber)**: Aksentuasi emas mewah, latar ivory, dan penggunaan Serif dominan. Dikhususkan untuk koleksi Mahakarya Heritage.
     2. **Tema Signature (Navy/Slate)**: Aksentuasi warna *navy* premium yang tegas, berkelas, namun tetap modern.
     3. **Tema Reguler / Standar (Warm Ivory/Stone)**: Visual default untuk *Essential Daily* dan seluruh koleksi normal lainnya. Ramah, bersih, dan membumi.
4. **Halaman Produk (PDP - Product Detail Page)**:
   - **Sticky Layout**: Untuk desktop, area galeri foto di kiri bersifat statis (*sticky*), sementara detail produk di kanan dapat di-*scroll* (standar *luxury brand*).
   - **Adaptive Product UI**: Tombol "Add to Cart", *badge*, dan *sub-headline* otomatis berubah warna mengikuti 3 Tema Visual di atas tergantung dari asal koleksinya.
   - **Detail Accordion**: Informasi spesifikasi furing, material, panduan *size*, dan garansi dirangkum rapi dalam *accordion*.
   - **Floating Action Button**: Di HP (Mobile), tombol "Beli" mengambang di layar bawah.
5. **Keranjang Belanja (Slide-out Cart)**:
   - **Drawer Cart (Bukan Halaman)**: Saat menekan tombol beli, keranjang (*Sheet/Drawer*) meluncur mulus dari samping kanan tanpa harus *loading* halaman baru, didukung efek *backdrop blur*.
   - **Etnik Cross-Selling**: Rekomendasi tambahan cerdas (misal: "Sempurnakan dengan Blangkon" atau bros) di dalam *drawer*.
   - **Checkout Trust**: *Badge* garansi dan *secure checkout* diletakkan tepat di atas tombol bayar.
6. **Static Pages (Company Profile)**:
   - Tentang Kami (Visi Misi, 3S 1C 1T 1H).
   - Layanan Jahit & Seragam Custom.
   - Fasilitas Showroom 3 Lantai.
   - Lokasi Toko & Kontak.
6. **Cart & Checkout**:
   - Slide-out Cart Drawer.
   - Integrasi Checkout Shopify *seamless*.

### 5. Keunggulan Teknis
- **SEO Optimized**: Meta tags dinamis per produk/koleksi, Schema Markup.
- **Performance**: Skor Lighthouse > 90 berkat arsitektur Astro Islands (Zero JS secara default).
- **Accessibility**: ARIA labels pada semua elemen interaktif Shadcn UI.
