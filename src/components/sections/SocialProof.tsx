import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ChevronRight, ChevronLeft, Quote, Sparkles, MessageSquareHeart } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export const SocialProof = () => {
  const { content } = useContent();
  const data = content?.socialProof || {};

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videos = [
    { src: "/videos/1.mp4", thumbnail: "/images/thum/2.jpg", label: "جشنواره و مسابقات  " },
    { src: "/videos/2.mp4", thumbnail: "/images/thum/1.jpg", label: " جشنواره و مسابقات  " },
    { src: "/videos/3.mp4", thumbnail: "/images/thum/3.jpg", label: "جشنواره و مسابقات  " }
  ];

  const testimonials = [
    {
      title: "باورم نمی‌شد پسرم تفریق‌های ۳ رقمی را ذهنی حل کند!",
      text: "آراد همیشه برای نوشتن تکالیف ریاضی مقاومت می‌کرد و خیلی زود خسته می‌شد. از وقتی کار با چرتکه رو شروع کرده، نه تنها سرعتش توی ریاضی بالا رفته، بلکه تمرکزش روی بقیه درس‌ها هم خیلی بهتر شده.",
      name: "مادر آراد (۹ ساله)",
      location: "تهران",
      avatar: "/images/avatar/avatar3.png"
    },
    {
      title: "بهترین سرمایه‌گذاری برای آینده بچه‌هام بود.",
      text: "بسته استارتر برای شروع عالی بود، ویدیوها خیلی واضح و جذاب هستند. پشتیبانی بسیار خوبی هم دارید که باعث دلگرمی ماست.",
      name: "پدر سارا و سامان",
      location: "اصفهان",
      avatar: "/images/avatar/avatar2.jpg"
    },
    {
      title: "افزایش چشمگیر اعتماد به نفس دخترم",
      text: "دخترم توی ریاضی خیلی ضعیف بود و استرس می‌گرفت. الان خیلی با اعتماد به نفس جواب میده و حتی به دوستاش هم کمک میکنه. واقعا ازتون ممنونم.",
      name: "مادر یسنا",
      location: "مشهد",
      avatar: "/images/avatar/avatar3.png"
    }
  ];

  // Logic remains similar but enhanced for animations
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const closeModal = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    setActiveVideo(null);
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white dark:from-slate-900 dark:via-indigo-950/10 dark:to-slate-900 transition-colors overflow-hidden">
      
      {/* Decorative Blob */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">

        <div className="text-center mb-16">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-6 py-2 rounded-full font-bold mb-6 border-2 border-indigo-200"
          >
            <MessageSquareHeart className="w-5 h-5" />
            <span>داستان موفقیت بچه‌ها</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
            {data.title || 'ببینید چقدر خوشحالند!'}
          </h2>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="relative aspect-video rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-xl border-4 border-white dark:border-slate-800"
              onClick={() => setActiveVideo(video.src)}
            >
              <img src={video.thumbnail} alt="video" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                 <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300 animate-bounce">
                    <Play className="w-8 h-8 ml-1 fill-current" />
                 </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-slate-800 dark:text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-sm">
                {video.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="relative max-w-4xl mx-auto">
           {/* Big decorative quotes */}
           <Quote className="absolute -top-12 -left-12 w-24 h-24 text-indigo-200/50 -rotate-12" />
           
           <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-4 border-indigo-100 dark:border-slate-700 relative z-10">
             <AnimatePresence mode="wait">
               <motion.div
                 key={currentTestimonial}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="flex flex-col items-center text-center"
               >
                 <div className="w-24 h-24 rounded-[2rem] bg-indigo-100 overflow-hidden mb-6 border-4 border-white dark:border-slate-700 shadow-md">
                   <img src={testimonials[currentTestimonial].avatar} className="w-full h-full object-cover" alt="avatar" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                   {testimonials[currentTestimonial].title}
                 </h3>
                 <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl leading-relaxed">
                   {testimonials[currentTestimonial].text}
                 </p>
                 <div className="font-bold text-indigo-600">{testimonials[currentTestimonial].name}</div>
                 <div className="text-sm text-slate-400">{testimonials[currentTestimonial].location}</div>
               </motion.div>
             </AnimatePresence>

             {/* Navigation Dots */}
             <div className="flex justify-center gap-3 mt-10">
               {testimonials.map((_, idx) => (
                 <button
                   key={idx}
                   onClick={() => setCurrentTestimonial(idx)}
                   className={`h-3 rounded-full transition-all duration-300 ${idx === currentTestimonial ? 'w-10 bg-indigo-500' : 'w-3 bg-indigo-200'}`}
                 />
               ))}
             </div>
           </div>
        </div>
      </div>

      {/* Modal logic remains similar but wrapped for better UI */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
             <button onClick={closeModal} className="absolute top-8 right-8 text-white bg-white/20 p-2 rounded-full backdrop-blur-md">✕</button>
             <video src={activeVideo} controls autoPlay className="max-w-4xl w-full rounded-3xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
