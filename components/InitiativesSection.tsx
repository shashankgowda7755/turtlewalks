import React, { useEffect, useRef, useState } from 'react';

const initiatives = [
  {
    id: 'cleanup',
    title: 'Beach Cleanups',
    subtitle: 'Beach',
    subtitleAfter: ' Cleanups',
    highlightSubtitle: true, // "Beach" is highlighted/underlined
    image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=600', // Placeholder
    color: 'border-orange-500', // secondary
    buttonBg: 'bg-sky-500', // primary
    buttonText: 'text-slate-900',
    buttonHoverBg: 'group-hover:bg-white group-hover:text-slate-900',
    type: 'cleanup'
  },
  {
    id: 'turtle',
    title: 'Turtle Walks',
    subtitle: 'Turtle ',
    subtitleAfter: 'Walks',
    highlightAfter: true, // "Walks" is highlighted
    image: '/assets/turtle_hero_bg.jpeg', // Using existing asset if possible, else fallback
    color: 'border-sky-500', // primary
    buttonBg: 'border-2 border-white/40',
    buttonText: 'text-white',
    buttonHoverBg: 'hover:bg-white hover:border-white hover:text-slate-900',
    type: 'walk'
  },
  {
    id: 'sand',
    title: 'Sand Sculpture Contest',
    subtitle: 'Sand ',
    subtitleAfter: 'Sculpture Contest',
    highlightAfter: true, // "Sculpture Contest" highlighted
    // highlightColor: 'border-purple-500', // special case
    image: 'https://images.unsplash.com/photo-1534234828563-025c889d1b0d?auto=format&fit=crop&q=80&w=600', // Placeholder
    color: 'border-purple-500',
    buttonBg: 'border-2 border-white/40',
    buttonText: 'text-white',
    buttonHoverBg: 'hover:bg-white hover:border-white hover:text-slate-900',
    type: 'sand'
  }
];

// Repeat initiatives to create infinite scroll effect
const allInitiatives = [...initiatives, ...initiatives, ...initiatives, ...initiatives];

export const InitiativesSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [autoScrollAllowed, setAutoScrollAllowed] = useState(true);

  // Auto scroll logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const scrollStep = () => {
      if (isHovering || !autoScrollAllowed || !scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const card = container.firstElementChild?.firstElementChild as HTMLElement;
      if (!card) return;

      // Check current scroll position
      const maxScroll = container.scrollWidth / 2;
      
      // Calculate item width including gap
      // We assume gap-6 (24px)
      const gap = 24; 
      const itemWidth = card.offsetWidth + gap;

      container.scrollBy({ left: itemWidth, behavior: 'smooth' });

      // Check for reset - using a timeout to wait for smooth scroll to "finish" roughly
      // But for infinite effect, we check bounds. 
      // The original script checked: if (container.scrollLeft >= maxScroll) reset.
      // We'll do a check in the next tick or after scroll.
      setTimeout(() => {
        if (container.scrollLeft >= maxScroll) {
          container.style.scrollBehavior = 'auto';
          container.scrollLeft = 0; // Reset
          container.style.scrollBehavior = 'smooth'; 
        }
      }, 500);
    };

    intervalId = setInterval(scrollStep, 3000);

    return () => clearInterval(intervalId);
  }, [isHovering, autoScrollAllowed]);

  const scrollManual = (direction: 'left' | 'right') => {
    setAutoScrollAllowed(false);
    setTimeout(() => setAutoScrollAllowed(true), 4000);

    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    
    // Estimate card width + gap
    // Fallback or dynamic measure
    const cardWidth = 300; // Min width in CSS is 300px, md:600px
    // Better to measure
    const firstCard = container.querySelector('div > div') as HTMLElement;
    const width = firstCard ? firstCard.offsetWidth + 24 : 324;

    if (direction === 'left') {
      container.scrollBy({ left: -width, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: width, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-12 pb-24 bg-sky-50 dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex justify-between items-end">
        <h2 className="font-['DM_Serif_Display'] text-4xl text-slate-900 dark:text-white">Explore Initiatives</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scrollManual('left')}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          >
            <span className="material-icons-round text-sm">arrow_back_ios_new</span>
          </button>
          <button 
            onClick={() => scrollManual('right')}
            className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20"
          >
            <span className="material-icons-round text-sm">arrow_forward_ios</span>
          </button>
        </div>
      </div>
      
      <div 
        id="initiatives-scroll-container"
        ref={scrollContainerRef}
        className="pl-4 sm:pl-6 lg:pl-8 overflow-x-auto no-scrollbar pb-8 scroll-smooth"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => { setIsHovering(false); setAutoScrollAllowed(true); }}
      >
        <div className="flex gap-6 w-max pr-8">
            {allInitiatives.map((item, idx) => (
                <div 
                    key={`${item.id}-${idx}`}
                    onClick={() => window.location.href=`initiative.html?id=${item.id}`} // Or router push
                    className="relative w-[300px] md:w-[600px] h-[450px] md:h-[500px] rounded-[32px] overflow-hidden group cursor-pointer shadow-xl transition-all hover:scale-[1.01]"
                >
                    <img 
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 bg-slate-200"
                        src={item.image}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x500/0ea5e9/ffffff?text=Initiative';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent">
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
                        <h3 className="font-['DM_Serif_Display'] text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                            {item.highlightSubtitle ? (
                                <>
                                    <span className={`border-b-4 ${item.color} pb-1`}>{item.subtitle}</span>{item.subtitleAfter}
                                </>
                            ) : item.highlightAfter ? (
                                <>
                                    {item.subtitle}<span className={`border-b-4 ${item.color} pb-1`}>{item.subtitleAfter}</span>
                                </>
                            ) : (
                                item.title
                            )}
                        </h3>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.location.href=`initiative.html?id=${item.id}`;
                            }}
                            className={`w-fit ${item.buttonBg} ${item.buttonText} font-bold px-8 py-3.5 rounded-full transition-all transform hover:-translate-y-1 flex items-center gap-2 ${item.buttonHoverBg}`}
                        >
                            {item.type === 'cleanup' ? 'Join Us' : 'Learn More'}
                            <span className="material-icons-round text-xl">arrow_forward</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};
