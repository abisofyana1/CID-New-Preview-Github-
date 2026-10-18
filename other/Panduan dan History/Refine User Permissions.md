# Development Change Log / Catatan Perubahan Pengembangan

**Project:** BNI Complaint App
**Last Updated:** 30 Dec 2025

This document serves as a detailed registry of all changes, commands, and improvements made to the application.
Dokumen ini berfungsi sebagai daftar rinci dari semua perubahan, perintah, dan perbaikan yang dilakukan pada aplikasi.

---

## [English Version] - Detailed Log

### **Phase 1: Initialization & Core Structure**
**Date:** 24 Dec 2025
- **Action**: Project Setup & UI Implementation.
- **Details**:
  - Initialized React + Vite project structure.
  - Implemented Sidebar Navigation and Layout based on BNI Corporate Identity (Blue/Orange).
  - Created `db_bniintciu` MySQL database schema.
  - Built Node.js Express Server with Authentication (`/api/auth`) and Complaint (`/api/complaints`) endpoints.

### **Phase 2: Functional Fixes**
**Date:** 29 Dec 2025
- **Action**: Ticket Generation & Popup Standardization.
- **Details**:
  - **Fixed**: `No Ticket` column now correctly displays generated ticket numbers (e.g., `T-29122025-101`).
  - **Refined**: All system notifications (Success, Error, Delete Confirm) now use the standardized `Popup.jsx` component.

### **Phase 3: Role Restrictions & Advanced Features**
**Date:** 30 Dec 2025

#### **1. Role-Based Access Control (RBAC)**
- **Time**: 29 Dec 2025, 08:30 AM
- **Command/Action**: Restrict Non-Admin actions.
- **Details**:
  - **User Role**: Hidden 'Delete' button. Replaced 'Edit' button with 'View' (Eye icon) for Closed tickets.
  - **Ticket Locking**: Prevented editing of `idstatus == 2` (Closed) tickets for standard users.

#### **2. Bug Fix: ReferenceError**
- **Time**: 29 Dec 2025, 07:25 PM
- **Command/Action**: Fix crashed UI.
- **Details**:
  - **Error**: `Uncaught ReferenceError: Eye is not defined` in `ComplaintList.jsx`.
  - **Fix**: Added `import { Eye } ...` from `lucide-react`.

#### **3. Logic Fix: Closing Tickets**
- **Time**: 29 Dec 2025, 07:30 PM
- **Command/Action**: Enable ticket closing for Users.
- **Details**:
  - **Issue**: Users could not close Open tickets because the Save logic was missing `idstatus` updates.
  - **Fix**: Rewrote `handleSubmit` to correctly toggle `idstatus` (1 -> 2) and `status_action` when the "Status: Close" button is active.

#### **4. Feature: Realtime 24H Timestamp**
- **Time**: 29 Dec 2025, 07:32 PM
- **Command/Action**: Fix timezone offset.
- **Details**:
  - **Change**: Replaced `new Date().toISOString()` (UTC) with custom local Date formatting (`YYYY-MM-DD HH:mm:ss`) for `tgl_open` and `tgl_close`.
  - **Result**: Timestamps now accurately reflect the user's local computer time in 24-hour format.

#### **5. Feature: Export to Excel**
- **Time**: 29 Dec 2025, 07:35 PM
- **Command/Action**: Replace Print button.
- **Details**:
  - **Change**: Removed generic "Print" button.
  - **New Feature**: Added "Export Excel" button with `.xlsx` download capability.
  - **Styling**: Applied Excel-green color theme (`#107c41`) and added `FileSpreadsheet` icon.

#### **6. Feature: Master Data Sorting**
- **Time**: 29 Dec 2025, 07:39 PM
- **Command/Action**: Auto-sort Master Data.
- **Details**:
  - **File**: `server/routes/master.js` (Backend).
  - **Logic**: Added `ORDER BY {name_column} ASC` to all Master Data GET requests.
  - **Result**: Dropdowns (Branch, BIC, Product) appear alphabetically A-Z.

#### **7. RBAC Expansion: Admin & SPV**
- **Time**: 30 Dec 2025, 08:40 AM
- **Command/Action**: Grant full access to SPV (IdGroup 2).
- **Details**:
  - **Logic Update**: Changed permission checks from `idgroup === 1` to `idgroup == 1 || idgroup == 2`.
  - **Fix**: Used loose equality (`==`) to handle string vs number mismatches in `localStorage` data.
  - **Result**: SPV role now has identical privileges to Admin (Edit Closed tickets, Delete data).

#### **8. UX Improvement: Smart Save & View Mode**
- **Time**: 30 Dec 2025, 10:10 AM - 10:15 AM
- **Command/Action**: Optimize Admin Experience & Fix Change Detection.
- **Details**:
  - **Feature**: Added "View" button for Admins (previously only Edit).
  - **Smart Save**: If Admin opens Edit Mode but makes **zero changes**, clicking "Save" now acts as "Cancel" (closes modal safely).
  - **Bug Fix**: `hasChanges()` function was ignoring the `notes` column. Removed the exclusion so Internal Note changes are properly saved.

---

## [Versi Bahasa Indonesia] - Catatan Detail

### **Fase 1: Inisialisasi & Struktur Inti**
**Tanggal:** 24 Des 2025
- **Aksi**: Setup Proyek & Implementasi UI.
- **Detail**:
  - Menginisialisasi struktur proyek React + Vite.
  - Mengimplementasikan Navigasi Sidebar dan Tata Letak berdasarkan Identitas Korporat BNI (Biru/Oranye).
  - Membuat skema database MySQL `db_bniintciu`.
  - Membangun Server Node.js Express dengan endpoint Autentikasi (`/api/auth`) dan Komplain (`/api/complaints`).

### **Fase 2: Perbaikan Fungsional**
**Tanggal:** 29 Des 2025
- **Aksi**: Pembuatan Tiket & Standarisasi Popup.
- **Detail**:
  - **Perbaikan**: Kolom `No Ticket` sekarang menampilkan nomor tiket yang dibuat secara otomatis dengan benar (contoh: `T-29122025-101`).
  - **Penyempurnaan**: Semua notifikasi sistem (Sukses, Error, Konfirmasi Hapus) sekarang menggunakan komponen `Popup.jsx` yang terstandarisasi.

### **Fase 3: Pembatasan Peran & Fitur Lanjutan**
**Tanggal:** 30 Des 2025

#### **1. Kontrol Akses Berbasis Peran (RBAC)**
- **Waktu**: 29 Des 2025, 08:30 PAGI
- **Perintah/Aksi**: Membatasi aksi Non-Admin.
- **Detail**:
  - **Peran User**: Tombol 'Hapus' disembunyikan. Tombol 'Edit' diganti dengan 'Lihat' (ikon Mata) untuk tiket yang ditutup.
  - **Penguncian Tiket**: Mencegah pengeditan tiket `idstatus == 2` (Closed) untuk pengguna biasa.

#### **2. Perbaikan Bug: ReferenceError**
- **Waktu**: 29 Des 2025, 07:25 MALAM
- **Perintah/Aksi**: Perbaiki UI yang crash.
- **Detail**:
  - **Error**: `Uncaught ReferenceError: Eye is not defined` di `ComplaintList.jsx`.
  - **Perbaikan**: Menambahkan `import { Eye } ...` dari library `lucide-react`.

#### **3. Perbaikan Logika: Penutupan Tiket**
- **Waktu**: 29 Des 2025, 07:30 MALAM
- **Perintah/Aksi**: Mengaktifkan penutupan tiket untuk User.
- **Detail**:
  - **Masalah**: User tidak bisa menutup tiket Terbuka (Open) karena logika Simpan tidak mengirim pembaruan `idstatus`.
  - **Perbaikan**: Menulis ulang `handleSubmit` untuk mengubah `idstatus` (1 -> 2) dan `status_action` dengan benar saat tombol "Status: Close" aktif.

#### **4. Fitur: Timestamp Realtime 24 Jam**
- **Waktu**: 29 Des 2025, 07:32 MALAM
- **Perintah/Aksi**: Perbaiki selisih zona waktu.
- **Detail**:
  - **Perubahan**: Mengganti `new Date().toISOString()` (UTC) dengan format Tanggal lokal kustom (`YYYY-MM-DD HH:mm:ss`) untuk `tgl_open` dan `tgl_close`.
  - **Hasil**: Timestamp sekarang secara akurat mencerminkan waktu komputer lokal pengguna dalam format 24 jam.

#### **5. Fitur: Export ke Excel**
- **Waktu**: 29 Des 2025, 07:35 MALAM
- **Perintah/Aksi**: Ganti tombol Print.
- **Detail**:
  - **Perubahan**: Menghapus tombol "Print" generik.
  - **Fitur Baru**: Menambahkan tombol "Export Excel" dengan kemampuan unduh file `.xlsx`.
  - **Gaya**: Menerapkan tema warna hijau Excel (`#107c41`) dan menambahkan ikon `FileSpreadsheet`.

#### **6. Fitur: Pengurutan Data Master**
- **Waktu**: 29 Des 2025, 07:39 MALAM
- **Perintah/Aksi**: Urutkan Data Master Otomatis.
- **Detail**:
  - **File**: `server/routes/master.js` (Backend).
  - **Logika**: Menambahkan `ORDER BY {nama_kolom} ASC` ke semua permintaan GET Data Master.
  - **Hasil**: Dropdown (Cabang, BIC, Produk) muncul urut abjad A-Z.

#### **7. Ekspansi RBAC: Admin & SPV**
- **Waktu**: 30 Des 2025, 08:40 PAGI
- **Perintah/Aksi**: Beri akses penuh ke SPV (IdGroup 2).
- **Detail**:
  - **Update Logika**: Mengubah cek izin dari `idgroup === 1` menjadi `idgroup == 1 || idgroup == 2`.
  - **Perbaikan**: Menggunakan kesetaraan longgar (`==`) untuk menangani ketidakcocokan string vs angka dalam data `localStorage`.
  - **Hasil**: Peran SPV sekarang memiliki hak istimewa identik dengan Admin (Edit tiket Closed, Hapus data).

#### **8. Peningkatan UX: Smart Save & Mode Lihat**
- **Waktu**: 30 Des 2025, 10:10 PAGI - 10:15 PAGI
- **Perintah/Aksi**: Optimalkan Pengalaman Admin & Perbaiki Deteksi Perubahan.
- **Detail**:
  - **Fitur**: Menambahkan tombol "Lihat" (View) untuk Admin (sebelumnya hanya Edit).
  - **Smart Save (Simpan Cerdas)**: Jika Admin membuka Mode Edit tetapi **tidak membuat perubahan**, mengklik "Save" sekarang bertindak sebagai "Batal" (menutup modal dengan aman).
  - **Perbaikan Bug**: Fungsi `hasChanges()` sebelumnya mengabaikan kolom `notes`. Pengecualian dihapus sehingga perubahan Catatan Internal disimpan dengan benar.

#### **9. Feature: Track Update History & Sticky Close**
- **Time**: 30 Dec 2025, 10:35 AM
- **Command/Action**: Enhance history tracking.
- **Details**:
  - **Database**: Added `iduser_u` and `tgl_update` columns to `tbl_complain`.
  - **Sticky Close**: Implemented logic to preserve the original "Close Date" and "Close By" user if a closed ticket is edited again.
  - **UI Update**: "Close By" column now displays "Update by [Name]" below the closer info. For Admin/SPV updaters, it also shows the timestamp (Date | Time).

#### **10. Bug Fix: Double View Icon**
- **Time**: 30 Dec 2025, 10:50 AM
- **Command/Action**: Fix UI Redundancy.
- **Details**:
  - **Issue**: Regular 'User' role saw two "Eye" icons on closed tickets (one generic View button + one converted Edit button).
  - **Fix**: Restricted the dedicated Green "View" button to be visible ONLY for Admin (Group 1) and SPV (Group 2). Regular users now see only the single context-aware action button (which becomes View on closed tickets).

#### **9. Fitur: Lacak Riwayat Update & Sticky Close**
- **Waktu**: 30 Des 2025, 10:35 PAGI
- **Perintah/Aksi**: Meningkatkan pelacakan riwayat.
- **Detail**:
  - **Database**: Menambahkan kolom `iduser_u` dan `tgl_update` ke `tbl_complain`.
  - **Sticky Close**: Implementasi logika untuk menjaga "Tanggal Close" dan pengguna "Close By" asli jika tiket yang sudah ditutup diedit kembali.
  - **UI Update**: Kolom "Close By" sekarang menampilkan "Update by [Nama]" di bawah info penutup. Untuk pembaruan oleh Admin/SPV, waktu lengkap (Tanggal | Jam) juga ditampilkan.

#### **10. Perbaikan Bug: Ikon View Ganda**
- **Waktu**: 30 Des 2025, 10:50 PAGI
- **Perintah/Aksi**: Perbaiki Redundansi UI.
- **Detail**:
  - **Masalah**: Role 'User' biasa melihat dua ikon "Mata" pada tiket yang ditutup (satu tombol View umum + satu tombol Edit yang dikonversi).
  - **Perbaikan**: Membatasi tombol "View" Hijau khusus agar HANYA terlihat oleh Admin (Grup 1) dan SPV (Grup 2). Pengguna biasa sekarang hanya melihat satu tombol aksi sadar-konteks (yang berubah menjadi View pada tiket tertutup).

#### **11. Logic Update: Updater Labels**
- **Time**: 30 Dec 2025, 11:00 AM
- **Command/Action**: Customize Update Labels.
- **Details**:
  - **Logic Change**: Differentiated the "Update by" text based on role.
  - **Admin (Group 1)**: Now displays as **"Update by Admin-SDI"**.
  - **SPV (Group 2)**: Now displays the actual full name (e.g., **"Update by [Name]"**), same as regular users.

