-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `role` ENUM('admin', 'penumpang') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pelanggan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `NIK` VARCHAR(100) NOT NULL,
    `nama_penumpang` VARCHAR(100) NOT NULL,
    `alamat` TEXT NOT NULL,
    `telp` VARCHAR(20) NOT NULL,
    `id_user` INTEGER NOT NULL,

    UNIQUE INDEX `Pelanggan_NIK_key`(`NIK`),
    UNIQUE INDEX `Pelanggan_id_user_key`(`id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Petugas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_petugas` VARCHAR(100) NOT NULL,
    `alamat` TEXT NOT NULL,
    `telp` VARCHAR(20) NOT NULL,
    `id_user` INTEGER NOT NULL,

    UNIQUE INDEX `Petugas_id_user_key`(`id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kereta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kereta` VARCHAR(100) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gerbong` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_gerbong` VARCHAR(191) NOT NULL,
    `kuota` INTEGER NOT NULL,
    `id_kereta` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kursi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_kursi` VARCHAR(191) NOT NULL,
    `id_gerbong` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jadwal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asal_keberangkatan` VARCHAR(100) NOT NULL,
    `tujuan_keberangkatan` VARCHAR(100) NOT NULL,
    `tanggal_berangkat` DATETIME(3) NOT NULL,
    `tanggal_kedatangan` DATETIME(3) NOT NULL,
    `harga` DOUBLE NOT NULL,
    `id_kereta` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pembelian_tiket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal_pembelian` DATETIME(3) NOT NULL,
    `id_pelanggan` INTEGER NOT NULL,
    `id_jadwal` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Detail_pembelian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `NIK` VARCHAR(100) NOT NULL,
    `nama_penumpang` VARCHAR(100) NOT NULL,
    `id_pembelian_tiket` INTEGER NOT NULL,
    `id_kursi` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pelanggan` ADD CONSTRAINT `Pelanggan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Petugas` ADD CONSTRAINT `Petugas_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gerbong` ADD CONSTRAINT `Gerbong_id_kereta_fkey` FOREIGN KEY (`id_kereta`) REFERENCES `Kereta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kursi` ADD CONSTRAINT `Kursi_id_gerbong_fkey` FOREIGN KEY (`id_gerbong`) REFERENCES `Gerbong`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jadwal` ADD CONSTRAINT `Jadwal_id_kereta_fkey` FOREIGN KEY (`id_kereta`) REFERENCES `Kereta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembelian_tiket` ADD CONSTRAINT `Pembelian_tiket_id_pelanggan_fkey` FOREIGN KEY (`id_pelanggan`) REFERENCES `Pelanggan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembelian_tiket` ADD CONSTRAINT `Pembelian_tiket_id_jadwal_fkey` FOREIGN KEY (`id_jadwal`) REFERENCES `Jadwal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Detail_pembelian` ADD CONSTRAINT `Detail_pembelian_id_pembelian_tiket_fkey` FOREIGN KEY (`id_pembelian_tiket`) REFERENCES `Pembelian_tiket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Detail_pembelian` ADD CONSTRAINT `Detail_pembelian_id_kursi_fkey` FOREIGN KEY (`id_kursi`) REFERENCES `Kursi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
