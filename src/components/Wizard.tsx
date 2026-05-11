import { useState, useEffect } from 'react';
import { fetchCategories, fetchProducts, Category, Product } from '../lib/woocommerce';
import { PDFPreview } from './PDFPreview';

type Step = 'IDLE' | 'CONNECTING' | 'SELECTING_CATEGORIES' | 'GENERATING' | 'READY';

export const Wizard = () => {
  const [step, setStep] = useState<Step>('IDLE');
  const [creds, setCreds] = useState({ url: '', key: '', secret: '', token: '' });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCats, setSelectedCats] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wc_creds');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCreds({ url: parsed.url || '', key: parsed.key || '', secret: parsed.secret || '', token: parsed.token || '' });
    }
  }, []);

  const [isManual, setIsManual] = useState(false);

  const handleManualConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      });
      if (!res.ok) throw new Error('Credenciales inválidas');
      
      const catRes = await fetch('/api/categories');
      if (!catRes.ok) throw new Error('No se pudieron obtener categorías. Verificá tu Bridge Token.');
      const cats = await catRes.json();
      setCategories(cats);
      setStep('SELECTING_CATEGORIES');
      // Save to localStorage
      localStorage.setItem('wc_creds', JSON.stringify(creds));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOneClickConnect = () => {
    if (!creds.url) return setError('Ingresá la URL de tu tienda');
    const baseUrl = window.location.origin.replace(/\/$/, '');
    const returnUrl = baseUrl;
    const callbackUrl = `${baseUrl}/api/auth/callback`;
    const cleanStoreUrl = creds.url.replace(/\/$/, '');
    const authUrl = `${cleanStoreUrl}/wc-auth/v1/authorize?app_name=PDF%20Woo&scope=read&user_id=1&return_url=${returnUrl}&callback_url=${callbackUrl}`;
    window.location.href = authUrl;
  };

  // Check if session exists on mount or return
  useEffect(() => {
    async function checkSession() {
      // Intentar cargar desde localStorage primero
      const saved = localStorage.getItem('wc_creds');
      if (saved) {
        const savedCreds = JSON.parse(saved);
        setCreds(savedCreds);
        
        const res = await fetch('/api/categories');
        if (res.ok) {
          const cats = await res.json();
          setCategories(cats);
          setStep('SELECTING_CATEGORIES');
        } else if (res.status === 401) {
          // Si el servidor perdió la sesión pero tenemos el token, re-autenticar silenciosamente
          await fetch('/api/auth/manual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(savedCreds),
          });
          const retryRes = await fetch('/api/categories');
          if (retryRes.ok) {
            const cats = await retryRes.json();
            setCategories(cats);
            setStep('SELECTING_CATEGORIES');
          }
        }
      }
    }
    checkSession();
  }, []);

  const handleGenerate = async () => {
    if (selectedCats.length === 0) {
      setError('Seleccioná al menos una categoría.');
      return;
    }
    setLoading(true);
    try {
      let res = await fetch(`/api/products?category=${selectedCats.join(',')}`);
      
      if (res.status === 401) {
        // Re-autenticar si se perdió la sesión
        const saved = localStorage.getItem('wc_creds');
        if (saved) {
          await fetch('/api/auth/manual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: saved,
          });
          res = await fetch(`/api/products?category=${selectedCats.join(',')}`);
        }
      }

      if (!res.ok) throw new Error();
      const prods = await res.json();
      setProducts(prods);
      setStep('READY');
    } catch (err) {
      setError('Error al traer productos. Verificá tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (id: any) => {
    setSelectedCats(prev => {
      const exists = prev.some(i => String(i) === String(id));
      if (exists) {
        return prev.filter(i => String(i) !== String(id));
      } else {
        return [...prev, id];
      }
    });
  };

  const isSelected = (id: any) => {
    return selectedCats.some(i => String(i) === String(id));
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
          <h2 className="text-3xl font-serif mb-6 text-gray-900">{isManual ? 'Conexión Manual' : 'Conectar Tienda'}</h2>
          <p className="text-gray-500 mb-8 text-sm">
            {isManual ? 'Ingresá tus llaves de API manualmente.' : 'Ingresá la dirección de tu WordPress para iniciar la conexión segura.'}
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">URL del Sitio</label>
              <input 
                type="url" 
                placeholder="https://mitienda.com"
                className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition-all"
                value={creds.url}
                onChange={e => setCreds({...creds, url: e.target.value})}
              />
            </div>
            {isManual && (
              <>
                <div className="bg-black/5 p-4 rounded-2xl border border-black/10 mb-4">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 font-bold">Modo Robusto (Bridge Plugin)</label>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-semibold">Bridge Token</label>
                    <input 
                      type="text" 
                      placeholder="Pegá el token del plugin aquí..."
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black transition-all text-sm"
                      value={creds.token}
                      onChange={e => setCreds({...creds, token: e.target.value})}
                    />
                  </div>
                </div>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-bold">O usar API Nativa</span></div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">Consumer Key</label>
                  <input 
                    type="text" 
                    placeholder="ck_..."
                    className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition-all"
                    value={creds.key}
                    onChange={e => setCreds({...creds, key: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">Consumer Secret</label>
                  <input 
                    type="password" 
                    placeholder="cs_..."
                    className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition-all"
                    value={creds.secret}
                    onChange={e => setCreds({...creds, secret: e.target.value})}
                  />
                </div>
              </>
            )}
          </div>
          
          {error && <p className="mt-6 text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl">⚠️ {error}</p>}
          
          <div className="mt-10 flex flex-col gap-3">
            <button 
              onClick={isManual ? handleManualConnect : handleOneClickConnect}
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-300 transition-all shadow-lg"
            >
              {loading ? 'Conectando...' : isManual ? 'Conectar Manualmente' : 'Vincular Tienda'}
            </button>
            <div className="flex justify-between items-center px-1">
              <button 
                onClick={() => setStep('IDLE')}
                className="text-gray-400 font-semibold hover:text-black transition-colors text-xs uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setIsManual(!isManual)}
                className="text-black font-bold hover:underline text-xs"
              >
                {isManual ? 'Usar modo automático' : '¿Problemas? Usar llaves manuales'}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'SELECTING_CATEGORIES' && (
        <div className="p-10 bg-white rounded-3xl shadow-2xl border border-gray-100">
          <h2 className="text-3xl font-serif mb-2 text-gray-900">Seleccionar Categorías</h2>
          <div className="flex justify-between items-end mb-6">
            <p className="text-gray-400">Elegí las secciones que querés incluir en el PDF.</p>
            <button 
              onClick={() => {
                if (selectedCats.length === categories.length) {
                  setSelectedCats([]);
                } else {
                  setSelectedCats(categories.map(c => c.id));
                }
              }}
              className="text-xs font-bold text-black uppercase tracking-wider hover:underline"
            >
              {selectedCats.length === categories.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {categories.filter(c => !c.parent || c.parent === 0).map(parent => {
              const children = categories.filter(c => c.parent === parent.id);
              return (
                <div key={parent.id} className="border-2 border-gray-100 rounded-2xl overflow-hidden bg-white">
                  <label 
                    className={`flex items-center justify-between p-4 cursor-pointer transition-all ${
                      isSelected(parent.id) ? 'bg-black/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input 
                        type="checkbox"
                        className="hidden"
                        checked={isSelected(parent.id)}
                        onChange={() => toggleCategory(parent.id)}
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected(parent.id) ? 'bg-black border-black' : 'border-gray-300'
                      }`}>
                        {isSelected(parent.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className="font-bold text-gray-900">{parent.name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                      {parent.count} items
                    </span>
                  </label>
                  
                  {children.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50/50 p-2 pl-12 flex flex-col gap-1">
                      {children.map(child => (
                        <label 
                          key={child.id}
                          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                            isSelected(child.id) ? 'bg-black/5 border-black/10 border' : 'hover:bg-gray-100 border-transparent border'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox"
                              className="hidden"
                              checked={isSelected(child.id)}
                              onChange={() => toggleCategory(child.id)}
                            />
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected(child.id) ? 'bg-black border-black' : 'border-gray-300'
                            }`}>
                              {isSelected(child.id) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                            <span className="font-medium text-sm text-gray-700">{child.name}</span>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full shadow-sm border border-gray-100">
                            {child.count} items
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