#### **11. Update Logika: Label Pembaruan**
- **Waktu**: 30 Des 2025, 11:00 PAGI
- **Perintah/Aksi**: Kustomisasi Label Update.
- **Detail**:
  - **Perubahan Logika**: Membedakan teks "Update by" berdasarkan peran.
  - **Admin (Grup 1)**: Sekarang ditampilkan sebagai **"Update by Admin-SDI"**.
  - **SPV (Grup 2)**: Sekarang menampilkan nama lengkap asli user (misal, **"Update by [Nama]"**), sama seperti user biasa.

#### **12. Feature: Detailed Export Column**
- **Time**: 30 Dec 2025, 11:05 AM
- **Command/Action**: Add Export Column.
- **Details**:
  - **New Column**: Added "Close Update by" column to the Excel export, positioned next to "Close By".
  - **Content**: Contains the detailed updater info (Name + Timestamp) with line breaks, matching the UI format exactly.
  - **Logic**: Replicates the "Admin-SDI" vs Real Name display logic used in the main table.

#### **12. Fitur: Kolom Ekspor Detail**
- **Waktu**: 30 Des 2025, 11:05 PAGI
- **Perintah/Aksi**: Tambah Kolom Ekspor.
- **Detail**:
  - **Kolom Baru**: Menambahkan kolom "Close Update by" pada ekspor Excel, diposisikan di sebelah "Close By".
  - **Konten**: Berisi info pembaruan detail (Nama + Waktu) dengan baris baru, persis seperti format UI.
  - **Logika**: Mereplikasi logika tampilan "Admin-SDI" vs Nama Asli yang digunakan di tabel utama.

#### **13. Network Configuration: IP-Based Access**
- **Time**: 30 Dec 2025, 11:25 AM
- **Command/Action**: Enable LAN Access.
- **Details**:
  - **Action**: Configured application to run on specific IP Address (`127.0.0.1`) instead of `127.0.0.1`.
  - **Backend**: Verified Server listens on all interfaces (Port 3001).
  - **Frontend**: Updated `vite.config.js` with `server: { host: true }` to expose the dev server.
  - **API Calls**: Hardcoded all axios requests in `ComplaintList`, `Login`, `UserManagement`, and `MasterRef` to point to `http://127.0.0.1:3001`.

#### **13. Konfigurasi Jaringan: Akses Berbasis IP**
- **Waktu**: 30 Des 2025, 11:25 PAGI
- **Perintah/Aksi**: Aktifkan Akses LAN.
- **Detail**:
  - **Aksi**: Mengkonfigurasi aplikasi agar berjalan pada Alamat IP spesifik (`127.0.0.1`) alih-alih `127.0.0.1`.
  - **Backend**: Memastikan Server mendengarkan pada semua antarmuka (Port 3001).
  - **Frontend**: Memperbarui `vite.config.js` dengan `server: { host: true }` untuk mengekspos dev server.
  - **Panggilan API**: Mengubah semua request axios di `ComplaintList`, `Login`, `UserManagement`, dan `MasterRef` agar mengarah ke `http://127.0.0.1:3001`.

#### **14. UI/UX Enhancements: Sidebar & Layout**
- **Time**: 30 Dec 2025, 01:20 PM
- **Command/Action**: Implement Auto-Hide Sidebar & Adjust Layout.
- **Details**:
  - **Auto-Hide Sidebar**: Implemented CSS-based auto-hide logic. Sidebar is now hidden off-screen (`translateX(-245px)`) by default, exposing only a 15px trigger strip. It expands fully (`translateX(0)`) on hover.
  - **Full Screen Layout**: Adjusted Main Content to take full width (`margin-left: 0`) since the sidebar is hidden, maximizing workspace.
  - **Button Relocation**: Moved the "Add Data" button in Complaint List to be positioned strictly below the title/description text, aligned to the left.

#### **14. Peningkatan UI/UX: Sidebar & Tata Letak**
- **Waktu**: 30 Des 2025, 01:20 SIANG
- **Perintah/Aksi**: Implementasi Sidebar Auto-Hide & Sesuaikan Layout.
- **Detail**:
  - **Sidebar Auto-Hide**: Mengimplementasikan logika auto-hide berbasis CSS. Sidebar sekarang tersembunyi di luar layar (`translateX(-245px)`) secara default, hanya menyisakan strip pemicu selebar 15px. Sidebar akan meluas sepenuhnya (`translateX(0)`) saat kursor diarahkan (hover).
  - **Layout Layar Penuh**: Menyesuaikan Konten Utama untuk mengambil lebar penuh (`margin-left: 0`) karena sidebar tersembunyi, memaksimalkan ruang kerja.
  - **Relokasi Tombol**: Memindahkan tombol "Add Data" di Daftar Komplain agar diposisikan tepat di bawah teks judul/deskripsi, rata kiri.

#### **15. Interaction Polish: Content Shift**
- **Time**: 30 Dec 2025, 01:25 PM
- **Command/Action**: Sync Sidebar and Content Movement.
- **Details**:
  - **Behavior**: Implemented CSS sibling selector (`.sidebar:hover ~ .main-content`) logic.
  - **Effect**: When the sidebar expands on hover, the main content area (including Table and Search Filters) now smoothly slides (`margin-left`) to the right by `260px` to avoid being covered, creating a responsive, cohesive "push" effect.
  - **Transition**: Added matching `0.3s ease-in-out` transition to `.main-content` to ensure the movement is perfectly synchronized with the sidebar animation.

#### **15. Pemolesan Interaksi: Pergeseran Konten**
- **Waktu**: 30 Des 2025, 01:25 SIANG
- **Perintah/Aksi**: Sinkronisasi Gerakan Sidebar dan Konten.
- **Detail**:
  - **Perilaku**: Mengimplementasikan logika selektor saudara CSS (`.sidebar:hover ~ .main-content`).
  - **Efek**: Saat sidebar meluas ketika di-hover, area konten utama (termasuk Tabel dan Filter Pencarian) sekarang bergeser (`margin-left`) ke kanan sejauh `260px` secara halus agar tidak tertutup, menciptakan efek "dorong" yang responsif.
  - **Transisi**: Menambahkan transisi `0.3s ease-in-out` yang cocok pada `.main-content` untuk memastikan gerakan tersinkronisasi sempurna dengan animasi sidebar.

#### **16. Login Branding: Trade & Remittance**
- **Time**: 30 Dec 2025, 02:20 PM
- **Command/Action**: Update Login UI Asset.
- **Details**:
  - **Asset Integration**: Imported new "Trade & Remittance" logo (globe icon with text) as `client/src/assets/trade_remittance.png`.
  - **UI Replacement**: Removed the generic "B" character box and "Welcome Back" text from the Login screen.
  - **New Design**: Replaced the entire header section of the login card with the new logo image, centered with `maxWidth: 280px` for optimal sizing.

#### **16. Branding Login: Trade & Remittance**
- **Waktu**: 30 Des 2025, 02:20 SIANG
- **Perintah/Aksi**: Perbarui Aset UI Login.
- **Detail**:
  - **Integrasi Aset**: Mengimpor logo baru "Trade & Remittance" (ikon bola dunia dengan teks) sebagai `client/src/assets/trade_remittance.png`.
  - **Penggantian UI**: Menghapus kotak karakter "B" generik dan teks "Welcome Back" dari layar Login.
  - **Desain Baru**: Mengganti seluruh bagian header kartu login dengan gambar logo baru, dipusatkan dengan `maxWidth: 280px` untuk ukuran optimal.

#### **17. UI Adjustment: Resized Login**
- **Time**: 30 Dec 2025, 02:25 PM
- **Command/Action**: Increase Login Visibility.
- **Details**:
  - **Login Card**: Increased width from `400px` to **`500px`** to provide a larger canvas.
  - **Logo Image**: Increased max-width from `280px` to **`380px`** to ensure the "Trade & Remittance" text and globe icon are clearly visible and legible.

#### **17. Penyesuaian UI: Ukuran Login**
- **Waktu**: 30 Des 2025, 02:25 SIANG
- **Perintah/Aksi**: Meningkatkan Visibilitas Login.
- **Detail**:
  - **Kartu Login**: Lebar ditingkatkan dari `400px` menjadi **`500px`** untuk memberikan area yang lebih luas.
  - **Gambar Logo**: Max-width ditingkatkan dari `280px` menjadi **`380px`** untuk memastikan teks "Trade & Remittance" dan ikon bola dunia terlihat jelas dan mudah dibaca.

#### **18. Visual Design: Picture Frame Login**
- **Time**: 30 Dec 2025, 02:40 PM
- **Command/Action**: Match Login UI to Reference Image.
- **Details**:
  - **Styles Applied**:
    - **Container**: Changed page background to `var(--primary)` gradient.
    - **Card**: Transformed into a "Picture Frame" style with a heavy **16px solid primary border** and **30px border-radius**.
    - **Inputs**: Updated styling for cleaner look (lighter borders, larger padding, gray icons).
    - **Labels**: Made labels darker gray and bold (`fontWeight: 700`) to match the reference.
    - **Button**: Full-width primary button with standard border-radius.

#### **18. Desain Visual: Login Gaya Bingkai Foto**
- **Waktu**: 30 Des 2025, 02:40 SIANG
- **Perintah/Aksi**: Sesuaikan UI Login dengan Gambar Referensi.
- **Detail**:
  - **Gaya yang Diterapkan**:
    - **Wadah**: Mengubah latar belakang halaman menjadi gradien `var(--primary)`.
    - **Kartu**: Diubah menjadi gaya "Bingkai Foto" dengan **border solid primer 16px** yang tebal dan **border-radius 30px**.
    - **Input**: Memperbarui gaya untuk tampilan yang lebih bersih (border lebih terang, padding lebih besar, ikon abu-abu).
    - **Label**: Membuat label abu-abu lebih gelap dan tebal (`fontWeight: 700`) agar sesuai dengan referensi.
    - **Tombol**: Tombol primer lebar penuh dengan border-radius standar.

#### **19. Visual Correction: Login Border**
- **Time**: 30 Dec 2025, 02:45 PM
- **Command/Action**: Revert Card Border.
- **Details**:
  - **Correction**: User clarified the reference image was for the *Logo/Text size*, not the card border style.
  - **Action**: Removed the 16px thick primary border from the Login card. Restored a cleaner, standard `1.5rem` border-radius.
  - **Maintained**: Kept the enlarged Globe/Text image (`380px`) and the 500px card width as requested.

#### **19. Koreksi Visual: Border Login**
- **Waktu**: 30 Des 2025, 02:45 SIANG
- **Perintah/Aksi**: Kembalikan Border Kartu.
- **Detail**:
  - **Koreksi**: User mengklarifikasi gambar referensi adalah untuk *Ukuran Logo/Teks*, bukan gaya border kartu.
  - **Aksi**: Menghapus border primer setebal 16px dari kartu Login. Mengembalikan border-radius standar `1.5rem`.
  - **Dipertahankan**: Tetap menjaga gambar Globe/Teks yang diperbesar (`380px`) dan lebar kartu 500px sesuai permintaan.

#### **20. Final Visual Polish: Logo Alignment**
- **Time**: 30 Dec 2025, 03:00 PM
- **Command/Action**: Optimize Logo Width.
- **Details**:
  - **Asset Update**: Replaced `trade_remittance.png` with a new, refined version `trade_remittance_new.png`.
  - **Zoom/Alignment**: Adjusted the image style to `width: 100%`. This forces the logo to span the full available width of the login card (matching the `form-input` width exactly), ensuring the "zoom" and alignment of the text/globe fit perfectly with the Username and Password fields as requested.

#### **20. Pemolesan Visual Akhir: Penyelarasan Logo**
- **Waktu**: 30 Des 2025, 03:00 SIANG
- **Perintah/Aksi**: Optimalkan Lebar Logo.
- **Detail**:
  - **Pembaruan Aset**: Mengganti `trade_remittance.png` dengan versi baru yang disempurnakan `trade_remittance_new.png`.
  - **Zoom/Penyelarasan**: Menyesuaikan gaya gambar menjadi `width: 100%`. Ini memaksa logo untuk membentang sepanjang lebar yang tersedia di kartu login (cocok persis dengan lebar `form-input`), memastikan "zoom" dan penyelarasan teks/bola dunia pas dengan kolom Username dan Password sesuai permintaan.

#### **21. Feature: Day Date Filter**
- **Time**: 30 Dec 2025, 03:00 PM
- **Command/Action**: Add Day Filter to Search.
- **Details**:
  - **Frontend**: Added a "Day" dropdown (1-31) to the search filters in `ComplaintList.jsx`.
  - **Layout**: Positioned the "Day" filter to the left of the "Month" filter as requested (Order: Day, Month, Year).
  - **Backend**: Updated `/api/complaints` endpoint to accept `f_day` parameter and filter by `DAY(tgl_open)`.
  - **Scope**: Applied to all user roles (Admin, SPV, User) as it is part of the common search interface.

#### **21. Fitur: Filter Tanggal Hari**
- **Waktu**: 30 Des 2025, 03:00 SIANG
- **Perintah/Aksi**: Tambah Filter Hari ke Pencarian.
- **Detail**:
  - **Frontend**: Menambahkan dropdown "Day" (1-31) ke filter pencarian di `ComplaintList.jsx`.
  - **Tata Letak**: Memposisikan filter "Day" di sebelah kiri filter "Month" sesuai permintaan (Urutan: Day, Month, Year).
  - **Backend**: Memperbarui endpoint `/api/complaints` untuk menerima parameter `f_day` dan memfilter berdasarkan `DAY(tgl_open)`.
  - **Cakupan**: Diterapkan ke semua peran pengguna (Admin, SPV, User) karena merupakan bagian dari antarmuka pencarian umum.

