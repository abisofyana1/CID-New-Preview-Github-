# Kajian Teknis & Fungsional: BNI Complaint Management App

**Tanggal Dokumen**: 31 Desember 2025
**Versi Dokumen**: 1.1
**Status**: Final Release

---

## 1. Eksekutif Summary
Aplikasi **BNI Complaint Management** dikembangkan sebagai solusi digital untuk modernisasi proses pencatatan, pemantauan, dan penyelesaian keluhan nasabah. Sistem ini mentransformasi proses pencatatan manual menjadi sistem terpusat berbasis web yang *real-time*, transparan, dan akuntabel. Dengan arsitektur modern (MERN Stack) dan desain antarmuka yang intuitif, aplikasi ini bertujuan meningkatkan efisiensi operasional tim penanganan keluhan (Handling Team) serta mempercepat *Service Level Agreement* (SLA) penyelesaian masalah.

## 2. Latar Belakang & Tujuan
### 2.1. Latar Belakang
Sebelumnya, pencatatan keluhan mungkin menghadapi kendala seperti:
*   Data tersebar atau tidak terstandarisasi.
*   Kesulitan dalam memantau status penyelesaian (*Open/Close*) secara *real-time*.
*   Keterbatasan dalam pelaporan dan analisis tren keluhan.
*   Kurangnya kontrol akses berjenjang (Role-Based Access Control).

### 2.2. Tujuan Pengembangan
1.  **Sentralisasi Data**: Mengumpulkan seluruh data keluhan dalam satu database yang aman.
2.  **Efisiensi Operasional**: Mempercepat proses input dan pencarian data nasabah.
3.  **Monitoring Efektif**: Menyediakan daftar tiket terpusat dengan indikator status visual (warna).
4.  **Keamanan Data**: Memastikan hanya pengguna berwenang yang dapat mengakses atau mengubah data sensitif.

## 3. Arsitektur & Spesifikasi Teknis
Aplikasi dibangun di atas fondasi teknologi modern untuk menjamin performa dan skalabilitas.

### 3.1. Technology Stack
| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend** | **React.js (Vite)** | Framework UI modern yang cepat dan responsif. Menggunakan **Tailwind/Vanilla CSS** untuk styling. |
| **Backend** | **Node.js & Express** | Server-side runtime yang efisien menangani request API asinkronus. |
| **Database** | **MySQL** | Relational Database Management System (RDBMS) untuk integritas data yang kuat. |
| **Konektivitas** | **Axios** | HTTP Client untuk komunikasi data antara Frontend dan Backend. |
| **Library Pendukung** | `lucide-react` (Ikon), `date-fns` (Waktu), `xlsx-js-style` (Export Excel), `recharts` (Grafik). |

### 3.2. Struktur Database
Terdiri dari tabel utama:
*   `tbl_complain`: Menyimpan data transaksi keluhan (Tiket, Nasabah, Masalah, Status).
*   `tbluser`: Data pengguna dan kredensial login.
*   `tblgroup`: Definisi peran (Role) pengguna.
*   Tabel Master (`tbl_product`, `tbl_branch`, dll): Referensi data standar.

## 4. Analisis Fungsional & Fitur
### 4.1. Manajemen Keluhan (Core Business)
*   **Generate Tiket Otomatis**: Sistem membuat Nomor Tiket unik untuk setiap keluhan baru.
*   **Status Tracking**: Penandaan jelas antara keluhan Aktif (**OPEN**) dan Selesai (**CLOSE**).
*   **Durasi Penanganan**: Sistem otomatis menghitung durasi *SLA* dari waktu Open hingga Close.
*   **Pencarian Cerdas**: Filter multi-dimensi (Berdasarkan User, Cabang, Tanggal, Produk).

### 4.2. Matriks Hak Akses (Role-Based Access Control)
Sistem menerapkan 5 level otorisasi untuk keamanan data:

| Role ID | Peran (Role) | Deskripsi Kewenangan |
| :---: | :--- | :--- |
| **1** | **Admin** | **Super User**. Akses penuh ke semua fitur, termasuk hapus data dan manajemen user sistem. |
| **2** | **MGR (Manager)** | **Pengawas**. Kewenangan setara Admin/SPV untuk monitoring dan intervensi data. Bisa kelola Master Data. |
| **3** | **SPV (Supervisor)** | **Operasional Lead**. Bisa mengedit/menghapus keluhan, menutup tiket, dan mengelola Master Data. |
| **4** | **TL (Team Leader)** | **Monitoring Tim**. Akses baca data tim, edit terbatas (hanya Open Ticket). Tidak bisa akses Master Data. |
| **5** | **User (Staf)** | **Pelaksana**. Input keluhan baru, edit tiket milik sendiri yang masih Open. *View Only* untuk tiket Close. |


## 5. Alur Kerja Sistem (Workflow)
1.  **Input**: Nasabah melapor -> User input data ke "Add Complaint" -> Status **OPEN**.
2.  **Proses**: User/TL memverifikasi dan menindaklanjuti. Update progres di kolom "Answer/Note".
3.  **Penyelesaian**: Masalah selesai -> User/SPV mengubah status menjadi **CLOSE**. Tanggal dan User penutup tercatat otomatis.
4.  **Review**: MGR/SPV memantau laporan harian melalui fitur Filter Search dan Export Excel.

## 6. Aspek Keamanan
*   **Password Hashing**: (Rekomendasi) Password pengguna harus dienkripsi di database.
*   **Session Management**: Menggunakan `localStorage` untuk menyimpan sesi login pengguna (Perlu peningkatan ke Token JWT untuk produksi).
*   **Audit Trail**: Setiap perubahan data penting (Edit/Close) mencatat siapa ("Updater") dan kapan ("Timestamp") perubahan dilakukan.

## 7. Kesimpulan
Aplikasi BNI Complaint Management versi 1.0 (Refined) telah memenuhi standar kebutuhan operasional untuk pencatatan dan pelaporan. Struktur datanya rapi, antarmuka pengguna (UI) modern dan mudah digunakan, serta pembagian hak akses (Roles) yang jelas menjamin keamanan dan akuntabilitas data.

---
*Dokumen ini dibuat secara otomatis oleh Asisten Pengembangan Sistem.*
