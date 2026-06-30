import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { getWooConfig, saveWooConfig } from '../services/wooService';
import { Loader } from './Loader';

export const AdminPanel = () => {
  const { content, updateContent } = useContent();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [formData, setFormData] = useState(content || {});
  const [wooConfig, setWooConfig] = useState({ url: '', key: '', secret: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchWooConfig = async () => {
      const config = await getWooConfig();
      setWooConfig(config);
    };
    fetchWooConfig();
  }, []);

  useEffect(() => {
    if (content && Object.keys(formData).length === 0) {
      setFormData(content);
    }
  }, [content]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">ورود به پنل مدیریت</h2>
          {loginError && <p className="text-rose-500 text-sm mb-4 text-center">{loginError}</p>}
          <form onSubmit={(e) => {
            e.preventDefault();
            if (password === '123') {
              setIsAuthenticated(true);
              setLoginError('');
            } else {
              setLoginError('رمز عبور اشتباه است');
            }
          }}>
            <input
              type="password"
              placeholder="رمز عبور..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl mb-4 text-left"
              dir="ltr"
            />
            <button type="submit" className="w-full bg-brand-600 text-white rounded-xl py-3 font-bold hover:bg-brand-700 transition-colors">
              ورود
            </button>
            {/* <p className="text-xs text-slate-500 text-center mt-4">رمز عبور پیش‌فرض: admin123</p> */}
          </form>
        </div>
      </div>
    );
  }

  if (!content) return <div className="min-h-screen flex items-center justify-center"><Loader message="در حال دریافت اطلاعات..." /></div>;

  const toPersianDigits = (str: string) => {
    if (typeof str !== 'string') return str;
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/[0-9]/g, function (w) {
      return persianNumbers[parseInt(w)];
    });
  };

  const handleChange = (section: string, field: string, value: string) => {
    // Determine if field should not have logic applied
    const isMedia = field.toLowerCase().includes('image') || field.toLowerCase().includes('video') || field.toLowerCase().includes('url');
    const finalValue = isMedia ? value : toPersianDigits(value);
    
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: finalValue
      }
    }));
  };

  const handleWooConfigChange = (field: string, value: string) => {
    setWooConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      // Save config reliably to server
      await saveWooConfig(wooConfig.url, wooConfig.key, wooConfig.secret);

      // Save configuration via context if available
      const success = await updateContent(formData);
      
      if (success) {
        setMessage('اطلاعات با موفقیت ذخیره شد.');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('خطا در ذخیره اطلاعات سایت!');
      }
    } catch (e: any) {
       console.error('config save failed', e);
       setMessage('خطا: ' + (e.message || 'مشکلی در ذخیره تنظیمات پیش آمد'));
    } finally {
       setSaving(false);
    }
  };

  const translations: Record<string, string> = {
    hero: 'بخش اصلی (Hero)',
    problem: 'بخش مشکل',
    benefits: 'بخش مزایا',
    socialProof: 'اثبات اجتماعی',
    howItWorks: 'نحوه کار',
    product: 'محصول',
    offer: 'پیشنهاد ویژه',
    finalCTA: 'دعوت به اقدام نهایی',
    faq: 'سوالات متداول',
    productConfig: 'تنظیمات محصولات فروشگاه',
    productId: 'شناسه محصول (خرید)',
    consultationProductId: 'شناسه محصول (مشاوره)',
    oldPrice: 'قیمت بدون تخفیف',
    price: 'قیمت اصلی / با تخفیف'
  };

  const getTranslation = (key: string) => translations[key] || key;

  return (
    <div className="min-h-screen bg-slate-100 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold">پنل مدیریت محتوا</h1>
          <button onClick={() => window.location.hash = ''} className="text-brand-600 hover:text-brand-800">
            بازگشت به سایت
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes('خطا') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="space-y-12">
          {/* WooCommerce Config */}
          <div className="border border-brand-200 rounded-xl p-6 bg-brand-50">
            <h2 className="text-xl font-bold mb-4 text-brand-600">تنظیمات ووکامرس (WooCommerce) و سفارش</h2>
            <p className="text-sm text-slate-600 mb-4">برای اتصال فرم سفارش مستقیم به سایت ووکامرسی خود، آدرس سایت، کلیدهای API و کدهای محصول را وارد کنید.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-semibold mb-1 text-slate-700">آدرس سایت (URL)</label>
                <input
                  type="text"
                  className="border border-slate-300 rounded-lg p-2 text-left"
                  dir="ltr"
                  placeholder="https://yoursite.com"
                  value={wooConfig.url || ''}
                  onChange={(e) => handleWooConfigChange('url', e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1 text-slate-700">کلید مشتری (Consumer Key)</label>
                <input
                  type="text"
                  className="border border-slate-300 rounded-lg p-2 text-left"
                  dir="ltr"
                  placeholder="ck_..."
                  value={wooConfig.key || ''}
                  onChange={(e) => handleWooConfigChange('key', e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1 text-slate-700">رمز مشتری (Consumer Secret)</label>
                <input
                  type="text"
                  className="border border-slate-300 rounded-lg p-2 text-left"
                  dir="ltr"
                  placeholder="cs_..."
                  value={wooConfig.secret || ''}
                  onChange={(e) => handleWooConfigChange('secret', e.target.value)}
                />
              </div>

              {/* Product IDs for Order Modal */}
              <div className="flex flex-col md:col-span-2 border-t border-brand-200 mt-4 pt-4">
                 <h3 className="text-lg font-bold mb-3 text-brand-600">کد محصول مربوط به فرم سفارش (OrderModal)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold mb-1 text-slate-700">کد محصول برای خرید</label>
                      <input
                        type="text"
                        className="border border-slate-300 rounded-lg p-2 text-left"
                        dir="ltr"
                        placeholder="14"
                        value={formData.productConfig?.productId || ''}
                        onChange={(e) => handleChange('productConfig', 'productId', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold mb-1 text-slate-700">کد محصول برای ثبت اولیه و تماس</label>
                      <input
                        type="text"
                        className="border border-slate-300 rounded-lg p-2 text-left"
                        dir="ltr"
                        placeholder="54"
                        value={formData.productConfig?.consultationProductId || ''}
                        onChange={(e) => handleChange('productConfig', 'consultationProductId', e.target.value)}
                      />
                    </div>
                 </div>
              </div>

            </div>
          </div>

          {Object.keys(formData).map((sectionKey) => {
            if (sectionKey === 'productConfig') return null;
            if (typeof formData[sectionKey] !== 'object' || formData[sectionKey] === null) return null;
            return (
            <div key={sectionKey} className="border border-slate-200 rounded-xl p-6 bg-slate-50">
              <h2 className="text-xl font-bold mb-4 text-brand-600">{getTranslation(sectionKey)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(formData[sectionKey]).map((fieldKey) => (
                  <div key={fieldKey} className="flex flex-col">
                    <label className="text-sm font-semibold mb-1 text-slate-700 tooltip" title={fieldKey}>{getTranslation(fieldKey)}</label>
                    {fieldKey.includes('image') || fieldKey.includes('video') || fieldKey.includes('Id') ? (
                       <input
                         type="text"
                         className="border border-slate-300 rounded-lg p-2 text-left"
                         dir="ltr"
                         value={formData[sectionKey][fieldKey] || ''}
                         onChange={(e) => handleChange(sectionKey, fieldKey, e.target.value)}
                       />
                    ) : typeof formData[sectionKey][fieldKey] === 'string' && formData[sectionKey][fieldKey].length > 50 ? (
                      <textarea
                        className="border border-slate-300 rounded-lg p-2 h-24"
                        value={formData[sectionKey][fieldKey] || ''}
                        onChange={(e) => handleChange(sectionKey, fieldKey, e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="border border-slate-300 rounded-lg p-2"
                        value={formData[sectionKey][fieldKey] || ''}
                        onChange={(e) => handleChange(sectionKey, fieldKey, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )})}
        </div>

        <div className="mt-10 flex justify-end sticky bottom-4">
          {saving && <Loader fullScreen message="در حال ذخیره تغییرات..." />}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-brand-700 disabled:opacity-50 transition-all z-10"
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </div>
      </div>
    </div>
  );
};