#### **22. Logic Update: Smart Day Filter**
- **Time**: 30 Dec 2025, 03:05 PM
- **Command/Action**: Dynamic Day Options.
- **Details**:
  - **Logic**: Updated the "Days" dropdown to dynamically calculate the number of days based on the selected **Month** and **Year**.
  - **Calculation**: Uses `new Date(year, month, 0).getDate()` to get the exact day count.
  - **Fallback**: Defaults to current year if Year is not selected (handling Leap Years for Feb correctly if year matches current year, otherwise standard). Defaults to 31 days if Month is not selected.
  - **Example**: Selecting 'February' now shows days 1-28 (or 1-29 if a leap year is selected), preventing invalid date selections.

#### **22. Update Logika: Filter Hari Cerdas**
- **Waktu**: 30 Des 2025, 03:05 SIANG
- **Perintah/Aksi**: Opsi Hari Dinamis.
- **Detail**:
  - **Logika**: Memperbarui dropdown "Hari" untuk menghitung jumlah hari secara dinamis berdasarkan **Bulan** dan **Tahun** yang dipilih.
  - **Perhitungan**: Menggunakan `new Date(year, month, 0).getDate()` untuk mendapatkan jumlah hari yang tepat.
  - **Fallback**: Default ke tahun berjalan jika Tahun tidak dipilih (menangani Tahun Kabisat untuk Feb dengan benar jika tahun cocok dengan tahun berjalan, jika tidak standar). Default ke 31 hari jika Bulan tidak dipilih.
  - **Contoh**: Memilih 'Februari' sekarang menampilkan hari 1-28 (atau 1-29 jika tahun kabisat dipilih), mencegah pemilihan tanggal yang tidak valid.

#### **23. UX Enhancement: Read Full Text**
- **Time**: 30 Dec 2025, 03:15 PM
- **Command/Action**: Implement "See All" for Long Text.
- **Details**:
  - **Feature**: Added truncation and "See All" functionality to the **Question / Complaint** and **Answer / Follow Up** columns in the Complaint List.
  - **Behavior**: If text exceeds 50 characters, it is truncated with an ellipsis (`...`) and a "See All" link appears. Clicking this opens a dedicated modal displaying the full, scrollable text.
  - **Access**: This feature is available to **All Users** (Admin, SPV, Regular Users) to ensure full readability of complaints details without breaking the table layout.

#### **23. Peningkatan UX: Baca Teks Lengkap**
- **Waktu**: 30 Des 2025, 03:15 SIANG
- **Perintah/Aksi**: Implementasi "See All" untuk Teks Panjang.
- **Detail**:
  - **Fitur**: Menambahkan fitur pemangkasan dan "See All" pada kolom **Question / Complaint** dan **Answer / Follow Up** di Daftar Komplain.
  - **Perilaku**: Jika teks melebihi 50 karakter, teks akan dipangkas dengan ellipsis (`...`) dan tautan "See All" muncul. Mengklik ini akan membuka modal khusus yang menampilkan teks lengkap yang dapat digulir.
  - **Akses**: Fitur ini tersedia untuk **Semua Pengguna** (Admin, SPV, Pengguna Biasa) untuk memastikan detail komplain dapat dibaca sepenuhnya tanpa merusak tata letak tabel.

#### **24. Visual Polish: See All Card**
- **Time**: 30 Dec 2025, 03:25 PM
- **Command/Action**: Style "See All" and Fix Text Wrap.
- **Details**:
  - **Button**: Styled the "See All" trigger as a transparent gradient card (`background: linear-gradient`, `backdropFilter: blur(2px)`) to look more like a premium UI element rather than plain text.
  - **Modal Text**: Implemented `wordBreak: 'break-word'` and `overflowWrap: 'break-word'` in the text modal. This forces long strings (like URLs without spaces) to break vertically, preventing unwanted horizontal scrolling and ensuring all text is readable vertically.

#### **24. Pemolesan Visual: Kartu "See All"**
- **Waktu**: 30 Des 2025, 03:25 SIANG
- **Perintah/Aksi**: Gaya "See All" dan Perbaiki Bungkus Teks.
- **Detail**:
  - **Tombol**: Mengubah gaya pemicu "See All" menjadi kartu gradien transparan (`background: linear-gradient`, `backdropFilter: blur(2px)`) agar terlihat lebih seperti elemen UI premium daripada teks biasa.
  - **Teks Modal**: Mengimplementasikan `wordBreak: 'break-word'` dan `overflowWrap: 'break-word'` di dalam modal teks. Ini memaksa string panjang (seperti URL tanpa spasi) untuk terputus secara vertikal, mencegah pengguliran horizontal yang tidak diinginkan dan memastikan semua teks dapat dibaca secara vertikal.

#### **25. Interaction Polish: Close on Overlay Click**
- **Time**: 30 Dec 2025, 03:30 PM
- **Command/Action**: Enhance Modal UX.
- **Details**:
  - **Click Outside to Close**: Added an `onClick` handler to the "See All" modal's background overlay (backdrop). Clicking anywhere outside the modal content now automatically closes the popup.
  - **Stop Propagation**: Added `e.stopPropagation()` to the modal content card itself to ensure clicking *inside* the card does not accidentally triggering the close action.

#### **25. Pemolesan Interaksi: Tutup Saat Klik Overlay**
- **Waktu**: 30 Des 2025, 03:30 SIANG
- **Perintah/Aksi**: Meningkatkan UX Modal.
- **Detail**:
  - **Klik Di Luar untuk Menutup**: Menambahkan handler `onClick` ke overlay latar belakang (backdrop) modal "See All". Mengklik di mana saja di luar konten modal sekarang secara otomatis menutup popup.
  - **Hentikan Propagasi**: Menambahkan `e.stopPropagation()` ke kartu konten modal itu sendiri untuk memastikan mengklik *di dalam* kartu tidak secara tidak sengaja memicu tindakan penutupan.

#### **26. UI Uniformity: Limit Text & Align "See All"**
- **Time**: 30 Dec 2025, 03:35 PM
- **Command/Action**: Standardize Text Limits.
- **Details**:
  - **Character Limit**: Restrict displayed text in Question/Answer columns to a strict **20 characters** (reduced from 50) to ensure uniform row heights and column widths.
  - **Layout**: Used a `flex-col` container to force the "See All" button onto a **new line** directly below the truncated text.
  - **Consistency**: This ensures every row with long text looks identical: a short snippet followed by a neatly aligned "See All" button, matching the user's reference image for a clean, grid-like appearance.

#### **26. Keseragaman UI: Batasi Teks & Ratakan "See All"**
- **Waktu**: 30 Des 2025, 03:35 SIANG
- **Perintah/Aksi**: Standarisasi Batas Teks.
- **Detail**:
  - **Batas Karakter**: Membatasi teks yang ditampilkan di kolom Pertanyaan/Jawaban hingga **20 karakter** ketat (dikurangi dari 50) untuk memastikan tinggi baris dan lebar kolom yang seragam.
  - **Tata Letak**: Menggunakan wadah `flex-col` untuk memaksa tombol "See All" ke **baris baru** tepat di bawah teks yang dipangkas.
  - **Konsistensi**: Ini memastikan setiap baris dengan teks panjang terlihat identik: cuplikan pendek diikuti oleh tombol "See All" yang tertata rapi, sesuai dengan gambar referensi pengguna untuk tampilan seperti kisi yang bersih.

#### **27. Layout Optimization: Responsive Table Columns**
- **Time**: 30 Dec 2025, 03:45 PM
- **Command/Action**: Optimize Table Layout for 100% Zoom.
- **Details**:
  - **Min-Widths**: Applied explicit `min-width` and `white-space: nowrap` to all table headers. This guarantees that columns (like "No Ticket", "Customer Type", "Dates") maintain a readable width and do not collapse or wrap text awkwardly, even when the screen is zoomed or resized.
  - **Readability**: This ensures that valid column content is always fully visible (not cut off) and maintains a neat, professional structure across different monitor sizes, triggering horizontal scrolling only when absolutely necessary to preserve content integrity.

#### **27. Optimasi Tata Letak: Kolom Tabel Responsif**
- **Waktu**: 30 Des 2025, 03:45 SIANG
- **Perintah/Aksi**: Optimalkan Tata Letak Tabel untuk Zoom 100%.
- **Detail**:
  - **Min-Widths**: Menerapkan `min-width` dan `white-space: nowrap` secara eksplisit ke semua header tabel. Ini menjamin bahwa kolom (seperti "No Ticket", "Customer Type", "Dates") mempertahankan lebar yang dapat dibaca dan tidak runtuh atau membungkus teks secara aneh, bahkan ketika layar di-zoom atau diubah ukurannya.
  - **Keterbacaan**: Ini memastikan bahwa konten kolom yang valid selalu terlihat sepenuhnya (tidak terpotong) dan mempertahankan struktur yang rapi dan profesional di berbagai ukuran monitor, memicu pengguliran horizontal hanya jika benar-benar diperlukan untuk menjaga integritas konten.

#### **28. UI Alignment: Center & Remove Scroll**
- **Time**: 30 Dec 2025, 03:55 PM
- **Command/Action**: Center align columns and fit to screen.
- **Details**:
  - **Center Alignment**: Applied `textAlign: 'center'` to headers and cell content for **No Ticket**, **Tgl Open/Open By**, **Tgl Close/Close By**, **Duration**, and **Action** columns.
  - **No Scroll 100%**: Removed fixed large `min-width` constraints and `white-space: nowrap` from most columns. This allows the table to fluidly adapt to the 100% zoom level viewport without forcing a horizontal scrollbar. Content will now naturally wrap or adjust to fit the available screen width.

#### **28. Penyelarasan UI: Tengah & Hapus Scroll**
- **Waktu**: 30 Des 2025, 03:55 SIANG
- **Perintah/Aksi**: Ratakan tengah kolom dan paskan ke layar.
- **Detail**:
  - **Penyelarasan Tengah**: Menerapkan `textAlign: 'center'` pada header dan isi sel untuk kolom **No Ticket**, **Tgl Open/Open By**, **Tgl Close/Close By**, **Duration**, dan **Action**.
  - **Tanpa Scroll 100%**: Menghapus batasan `min-width` besar yang tetap dan `white-space: nowrap` dari sebagian besar kolom. Ini memungkinkan tabel beradaptasi secara cair dengan viewport tingkat zoom 100% tanpa memaksakan scrollbar horizontal. Konten sekarang akan secara alami membungkus atau menyesuaikan agar sesuai dengan lebar layar yang tersedia.

#### **29. Visual & Branding Updates**
- **Time**: 30 Dec 2025, 04:05 PM
- **Command/Action**: Update Logo, Titles, and Centering.
- **Details**:
  - **Sidebar Logo**: Replaced the 'B' placeholder icon with the `trade_remittance_new.png` image, resized to fit the sidebar width.
  - **App Title**: Changed "BNI App Complaint System" to "Database Trade & Remittance" in the sidebar.
  - **Menu/Page Title**: Renamed "Complaint List" to "Data List" in both the Sidebar menu and the Complaint List page header.
  - **Action Column**: Ensured the edit/delete/view icons in the "Action" column are vertically and horizontally centered using `flex items-center justify-center`.
  - **Scope**: Applied universally to all user roles.

#### **29. Pembaruan Visual & Branding**
- **Waktu**: 30 Des 2025, 04:05 SIANG
- **Perintah/Aksi**: Perbarui Logo, Judul, dan Pemusatan.
- **Detail**:
  - **Logo Sidebar**: Mengganti ikon placeholder 'B' dengan gambar `trade_remittance_new.png`, diubah ukurannya agar sesuai dengan lebar sidebar.
  - **Judul Aplikasi**: Mengubah "BNI App Complaint System" menjadi "Database Trade & Remittance" di sidebar.
  - **Judul Menu/Halaman**: Mengubah nama "Complaint List" menjadi "Data List" baik di menu Sidebar maupun header halaman Daftar Komplain.
  - **Kolom Aksi**: Memastikan ikon edit/hapus/lihat di kolom "Action" dipusatkan secara vertikal dan horizontal menggunakan `flex items-center justify-center`.
  - **Cakupan**: Diterapkan secara universal untuk semua peran pengguna.

#### **30. Visual Polish: Resize Sidebar Logo**
- **Time**: 30 Dec 2025, 04:15 PM
- **Command/Action**: Resize Sidebar Logo.
- **Details**:
  - **Adjustment**: Reduced the `maxWidth` of the sidebar logo from **180px** to **120px**.
  - **Styling**: Added `borderRadius: '8px'` to soften the edges of the image container.
  - **Goal**: To make the sidebar header look neater, more balanced, and less overwhelming within the sidebar's width.

#### **30. Pemolesan Visual: Ubah Ukuran Logo Sidebar**
- **Waktu**: 30 Des 2025, 04:15 SIANG
- **Perintah/Aksi**: Ubah Ukuran Logo Sidebar.
- **Detail**:
  - **Penyesuaian**: Mengurangi `maxWidth` logo sidebar dari **180px** menjadi **120px**.
  - **Gaya**: Menambahkan `borderRadius: '8px'` untuk memperhalus tepi wadah gambar.
  - **Tujuan**: Untuk membuat header sidebar terlihat lebih rapi, lebih seimbang, dan tidak terlalu mendominasi lebar sidebar.

