import { useState, useEffect } from 'react';
import { fetchCategories, fetchProducts, Category, Product } from '../lib/woocommerce';
import { PDFPreview } from './PDFPreview';

type Step = 'IDLE' | 'CONNECTING' | 'SELECTING_CATEGORIES' | 'GENERATING' | 'READY';

export const Wizard = () => {
  const [step, setStep] = useState<Step>('IDLE');
  const [creds, setCreds] = useState({ url: '', key: '', secret: '' });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCats, setSelectedCats] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wc_creds');
    if (saved) {
      setCreds(JSON.parse(saved));
    }
  }, []);

  const handleOneClickConnect = () => {
    if (!creds.url) return setError('Ingresá la URL de tu tienda');
    
    const returnUrl = window.location.origin;
    const callbackUrl = `${window.location.origin}/api/auth/callback`;
    const authUrl = `${creds.url}/wc-auth/v1/authorize?app_name=PDF%20Woo&scope=read&user_id=1&return_url=${returnUrl}&callback_url=${callbackUrl}`;
    
    window.location.href = authUrl;
  };

  // Check if session exists on mount or return
  useEffect(() => {
    async function checkSession() {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const cats = await res.json();
        setCategories(cats);
        setStep('SELECTING_CATEGORIES');
      }
    }
    checkSession();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?category=${selectedCats.join(',')}`);
      if (!res.ok) throw new Error();
      const prods = await res.json();
      setProducts(prods);
      setStep('READY');
    } catch (err) {
      setError('Error al traer productos.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (id: number) => {
    setSelectedCats(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {step === 'IDLE' && (
        <div className="text-center p-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
          <h1 className="text-5xl font-serif mb-6 text-gray-900 tracking-tight">L'Artisan Catalog</h1>
          <p className="text-gray-500 mb-10 text-lg">Generá catálogos editoriales de lujo directamente desde tu WooCommerce.</p>
          <button 
            onClick={() => setStep('CONNECTING')}
            className="px-10 py-5 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
          >
            Conectar WooCommerce
          </button>
        </div>
      )}

      {step === 'CONNECTING' && (
        <div className="p-10 bg-white rounded-3xl shadow-2xl border border-gray-100">
          <h2 className="text-3xl font-serif mb-6 text-gray-900">Conectar Tienda</h2>
          <p className="text-gray-500 mb-8 text-sm">
            Ingresá la dirección de tu WordPress para iniciar la conexión segura.
          </p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">URL del Sitio</label>
              <input 
                type="url" 
                placeholder="https://mitienda.com"
                required
                className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition-all"
                value={creds.url}
                onChange={e => setCreds({...creds, url: e.target.value})}
              />
            </div>
          </div>
          
          {error && <p className="mt-6 text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl">⚠️ {error}</p>}
          
          <div className="mt-10 flex gap-4">
            <button 
              onClick={() => setStep('IDLE')}
              className="flex-1 py-4 text-gray-400 font-semibold hover:text-black transition-colors text-sm"
            >
              Cancelar
            </button>
            <button 
              onClick={handleOneClickConnect}
              disabled={loading}
              className="flex-[2] py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-300 transition-all shadow-lg"
            >
              {loading ? 'Conectando...' : 'Vincular Tienda'}
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-2xl flex gap-3">
            <span className="text-blue-500">ℹ️</span>
            <p className="text-[10px] text-blue-700 leading-relaxed">
              No necesitás crear llaves manuales. Te redirigiremos a tu WordPress para que autorices el acceso con un clic.
            </p>
          </div>
        </div>
      )}

      {step === 'SELECTING_CATEGORIES' && (
        <div className="p-10 bg-white rounded-3xl shadow-2xl border border-gray-100">
          <h2 className="text-3xl font-serif mb-2 text-gray-900">Seleccionar Categorías</h2>
          <p className="text-gray-400 mb-8">Elegí las secciones que querés incluir en el PDF.</p>
          
          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {categories.map(cat => (
              <label 
                key={cat.id}
                className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                  selectedCats.includes(cat.id) ? 'border-black bg-black/5' : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox"
                    className="hidden"
                    checked={selectedCats.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedCats.includes(cat.id) ? 'bg-black border-black' : 'border-gray-300'
                  }`}>
                    {selectedCats.includes(cat.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="font-medium text-gray-800">{cat.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm">
                  {cat.count} items
                </span>
              </label>
            ))}
          </div>

          <div className="mt-10 flex gap-4">
            <button 
              onClick={() => setStep('CONNECTING')}
              className="flex-1 py-4 text-gray-400 font-semibold hover:text-black transition-colors"
            >
              Atrás
            </button>
            <button 
              onClick={handleGenerate}
              disabled={selectedCats.length === 0 || loading}
              className="flex-[2] py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-300 transition-all shadow-lg"
            >
              {loading ? 'Procesando...' : `Generar con ${selectedCats.length} categorías`}
            </button>
          </div>
        </div>
      )}

      {step === 'READY' && (
        <div className="relative">
          <button 
            onClick={() => setStep('SELECTING_CATEGORIES')}
            className="absolute -top-12 left-0 text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors font-bold"
          >
            ← Volver a categorías
          </button>
          <PDFPreview products={products} />
        </div>
      )}
    </div>
  );
};
