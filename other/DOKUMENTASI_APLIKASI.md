# Dokumentasi Struktur Aplikasi & Fungsi File

Dokumen ini berisi penjelasan lengkap mengenai struktur direktori, peran, fungsi setiap file, serta analisis basis data dalam aplikasi Complaint Handling System (BNI INT CIU).

## 🚀 ROOT DIRECTORY
Direktori utama tempat proyek berada.

- **`Format Import XLSX/`**: Folder berisi template Excel untuk fitur import data massal.
- **`Panduan dan History/`**: Dokumen pendukung riwayat pengembangan dan panduan manual (jika ada).
- **`db_bniintciu.sql`**: Dump database MySQL lama (backup/legacy).
- **`db_bniintciu_pg.sql`**: Dump database PostgreSQL terbaru (Struktur & Data Production).
- **`DOKUMENTASI_APLIKASI.md`**: File ini (Dokumentasi sistem & referensi).

---

## 💻 CLIENT (Frontend)
Bagian antarmuka pengguna, dibangun menggunakan **React.js (Vite)** + **Tailwind CSS**.
Lokasi: `client/src/`

### 📂 `client/src/` (Core)
- **`main.jsx`**: Titik masuk utama aplikasi React. Me-render component `App` ke dalam DOM.
- **`App.jsx`**: Routing utama aplikasi. Mengatur navigasi halaman (React Router) dan perlindungan rute (Protected Route) berdasarkan status login.
- **`index.css`**: Global Stylesheet. Mendefinisikan variabel warna (`--primary`, `--secondary`), style dasar, utilitas CSS, dan reset CSS.

### 📂 `client/src/components/` (Komponen UI Reusable)
- **`Sidebar.jsx`**: Menu navigasi samping. Mengontrol akses menu berdasarkan Role User (Admin, MGR, SPV, TL, User).
- **`Modal.jsx`**: Komponen Popup/Dialog standar untuk form input atau view detail.
- **`Popup.jsx`**: Komponen Notifikasi Alert (SweetAlert-style) untuk pesan Sukses/Gagal/Konfirmasi.
- **`ProtectedRoute.jsx`**: Middleware frontend untuk melempar user ke halaman login jika sesi habis/belum login.

### 📂 `client/src/pages/` (Halaman Aplikasi)
- **`Login.jsx`**: Halaman otentikasi.
- **`ComplaintList.jsx`**: Dashboard Utama.
  - **Fitur**: Daftar Tiket, Search/Filter, Add New (dengan Quick Add untuk Admin/MGR/SPV), Edit, View Detail, Export Excel, Print.
  - **Quick Add**: Tombol (+) pada dropdown input hanya muncul untuk user berhak (Admin/MGR/SPV).
- **`MasterRef.jsx`**: Manajemen Master Data.
  - **Fitur**: CRUD untuk Produk, Cabang, Channel, Subject, dll.
  - **Koneksi**: Terhubung ke API `/api/master`.
- **`UserManagement.jsx`**: Halaman Admin untuk manajemen User & Role.
- **`ImportData.jsx`**: Halaman Import Data Excel Massal (Fitur Drag & Drop + Validasi).
- **`ActivityLogApp.jsx`**: Monitoring Error Log Sistem.
- **`ActivityLogUser.jsx`**: Audit Trail (Log aktivitas user).
- **`SqlExecute.jsx`**: (Dev Tool) Halaman eksekusi SQL manual (hanya untuk maintainer/developer).

---

## ⚙️ SERVER (Backend)
Bagian server API, dibangun menggunakan **Node.js** + **Express** + **PostgreSQL**.
Lokasi: `server/`

### 📂 `server/` (Root)
- **`index.js`**: Entry point server. Menjalankan Express app, parsing request, static files, dan CORS.
- **`db.js`**: Konfigurasi koneksi database PostgreSQL (`pg-pool`). Menyediakan fungsi helper `query`, `insertSet`, `updateSet`.
- **`.env`**: File Environment Variables (Database Credentials, Port). **RAHASIA**.

### 📂 `server/routes/` (API Endpoints)
- **`auth.js`** (`/api/auth`): Login & Validasi Sesi.
- **`complaints.js`** (`/api/complaints`):
  - CRUD Tiket Komplain.
  - Menangani sanitasi data input (misal: kosong -> NULL).
  - Menangani Import Excel (`/import`).
- **`master.js`** (`/api/master`):
  - CRUD Generik untuk semua tabel referensi (bic, branch, product, dll).
- **`users.js`** (`/api/users`):
  - CRUD User Management (Add, Edit, Delete, Ganti Password).
- **`activity.js`** (`/api/activity`):
  - Read & Write Log Aktivitas.
- **`system.js`** (`/api/system`):
  - Endpoint utilitas SQL Execute.

### 📂 `server/utils/`
- **`activityLogger.js`**: Modul helper untuk mencatat setiap aksi Create/Update/Delete user ke database log.

---

## 📊 ANALISIS DATABASE
Berikut adalah status penggunaan tabel dalam database PostgreSQL saat ini.

### ✅ Tabel TERPAKAI (Active)
Tabel-tabel ini merupakan inti dari aplikasi dan digunakan secara aktif oleh kode backend.

**1. Transaksi & User**
- **`tbl_complain`**: Tabel utama data tiket/transaksi.
- **`tbluser`**: Data pengguna aplikasi.
- **`tblgroup`**: Data Role/Group (Admin, User, TL, SPV, MGR).
- **`tbl_activity_log_app`**: Log error sistem.
- **`tbl_activity_log_user`**: Audit trail aktivitas user.

**2. Master Data (Referensi)**
- **`ref_product`**: Produk/Layanan.
- **`ref_subject`**: Subject/Kategori masalah.
- **`ref_channel`**: Media pelaporan (Email, Telp, dll).
- **`ref_branch`**: Kantor Cabang.
- **`ref_bic`**: Bank Identifier Codes (BIC).
- **`ref_bnir_rep`**: BNI Remittance Representatives.
- **`ref_typecust`**: Tipe Nasabah (Individu, Korporasi, dll).
- **`ref_pagent`**: Paying Agents.
- **`ref_status`**: Status Tiket (Open, Closed).

### ⚠️ Tabel TIDAK TERPAKAI (Legacy/Unused)
Tabel ini ada di database (hasil migrasi lama) namun **tidak pernah dipanggil** oleh aplikasi saat ini. Dapat dipertimbangkan untuk dihapus (Drop) atau diarsipkan.

- **`ref_customer`**: Tidak dipakai. Data nasabah disimpan langsung per tiket di `tbl_complain` atau via `ref_typecust`.
- **`ref_subject02`**: Tabel duplikat/versi lama dari `ref_subject`.
- **`ref_bulan`**: Tidak dipakai (Logic tanggal ditangani aplikasi).
- **`ref_tahun`**: Tidak dipakai.
- **`ref_yn`**: Tidak dipakai (Logic Yes/No ditangani aplikasi).
- **`rmenu`**: Legacy menu management (Sekarang via React Router & Sidebar).
- **`tbllistmaster`**: Legacy list master (Sekarang via `master.js` config).

---
*Dokumen ini dibuat otomatis oleh AI Assistant pada 05 Jan 2026. Mohon diperbarui jika ada perubahan struktur.*