#### **31. Visual Polish: Further Reduce Logo Size**
- **Time**: 30 Dec 2025, 04:25 PM
- **Command/Action**: Resize Sidebar Logo to 70px.
- **Details**:
  - **Adjustment**: Further reduced the `maxWidth` of the sidebar logo from **120px** to **70px**.
  - **Reason**: To make the logo even more compact and neat as per user feedback, ensuring maximum whitespace and a cleaner look for the sidebar header.

#### **31. Pemolesan Visual: Perkecil Lagi Ukuran Logo**
- **Waktu**: 30 Des 2025, 04:25 SIANG
- **Perintah/Aksi**: Ubah Ukuran Logo Sidebar menjadi 70px.
- **Detail**:
  - **Penyesuaian**: Mengurangi lebih lanjut `maxWidth` logo sidebar dari **120px** menjadi **70px**.
  - **Alasan**: Untuk membuat logo menjadi lebih kompak dan rapi sesuai masukan pengguna, memastikan ruang kosong yang maksimal dan tampilan header sidebar yang lebih bersih.

#### **32. Visual Update: Sidebar Header Layout**
- **Time**: 30 Dec 2025, 04:35 PM
- **Command/Action**: Align Sidebar Header to Left.
- **Details**:
  - **Layout**: Changed the sidebar header from a vertical stack (`flex-col`) to a horizontal row (`flex-row`).
  - **Alignment**: The logo and text are now displayed **side-by-side** and aligned to the **left (start)**.
  - **Spacing**: Added a `gap` of `1rem` between the 70px logo and the title text.
  - **Goal**: This reduces the vertical height occupied by the header, making the sidebar look less "long" and more compact, as requested ("rata kiri... supaya sidebar tidak terlalu panjang").

#### **32. Pembaruan Visual: Tata Letak Header Sidebar**
- **Waktu**: 30 Des 2025, 04:35 SIANG
- **Perintah/Aksi**: Ratakan Kiri Header Sidebar.
- **Detail**:
  - **Tata Letak**: Mengubah header sidebar dari tumpukan vertikal (`flex-col`) menjadi baris horizontal (`flex-row`).
  - **Penyelarasan**: Logo dan teks sekarang ditampilkan **berdampingan** dan diratakan ke **kiri**.
  - **Jarak**: Menambahkan `gap` sebesar `1rem` antara logo 70px dan teks judul.
  - **Tujuan**: Ini mengurangi ketinggian vertikal yang ditempati oleh header, membuat sidebar terlihat tidak terlalu "panjang" dan lebih ringkas, seperti yang diminta ("rata kiri... supaya sidebar tidak terlalu panjang").

#### **33. UI Fix: Hard Center Action Column**
- **Time**: 30 Dec 2025, 04:45 PM
- **Command/Action**: Force Center Action Icons.
- **Details**:
  - **CSS Update**: Added `textAlign: 'center'` and `verticalAlign: 'middle'` directly to the `<td>` element of the Action column.
  - **Reason**: The flexbox container inside the cell was centering content *within itself*, but if the cell had extra height or width quirks, it might still look off-center. Applying styles to the `<td>` guarantees the content is centered relative to the entire table cell box.

#### **33. Perbaikan UI: Paksa Tengah Kolom Aksi**
- **Waktu**: 30 Des 2025, 04:45 SIANG
- **Perintah/Aksi**: Paksa Ikon Aksi ke Tengah.
- **Detail**:
  - **Pembaruan CSS**: Menambahkan `textAlign: 'center'` dan `verticalAlign: 'middle'` secara langsung ke elemen `<td>` dari kolom Action.
  - **Alasan**: Wadah flexbox di dalam sel memusatkan konten *di dalam dirinya sendiri*, tetapi jika sel memiliki keunikan tinggi atau lebar tambahan, itu mungkin masih terlihat tidak di tengah. Menerapkan gaya pada `<td>` menjamin konten dipusatkan relatif terhadap seluruh kotak sel tabel.

#### **34. Branding: Browser Tab Icon & Title**
- **Time**: 30 Dec 2025, 04:55 PM
- **Command/Action**: Update Favicon and Page Title.
- **Details**:
  - **Favicon**: Updated the browser tab icon (`favicon`) to use the `trade_remittance_new.png` logo, replacing the default Vite logo. Use `copy` command to move asset to `public` folder and updated `index.html`.
  - **Page Title**: Updated the browser tab title from "client" to "Database Trade & Remittance" for professional consistency.

#### **34. Branding: Ikon & Judul Tab Browser**
- **Waktu**: 30 Des 2025, 04:55 SIANG
- **Perintah/Aksi**: Perbarui Favicon dan Judul Halaman.
- **Detail**:
  - **Favicon**: Memperbarui ikon tab browser (`favicon`) menggunakan logo `trade_remittance_new.png`, menggantikan logo Vite default. Menggunakan perintah `copy` untuk memindahkan aset ke folder `public` dan memperbarui `index.html`.
  - **Judul Halaman**: Memperbarui judul tab browser dari "client" menjadi "Database Trade & Remittance" untuk konsistensi profesional.

#### **35. Branding: Shorten Tab Title**
- **Time**: 30 Dec 2025, 05:05 PM
- **Command/Action**: Updates Page Title.
- **Details**:
  - **Correction**: Shortened the browser tab title from "Database Trade & Remittance" to just "**Trade & Remittance**" as per specific user request.

#### **35. Branding: Persingkat Judul Tab**
- **Waktu**: 30 Des 2025, 05:05 SIANG
- **Perintah/Aksi**: Memperbarui Judul Halaman.
- **Detail**:
  - **Koreksi**: Mempersingkat judul tab browser dari "Database Trade & Remittance" menjadi hanya "**Trade & Remittance**" sesuai permintaan khusus pengguna.

#### **36. Data Format: Branch Dropdown**
- **Time**: 30 Dec 2025, 05:55 PM
- **Command/Action**: Enhance Branch Dropdown Display.
- **Details**:
  - **Display Format**: Updated the "Branch" dropdown option label in both the Search Filter and Add/Edit Data form.
  - **New Format**: It now displays `kode_brc, sandi_brc, name_brc` (e.g., "123, BNI01, Jakarta Branch") instead of just `name_brc`.
  - **Universal Application**: This change applies to all user roles (Admin, SPV, User) as it modifies the core component rendering logic.

#### **36. Format Data: Dropdown Cabang**
- **Waktu**: 30 Des 2025, 05:55 SIANG
- **Perintah/Aksi**: Meningkatkan Tampilan Dropdown Cabang.
- **Detail**:
  - **Format Tampilan**: Memperbarui label opsi dropdown "Branch" baik di Filter Pencarian maupun formulir Tambah/Edit Data.
  - **Format Baru**: Sekarang menampilkan `kode_brc, sandi_brc, name_brc` (contoh: "123, BNI01, Cabang Jakarta") alih-alih hanya `name_brc`.
  - **Aplikasi Universal**: Perubahan ini berlaku untuk semua peran pengguna (Admin, SPV, User) karena memodifikasi logika rendering komponen inti.

#### **37. Data Format: Branch Separator**
- **Time**: 30 Dec 2025, 06:00 PM
- **Command/Action**: Change Separator in Branch Dropdown.
- **Details**:
  - **Change**: Updated the separator in the Branch dropdown items from a comma (`,`) to a dash (`-`).
  - **New Format**: `kode_brc - sandi_brc - name_brc` (e.g., "123 - BNI01 - Jakarta Branch").
  - **Visuals**: Provides cleaner separation between the data points.

#### **37. Format Data: Pemisah Cabang**
- **Waktu**: 30 Des 2025, 06:00 SIANG
- **Perintah/Aksi**: Ubah Pemisah di Dropdown Cabang.
- **Detail**:
  - **Perubahan**: Memperbarui pemisah pada item dropdown Cabang dari koma (`,`) menjadi strip (`-`).
  - **Format Baru**: `kode_brc - sandi_brc - name_brc` (contoh: "123 - BNI01 - Cabang Jakarta").
  - **Visual**: Memberikan pemisahan yang lebih bersih antara titik data.

#### **38. UI Optimization: Zoom, Animation & Sidebar Alignment**
- **Time**: 30 Dec 2025, 06:10 PM
- **Command/Action**: Apply Zoom, Smooth Sidebar, and Center Bottom Items.
- **Details**:
  - **Default Zoom**: Set `zoom: 90%` on the `body` element to scale down the entire interface by default.
  - **Sidebar Animation**: Updated the sidebar transition to `0.4s cubic-bezier(0.25, 0.8, 0.25, 1)` for a smoother, more natural auto-hide/reveal effect.
  - **Bottom Sidebar Alignment**:
    - Converted the bottom container (user info + logout) to a `flex-col` layout with `align-items: center`.
    - Wrapped the user info (name, role) in a centered flex container.
    - Centered the "Logout" button content.
  - **Result**: The user info and logout button are now perfectly centered at the bottom of the sidebar.

#### **38. Optimasi UI: Zoom, Animasi & Penyelarasan Sidebar**
- **Waktu**: 30 Des 2025, 06:10 SIANG
- **Perintah/Aksi**: Terapkan Zoom, Sidebar Halus, dan Tengahkan Item Bawah.
- **Detail**:
  - **Zoom Default**: Mengatur `zoom: 90%` pada elemen `body` untuk mengecilkan seluruh antarmuka secara default.
  - **Animasi Sidebar**: Memperbarui transisi sidebar menjadi `0.4s cubic-bezier(0.25, 0.8, 0.25, 1)` untuk efek sembunyi/tampil otomatis yang lebih halus dan alami.
  - **Penyelarasan Sidebar Bawah**:
    - Mengubah wadah bawah (info pengguna + logout) menjadi tata letak `flex-col` dengan `align-items: center`.
    - Membungkus info pengguna (nama, jabatan) dalam wadah fleksibel yang dipusatkan.
    - Memusatkan konten tombol "Logout".
  - **Hasil**: Info pengguna dan tombol logout sekarang berada tepat di tengah bagian bawah sidebar.

#### **39. Bug Fix: Sidebar Height**
- **Time**: 30 Dec 2025, 04:02 PM
- **Command/Action**: Fix "Hanging" Sidebar.
- **Details**:
  - **Issue**: The sidebar appeared "hanging" (gap at bottom) because `height: 100vh` was calculated against the viewport *before* the `zoom: 90%` scaling was applied, or resulted in a mismatch in pixels.
  - **Fix**: Replaced `height: 100vh` with `bottom: 0` (anchoring top and bottom). This forces the sidebar to stretch to the full available vertical space of the viewport, regardless of the zoom level.
  - **Scope**: Applied to the global `.sidebar` CSS class, fixing it for all user roles.

#### **39. Perbaikan Bug: Tinggi Sidebar**
- **Waktu**: 30 Des 2025, 04:02 SORE
- **Perintah/Aksi**: Perbaiki Sidebar "Menggantung".
- **Detail**:
  - **Masalah**: Sidebar tampak "menggantung" (celah di bagian bawah) karena `height: 100vh` dihitung terhadap viewport *sebelum* penskalaan `zoom: 90%` diterapkan, atau mengakibatkan ketidakcocokan piksel.
  - **Perbaikan**: Mengganti `height: 100vh` dengan `bottom: 0` (menjangkarkan atas dan bawah). Ini memaksa sidebar untuk merentang ke seluruh ruang vertikal viewport yang tersedia, terlepas dari tingkat zoom.
  - **Cakupan**: Diterapkan pada kelas CSS `.sidebar` global, memperbaikinya untuk semua peran pengguna.

#### **40. Bug Fix: Login Layout**
- **Time**: 30 Dec 2025, 04:15 PM
- **Command/Action**: Fix Hanging Login & Reduce Gaps.
- **Details**:
  - **Hanging Fix**: Increased the login container `minHeight` to `112vh`. This compensates for the default `zoom: 90%` setting on the body, ensuring the background gradient fully covers the viewport without leaving a white bar at the bottom.
  - **Spacing Fix**: Reduced the margin below the "Trade & Remittance" logo from `2rem` to `0.5rem`. This tightens the gap between the logo and the Username field, removing the excessive whitespace.

#### **40. Perbaikan Bug: Tata Letak Login**
- **Waktu**: 30 Des 2025, 04:15 SORE
- **Perintah/Aksi**: Perbaiki Login Menggantung & Kurangi Celah.
- **Detail**:
  - **Perbaikan Menggantung**: Meningkatkan `minHeight` wadah login menjadi `112vh`. Ini mengkompensasi pengaturan default `zoom: 90%` pada body, memastikan gradien latar belakang menutupi viewport sepenuhnya tanpa meninggalkan bar putih di bagian bawah.
  - **Perbaikan Jarak**: Mengurangi margin di bawah logo "Trade & Remittance" dari `2rem` menjadi `0.5rem`. Ini memperkecil jarak antara logo dan kolom Username, menghilangkan ruang kosong yang berlebihan.

#### **41. Bug Fix: White Overlay & Zoom Issues**
- **Time**: 30 Dec 2025, 04:36 PM
- **Command/Action**: Refactor Zoom & Modals.
- **Details**:
  - **Issue**: Actions causing popups (Delete, Edit) showed a white page/gap because `zoom: 90%` on `body` scaled down the `100vh` overlay.
  - **Fix 1**: Moved `zoom: 90%` from `body` to `#root`.
  - **Fix 2**: Refactored `Popup.jsx` and created `Modal.jsx` to use **React Portals**. This renders overlays outside the zoomed root, ensuring they cover 100% of the screen.

#### **42. Bug Fix: Blank Data List Page**
- **Time**: 30 Dec 2025, 04:40 PM
- **Command/Action**: Fix Runtime Crash.
- **Details**:
  - **Issue**: Clicking "Data List" resulted in a blank page caused by the "See All" text modal trying to access properties of `null` when closed.
  - **Fix**: Implemented safe property access (`?.`) for the text view modal in `ComplaintList.jsx`.

