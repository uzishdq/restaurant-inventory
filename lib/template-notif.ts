import { TPurcaseNotif } from "./type-data";

export const templatePurchaseRequest = (props: TPurcaseNotif) => {
  return `*Pemberitahuan Pesanan*

Bapak/Ibu ${props.nameSupplier}  
di ${props.store_name}

Kami ingin memesan beberapa produk berikut:
${props.items
  .map(
    (i) => `
- ${i.nameItem} - ${i.qty} ${i.nameUnit}`
  )
  .join("\n")}

Mohon konfirmasi ketersediaan dan waktu pengiriman.

Terima kasih.`;
};

export const templatePurchaseUpdate = (props: TPurcaseNotif) => {
  return `*Pemberitahuan Perubahan Pesanan*

Bapak/Ibu ${props.nameSupplier}  
di ${props.store_name}

Kami ingin mengubah pesanan produk berikut:
${props.items
  .map(
    (i) => `
- ${i.nameItem} - ${i.qty} ${i.nameUnit}`
  )
  .join("\n")}

Mohon konfirmasi ketersediaan dan waktu pengiriman.

Terima kasih.`;
};
