import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, CheckCircle, CreditCard, PhoneCall, Globe, ArrowRight, ArrowLeft, Copy, Wallet, Sparkles, Star } from 'lucide-react';
import { provincesAndCities, provinces } from '../lib/iranLocations';
import { wooService, getWooConfig } from '../services/wooService';
import { useContent } from '../context/ContentContext';
import { Loader } from './Loader';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'order' | 'consultation';
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, type = 'order' }) => {
  const { content, getUnifiedPrice } = useContent();
  const { rawPrice } = getUnifiedPrice();
  const isConsultation = type === 'consultation';
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'bacs' | 'call'>(isConsultation ? 'call' : 'bacs');
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    childAge: '',
    province: '',
    city: '',
    trackingNumber: '',
    quantity: 1,
  });

  const handleQuantityChange = (delta: number) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta)
    }));
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setServerError('');
      setErrors({});
      setTouched({});
      setStep(1);
      setPaymentMethod(isConsultation ? 'call' : 'bacs');
      setFormData(prev => ({ ...prev, trackingNumber: '' }));
    }
  }, [isOpen, isConsultation]);

  const availableCities = formData.province ? provincesAndCities[formData.province] : [];

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'نام و نام خانوادگی الزامی است';
        break;
      case 'childAge':
        if (!value.trim()) error = 'سن فرزند الزامی است';
        else if (isNaN(Number(value)) || Number(value) <= 0) error = 'سن فرزند نامعتبر است';
        break;
      case 'phone':
        if (!value.trim()) error = 'شماره موبایل الزامی است';
        else if (!/^09\d{9}$/.test(value)) error = 'شماره باید با ۰۹ شروع شود و ۱۱ رقم باشد';
        break;
      case 'province':
        if (!value) error = 'لطفا استان را انتخاب نمایید';
        break;
      case 'city':
        if (!value) error = 'لطفا شهرستان را انتخاب نمایید';
        break;
      case 'trackingNumber':
        if (paymentMethod === 'bacs' && !value.trim()) error = 'ثبت شماره پیگیری یا ارجاع الزامی است';
        break;
    }
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 11) : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
      ...(name === 'province' ? { city: '' } : {})
    }));
    
    if (touched[name]) {
       setErrors(prev => ({ ...prev, [name]: validateField(name, newValue) }));
    } else if (name === 'phone' && newValue.length === 11) {
       setErrors(prev => ({ ...prev, [name]: validateField(name, newValue) }));
       setTouched(prev => ({ ...prev, [name]: true }));
    }

    if (serverError) setServerError('');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateStep1 = () => {
    const fieldsToValidate = ['fullName', 'childAge', 'phone', 'province', 'city'];
    let isValid = true;
    const newErrors: Record<string, string> = { ...errors };
    const newTouched: Record<string, boolean> = { ...touched };

    fieldsToValidate.forEach(key => {
      const error = validateField(key, String(formData[key as keyof typeof formData]));
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
      newTouched[key] = true;
    });

    setErrors(newErrors);
    setTouched(newTouched);
    return isValid;
  };

  const validateStep3 = () => {
    if (paymentMethod === 'bacs') {
      const error = validateField('trackingNumber', formData.trackingNumber);
      if (error) {
        setErrors(prev => ({ ...prev, trackingNumber: error }));
        setTouched(prev => ({ ...prev, trackingNumber: true }));
        return false;
      }
    }
    return true;
  };

  const getFieldStateClass = (name: string) => {
    if (touched[name] && errors[name]) return 'border-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-900';
    if (touched[name] && !errors[name] && formData[name as keyof typeof formData]) return 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
    return 'border-sky-200 dark:border-slate-600 bg-sky-50/50 dark:bg-slate-900/50 hover:border-sky-300';
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(isConsultation ? 3 : 2);
    } else if (step === 2) {
      if (paymentMethod === 'online') return;
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
       setStep(step === 3 && isConsultation ? 1 : step - 1);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && !validateStep1()) return;
    if (step === 3 && !validateStep3()) return;

    if (step < 3 && !isConsultation) {
      handleNext();
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    const config = await getWooConfig();
    if (!config.url || !config.key) {
      setServerError('تنظیمات ووکامرس انجام نشده است. لطفا سیستم را پیکربندی کنید.');
      setIsSubmitting(false);
      return;
    }

    const defaultProductId = 54;
    const defaultConsultationProductId = 14;
    
    // Attempt to get product from WooCommerce (from landing category)
    let dynamicProductId = parseInt(content?.productConfig?.productId) || defaultProductId;
    
    if (!isConsultation) {
      const landingProduct = await wooService.getLandingProduct();
      if (landingProduct?.id) {
         dynamicProductId = landingProduct.id;
      }
    }

    const configConsultationProductId = parseInt(content?.productConfig?.consultationProductId) || defaultConsultationProductId;

    const productId = isConsultation ? configConsultationProductId : dynamicProductId;

    try {
      let customerNote = `سن فرزند: ${formData.childAge}`;
      if (paymentMethod === 'bacs' && formData.trackingNumber) {
        customerNote += `\nشماره پیگیری واریز: ${formData.trackingNumber}`;
      } else if (paymentMethod === 'call') {
        customerNote += `\nمشتری درخواست تماس و مشاوره دارد.`;
      }

      const orderPayload: any = {
        payment_method: paymentMethod === 'call' ? "cod" : "bacs",
        payment_method_title: paymentMethod === 'call' ? "ثبت اولیه و تماس" : "کارت به کارت",
        set_paid: false,
        billing: {
          first_name: formData.fullName,
          city: formData.city,
          state: formData.province,
          phone: formData.phone,
        },
        line_items: [
          {
            product_id: productId,
            quantity: isConsultation ? 1 : formData.quantity
          }
        ],
        customer_note: customerNote
      };

      await wooService.createOrder(orderPayload);
      setIsSuccess(true);
    } catch (error: any) {
      if (error.message?.includes('504') || error.message?.includes('500') || error.message?.includes('502') || error.message?.includes('503')) {
        setServerError('ارتباط با سرور سایت فروشگاهی جهت ثبت سفارش امکان‌پذیر نبود. لطفا چند لحظه دیگر دوباره تلاش کنید.');
      } else {
        setServerError(error.message || 'متاسفانه در ثبت درخواست خطایی رخ داد.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const renderStepIndicators = () => {
    if (isConsultation) return null;
    return (
    <div className="flex items-center justify-center space-x-reverse space-x-2 mb-8 relative z-10">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center space-x-reverse space-x-2">
          <motion.div 
            animate={step === s ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: step === s ? Infinity : 0, duration: 2 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg border-4 transition-colors duration-300 ${
                step === s ? 'bg-amber-400 border-amber-200 text-indigo-900 shadow-lg' : 
                step > s ? 'bg-emerald-400 border-emerald-200 text-white' : 
                'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            {step > s ? <CheckCircle className="w-5 h-5" /> : s}
          </motion.div>
          {s < 3 && (
              <div className="w-12 h-2 rounded-full bg-slate-100 overflow-hidden relative">
                  <div className={`absolute top-0 right-0 h-full transition-all duration-500 rounded-full ${step > s ? 'w-full bg-emerald-400' : 'w-0 bg-emerald-400'}`} />
              </div>
          )}
        </div>
      ))}
    </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        {/* Playful Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 transition-opacity bg-indigo-900/60 backdrop-blur-sm"
          onClick={onClose}
        >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
          className="relative z-10 w-full max-w-lg overflow-hidden bg-white dark:bg-slate-800 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/50 flex flex-col max-h-[90vh] sm:max-h-[95vh]"
        >
          {/* Mobile drag handle */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-2 bg-slate-200 dark:bg-slate-600 rounded-full sm:hidden z-30" />

          {/* Close Button */}
          <div className="absolute top-5 right-5 z-20">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-rose-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors shadow-sm"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="p-6 sm:p-8 pt-14 sm:pt-12 overflow-y-auto no-scrollbar flex-1 relative">
            
            {/* Decorative Floating Elements */}
            <motion.div animate={{ y: [-5, 5] }} transition={{ repeat: Infinity, duration: 3, repeatType: "reverse" }} className="absolute top-10 left-6 text-sky-200 opacity-50">
                <Star className="w-8 h-8 fill-sky-200" />
            </motion.div>
            <motion.div animate={{ y: [5, -5] }} transition={{ repeat: Infinity, duration: 4, repeatType: "reverse" }} className="absolute bottom-20 right-6 text-amber-200 opacity-50">
                <Sparkles className="w-10 h-10" />
            </motion.div>

            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-full w-full py-12"
                >
                  <Loader message="در حال ساختن جادو..." />
                </motion.div>
              ) : isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-8 relative z-10"
                >
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
                    className="w-28 h-28 bg-gradient-to-tr from-emerald-400 to-teal-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white"
                  >
                    <CheckCircle className="w-16 h-16 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                    {paymentMethod === 'call' ? 'عالی بود! ثبت شد.' : 'سفارش شما با موفقیت ثبت شد!'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-8 font-bold text-lg leading-relaxed">
                    {paymentMethod === 'call' 
                      ? 'دوستان ما به زودی برای یک گپ دوستانه و مشاوره رایگان با شما تماس می‌گیرند.' 
                      : 'بسته شگفت‌انگیز شما در سیستم ثبت شد و به زودی آماده ارسال می‌شود.'}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-8 py-4 bg-sky-500 text-white rounded-2xl font-black text-xl shadow-[0_6px_0_rgb(14,165,233)] active:shadow-none active:translate-y-[6px] transition-all w-full"
                  >
                    بزن بریم!
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  {renderStepIndicators()}

                    {isSubmitting && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center p-6"
                      >
                         <div className="relative w-32 h-32 mb-8">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute inset-0 border-8 border-sky-400 rounded-full border-t-transparent border-b-transparent"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1], rotate: [360, 180, 0] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute inset-4 border-4 border-emerald-400 rounded-full border-r-transparent border-l-transparent"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute inset-8 bg-sky-100 dark:bg-sky-900/50 rounded-full flex items-center justify-center"
                            >
                                <Sparkles className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                            </motion.div>
                         </div>
                         <h3 className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 mb-3 drop-shadow-sm text-center">چند لحظه صبر کنید...</h3>
                         <p className="text-slate-600 dark:text-slate-300 font-bold text-center text-lg leading-relaxed max-w-sm">
                           در حال ارتباط با سرور و آماده‌سازی سفارش شما هستیم. رنگ‌ها در هم می‌آمیزند...
                         </p>
                      </motion.div>
                    )}

                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {/* STEP 1: Info Form */}
                    {step === 1 && (
                      <div className="space-y-5">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl sm:text-3xl font-black text-indigo-900 dark:text-white">دوست جدید ما کیه؟</h3>
                            <p className="text-sm font-bold text-slate-500 mt-2">اطلاعات زیر رو دقیق پر کن تا با شما تماس بگیریم و کامل براتون توضیح بدیم.</p>
                        </div>
                        
                        {!isConsultation && (
                          <div className="bg-sky-50 dark:bg-slate-800/50 border-2 border-sky-100 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between">
                            <label className="block text-sm font-black text-slate-700 dark:text-slate-300">
                              تعداد سفارش
                            </label>
                            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-xl border-2 border-sky-50 dark:border-slate-800 shadow-sm">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(-1)}
                                className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-2xl font-black transition-colors"
                              >
                                -
                              </button>
                              <span className="text-2xl font-black text-slate-800 dark:text-white w-8 text-center">{formData.quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(1)}
                                className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-2xl font-black transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2 flex justify-between">
                            نام و نام خانوادگی
                            {touched.fullName && !errors.fullName && formData.fullName && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`w-full px-5 py-4 rounded-2xl border-2 font-bold ${getFieldStateClass('fullName')} focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all dark:text-white`}
                            placeholder="مثال: مریم کریمی"
                          />
                          {errors.fullName && <p className="mt-2 text-sm font-bold text-rose-500">{errors.fullName}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">
                              سن فرزند (سال)
                            </label>
                            <input
                              type="number"
                              name="childAge"
                              value={formData.childAge}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              className={`w-full px-5 py-4 rounded-2xl border-2 font-bold ${getFieldStateClass('childAge')} focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all dark:text-white`}
                              placeholder="مثال: ۸"
                            />
                            {errors.childAge && <p className="mt-2 text-sm font-bold text-rose-500">{errors.childAge}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">
                              شماره موبایل
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              dir="ltr"
                              className={`w-full px-5 py-4 rounded-2xl border-2 font-bold ${getFieldStateClass('phone')} focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all dark:text-white text-left tracking-wider`}
                              placeholder="09123456789"
                            />
                            {errors.phone && <p className="mt-2 text-sm font-bold text-rose-500 text-right">{errors.phone}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">استان</label>
                            <select
                              name="province"
                              value={formData.province}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              className={`w-full px-5 py-4 rounded-2xl border-2 font-bold ${getFieldStateClass('province')} focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all dark:text-white appearance-none`}
                            >
                              <option value="">انتخاب...</option>
                              {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            {errors.province && <p className="mt-2 text-sm font-bold text-rose-500">{errors.province}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">شهرستان</label>
                            <select
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              disabled={!formData.province}
                              className={`w-full px-5 py-4 rounded-2xl border-2 font-bold ${getFieldStateClass('city')} focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all dark:text-white appearance-none disabled:opacity-50`}
                            >
                              <option value="">انتخاب...</option>
                              {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.city && <p className="mt-2 text-sm font-bold text-rose-500">{errors.city}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Payment Options */}
                    {step === 2 && (
                       <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl sm:text-3xl font-black text-indigo-900 dark:text-white">روش پرداخت</h3>
                            <p className="text-sm font-bold text-slate-500 mt-2">چطور دوست داری سفارشت رو نهایی کنی؟</p>
                        </div>
                        
                        <motion.div 
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           onClick={() => setPaymentMethod('bacs')}
                           className={`p-5 rounded-2xl border-4 transition-all cursor-pointer flex items-center gap-4 ${paymentMethod === 'bacs' ? 'border-sky-500 bg-sky-50 shadow-md' : 'border-slate-100 hover:border-sky-200'}`}
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${paymentMethod === 'bacs' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <CreditCard className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-lg text-slate-900">کارت به کارت</h4>
                                <p className="text-sm font-bold text-slate-500 mt-1">نمایش شماره کارت و واریز مستقیم</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center ${paymentMethod === 'bacs' ? 'border-sky-500' : 'border-slate-200'}`}>
                                {paymentMethod === 'bacs' && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full" />}
                            </div>
                        </motion.div>

                        <motion.div 
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           onClick={() => setPaymentMethod('call')}
                           className={`p-5 rounded-2xl border-4 transition-all cursor-pointer flex items-center gap-4 ${paymentMethod === 'call' ? 'border-amber-400 bg-amber-50 shadow-md' : 'border-slate-100 hover:border-amber-200'}`}
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${paymentMethod === 'call' ? 'bg-amber-400 text-indigo-900' : 'bg-slate-100 text-slate-400'}`}>
                                <PhoneCall className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-lg text-slate-900">ثبت اولیه و تماس با من</h4>
                                <p className="text-sm font-bold text-slate-500 mt-1">جهت دریافت مشاوره رایگان پیش از خرید</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center ${paymentMethod === 'call' ? 'border-amber-400' : 'border-slate-200'}`}>
                                {paymentMethod === 'call' && <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />}
                            </div>
                        </motion.div>
                       </div>
                    )}

                    {/* STEP 3: Final / Bank Transfer details */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl sm:text-3xl font-black text-indigo-900 dark:text-white">قدم آخر!</h3>
                                {paymentMethod === 'bacs' && <p className="text-sm font-bold text-slate-500 mt-2">مبلغ رو واریز کن و شماره پیگیری رو برامون بنویس.</p>}
                                {paymentMethod === 'call' && <p className="text-sm text-emerald-500 mt-2 font-black">همه چیز برای یک شروع جذاب آماده است.</p>}
                            </div>

                            {paymentMethod === 'bacs' && (
                                <div className="bg-gradient-to-r from-[#78b31a] to-[#60940d] rounded-[2rem] p-0 text-white shadow-xl relative overflow-hidden flex flex-col border-4 border-white mb-8">
                                    <div className="absolute inset-0 z-0 opacity-20 bg-[url('/images/cubes.png')]"></div>
                                    
                                    <div className="relative z-10 pt-5 px-2">
                                        <div className="bg-[#4a2e21] w-full h-14 rounded-2xl flex justify-between items-center px-4 shadow-inner border border-[#3a2016]">
                                            <div className="flex items-center gap-2">
                                                <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-[#8ebd25]"></div>
                                                <div className="w-10 h-8 bg-blue-400 rounded-lg flex items-center justify-center p-[2px] border border-white/20">
                                                    <div className="w-full h-full bg-gradient-to-r from-white/90 to-blue-100 rounded-md opacity-90 shadow-inner" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right leading-tight">
                                                    <div className="text-white font-black text-[10px]">بانک قرض الحسنه مهر ایران</div>
                                                </div>
                                                <div className="w-9 h-9 bg-[#78b31a] rounded-full flex items-center justify-center border-2 border-[#5d8a0c] shadow-sm">
                                                     <Wallet className="w-5 h-5 text-[#4a2e21]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 pb-6 pt-4 relative z-10 text-right">
                                        <div className="text-white/90 text-sm font-bold mb-2">شماره کارت جهت واریز:</div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                                            <div dir="ltr" className="text-xm sm:text-xl font-mono tracking-widest font-black text-center sm:text-left drop-shadow-md text-white bg-black/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                                6063 7310 4946 1800
                                            </div>
                                            <button 
                                              type="button"
                                              onClick={() => copyToClipboard('6063731049461800')}
                                              className="px-4 py-3 hover:bg-white/30 rounded-xl transition self-center sm:self-auto flex items-center justify-center text-sm font-black gap-2 bg-white/20 border-2 border-white/50 w-[80%] sm:w-auto backdrop-blur-md"
                                            >
                                                {copied ? (
                                                  <><CheckCircle className="w-3 h-3 text-white" /> کپی شد</>
                                                ) : (
                                                  <><Copy className="w-3h-3" /> کپی</>
                                                )}
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-end pt-3 border-t-2 border-white/20">
                                            <div>
                                                {/* <div className="text-xs text-white/80 font-bold mb-1">نام دارنده حساب</div>
                                                <div className="font-black text-sm drop-shadow-sm">کامیل میرزائی</div> */}
                                                <div className="text-left bg-black/20 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-md">
                                                <div className="text-xs text-white/80 font-bold mb-1 text-center">نام دارنده حساب</div>
                                                <div className="font-black text-base">کامیل میرزائی </div>
                                            </div>
                                            </div>
                                            <div className="text-left bg-black/20 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-md">
                                                <div className="text-xs text-white/80 font-bold mb-1 text-center">مبلغ قابل پرداخت</div>
                                                <div className="font-black text-base">{(rawPrice * formData.quantity).toLocaleString('fa-IR')} <span className="text-xs font-normal opacity-90">تومان</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'bacs' && (
                                <div>
                                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">
                                        شماره پیگیری پرداخت (رسید)
                                    </label>
                                    <input
                                        type="number"
                                        name="trackingNumber"
                                        value={formData.trackingNumber}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        dir="ltr"
                                        className={`w-full px-5 py-4 rounded-2xl border-2 font-bold ${getFieldStateClass('trackingNumber')} focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all dark:text-white text-left tracking-widest`}
                                        placeholder="مثال: 123456"
                                    />
                                    {errors.trackingNumber && <p className="mt-2 text-sm font-bold text-rose-500 text-right">{errors.trackingNumber}</p>}
                                </div>
                            )}

                            {paymentMethod === 'call' && (
                                <div className="p-8 bg-sky-50 dark:bg-slate-900/50 rounded-[2rem] border-4 border-sky-100 text-center">
                                    <PhoneCall className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-bounce" />
                                    <h4 className="font-black text-xl text-slate-800 dark:text-white mb-3">آماده تماس ما باش!</h4>
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                                        به محض اینکه دکمه زیر رو بزنی، دوستای ما تو سریع‌ترین زمان باهات تماس می‌گیرن تا راهنماییت کنن.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {serverError && (
                      <div className="p-4 bg-rose-100 border-2 border-rose-300 text-rose-800 font-bold rounded-2xl text-sm text-center">
                        {serverError}
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-8 pt-6 border-t-2 border-slate-100 dark:border-slate-700/50">
                      {step > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={handleBack}
                          disabled={isSubmitting}
                          className="flex-shrink-0 p-4 rounded-2xl font-black text-slate-500 bg-slate-100 border-b-4 border-slate-200 hover:bg-slate-200 transition-colors"
                        >
                          <ArrowRight className="w-6 h-6" />
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-4 bg-amber-400 hover:bg-amber-500 disabled:bg-slate-300 text-indigo-900 rounded-2xl font-black text-lg shadow-[0_6px_0_rgb(217,119,6)] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-2"
                      >
                        {step < 3 && !isConsultation ? (
                          <>
                            بریم مرحله بعد
                            <ArrowLeft className="w-6 h-6" />
                          </>
                        ) : (
                          paymentMethod === 'call' ? 'ثبت و تماس با من' : 'تکمیل سفارش و ثبت'
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