#### **41. Perbaikan Bug: Overlay Putih & Masalah Zoom**
- **Waktu**: 30 Des 2025, 04:36 SORE
- **Perintah/Aksi**: Refactor Zoom & Modal.
- **Detail**:
  - **Masalah**: Aksi yang memunculkan popup (Hapus, Edit) menampilkan halaman/celah putih karena `zoom: 90%` pada `body` mengecilkan overlay `100vh`.
  - **Perbaikan 1**: Memindahkan `zoom: 90%` dari `body` ke `#root`.
  - **Perbaikan 2**: Merefaktor `Popup.jsx` dan membuat `Modal.jsx` untuk menggunakan **React Portals**. Ini merender overlay di luar root yang di-zoom, memastikannya menutupi 100% layar.

#### **42. Perbaikan Bug: Halaman Data List Kosong**
- **Waktu**: 30 Des 2025, 04:40 SORE
- **Perintah/Aksi**: Perbaiki Crash Runtime.
- **Detail**:
  - **Masalah**: Mengklik "Data List" menghasilkan halaman kosong disebabkan oleh modal "See All" yang mencoba mengakses properti dari `null` saat ditutup.
  - **Perbaikan**: Mengimplementasikan akses properti yang aman (`?.`) untuk modal tampilan teks di `ComplaintList.jsx`.

#### **43. Sidebar Enhancement: Live Search**
- **Time**: 30 Dec 2025, 04:50 PM
- **Command/Action**: Add Search to Master Menu.
- **Details**:
  - **Feature**: Added a real-time search input inside the "Master" sidebar submenu.
  - **Functionality**: Users can now type to filter the list of Master Data pages (e.g., "Branch", "BIC", "Product") instantly.
  - **UX**: Displays "No results" if the search query matches no items.

#### **44. Sidebar Restructuring: Users & Admin**
- **Time**: 30 Dec 2025, 04:55 PM
- **Command/Action**: Rename & Move Admin Menu.
- **Details**:
  - **Rename**: Changed the "Admin" menu label to **"Users"**.
  - **Relocation**: Moved the "Users" menu to position it **below** the "Master" menu (previously it was at the top).
  - **Access**: Remains visible only to users with `idgroup == 1` (Admin).

#### **45. UX Improvement: Master Add Button**
- **Time**: 30 Dec 2025, 05:00 PM
- **Command/Action**: Reposition Add Button.
- **Details**:
  - **Change**: Moved the "Add New" button in `MasterRef.jsx`.
  - **New Position**: Placed vertically **below** the "Master Data Management" description text, aligned to the left.
  - **Style**: layout adjusted to `flex-col` for the header section.

#### **46. New Feature: Activity Logs**
- **Time**: 30 Dec 2025, 05:15 PM
- **Command/Action**: Implement System & User Logging.
- **Details**:
  - **New Sidebar Menu**: Added "Activity Log" menu for **Admin (Group 1)** and **SPV (Group 2)**.
  - **Sub-menus**:
    1. **Log User**: Tracks user actions. Implemented auto-logging for **Login** events and **App Issue Reports**.
    2. **Log Aplikasi**: Dashboard to monitor system health.
  - **Database**: Created `tbl_activity_log_user` and `tbl_activity_log_app` tables.
  - **Backend**: Added `/api/activity` endpoints to handle log creation and retrieval.
  - **Auto-Log**: Every successful login now inserts a record into `tbl_activity_log_user` with IP address and timestamp.

#### **43. Peningkatan Sidebar: Pencarian Langsung**
- **Waktu**: 30 Des 2025, 04:50 SORE
- **Perintah/Aksi**: Tambah Pencarian ke Menu Master.
- **Detail**:
  - **Fitur**: Menambahkan input pencarian realtime di dalam submenu sidebar "Master".
  - **Fungsi**: Pengguna sekarang dapat mengetik untuk memfilter daftar halaman Data Master (misal: "Branch", "BIC", "Product") secara instan.
  - **UX**: Menampilkan "No results" jika query pencarian tidak cocok dengan item apa pun.

#### **44. Restrukturisasi Sidebar: Users & Admin**
- **Waktu**: 30 Des 2025, 04:55 SORE
- **Perintah/Aksi**: Ubah Nama & Pindahkan Menu Admin.
- **Detail**:
  - **Ubah Nama**: Mengubah label menu "Admin" menjadi **"Users"**.
  - **Relokasi**: Memindahkan menu "Users" ke posisi **di bawah** menu "Master" (sebelumnya ada di paling atas).
  - **Akses**: Tetap hanya terlihat oleh pengguna dengan `idgroup == 1` (Admin).

#### **45. Peningkatan UX: Tombol Tambah Master**
- **Waktu**: 30 Des 2025, 05:00 SORE
- **Perintah/Aksi**: Reposisi Tombol Tambah.
- **Detail**:
  - **Perubahan**: Memindahkan tombol "Add New" di `MasterRef.jsx`.
  - **Posisi Baru**: Ditempatkan secara vertikal **di bawah** teks deskripsi "Master Data Management", rata kiri.
  - **Gaya**: Tata letak disesuaikan menjadi `flex-col` untuk bagian header.

#### **46. Fitur Baru: Activity Logs**
- **Waktu**: 30 Des 2025, 05:15 SORE
- **Perintah/Aksi**: Implementasi Pencatatan Sistem & User.
- **Detail**:
  - **Menu Sidebar Baru**: Menambahkan menu "Activity Log" untuk **Admin (Grup 1)** dan **SPV (Grup 2)**.
  - **Sub-menu**:
    1. **Log User**: Melacak tindakan pengguna. Implementasi pencatatan otomatis untuk event **Login** dan **Laporan Masalah Aplikasi**.
    2. **Log Aplikasi**: Dashboard untuk memantau kesehatan sistem.
  - **Database**: Membuat tabel `tbl_activity_log_user` dan `tbl_activity_log_app`.
  - **Backend**: Menambahkan endpoint `/api/activity` untuk menangani pembuatan dan pengambilan log.
#### **47. Activity Logs: User Action Automation**
- **Time**: 30 Dec 2025, 05:25 PM
- **Command/Action**: Backend-based User Logging.
- **Details**:
  - **Feature**: Implemented automated logging for **ADD**, **EDIT**, and **DELETE** actions for both **Complaints** and **Master Data**.
  - **Implementation**: Extended the backend Node.js routes (`/api/complaints`, `/api/master`) to insert a record into `tbl_activity_log_user` immediately after a successful database transaction.
  - **Data Captured**: Logs the User ID (`iduser`), Action Type (e.g., `ADD_COMPLAINT`, `EDIT_MASTER`), Details (Ticket No or Item ID), and IP Address.

#### **48. Activity Logs: App Navigation & Health**
- **Time**: 30 Dec 2025, 05:35 PM
- **Command/Action**: Navigation & Performance Logger.
- **Details**:
  - **Navigation Log**: Created a `NavigationLogger` component that tracks every page visit (`useLocation`) and logs it to `tbl_activity_log_app` with status "Normal" (Safe).
  - **Performance Monitor**: Integrated a basic heuristic check (using `performance.memory` for Chrome or fallback) to detect high memory usage or rendering lags.
  - **Status**: If performance is degraded, the log status changes to **"Slow Network"** or **"Bug"**.

#### **49. Feature: Performance Warning Notification**
- **Time**: 30 Dec 2025, 05:40 PM
- **Command/Action**: Global Floating Warning.
- **Details**:
  - **Trigger**: If the application detects slowness or high cache usage (simulated by the performance monitor), a floating yellow warning appears.
  - **UI**: Displayed as a fixed banner at the top-right: "System Warning: Browser Cache Full / Slow App. Please clear cache."
  - **Scope**: visible to **All Roles** as requested.

#### **47. Activity Logs: Otomatisasi Aksi User**
- **Waktu**: 30 Des 2025, 05:25 SORE
- **Perintah/Aksi**: Pencatatan User Berbasis Backend.
- **Detail**:
  - **Fitur**: Mengimplementasikan pencatatan otomatis untuk aksi **TAMBAH**, **EDIT**, dan **HAPUS** baik untuk **Komplain** maupun **Data Master**.
  - **Implementasi**: Memperluas rute backend Node.js (`/api/complaints`, `/api/master`) untuk menyisipkan catatan ke `tbl_activity_log_user` segera setelah transaksi database berhasil.
  - **Data yang Ditangkap**: Mencatat ID User (`iduser`), Tipe Aksi (cth: `ADD_COMPLAINT`, `EDIT_MASTER`), Detail (No Tiket atau ID Item), dan Alamat IP.

#### **48. Activity Logs: Navigasi Aplikasi & Kesehatan**
- **Waktu**: 30 Des 2025, 05:35 SORE
- **Perintah/Aksi**: Pencatat Navigasi & Performa.
- **Detail**:
  - **Log Navigasi**: Membuat komponen `NavigationLogger` yang melacak setiap kunjungan halaman (`useLocation`) dan mencatatnya ke `tbl_activity_log_app` dengan status "Normal" (Aman).
  - **Monitor Performa**: Mengintegrasikan pemeriksaan heuristik dasar (menggunakan `performance.memory` untuk Chrome atau fallback) untuk mendeteksi penggunaan memori tinggi atau lag rendering.
  - **Status**: Jika performa menurun, status log berubah menjadi **"Slow Network"** atau **"Bug"**.

#### **49. Fitur: Notifikasi Peringatan Performa**
- **Waktu**: 30 Des 2025, 05:40 SORE
- **Perintah/Aksi**: Peringatan Mengambang Global.
- **Detail**:
  - **Pemicu**: Jika aplikasi mendeteksi kelambatan atau penggunaan cache yang tinggi (disimulasikan oleh monitor performa), peringatan kuning mengambang muncul.
  - **UI**: Ditampilkan sebagai banner tetap di kanan atas: "System Warning: Browser Cache Full / Slow App. Please clear cache."
#### **50. Activity Log: Formatting & Types**
- **Time**: 30 Dec 2025, 05:45 PM
- **Command/Action**: Format User Log Messages.
- **Details**:
  - **Requirement**: Users needed specific formatting for log messages (e.g., "Menambahkan Data List", "Update Status:Close").
  - **Implementation**: Updated backend logging logic in `complaints.js` and `master.js` to use precise Indonesian phrases:
    - **Add Complaint**: "Menambahkan Data List [Ticket]"
    - **Update Complaint**: "Update Data List [Ticket]" OR "Update Status:Close [Ticket]" (if status changed to Closed).
    - **Delete Complaint**: "Menghapus Data List [Ticket]"
    - **Master Data**: "Menambahkan/Update/Menghapus Data Master [Name/ID]"
  - **Date Format**: Updated the `ActivityLogUser` table to display dates in the requested format: **`ddMMyy | HH:mm:ss`** (e.g., `301225 | 17:30:00`).

#### **50. Log Aktivitas: Pemformatan & Tipe**
- **Waktu**: 30 Des 2025, 05:45 SORE
- **Perintah/Aksi**: Format Pesan Log User.
- **Detail**:
  - **Persyaratan**: User membutuhkan pemformatan khusus untuk pesan log (misal: "Menambahkan Data List", "Update Status:Close").
  - **Implementasi**: Memperbarui logika pencatatan backend di `complaints.js` dan `master.js` untuk menggunakan frasa bahasa Indonesia yang tepat:
    - **Tambah Komplain**: "Menambahkan Data List [Ticket]"
    - **Update Komplain**: "Update Data List [Ticket]" ATAU "Update Status:Close [Ticket]" (jika status berubah menjadi Closed).
    - **Hapus Komplain**: "Menghapus Data List [Ticket]"
    - **Data Master**: "Menambahkan/Update/Menghapus Data Master [Name/ID]"
#### **51. Feature: Master Data Enhancement**
- **Time**: 30 Dec 2025, 06:15 PM
- **Command/Action**: Live Search & Excel Import.
- **Details**:
  - **Live Search**: Removed the global search input from the Sidebar. Implemented a specific **Live Search** input on every Master Data sub-page, positioned to the right of the "Add New" button.
  - **Excel Import**: Added an "**Import Excel**" button (with upload icon) next to the "Add New" button on all Master Data pages.
  - **Functionality**: Users can upload `.xlsx` files to bulk-insert data. The system reads the file client-side and automatically creates records for each row.
  - **Access**: Available to Admin and SPV roles.

#### **52. Feature: User Management Bulk Import**
- **Time**: 30 Dec 2025, 06:20 PM
- **Command/Action**: User Import via Excel.
- **Details**:
  - **Feature**: Added "**Import Excel**" capability to the User Management page.
  - **Logic**: Allows bulk creation of users from an Excel file.
  - **Defaults**: If `pass` (password) is missing in the Excel file, it defaults to `123456`. If `idgroup` is missing, it defaults to `3` (User).

#### **51. Fitur: Peningkatan Data Master**
- **Waktu**: 30 Des 2025, 06:15 SORE
- **Perintah/Aksi**: Pencarian Langsung & Impor Excel.
- **Detail**:
  - **Pencarian Langsung**: Menghapus input pencarian global dari Sidebar. Mengimplementasikan input **Live Search** spesifik di setiap sub-halaman Data Master, diposisikan di sebelah kanan tombol "Add New".
  - **Impor Excel**: Menambahkan tombol "**Import Excel**" (dengan ikon unggah) di sebelah tombol "Add New" pada semua halaman Data Master.
  - **Fungsionalitas**: Pengguna dapat mengunggah file `.xlsx` untuk menyisipkan data secara massal. Sistem membaca file di sisi klien dan secara otomatis membuat catatan untuk setiap baris.
  - **Akses**: Tersedia untuk peran Admin dan SPV.

