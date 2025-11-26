import { TPurcaseMismatchNotif, TPurcaseNotif } from "./type-data";

export const templatePurchaseRequest = (props: TPurcaseNotif) => {
  return `*Pemberitahuan Pesanan*

Bapak/Ibu ${props.nameSupplier}  
di ${props.store_name}

Kami ingin memesan beberapa produk berikut:
${props.items.map((i) => `- ${i.nameItem} - ${i.qty} ${i.nameUnit}`).join("\n")}

Mohon konfirmasi ketersediaan dan waktu pengiriman.

Terima kasih.`;
};

export const templatePurchaseUpdate = (props: TPurcaseNotif) => {
  return `*Pemberitahuan Perubahan Pesanan*

Bapak/Ibu ${props.nameSupplier}  
di ${props.store_name}

Kami ingin mengubah pesanan produk berikut:
${props.items.map((i) => `- ${i.nameItem} - ${i.qty} ${i.nameUnit}`).join("\n")}

Mohon konfirmasi ketersediaan dan waktu pengiriman.

Terima kasih.`;
};

export const templatePurchaseMismatch = (props: TPurcaseMismatchNotif) => {
  return `*Pemberitahuan Ketidaksesuaian Barang*

Bapak/Ibu ${props.nameUser}  

Saat proses penerimaan barang, ditemukan beberapa item yang tidak sesuai dengan pesanan:
${props.store_name} / ${props.nameSupplier}

Berikut detail barang yang tidak sesuai:
${props.items
  .map(
    (i) => `- ${i.nameItem}
  Dipesan: ${i.qty} ${i.nameUnit}
  Diterima Baik: ${i.qtyCheck} ${i.nameUnit}
  Selisih/Rusak: ${i.qtyDifference} ${i.nameUnit}
  Note: ${i.note}`
  )
  .join("\n\n")}

Mohon segera dilakukan verifikasi dan koordinasi dengan supplier.

Terima kasih.`;
};

export const templateLowStock = (props: TPurcaseMismatchNotif) => {
  return `*Pemberitahuan Low Stock*

Beberapa item stok di restoran Anda berada di bawah batas minimum.
Mohon lakukan pengecekan dan restock secepatnya.

Berikut detail barang yang tidak sesuai:
${props.items
  .map(
    (i) => `- ${i.nameItem}
  Dipesan: ${i.qty} ${i.nameUnit}
  Diterima Baik: ${i.qtyCheck} ${i.nameUnit}
  Selisih/Rusak: ${i.qtyDifference} ${i.nameUnit}
  Note: ${i.note}`
  )
  .join("\n\n")}

Silakan siapkan pembelian atau pemesanan ulang.

Terima kasih.`;
};
