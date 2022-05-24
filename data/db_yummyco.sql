/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `detail_transaksi` (
  `id_detail_transaksi` int(11) NOT NULL AUTO_INCREMENT,
  `id_transaksi` int(11) NOT NULL,
  `id_makanan` int(11) NOT NULL,
  `jumlah_beli` int(11) NOT NULL,
  PRIMARY KEY (`id_detail_transaksi`),
  KEY `fk_id_transaksi` (`id_transaksi`),
  KEY `fk_id_makanan` (`id_makanan`),
  CONSTRAINT `fk_id_makanan` FOREIGN KEY (`id_makanan`) REFERENCES `makanan` (`id_makanan`),
  CONSTRAINT `fk_id_transaksi` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi` (`id_transaksi`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `login_user` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `makanan` (
  `id_makanan` int(11) NOT NULL AUTO_INCREMENT,
  `jenis_makanan` varchar(50) NOT NULL,
  `harga` decimal(9,2) NOT NULL,
  `stok` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_makanan`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `transaksi` (
  `id_transaksi` int(11) NOT NULL AUTO_INCREMENT,
  `nama_pelanggan` varchar(50) NOT NULL,
  `tanggal_transaksi` date NOT NULL,
  `total_bayar` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id_transaksi`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

INSERT INTO `detail_transaksi` (`id_detail_transaksi`, `id_transaksi`, `id_makanan`, `jumlah_beli`) VALUES
(1, 1, 1, 1);
INSERT INTO `detail_transaksi` (`id_detail_transaksi`, `id_transaksi`, `id_makanan`, `jumlah_beli`) VALUES
(2, 1, 2, 1);
INSERT INTO `detail_transaksi` (`id_detail_transaksi`, `id_transaksi`, `id_makanan`, `jumlah_beli`) VALUES
(3, 1, 3, 0);
INSERT INTO `detail_transaksi` (`id_detail_transaksi`, `id_transaksi`, `id_makanan`, `jumlah_beli`) VALUES
(4, 1, 5, 0),
(5, 1, 6, 0),
(6, 2, 1, 2),
(7, 2, 2, 2),
(8, 2, 3, 2),
(9, 2, 5, 0),
(10, 2, 6, 0),
(11, 3, 1, 0),
(12, 3, 2, 0),
(13, 3, 3, 3),
(14, 3, 5, 3),
(15, 3, 6, 0),
(16, 4, 1, 1),
(17, 4, 2, 1),
(18, 4, 3, 0),
(19, 4, 5, 0),
(20, 4, 6, 0),
(21, 5, 1, 1),
(22, 5, 2, 1),
(23, 5, 3, 1),
(24, 5, 5, 1),
(25, 5, 6, 1),
(26, 6, 1, 2),
(27, 6, 2, 2),
(28, 6, 3, 0),
(29, 6, 5, 0),
(30, 6, 6, 1);

INSERT INTO `login_user` (`id_user`, `username`, `password`) VALUES
(1, 'admin', 'admin');


INSERT INTO `makanan` (`id_makanan`, `jenis_makanan`, `harga`, `stok`) VALUES
(1, 'Ayam Geprek', 15000.00, 32);
INSERT INTO `makanan` (`id_makanan`, `jenis_makanan`, `harga`, `stok`) VALUES
(2, 'Nasi', 5000.00, 22);
INSERT INTO `makanan` (`id_makanan`, `jenis_makanan`, `harga`, `stok`) VALUES
(3, 'Es teh manis', 3000.00, 29);
INSERT INTO `makanan` (`id_makanan`, `jenis_makanan`, `harga`, `stok`) VALUES
(5, 'Nasi goreng', 12000.00, 26),
(6, 'Ayam goreng', 10000.00, 23);

INSERT INTO `transaksi` (`id_transaksi`, `nama_pelanggan`, `tanggal_transaksi`, `total_bayar`) VALUES
(1, 'John Dude', '2022-05-22', 20000.00);
INSERT INTO `transaksi` (`id_transaksi`, `nama_pelanggan`, `tanggal_transaksi`, `total_bayar`) VALUES
(2, 'Reymunda', '2022-05-22', 46000.00);
INSERT INTO `transaksi` (`id_transaksi`, `nama_pelanggan`, `tanggal_transaksi`, `total_bayar`) VALUES
(3, 'Putri', '2022-05-22', 45000.00);
INSERT INTO `transaksi` (`id_transaksi`, `nama_pelanggan`, `tanggal_transaksi`, `total_bayar`) VALUES
(4, 'Bambang', '2022-05-22', 20000.00),
(5, 'Tono Toni', '2022-05-22', 45000.00),
(6, 'Suryana', '2022-05-23', 50000.00);


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;