#### **52. Fitur: Impor Massal Manajemen User**
- **Waktu**: 30 Des 2025, 06:20 SORE
- **Perintah/Aksi**: Impor User via Excel.
- **Detail**:
  - **Fitur**: Menambahkan kemampuan "**Import Excel**" ke halaman Manajemen User.
  - **Logika**: Memungkinkan pembuatan pengguna secara massal dari file Excel.
  - **Default**: Jika `pass` (password) hilang dalam file Excel, defaultnya adalah `123456`. Jika `idgroup` hilang, defaultnya adalah `3` (User).

#### **53. Fix: User Management Logging**
- **Time**: 30 Dec 2025, 06:40 PM
- **Command/Action**: Enable Activity Logging for User Management.
- **Details**:
  - **Issue**: Actions in "Manage Users" (Add, Edit, Delete) were not being recorded in the User Activity Log.
  - **Fix Frontend**: Updated `UserManagement.jsx` to pass the current user's ID (`actorId`) in the request payload/params.
  - **Fix Backend**: Updated `server/routes/users.js` to trigger `logUserActivity` upon successful Create, Update, and Delete operations.
  - **Log Format**:
    - Add: "Menambahkan User [Name]"
    - Update: "Update User [Name]"
    - Delete: "Menghapus User [Name]"

#### **53. Perbaikan: Pencatatan Log Manajemen User**
- **Waktu**: 30 Des 2025, 06:40 SORE
- **Perintah/Aksi**: Mengaktifkan Pencatatan Aktivitas untuk Manajemen User.
- **Detail**:
  - **Masalah**: Tindakan di "Manage Users" (Tambah, Edit, Hapus) tidak tercatat di Log Aktivitas User.
  - **Perbaikan Frontend**: Memperbarui `UserManagement.jsx` untuk mengirim ID pengguna saat ini (`actorId`) dalam payload/params permintaan.
  - **Perbaikan Backend**: Memperbarui `server/routes/users.js` untuk memicu `logUserActivity` setelah operasi Buat, Perbarui, dan Hapus berhasil.
  - **Format Log**:
    - Tambah: "Menambahkan User [Name]"
    - Update: "Update User [Name]"
    - Hapus: "Menghapus User [Name]"

#### **54. Fix: Activity Log SQL Error**
- **Time**: 30 Dec 2025, 06:45 PM
- **Command/Action**: Fix SQL Query in `activity.js`.
- **Details**:
  - **Issue:** The Activity Log page was failing to load (`500 Internal Server Error`).
  - **Cause:** The backend query requested `u.username` from `tbluser`, but the correct column name is `name`.
  - **Fix**: Updated `server/routes/activity.js` to select `u.name AS username`.

#### **54. Perbaikan: Kesalahan SQL Log Aktivitas**
- **Waktu**: 30 Des 2025, 06:45 SORE
- **Perintah/Aksi**: Perbaiki Query SQL di `activity.js`.
- **Detail**:
  - **Masalah**: Halaman Log Aktivitas gagal dimuat (`500 Internal Server Error`).
  - **Penyebab**: Query backend meminta `u.username` dari `tbluser`, tetapi nama kolom yang benar adalah `name`.
  - **Perbaikan**: Diperbarui `server/routes/activity.js` untuk memilih `u.name AS username`.

#### **55. Improvement: Navigation Logging Clarity**
- **Time**: 30 Dec 2025, 06:50 PM
- **Command/Action**: Enhance `POST /api/activity/app` logic.
- **Details**:
  - **Question**: User asked about "REPORT_APP_ISSUE Reported Status: Normal".
  - **Explanation**: It was an automated health check triggered during page navigation.
  - **Improvement**: Refined the backend logic.
    - If Status is 'Normal', log Action as **'NAVIGATION'** and Details as **"User visited menu: [Path]"**.
    - If Status is 'Down/Bug', keep Action as 'REPORT_APP_ISSUE'.
  - **Benefit**: User logs now clearly show navigation history (e.g., "User visited menu: /master/bic") instead of generic status reports.

#### **55. Peningkatan: Kejelasan Pencatatan Navigasi**
- **Waktu**: 30 Des 2025, 06:50 SORE
- **Perintah/Aksi**: Tingkatkan logika `POST /api/activity/app`.
- **Detail**:
  - **Pertanyaan**: User menanyakan tentang "REPORT_APP_ISSUE Reported Status: Normal".
  - **Penjelasan**: Itu adalah pemeriksaan kesehatan otomatis yang dipicu saat navigasi halaman.
  - **Peningkatan**: Memperbaiki logika backend.
    - Jika Status 'Normal', catat Aksi sebagai **'NAVIGATION'** dan Detail sebagai **"User visited menu: [Path]"**.
    - Jika Status 'Down/Bug', pertahankan Aksi sebagai 'REPORT_APP_ISSUE'.
  - **Manfaat**: Log pengguna sekarang dengan jelas menampilkan riwayat navigasi (contoh: "User visited menu: /master/bic") daripada laporan status umum.

#### **56. Optimization: Activity Log Pagination**
- **Time**: 30 Dec 2025, 06:55 PM
- **Command/Action**: Implement Server-Side Pagination for Logs.
- **Details**:
  - **Question**: User asked if logs would slow down the app.
  - **Answer**: Yes, if fetching all records at once (SELECT *).
  - **Optimization**: Implemented pagination on both User and App Activity pages. The system now fetches only 20/50/100 records at a time, ensuring the interface remains fast regardless of database size.
  - **Components Updated**: `ActivityLogUser.jsx`, `ActivityLogApp.jsx`, `server/routes/activity.js`.

#### **56. Optimasi: Paginasi Log Aktivitas**
- **Waktu**: 30 Des 2025, 06:55 SORE
- **Perintah/Aksi**: Implementasi Paginasi Sisi Server untuk Log.
- **Detail**:
  - **Pertanyaan**: User bertanya apakah log akan memperlambat aplikasi.
  - **Jawaban**: Ya, jika mengambil semua data sekaligus (SELECT *).
  - **Optimasi**: Mengimplementasikan paginasi pada halaman Aktivitas User dan Aplikasi. Sistem sekarang hanya mengambil 20/50/100 data pemrosesan sekaligus, memastikan antarmuka tetap cepat terlepas dari ukuran database.
#### **57. Adjustment: Refine User Logging**
- **Time**: 30 Dec 2025, 07:05 PM
- **Command/Action**: Exclude 'Normal' App Status from User Logs.
- **Details**:
  - **Request**: User requested "REPORT_APP_ISSUE Reported Status: Normal" OR "NAVIGATION" logs to be NOT included in `tbl_activity_log_user`.
  - **Implementation**: Updated `server/routes/activity.js` logic.
  - **Old Logic**: If Status='Normal' -> Log as 'NAVIGATION' in User Log.
  - **New Logic**: If Status='Normal' -> Do **NOT** log anything in User Log. Only 'Down', 'Bug', or 'Error' statuses are cross-logged to User Activity.
  - **Goal**: Keep User Activity Log clean, focusing only on meaningful manual actions (Add/Edit/Delete) and critical system reports.

#### **57. Penyesuaian: Perhalus Pencatatan User**
- **Waktu**: 30 Des 2025, 07:05 SORE
- **Perintah/Aksi**: Kecualikan Status Aplikasi 'Normal' dari Log User.
- **Detail**:
  - **Permintaan**: User meminta agar log "REPORT_APP_ISSUE Reported Status: Normal" ATAU "NAVIGATION" **TIDAK** dimasukkan ke dalam `tbl_activity_log_user`.
  - **Implementasi**: Memperbarui logika `server/routes/activity.js`.
  - **Logika Lama**: Jika Status='Normal' -> Catat sebagai 'NAVIGATION' di Log User.
  - **Logika Baru**: Jika Status='Normal' -> **JANGAN** catat apa pun di Log User. Hanya status 'Down', 'Bug', atau 'Error' yang dicatat silang ke Aktivitas User.
  - **Tujuan**: Menjaga Log Aktivitas User tetap bersih, hanya berfokus pada tindakan manual yang berarti (Tambah/Edit/Hapus) dan laporan sistem kritis.
#### **58. Adjustment: IP Address Formatting**
- **Time**: 30 Dec 2025, 07:10 PM
- **Command/Action**: Remove `::ffff:` prefix from logged IPs.
- **Details**:
  - **Issue:** Logs were displaying IPv4 addresses mapped to IPv6 format (e.g., `::ffff:127.0.0.1`).
  - **Fix**: Updated `server/utils/activityLogger.js`, `server/routes/auth.js`, and `server/routes/activity.js` to strip the `::ffff:` prefix before saving to the database.
  - **Result**: IPs will now appear as clean IPv4 addresses (e.g., `127.0.0.1`).

#### **58. Penyesuaian: Format Alamat IP**
- **Waktu**: 30 Des 2025, 07:10 SORE
- **Perintah/Aksi**: Hapus awalan `::ffff:` dari IP yang dicatat.
- **Detail**:
  - **Masalah**: Log menampilkan alamat IPv4 yang dipetakan ke format IPv6 (contoh: `::ffff:127.0.0.1`).
  - **Perbaikan**: Diperbarui `server/utils/activityLogger.js`, `server/routes/auth.js`, dan `server/routes/activity.js` untuk menghapus awalan `::ffff:` sebelum disimpan ke database.
  - **Hasil**: IP sekarang akan muncul sebagai alamat IPv4 bersih (contoh: `127.0.0.1`).

#### **59. Enhancement: Detailed User Logs & App Filter**
- **Time**: 30 Dec 2025, 07:20 PM
- **Command/Action**: Refine User Logs and Filter App Logs.
- **Details**:
  - **User Log Specificity**: Updated `server/routes/complaints.js` to compare edited fields. Logs now detail exactly what changed:
    - Example: `"Update Data List T-30122025-103 (Changed: Question / Complaint, Status)"`.
  - **App Log Filtering**: Updated `NavigationLogger.jsx` to **STOP** logging "Normal/Safe" statuses.
    - It now ONLY logs issues like "Slow Network", "Freeze" (mapped to Down/Bug), or manual reports.
  - **Benefit**: Keeps the database clean and provides actionable audit trails for edits.

#### **59. Peningkatan: Detail Log User & Filter Log Aplikasi**
- **Waktu**: 30 Des 2025, 07:20 SORE
- **Perintah/Aksi**: Perjelas Log User dan Filter Log Aplikasi.
- **Detail**:
  - **Spesifisitas Log User**: Memperbarui `server/routes/complaints.js` untuk membandingkan field yang diedit. Log sekarang merinci apa yang berubah:
    - Contoh: `"Update Data List T-30122025-103 (Changed: Question / Complaint, Status)"`.
  - **Filter Log Aplikasi**: Memperbarui `NavigationLogger.jsx` untuk **BERHENTI** mencatat status "Normal/Aman".
    - Sekarang HANYA mencatat masalah seperti "Jaringan Lemot", "Freeze" (dipetakan ke Down/Bug), atau laporan manual.
  - **Manfaat**: Menjaga database tetap bersih dan memberikan jejak audit yang dapat ditindaklanjuti untuk pengeditan.

#### **60. Feature: Advanced System Health Monitor**
- **Time**: 30 Dec 2025, 07:35 PM
- **Command/Action**: Upgrade `NavigationLogger.jsx` with Global Error Listeners.
- **Details**:
  - **Goal**: Make system error logging 100% accurate and automatic.
  - **Implementation**: Added global event listeners to the frontend:
    - **`error` listener**: Catches script crashes and unhandled exceptions (Status: **Error**).
    - **`unhandledrejection` listener**: Automates catching of failed API calls (500/400) and Network Errors (Status: **Down**).
    - **`offline` listener**: Detects when internet connection is lost (Status: **Down**).
  - **Testing**: Added localized "Test Buttons" (Down/Bug/Error) visible only to Admins to verify the system works in real-time.

#### **60. Fitur: Monitor Kesehatan Sistem Tingkat Lanjut**
- **Waktu**: 30 Des 2025, 07:35 SORE
- **Perintah/Aksi**: Upgrade `NavigationLogger.jsx` dengan Listener Error Global.
- **Detail**:
  - **Tujuan**: Membuat pencatatan error sistem 100% akurat dan otomatis.
  - **Implementasi**: Menambahkan pendengar acara (event listeners) global ke frontend:
    - **`error` listener**: Menangkap script crash dan pengecualian yang tidak tertangani (Status: **Error**).
    - **`unhandledrejection` listener**: Mengotomatiskan penangkapan panggilan API yang gagal (500/400) dan Kesalahan Jaringan (Status: **Down**).
    - **`offline` listener**: Mendeteksi ketika koneksi internet terputus (Status: **Down**).
  - **Pengujian**: Menambahkan "Tombol Test" lokal (Down/Bug/Error) yang hanya terlihat oleh Admin untuk memverifikasi sistem bekerja secara real-time.

#### **61. Cleanup: Remove Test Features**
- **Time**: 30 Dec 2025, 07:40 PM
- **Command/Action**: Remove Test Buttons from `NavigationLogger.jsx`.
- **Details**:
  - **Action**: Removed the temporary simulation buttons (Test Down/Bug/Error).
  - **Status**: The monitoring system is now fully automated and running silently in the background.

#### **61. Pembersihan: Hapus Fitur Test**
- **Waktu**: 30 Des 2025, 07:40 SORE
- **Perintah/Aksi**: Hapus Tombol Test dari `NavigationLogger.jsx`.
- **Detail**:
  - **Aksi**: Menghapus tombol simulasi sementara (Test Down/Bug/Error).
  - **Status**: Sistem pemantauan sekarang sepenuhnya otomatis dan berjalan secara diam-diam di latar belakang.

