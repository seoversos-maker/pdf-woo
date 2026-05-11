import { PDFDownloadLink } from '@react-pdf/renderer';
import { CatalogDocument } from './CatalogDocument';
import { Product } from '../lib/woocommerce';

interface Props {
  products: Product[];
}

export const PDFPreview = ({ products }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-serif mb-2 text-gray-900">Catálogo Listo</h2>
        <p className="text-gray-500">Se han procesado {products.length} productos de WooCommerce.</p>
      </div>

      <PDFDownloadLink
        document={<CatalogDocument products={products} />}
        fileName="catalogo-lartisan.pdf"
        className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3"
      >
        {({ loading }) => (
          loading ? 'Preparando PDF...' : 'Descargar Catálogo (PDF)'
        )}
      </PDFDownloadLink>
      
      <p className="mt-6 text-xs text-gray-400 uppercase tracking-widest">Estética Editorial L'Artisan</p>
    </div>
  );
};
