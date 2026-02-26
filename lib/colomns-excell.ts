import { TColumnExcell } from "./type-data";

export const columnsExcelTransactionIn: TColumnExcell[] = [
  { header: "No Transaksi", value: "idTransaction" },
  { header: "Dibuat Oleh", value: "nameUser" },
  { header: "Tanggal", value: "dateTransaction" },
  { header: "Toko", value: "store_name" },
  { header: "Bahan Baku", value: "nameItem" },
  { header: "Unit", value: "nameUnit" },
  { header: "Jumlah Dipesan", value: "quantityDetailTransaction" },
  { header: "Jumlah Baik", value: "quantityCheck" },
  { header: "Jumlah Rusak", value: "quantityDifference" },
  { header: "Note", value: "note" },
];

export const columnsExcelTransactionOUT: TColumnExcell[] = [
  { header: "No Transaksi", value: "idTransaction" },
  { header: "Dibuat Oleh", value: "nameUser" },
  { header: "Tanggal", value: "dateTransaction" },
  { header: "Bahan Baku", value: "nameItem" },
  { header: "Unit", value: "nameUnit" },
  { header: "Qyt Keluar", value: "quantityDetailTransaction" },
  { header: "Note", value: "note" },
];

export const columnsExcelTransactionCHECK: TColumnExcell[] = [
  { header: "No Transaksi", value: "idTransaction" },
  { header: "Dibuat Oleh", value: "nameUser" },
  { header: "Tanggal", value: "dateTransaction" },
  { header: "Bahan Baku", value: "nameItem" },
  { header: "Unit", value: "nameUnit" },
  { header: "Qyt Sistem", value: "quantityDetailTransaction" },
  { header: "Qyt Fisik", value: "quantityCheck" },
  { header: "Selisih", value: "quantityDifference" },
  { header: "Note", value: "note" },
];

export const columnsExcelStockReport: TColumnExcell[] = [
  { header: "No Bahan Baku", value: "idItem" },
  { header: "Nama", value: "nameItem" },
  { header: "Kategori", value: "nameCategory" },
  { header: "Satuan", value: "nameUnit" },
  { header: "Stok Awal", value: "stokAwal" },
  { header: "Barang Masuk", value: "totalMasuk" },
  { header: "Barang Keluar", value: "totalKeluar" },
  { header: "Total Perubahan", value: "totalPerubahan" },
  { header: "Stok Akhir", value: "stokAkhir" },
  { header: "Stok Minimum", value: "stokMinimum" },
  { header: "Status Stok", value: "stockStatus" },
  { header: "Jumlah Transaksi", value: "totalTransaksi" },
];