#### **62. Bugfix: Master Data Import**
- **Time**: 31 Dec 2025, 11:15 AM
- **Command/Action**: Fix `500 Internal Server Error` during Excel Import.
- **Details**:
  - **Issue:** Importing master data (e.g., Branch) failed because the `iduser` field (used for logging) was being included in the Database INSERT query, but master tables do not have an `iduser` column.
  - **Fix**: Updated `server/routes/master.js` to extract and remove `iduser` from the payload before executing the SQL INSERT/UPDATE, while still using it for the activity log.
  - **Result**: Bulk import of master data now works correctly without SQL errors.

#### **62. Perbaikan Bug: Import Data Master**
- **Waktu**: 31 Des 2025, 11:15 PAGI
- **Perintah/Aksi**: Perbaiki `500 Internal Server Error` saat Import Excel.
- **Detail**:
  - **Masalah**: Import data master (contoh: Branch) gagal karena field `iduser` (digunakan untuk logging) disertakan dalam query DATABASE INSERT, tetapi tabel master tidak memiliki kolom `iduser`.
  - **Perbaikan**: Diperbarui `server/routes/master.js` untuk mengekstrak dan menghapus `iduser` dari payload sebelum menjalankan SQL INSERT/UPDATE, sambil tetap menggunakannya untuk log aktivitas.
  - **Hasil**: Import massal data master sekarang berfungsi dengan benar tanpa error SQL.

#### **63. Improvement: Layout & Sorting**
- **Time**: 31 Dec 2025, 11:25 AM
- **Command/Action**: Sort Branch by 'Kode BRC' and Minimize Sidebar.
- **Details**:
  - **Sorting**: Updated `server/routes/master.js` to sort Branch Data by `kode_brc` (A-Z) instead of `name_brc`.
  - **Sidebar**: Updated `Sidebar.jsx` to behave like an Accordion. Opening one menu (e.g., Master) now automatically closes others (e.g., Activity Log), keeping the sidebar compact and neat.
  - **Analysis**: The "Warning: max_input_vars" image is a database tool warning (phpMyAdmin), not an application error. It appears when viewing large tables directly in the DB viewer.

#### **63. Peningkatan: Tata Letak & Pengurutan**
- **Waktu**: 31 Des 2025, 11:25 PAGI
- **Perintah/Aksi**: Urutkan Branch berdasarkan 'Kode BRC' dan Minimalkan Sidebar.
- **Detail**:
  - **Pengurutan**: Diperbarui `server/routes/master.js` untuk mengurutkan Data Branch berdasarkan `kode_brc` (A-Z) alih-alih `name_brc`.
  - **Sidebar**: Diperbarui `Sidebar.jsx` agar berperilaku seperti Akordeon. Membuka satu menu (misal: Master) sekarang otomatis menutup menu lain (misal: Log Aktivitas), menjaga sidebar tetap ringkas dan rapi.
  - **Analisis**: Gambar peringatan "max_input_vars" adalah peringatan alat database (phpMyAdmin), bukan error aplikasi. Ini uncul saat melihat tabel besar langsung di penampil DB.

#### **64. Bugfix: Frontend Branch Sorting**
- **Time**: 31 Dec 2025, 11:30 AM
- **Command/Action**: Override Frontend Sort for Branch.
- **Details**:
  - **Issue**: Although the backend was updated to sort by `kode_brc`, the frontend (`ComplaintList.jsx`) was forcing a re-sort by `name_brc` upon fetching data.
  - **Fix**: Updated `ComplaintList.jsx` to sort the fetched Branch list by `kode_brc`.
  - **Result**: The "Unit / Branch" dropdown in the Complaint Form is now correctly sorted A-Z by Branch Code.

#### **64. Perbaikan Bug: Pengurutan Branch Frontend**
- **Waktu**: 31 Des 2025, 11:30 PAGI
- **Perintah/Aksi**: Timpa Pengurutan Frontend untuk Branch.
- **Detail**:
  - **Masalah**: Meskipun backend sudah diperbarui untuk mengurutkan berdasarkan `kode_brc`, frontend (`ComplaintList.jsx`) memaksa pengurutan ulang berdasarkan `name_brc` saat mengambil data.
  - **Perbaikan**: Diperbarui `ComplaintList.jsx` untuk mengurutkan daftar Branch yang diambil berdasarkan `kode_brc`.
  - **Hasil**: Dropdown "Unit / Branch" di Formulir Komplain sekarang diurutkan dengan benar A-Z berdasarkan Kode Cabang.

#### **65. Feature: Expand User Roles**
- **Time**: 31 Dec 2025, 11:45 AM
- **Command/Action**: Add 2 new Roles (MGR, TL) and Refine Permissions.
- **Details**:
  - **Database Migration**: Created and executed `fix_roles.js` to ensure `tblgroup` contains:
    1. Admin
    2. SPV
    3. User
    4. MGR (Manager)
    5. TL (Team Leader)
  - **Permission Logic**:
    - **MGR (4)**: Granted Full Access (Same as SPV/Admin). Can Edit/Delete/View Master.
    - **TL (5)**: Granted Standard Access (Same as User). Limited to View/Edit own data if applicable, no Master Data handling.
  - **Components Updated**:
    - `UserManagement.jsx`: Added Dropdown options for MGR & TL, and updated Badge colors (Purple for MGR, Teal for TL).
    - `Sidebar.jsx`, `ComplaintList.jsx`, `MasterRef.jsx`: Updated all privilege checks to include ID Group 4 (MGR).

#### **65. Fitur: Penambahan Peran Pengguna (Roles)**
- **Waktu**: 31 Des 2025, 11:45 PAGI
- **Perintah/Aksi**: Menambahkan 2 Role baru (MGR, TL) dan Memperbaiki Izin.
- **Detail**:
  - **Migrasi Database**: Membuat dan menjalankan `fix_roles.js` untuk memastikan `tblgroup` berisi:
    1. Admin
    2. SPV
    3. User
    4. MGR (Manajer)
    5. TL (Team Leader)
  - **Logika Izin**:
    - **MGR (4)**: Diberikan Akses Penuh (Sama dengan SPV/Admin). Bisa Edit/Hapus/Lihat Master.
    - **TL (5)**: Diberikan Akses Standar (Sama dengan User). Terbatas, tidak bisa mengelola Data Master.
  - **Komponen Diperbarui**:
    - `UserManagement.jsx`: Menambahkan opsi Dropdown untuk MGR & TL, dan memperbarui warna Badge (Ungu untuk MGR, Teal untuk TL).
    - `Sidebar.jsx`, `ComplaintList.jsx`, `MasterRef.jsx`: Memperbarui semua pemeriksaan hak istimewa untuk menyertakan ID Group 4 (MGR).

#### **66. Refactor: User Role IDs Reordered**
- **Time**: 31 Dec 2025, 11:55 AM
- **Command/Action**: Reassign Role IDs safely.
- **Details**:
  - **New ID Mapping**:
    1. Admin
    2. MGR (Manager) - *New ID*
    3. SPV (Supervisor) - *New ID*
    4. TL (Team Leader) - *New ID*
    5. User - *New ID*
  - **Migration**: Check `server/reorder_roles.js` for logic. Used temporary IDs (11, 22, 33, etc.) to swap roles safely without constraint violations or data loss.
  - **Frontend Updates**: Updated checks in `Sidebar.jsx`, `UserManagement.jsx`, `ComplaintList.jsx`, and `MasterRef.jsx` to respect the new hierarchy (1, 2, 3 = Privileged).

#### **66. Refaktor: Urutan Ulang ID Peran Pengguna**
- **Waktu**: 31 Des 2025, 11:55 PAGI
- **Perintah/Aksi**: Menetapkan ulang ID Peran dengan aman.
- **Detail**:
  - **Pemetaan ID Baru**:
    1. Admin
    2. MGR (Manajer) - *ID Baru*
    3. SPV (Supervisor) - *ID Baru*
    4. TL (Team Leader) - *ID Baru*
    5. User - *ID Baru*
  - **Migrasi**: Periksa `server/reorder_roles.js` untuk logika. Menggunakan ID sementara (11, 22, 33, dll.) untuk menukar peran dengan aman tanpa pelanggaran constraint atau kehilangan data.
  - **Pembaruan Frontend**: Memperbarui pemeriksaan di `Sidebar.jsx`, `UserManagement.jsx`, `ComplaintList.jsx`, dan `MasterRef.jsx` untuk mematuhi hierarki baru (1, 2, 3 = Hak Istimewa).

#### **69. Documentation: Created Analysis & Guide**
- **Time**: 31 Dec 2025, 01:40 PM
- **Command/Action**: Create `Kajian Aplikasi.md` and `Petunjuk Penggunaan Aplikasi.md`.
- **Details**:
  - **Kajian Aplikasi.md**: Comprehensive document outlining the App Architecture, Tech Stack, Features, RBAC structure, and Roadmap.
  - **Petunjuk Penggunaan Aplikasi.md**: User-friendly guide covering Login, Dashboard navigation, Complaint Handling (View/Filter/Add/Edit/Close), and Admin functions (Master Data/User Management).

#### **69. Dokumentasi: Membuat Kajian & Petunjuk**
- **Waktu**: 31 Des 2025, 01:40 SIANG
- **Perintah/Aksi**: Membuat `Kajian Aplikasi.md` dan `Petunjuk Penggunaan Aplikasi.md`.
- **Detail**:
  - **Kajian Aplikasi.md**: Dokumen komprehensif yang menjabarkan Arsitektur Aplikasi, Tech Stack, Fitur, Struktur RBAC, dan Roadmap.
  - **Petunjuk Penggunaan Aplikasi.md**: Panduan ramah pengguna yang mencakup Login, navigasi Dashboard, Penanganan Keluhan (Lihat/Filter/Tambah/Edit/Tutup), dan fungsi Admin (Data Master/Manajemen Pengguna).

#### **70. Documentation: Refined & Detailed**
- **Time**: 31 Dec 2025, 01:50 PM
- **Command/Action**: Rewrite `Kajian Aplikasi.md` and `Petunjuk Penggunaan Aplikasi.md`.
- **Details**:
  - **Enhancement**: Added significantly more detail, clearly defined Business Flows, Technical Specifications, and Step-by-Step User Instructions.
  - **Structure**:
    - **Kajian**: Added Executive Summary, Role Matrix, Tech Stack Table, and Security Analysis.
    - **Petunjuk**: Added Table of Contents, specific scenarios (Input/Close Ticket), Access Rights explanation, and Placeholders for Screenshots (`![Capture here]`).
  - **Captures**: User is instructed to capture screen images and place them in the document where indicated.

#### **70. Dokumentasi: Diperhalus & Mendetail**
- **Waktu**: 31 Des 2025, 01:50 SIANG
- **Perintah/Aksi**: Menulis ulang `Kajian Aplikasi.md` dan `Petunjuk Penggunaan Aplikasi.md`.
- **Detail**:
  - **Peningkatan**: Menambahkan detail yang jauh lebih lengkap, mendefinisikan Alur Bisnis, Spesifikasi Teknis, dan Instruksi Pengguna Langkah-demi-Langkah.
  - **Struktur**:
    - **Kajian**: Menambahkan Ringkasan Eksekutif, Matriks Peran, Tabel Tech Stack, dan Analisis Keamanan.
    - **Petunjuk**: Menambahkan Daftar Isi, skenario spesifik (Input/Tutup Tiket), penjelasan Hak Akses, dan Penampung (Placeholder) untuk Tangkapan Layar.
  - **Capture**: Pengguna diinstruksikan untuk mengambil gambar layar dan menempatkannya di dokumen sesuai petunjuk.

#### **71. Documentation: Removed Dashboard Section**
- **Time**: 31 Dec 2025, 02:00 PM
- **Command/Action**: Remove Dashboard section from `Petunjuk Penggunaan Aplikasi.md` and `Kajian Aplikasi.md`.
- **Details**:
  - **Correction**: User confirmed the application does not have a "Dashboard" page with Charts/Statistics.
  - **Petunjuk**: Removed Section 2 (Dashboard) and renumbered subsequent sections. Updated Login workflow to redirect to "Complaint List".
  - **Kajian**: Removed "Dashboard Analitik" (Section 4.3), and updated "Tujuan Pengembangan" and "Workflow" to refer to List/Excel monitoring instead of Dashboard visuals.

#### **71. Dokumentasi: Menghapus Bagian Dashboard**
- **Waktu**: 31 Des 2025, 02:00 SIANG
- **Perintah/Aksi**: Hapus bagian Dashboard dari `Petunjuk Penggunaan Aplikasi.md` dan `Kajian Aplikasi.md`.
- **Detail**:
  - **Koreksi**: User mengonfirmasi aplikasi tidak memiliki halaman "Dashboard" dengan Grafik/Statistik.
  - **Petunjuk**: Menghapus Bagian 2 (Dashboard) dan menomori ulang bagian selanjutnya. Memperbarui alur Login untuk mengarahkan ke "Complaint List".
  - **Kajian**: Menghapus "Dashboard Analitik" (Bagian 4.3), dan memperbarui "Tujuan Pengembangan" serta "Workflow" agar merujuk pada pemantauan via List/Excel, bukan visual Dashboard.

