# Buku Petunjuk Penggunaan (User Manual): BNI Complaint Management App

**Selamat Datang**,
Dokumen ini adalah panduan resmi penggunaan aplikasi **BNI Complaint Management**. Ikuti langkah-langkah di bawah ini untuk memahami cara mengoperasikan sistem dengan optimal.

---

## DAFTAR ISI
1.  [Persiapan & Login](#1-persiapan--login)
2.  [Modul Manajemen Keluhan (Complaint List)](#2-modul-manajemen-keluhan-complaint-list)
    *   [Melihat & Mencari Data](#a-melihat--mencari-data)
    *   [Menambah Keluhan Baru](#b-menambah-keluhan-baru-input-ticket)
    *   [Mengupdate & Menutup Tiket](#c-mengupdate--menutup-tiket-closing)
    *   [Export Laporan](#d-export-laporan-excel)
3.  [Modul User Management](#3-modul-user-management-khusus-adminmgrspv)
4.  [Modul Master Data](#4-modul-master-data)

---

## 1. Persiapan & Login
Sebelum memulai, pastikan Anda telah memiliki **Username** dan **Password** yang diberikan oleh Administrator.

1.  **Akses Web**: Buka browser (Chrome/Edge/Firefox) dan masukkan alamat URL aplikasi.
2.  **Halaman Login**:
    *   Masukkan **Username** Anda.
    *   Masukkan **Password** Anda.
    *   Klik tombol **LOGIN**.
3.  **Berhasil**: Jika kredensial benar, Anda akan langsung diarahkan ke halaman **Complaint List** (Data List).

> ![Ilustrasi: Halaman Login Aplikasi]
> *(Silakan capture halaman Login dan tempel di sini)*

---



---

## 2. Modul Manajemen Keluhan (Complaint List)
Menu: **Complaint List**
Ini adalah halaman kerja utama harian Anda.

### A. Melihat & Mencari Data
Daftar keluhan ditampilkan dalam format tabel. Gunakan fitur **Filter Search** di bagian atas untuk menemukan data spesifik:

1.  **Pencarian Teks**: Isi kolom "No Ticket", "Customer Name", atau "No Reff".
2.  **Filter Spesifik**:
    *   **User Open / User Close**: Pilih nama staf dari Dropdown (format: *Nama - Jabatan*) untuk melihat kinerja individu.
    *   **Cabang**: Pilih Unit/Cabang kerja.
    *   **Tanggal**: Tentukan Hari/Bulan/Tahun.
3.  **Reset**: Klik tombol **Reset** (Merah) untuk menghapus semua filter dan menampilkan semua data kembali.

### B. Menambah Keluhan Baru (Input Ticket)
Untuk mencatat keluhan nasabah baru:

1.  Klik tombol **+ Add Data** (Tombol Biru di pojok kanan atas).
2.  Akan muncul **Form Popup**. Isi data berikut:
    *   **Channel**: Media pelaporan (Email, Telp, dll).
    *   **Customer Details**: Jenis Nasabah, Nama, dan Lokasi/Cabang.
    *   **Product Info**: Pilih Produk dan Subjek Masalah.
    *   **Complaint Message**: Ketik detail keluhan nasabah di kolom "Message".
3.  Klik **Save**.
4.  Data tersimpan dengan status **OPEN**. Nomor tiket akan digenerate otomatis.

> ![Ilustrasi: Form Input Data Baru]
> *(Capture form popup saat menambah data)*

### C. Mengupdate & Menutup Tiket (Closing)
Setiap tiket yang sudah ditindaklanjuti harus diupdate atau ditutup.

1.  **Cari Tiket**: Temukan tiket pada tabel.
2.  **Klik Aksi**:
    *   Tombol **Edit** (Pensil Biru): Untuk mengubah data.
    *   Tombol **View** (Mata Hijau): Untuk melihat detail (Mode Baca Saja).
3.  **Update**:
    *   Isi/Tambahkan progres penanganan di kolom **Answer / Follow Up**.
4.  **Closing (Penyelesaian)**:
    *   Jika masalah selesai, ubah **Status** pada form menjadi **CLOSE**.
    *   Klik **Save**.
    *   Sistem akan mencatat **Tanggal Close** dan **Nama User** yang menutup tiket secara otomatis.

> **PENTING: Aturan Hak Akses Edit**
> *   **User / TL**: Hanya bisa mengedit tiket berstatus **OPEN**. Tiket yang sudah CLOSE terkunci (View Only).
> *   **Admin / MGR / SPV**: Memiliki hak akses khusus untuk membuka kembali atau mengedit tiket yang sudah **CLOSE**.

### D. Export Laporan Excel
Untuk kebutuhan laporan harian/bulanan:
1.  Pastikan filter data sudah sesuai dengan data yang ingin ditarik (misal: Filter bulan "Desember").
2.  Klik tombol Hijau **Export Excel** di atas tabel.
3.  File `.xlsx` akan terunduh otomatis ke komputer Anda.

---

## 3. Modul User Management (Khusus Admin/MGR/SPV)
Menu: **User Management**
Digunakan untuk menambah personil tim atau mereset password.

1.  **Daftar User**: Tabel menampilkan semua pengguna beserta jabatannya. Warna Badge menunjukkan Level Role (Ungu=MGR, Oranye=SPV, dll).
2.  **Tambah User Baru**:
    *   Klik **Add User**.
    *   Isi Username, Nama Lengkap, NIP, Jabatan.
    *   Pilih **Role** (Penting! Menentukan hak akses user tersebut).
    *   Isi Password awal.
    *   Klik **Save**.
3.  **Reset Password**: Klik tombol Edit pada user -> Kosongkan password jika tidak ingin mengubah, atau isi password baru untuk mereset.

---

## 4. Modul Master Data
Menu: **Master Data** -> Pilih Sub-menu (Product / Branch / Channel / dll).
Digunakan untuk standarisasi isian form.

*   Halaman ini berfungsi layaknya CRUD (Create, Read, Update, Delete) sederhana.
*   Pastikan Kode Cabang atau Nama Produk diinput dengan benar karena akan muncul di pilihan Dropdown seluruh user.

---

## Bantuan & Troubleshooting
*   **Aplikasi tidak bisa dibuka?** Periksa koneksi internet atau jaringan intranet Anda.
*   **Data tidak muncul?** Coba tekan tombol **Reset Filter** atau refresh browser (F5).
*   **Error "Network Error"?** Hubungi tim IT Support, kemungkinan server database sedang down.

---
*Dokumen User Guide v1.1 - Dibuat 31 Des 2025*
