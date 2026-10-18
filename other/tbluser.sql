-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jan 05, 2026 at 12:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_bniintciu`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbluser`
--

CREATE TABLE `tbluser` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL DEFAULT '',
  `pass` varchar(50) NOT NULL DEFAULT '',
  `nip_nrp` varchar(25) DEFAULT NULL,
  `fullname` varchar(50) DEFAULT '',
  `idgroup` varchar(15) NOT NULL DEFAULT '0',
  `jabatan` varchar(200) DEFAULT NULL,
  `nohp` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `lastchange` date NOT NULL,
  `must_change_password` tinyint(1) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tbluser`
--

INSERT INTO `tbluser` (`id`, `name`, `pass`, `nip_nrp`, `fullname`, `idgroup`, `jabatan`, `nohp`, `email`, `lastchange`, `must_change_password`) VALUES
(154, '95194', '95194', '95194', 'Silvi Nurul Aola', '5', 'RQA', '-', 'Silvi.Aola@bni.co.id', '2025-12-31', 0),
(153, '94861', '94861', '94861', 'Nandha Putri Wulandari', '5', 'RQA', '-', 'Nandha.Wulandari@bni.co.id', '2025-12-31', 0),
(152, '94863', '94863', '94863', 'Dwi Wahyuningsih', '5', 'RQA', '-', 'Dwi.Wahyuningsih@bni.co.id', '2025-12-31', 0),
(151, '92047', '92047', '92047', 'Awalia Rizka Wulandari', '5', 'RQA', '-', 'Awalia.Rizka@bni.co.id', '2025-12-31', 0),
(149, '92358', '92358', '92358', 'Yoedhi Bagoes P', '5', 'RQA', '-', 'Yoedhi.Bagoes@bni.co.id', '2025-12-31', 0),
(150, '92182', '92182', '92182', 'Eko Puji Rahayu', '5', 'RQA', '-', 'Eko.PujiRahayu@bni.co.id', '2025-12-31', 0),
(148, '93971', '93971', '93971', 'Rivany Keumala Putri Siagian', '5', 'RQA', '-', 'Rivany.Siagian@bni.co.id', '2025-12-31', 0),
(147, '95373', '95373', '95373', 'Resty Jelita Chintya', '5', 'RQA', '-', 'Resty.JelitaChintya@bni.co.id', '2025-12-31', 0),
(146, '96204', '96204', '96204', 'Sasmita Dwi Kartika Warih', '5', 'RQA', '-', 'Sasmita.Dwi.Kartika.Warih@bni.co.id', '2025-12-31', 0),
(145, '91199', '91199', '91199', 'Agung Setio Nugroho', '5', 'RQA', '-', 'Agung.SetioNugroho@bni.co.id', '2025-12-31', 0),
(143, '95522', '95522', '95522', 'Tika Meila Sari', '5', 'RQA', '-', 'Tika.Meila@bni.co.id', '2025-12-31', 0),
(144, '94904', '94904', '94904', 'Ismayani', '5', 'RQA', '-', 'Ismayani@bni.co.id', '2025-12-31', 0),
(142, '78153', '78153', '78153', 'Novita Sari Anggraini', '5', 'RQA', '-', 'Novita.anggraini@bni.co.id', '2025-12-31', 0),
(140, '92308', '92308', '92308', 'Daud Yusuf', '5', 'RQA', '-', 'Daud.Yusuf@bni.co.id', '2025-12-31', 0),
(141, '93739', '93739', '93739', 'Septianingsih', '5', 'RQA', '-', 'Septianingsih@bni.co.id', '2025-12-31', 0),
(139, '91557', '91557', '91557', 'Putri Alief Rizki', '5', 'RQA', '-', 'Putri.Alief@bni.co.id', '2025-12-31', 0),
(138, '96297', '96297', '96297', 'Bagus Sugiarta', '5', 'RQA', '-', 'Bagus.Sugiarta@bni.co.id', '2025-12-31', 0),
(136, '91732', '91732', '91732', 'Dwi Enggar Agustina', '5', 'RQA', '-', 'dwi.agustina@bni.co.id', '2025-12-31', 0),
(137, '95139', '95139', '95139', 'Imam Rasyid Azis', '5', 'RQA', '-', 'Imam.Rasyid@bni.co.id', '2025-12-31', 0),
(135, '90787', '90787', '90787', 'Dwi Ayu Retno Wulan', '5', 'RQA', '-', 'Dwi.Wulan92@bni.co.id', '2025-12-31', 0),
(134, '90996', '90996', '90996', 'Destia Reti', '5', 'RQA', '-', 'Destia61@bni.co.id', '2025-12-31', 0),
(133, '91797', '91797', '91797', 'Giyanti Dwi Wahyuni', '5', 'RQA', '-', 'Giyanti.dwi@bni.co.id', '2025-12-31', 0),
(132, '96258', '96258', '96258', 'Fitri Nur Pratama', '5', 'RQA', '-', 'fitri.nur@bni.co.id', '2025-12-31', 0),
(130, '93079', '93079', '93079', 'Yully Damayanti', '5', 'RQA', '-', 'Yully.Damayanti@bni.co.id', '2025-12-31', 0),
(131, '95363', '95363', '95363', 'Espe Simanjuntak', '5', 'RQA', '-', 'Espe.Simanjuntak@bni.co.id', '2025-12-31', 0),
(129, '90775', '90775', '90775', 'Tia Sutrianoer Hasyim', '5', 'RQA', '-', 'Tia.Hasyim@bni.co.id', '2025-12-31', 0),
(128, '92128', '92128', '92128', 'Lusiani Kusuma Dewi', '5', 'RQA', '-', 'Lusiana.Dewi@bni.co.id', '2025-12-31', 0),
(126, '90879', '90879', '90879', 'Silvia Rachman Harahap', '5', 'RQA', '-', 'Silvia.Harahap@bni.co.id', '2025-12-31', 0),
(127, '91891', '91891', '91891', 'Yesi Susanti', '5', 'RQA', '-', 'Yesi.Susanti@bni.co.id', '2025-12-31', 0),
(125, '94633', '94633', '94633', 'Sarwono', '5', 'RQA', '-', 'sarwono.bcc@bni.co.id', '2025-12-31', 0),
(124, '99060', '99060', '99060', 'Ulfa Maisaroh', '5', 'CXO T&R', '-', 'Ulfa.Maisaroh@bni.co.id', '2025-12-31', 0),
(122, '96954', '96954', '96954', 'Amartya Intan Ramadhina', '5', 'CXO T&R', '-', 'Amartya.Intan@bni.co.id', '2025-12-31', 0),
(123, '96991', '96991', '96991', 'Deyna Yulian Putri', '5', 'CXO T&R', '-', 'Deyna.Yulian.Putri@bni.co.id', '2025-12-31', 0),
(121, '96903', '96903', '96903', 'Restika Arisandi', '5', 'CXO T&R', '-', 'Restika.Arisandi@bni.co.id', '2025-12-31', 0),
(120, '96455', '96455', '96455', 'Opentina Br Sidabutar', '5', 'CXO T&R', '-', 'Opentina.Br.Sidabutar@bni.co.id', '2025-12-31', 0),
(119, '96375', '96375', '96375', 'Rany Luthfiani', '5', 'CXO T&R', '-', 'Rany.Luthfiani@bni.co.id', '2025-12-31', 0),
(118, '96283', '96283', '96283', 'Maria Okta Angelia Imelda Manik', '5', 'CXO T&R', '-', 'Maria.Manik@bni.co.id', '2025-12-31', 0),
(117, '96207', '96207', '96207', 'Fanka Amalia Ananda', '5', 'CXO T&R', '-', 'Fanka.Amalis.Anada@bni.co.id', '2025-12-31', 0),
(116, '96199', '96199', '96199', 'Dwiky Alviansyah Putra ', '5', 'CXO T&R', '-', 'Dwiky.Alviansyah.Putra@bni.co.id', '2025-12-31', 0),
(115, '95463', '95463', '95463', 'Vito Syaelendra', '5', 'CXO T&R', '-', 'Vito.Syaelendra@bni.co.id', '2025-12-31', 0),
(114, '95105', '95105', '95105', 'Clara Pitaloka', '5', 'CXO T&R', '-', 'clara.pitaloka@bni.co.id', '2025-12-31', 0),
(113, '94741', '94741', '94741', 'Ella Yolanda Tinambunan', '5', 'CXO T&R', '-', 'Ella.Yolanda@bni.co.id', '2025-12-31', 0),
(111, '93970', '93970', '93970', 'Ratu Siti Hafsah Dasilva', '5', 'CXO T&R', '-', 'Ratu.Dasilva@bni.co.id', '2025-12-31', 0),
(112, '94747', '94747', '94747', 'Machriwan Aswad', '5', 'CXO T&R', '-', 'Machriwan.Aswad@bni.co.id', '2025-12-31', 0),
(110, '95474', '95474', '95474', 'Angga Hermansyah', '4', 'TL T&R', '-', 'Angga.Hermansyah@bni.co.id', '2025-12-31', 0),
(109, '36779', '36779', '36779', 'Jennifer Stefanie Nugraha', '3', 'SPV T&R', NULL, 'Jennifer.Nugraha@bni.co.id', '2025-12-31', 0),
(108, '19244', '19244', '19244', 'Sondang Rianovalina Siahaan', '2', 'MGR T&R', '-', 'Sondang.rianovalina@bni.co.id', '2025-12-31', 0),
(103, 'anggauser', 'anggauser', '', 'Angga - CXO', '5', 'CXO T&R', '', '', '2025-12-30', 0),
(102, 'anggaspv', 'anggaspv', '', 'Angga - SPV', '3', 'SPV - T&R', '', '', '2025-12-30', 0),
(161, 'tl', 'Passw0rd29$', '', 'tl', '4', 'tl', 'tl', 'tl', '2025-12-31', 0),
(162, 'user', 'Aaaa1234!', '', 'user', '5', 'user', 'user', 'user', '2025-12-31', 0),
(98, 'admin', 'admin', '', 'Admin - SDI', '1', 'Administrator', '', '', '2025-12-30', 0),
(159, 'spv', 'Passw0rd29$', '', 'spv', '3', 'spv', 'spv', 'spv', '2025-12-31', 0),
(158, 'mgr', 'mgr', '', 'mgr', '2', 'mgr', 'mgr', 'mgr', '2025-12-31', 1),
(163, '1', 'Passw0rd29$', '', '1', '5', '1', '1', '1', '2026-01-05', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbluser`
--
ALTER TABLE `tbluser`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbluser`
--
ALTER TABLE `tbluser`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=164;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
