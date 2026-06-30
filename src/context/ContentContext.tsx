import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultContent from '../../content.json';
import { wooService, getWooConfig, saveWooConfig } from '../services/wooService';

export const ContentContext = createContext<any>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<any>(null);
  const [wooProduct, setWooProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await wooService.getAppContent();
        if (data) {
          setContent(data);
          localStorage.setItem('site_content', JSON.stringify(data)); // backup
        } else {
          throw new Error('No content found in wooService');
        }
      } catch (err) {
        // Silent fallback
        try {
          const saved = localStorage.getItem('site_content');
          if (saved) {
            setContent(JSON.parse(saved));
          } else {
            setContent(defaultContent);
          }
        } catch (parseErr) {
          console.warn('Error parsing local storage, using default');
          setContent(defaultContent);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchProduct = async () => {
      try {
        const product = await wooService.getLandingProduct();
        if (product) {
          setWooProduct(product);
        }
      } catch (e) {
         // silently fail product fetch
      }
    };

    Promise.all([fetchContent(), fetchProduct()]);
  }, []);

  const updateContent = async (newContent: any) => {
    try {
      localStorage.setItem('site_content', JSON.stringify(newContent));
      setContent(newContent);
      
      // Save changes to actual file via wooService
      await wooService.updateAppContent(newContent);

      return true;
    } catch (err) {
      console.error('Error saving content:', err);
      return false;
    }
  };

  const updateWooConfigs = (url: string, key: string, secret: string) => {
      saveWooConfig(url, key, secret);
  };

  // Unified Price Calculation!
  const getUnifiedPrice = () => {
    const defaultData = content?.offer || {};
    
    // Woo Data available
    if (wooProduct) {
      const priceVal = wooProduct.price ? parseInt(wooProduct.price).toLocaleString('fa-IR') : '';
      const oldPriceVal = wooProduct.regular_price ? parseInt(wooProduct.regular_price).toLocaleString('fa-IR') : '';
      const hasDiscount = !!wooProduct.sale_price && wooProduct.sale_price !== wooProduct.regular_price;

      return {
        price: priceVal,
        oldPrice: hasDiscount ? oldPriceVal : null,
        unit: 'تومان',
        isWoo: true,
        rawPrice: wooProduct.price ? parseInt(wooProduct.price) : 0
      };
    }

    // Fallback to content.json
    return {
      price: defaultData.price || '968,000',
      oldPrice: defaultData.oldPrice || '1,2,000',
      unit: 'تومان',
      isWoo: false,
      rawPrice: parseInt((defaultData.price || '968000').toString().replace(/,/g, '').replace(/،/g, ''))
    };
  };

  return (
    <ContentContext.Provider value={{ content, wooProduct, getUnifiedPrice, loading, error, updateContent, updateWooConfigs }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