#### **72. Improvement: Force Password Change on First Login**
- **Time**: 31 Dec 2025, 02:40 PM
- **Command/Action**: Implement Force Change Password logic.
- **Details**:
  - **Database**: Added `must_change_password` (TINYINT) column to `tbluser` via migration script.
  - **Backend**:
    - Updated `POST /api/users` (Create User) to set `must_change_password = 1` by default.
    - Updated `PUT /api/users/:id` (Update User) to set `must_change_password = 0` when password is changed by Admin (optional logic, but safe).
    - Added `POST /api/auth/change-password` endpoint to verify old password and set `must_change_password = 0` on success.
  - **Frontend**:
    - Created `ForceChangePasswordModal.jsx` component with fields for Old Password, New Password, and Confirm Password (with Eye icons).
    - Updated `App.jsx` PrivateLayout to check `user.must_change_password`. If 1, it blocks the screen with the Modal.
    - Modal centers on screen and prevents other interactions until password is successfully changed.

#### **72. Peningkatan: Paksa Ganti Password Saat Login Pertama**
- **Waktu**: 31 Des 2025, 02:40 SIANG
- **Perintah/Aksi**: Implementasi logika Paksa Ganti Password.
- **Detail**:
  - **Database**: Menambahkan kolom `must_change_password` (TINYINT) ke `tbluser` melalui script migrasi.
  - **Backend**:
    - Memperbarui `POST /api/users` (Buat User) untuk mengatur `must_change_password = 1` secara default.
    - Menambahkan endpoint `POST /api/auth/change-password` untuk memverifikasi password lama dan mengatur `must_change_password = 0` saat berhasil.
  - **Frontend**:
    - Membuat komponen `ForceChangePasswordModal.jsx` dengan kolom Password Lama, Password Baru, dan Konfirmasi (dengan ikon Mata).
    - Memperbarui `App.jsx` PrivateLayout untuk memeriksa `user.must_change_password`. Jika 1, layar akan diblokir dengan Modal.
    - Modal muncul di tengah layar dan mencegah interaksi lain sampai password berhasil diubah.

#### **73. Bug Fix: Fix App.jsx Import Error**
- **Time**: 31 Dec 2025, 02:45 PM
- **Command/Action**: Remove invalid import `import Link ...` from `App.jsx`.
- **Details**:
  - **Issue**: `Uncaught SyntaxError` because `react-router-dom` does not have a default export, and `Link` was imported incorrectly as default (and unused).
  - **Fix**: Removed the line. The app should now load correctly.

#### **73. Perbaikan Bug: Perbaiki Masalah Import App.jsx**
- **Waktu**: 31 Des 2025, 02:45 SIANG
- **Perintah/Aksi**: Hapus import tidak valid `import Link ...` dari `App.jsx`.
- **Detail**:
  - **Masalah**: `Uncaught SyntaxError` karena `react-router-dom` tidak memiliki ekspor default, dan `Link` diimpor secara salah sebagai default (dan tidak digunakan).
  - **Perbaikan**: Menghapus baris tersebut. Aplikasi seharusnya sekarang dimuat dengan benar.

#### **74. Improvement: Password Complexity & UI Tweak**
- **Time**: 31 Dec 2025, 03:00 PM
- **Command/Action**: Enhance `ForceChangePasswordModal.jsx`.
- **Details**:
  - **Styles**: Positioned "Eye" icons vertically centered inside the input field (`top-1/2 -translate-y-1/2`).
  - **Validation**: Enforced strict password rules:
    - Minimum 8 characters.
    - At least one number.
    - At least one symbol from whitelist `[!@#$%&*]`.
    - Disallowed symbols *outside* the whitelist.
    - Password cannot contain the user's Full Name (case-insensitive check).

#### **74. Peningkatan: Kompleksitas Password & UI**
- **Waktu**: 31 Des 2025, 03:00 SIANG
- **Perintah/Aksi**: Meningkatkan `ForceChangePasswordModal.jsx`.
- **Detail**:
  - **Gaya**: Memposisikan ikon "Mata" secara vertikal di tengah kolom input (`top-1/2 -translate-y-1/2`).
  - **Validasi**: Menerapkan aturan password ketat:
    - Minimal 8 karakter.
    - Minimal satu angka.
    - Minimal satu simbol dari daftar putih `[!@#$%&*]`.
    - Simbol di luar daftar putih dilarang.
    - Password tidak boleh mengandung Nama Lengkap pengguna (cek case-insensitive).

#### **67. Improvement: User Filter Dropdowns**
- **Time**: 31 Dec 2025, 12:10 PM
- **Command/Action**: Convert "User Open/Close" inputs to Dropdowns.
- **Details**:
  - **Backend**: Updated `server/routes/users.js` to sort users by `fullname ASC` (A-Z) for better list readability.
  - **Frontend**: Updated `ComplaintList.jsx` to:
    1. Fetch the User List from `/api/users`.
    2. Replace the text inputs for "User Open Case" and "User Close Case" with Dropdown Selects.
    3. The Dropdowns are populated with `fullname`, making it easier to filter logs by specific users.

#### **67. Peningkatan: Dropdown Filter Pengguna**
- **Waktu**: 31 Des 2025, 12:10 SIANG
- **Perintah/Aksi**: Ubah input "User Open/Close" menjadi Dropdown.
- **Detail**:
  - **Backend**: Diperbarui `server/routes/users.js` untuk mengurutkan pengguna berdasarkan `fullname ASC` (A-Z) agar daftar lebih mudah dibaca.
  - **Frontend**: Diperbarui `ComplaintList.jsx` untuk:
    1. Mengambil Daftar Pengguna dari `/api/users`.
    2. Mengganti input teks untuk "User Open Case" dan "User Close Case" dengan Dropdown Select.
    3. Dropdown diisi dengan `fullname`, memudahkan penyaringan log berdasarkan pengguna tertentu.

#### **68. Improvement: User Dropdown Display**
- **Time**: 31 Dec 2025, 01:25 PM
- **Command/Action**: Append Position (Jabatan) to User Dropdowns.
- **Details**:
  - **Action**: Updated `ComplaintList.jsx`.
  - **Change**: The "User Open" and "User Close" dropdowns now display the user's position alongside their name for better identification.
  - **Format**: `FullName - Position` (e.g., "Abi Sofyana - CXO T&R").

#### **68. Peningkatan: Tampilan Dropdown Pengguna**
- **Waktu**: 31 Des 2025, 01:25 SIANG
- **Perintah/Aksi**: Tambahkan Jabatan pada Dropdown Pengguna.
- **Detail**:
  - **Aksi**: Memperbarui `ComplaintList.jsx`.
  - **Perubahan**: Dropdown "User Open" dan "User Close" sekarang menampilkan jabatan pengguna di sebelah nama mereka untuk identifikasi yang lebih baik.
  - **Format**: `Nama Lengkap - Jabatan` (contoh: "Abi Sofyana - CXO T&R").
#### **75. Improvement: Password Uppercase Constraint**
- **Time**: 31 Dec 2025, 03:20 PM
- **Command/Action**: Update `ForceChangePasswordModal.jsx`.
- **Details**:
  - **Validation**: Added rule: "Must contain at least one Uppercase Letter (A-Z)".
  - **Localization**: Translated all error messages and helper text to Indonesian.
    - "Min 8 chars..." -> "Min 8 karakter..."
    - "Must contain..." -> "Password harus mengandung..."
    - Button text updated to "Reset Password" (no change) or "Proses..." on loading.

#### **75. Peningkatan: Syarat Huruf Besar Password**
- **Waktu**: 31 Des 2025, 03:20 SIANG
- **Perintah/Aksi**: Memperbarui `ForceChangePasswordModal.jsx`.
- **Detail**:
  - **Validasi**: Menambahkan aturan: "Harus mengandung minimal satu Huruf Besar (A-Z)".
  - **Lokalisasi**: Menerjemahkan semua pesan error dan teks bantuan ke Bahasa Indonesia.
    - "Min 8 chars..." -> "Min 8 karakter..."
    - "Must contain..." -> "Password harus mengandung..."
    - Teks tombol diperbarui menjadi "Reset Password" atau "Proses..." saat memuat.
#### **76. Fix: Hide Browser Default Password Icon**
- **Time**: 31 Dec 2025, 03:30 PM
- **Command/Action**: Update `index.css`.
- **Details**:
  - **Issue**: Two "eye" icons appeared in password fields (One custom, one browser default).
  - **Fix**: Added CSS rule `input[type="password"]::-ms-reveal { display: none; }` to hide the native Edge/Windows password toggle, ensuring only the custom UI component is visible.

#### **76. Perbaikan: Sembunyikan Ikon Password Bawaan Browser**
- **Waktu**: 31 Des 2025, 03:30 SIANG
- **Perintah/Aksi**: Memperbarui `index.css`.
- **Detail**:
  - **Masalah**: Dua ikon "mata" muncul di kolom password (Satu kustom, satu bawaan browser).
  - **Perbaikan**: Menambahkan aturan CSS `input[type="password"]::-ms-reveal { display: none; }` untuk menyembunyikan tombol password bawaan Edge/Windows, memastikan hanya komponen UI kustom yang terlihat.
#### **77. Bug Fix: Relax Fullname Password Constraint**
- **Time**: 31 Dec 2025, 03:40 PM
- **Command/Action**: Update `ForceChangePasswordModal.jsx`.
- **Details**:
  - **Issue**: User with short fullname (e.g., "2") could not use passwords containing that character (e.g., "Abi123" contains "2").
  - **Fix**: Added a length check `user.fullname.length >= 4`. The system now only validates "Password contains Fullname" if the Fullname is 4 characters or longer.

#### **77. Perbaikan Bug: Melonggarkan Batasan Nama Lengkap di Password**
- **Waktu**: 31 Des 2025, 03:40 SIANG
- **Perintah/Aksi**: Memperbarui `ForceChangePasswordModal.jsx`.
- **Detail**:
  - **Masalah**: Pengguna dengan nama pendek (misal "2") tidak bisa menggunakan password yang mengandung karakter tersebut (misal "Abi123" mengandung "2").
  - **Perbaikan**: Menambahkan cek panjang `user.fullname.length >= 4`. Sistem sekarang hanya memvalidasi "Password mengandung Nama Lengkap" jika Nama Lengkap terdiri dari 4 karakter atau lebih.

#### **78. Improvement: Detailed BIC/Correspondent Dropdowns**
- **Time**: 31 Dec 2025, 03:55 PM
- **Command/Action**: Update `ComplaintList.jsx`.
- **Details**:
  - **Change**: Updated "Correspondent" (BIC) dropdown options in both Search Filter and Add Data Form.
  - **New Format**: `Country - Name - Scode` (e.g., "INDONESIA - BANK BNI - BNIIDJA").
  - **Reason**: To provide clearer identification of correspondent banks by including Country and Swift Code.

#### **78. Peningkatan: Dropdown BIC/Koresponden Lebih Detail**
- **Waktu**: 31 Des 2025, 03:55 SIANG
- **Perintah/Aksi**: Memperbarui `ComplaintList.jsx`.
- **Detail**:
  - **Perubahan**: Memperbarui opsi dropdown "Koresponden" (BIC) baik di Filter Pencarian maupun Form Tambah Data.
  - **Format Baru**: `Negara - Nama - Scode` (contoh: "INDONESIA - BANK BNI - BNIIDJA").
  - **Alasan**: Memberikan identifikasi bank koresponden yang lebih jelas dengan menyertakan Negara dan Kode Swift.

#### **79. Improvement: Sort BIC by Country**
- **Time**: 31 Dec 2025, 04:05 PM
- **Command/Action**: Update `ComplaintList.jsx`.
- **Details**:
  - **Change**: Changed the default sorting of the BIC dropdown list.
  - **Logic**: Now sorted alphabetically (A-Z) by `country_bic` (Country Name) instead of Bank Name.
  - **Goal**: To align with the new display format which starts with "Country".

#### **79. Peningkatan: Urutkan BIC Berdasarkan Negara**
- **Waktu**: 31 Des 2025, 04:05 SIANG
- **Perintah/Aksi**: Memperbarui `ComplaintList.jsx`.
- **Detail**:
  - **Perubahan**: Mengubah urutan default daftar dropdown BIC.
  - **Logika**: Sekarang diurutkan secara abjad (A-Z) berdasarkan `country_bic` (Nama Negara), bukan Nama Bank.
  - **Tujuan**: Menyelaraskan dengan format tampilan baru yang dimulai dengan "Negara".

#### **80. Improvement: Sync Master Data Fields**
- **Time**: 31 Dec 2025, 04:40 PM
- **Command/Action**: Update `MasterRef.jsx`.
- **Details**:
  - **Goal**: Ensure "Add/Edit" forms in Master Data Submenu match the database schema.
  - **Changes**:
    - **Product Master**: Added fields `seq`, `parent`, `listselection`, `lv`, `urutmenu` (previously only `name`, `ket`, `aktif`).
    - **Subject Master**: Added fields `idproduct`, `seq`, `parent`, `listselection`, `lv`, `urutmenu` (previously only `name`, `ket`, `aktif`).
  - **Impact**: Admins can now manage all relevant columns for Products and Subjects directly from the UI.

#### **80. Peningkatan: Sinkronisasi Kolom Master Data**
- **Waktu**: 31 Des 2025, 04:40 SIANG
- **Perintah/Aksi**: Memperbarui `MasterRef.jsx`.
- **Detail**:
  - **Tujuan**: Memastikan form "Tambah/Edit" di Submenu Master Data sesuai dengan skema database.
  - **Perubahan**:
    - **Master Produk**: Menambahkan kolom `seq`, `parent`, `listselection`, `lv`, `urutmenu` (sebelumnya hanya `name`, `ket`, `aktif`).
    - **Master Subjek**: Menambahkan kolom `idproduct`, `seq`, `parent`, `listselection`, `lv`, `urutmenu` (sebelumnya hanya `name`, `ket`, `aktif`).
  - **Dampak**: Admin sekarang dapat mengelola semua kolom yang relevan untuk Produk dan Subjek langsung dari UI.
