/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { Problem } from './components/sections/Problem';
import { Benefits } from './components/sections/Benefits';
import { SocialProof } from './components/sections/SocialProof';
import { motion, AnimatePresence } from 'motion/react';
import { useContent } from './context/ContentContext';
import { Loader } from './components/Loader';
import { Footer } from './components/sections/Footer';
import { BackToTop } from './components/ui/BackToTop';

// Lazy loaded components for performance
const Product = lazy(() => import('./components/sections/Product').then(module => ({ default: module.Product })));
const HowItWorks = lazy(() => import('./components/sections/HowItWorks').then(module => ({ default: module.HowItWorks })));
const Offer = lazy(() => import('./components/sections/Offer').then(module => ({ default: module.Offer })));
const FAQ = lazy(() => import('./components/sections/FAQ').then(module => ({ default: module.FAQ })));
const FinalCTA = lazy(() => import('./components/sections/FinalCTA').then(module => ({ default: module.FinalCTA })));
const OrderModal = lazy(() => import('./components/OrderModal').then(module => ({ default: module.OrderModal })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(module => ({ default: module.AdminPanel })));
const StickyMobileCTA = lazy(() => import('./components/sections/StickyMobileCTA').then(module => ({ default: module.StickyMobileCTA })));

interface OfferProps {
  onOrderClick?: () => void;
}

 export default function App() {

  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'order' | 'consultation'>('order');
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');
  const { content, loading } = useContent();
  
  const data = content || {};

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowStickyCTA(true);
      } else {
        setShowStickyCTA(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdmin) {
    return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader message="در حال بارگذاری پنل مدیریت..." /></div>}><AdminPanel /></Suspense>;
  }

  if (loading || !content) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><Loader message="در حال بارگذاری ..." /></div>;
  }

  const handleOrderClick = () => {
    setModalType('order');
    setIsOrderModalOpen(true);
  };

  const handleConsultationClick = () => {
    setModalType('consultation');
    setIsOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100 selection:bg-brand-200 selection:text-brand-900 flex flex-col">
      <Header onConsultationClick={handleConsultationClick} />
      <main className="flex-grow">
        <Hero onOrderClick={handleOrderClick} onConsultationClick={handleConsultationClick} />
        <Problem />
        <Benefits />
        <SocialProof />
        <Suspense fallback={<div className="h-40 flex justify-center items-center"><Loader message="در حال بارگذاری..." /></div>}>
          <Product onOrderClick={handleOrderClick} />
          <HowItWorks />
          <Offer onOrderClick={handleOrderClick} />
          <FAQ />
          <FinalCTA onOrderClick={handleOrderClick} />
        </Suspense>
      </main>
      <Footer />

      <Suspense fallback={null}>
        <OrderModal 
          isOpen={isOrderModalOpen} 
          onClose={() => setIsOrderModalOpen(false)} 
          type={modalType}
        />

        {/* Sticky Mobile CTA */}
        <AnimatePresence>
          {showStickyCTA && !isOrderModalOpen && (
            <StickyMobileCTA
              show={true}
              onOrderClick={handleOrderClick}
            />
          )}
        </AnimatePresence>
      </Suspense>
      <BackToTop />
    </div>
  );
}
