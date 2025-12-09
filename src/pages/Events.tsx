import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import InstagramContactBar from "@/components/ui/InstagramContactBar";
import { Calendar, Clock, MapPin, BookOpen, Sparkles, PartyPopper, Search, Filter, Grid, List } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion, AnimatePresence } from 'framer-motion';
import { PageBgAndCursor } from "@/components/PageBgAndCursor";
import eventService, { EventData as EventDataType } from "../services/eventService";

interface EventCardProps extends EventDataType {
  icon?: React.ReactNode;
  gradient?: string;
}

const categories = [
  { id: 'all', nameKey: 'allEvents' },
  { id: 'academic', nameKey: 'academic' },
  { id: 'cultural', nameKey: 'cultural' },
  { id: 'workshop', nameKey: 'workshops' },
  { id: 'social', nameKey: 'social' },
];

const EventCard = ({ 
  title, description, date, time, location, category, icon, gradient, image, 
  featured = false, buttonLabel = 'Register Now', buttonLink = '#', isPastEvent = false
}: EventCardProps) => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#14213d]/60 backdrop-blur-md text-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col border border-gray-900 relative"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={t(title, title)}
          className={`w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ${isPastEvent ? 'opacity-60 grayscale' : ''}`}
          loading="lazy"
        />
        {featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            {t('featured', 'Featured')}
          </div>
        )}
        {isPastEvent && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-lg font-bold bg-black/60 px-4 py-2 rounded">{t('eventEnded', 'Event Ended')}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#14213d]/90 to-transparent p-4 flex justify-between items-center">
          <span className="text-white text-sm font-medium bg-[#14213d]/80 px-2 py-1 rounded">
            {t(category, category)}
          </span>
          {isPastEvent && (
            <span className="ml-2 bg-gray-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">{t('eventEnded', 'Event Ended')}</span>
          )}
        </div>
      </div>
      <div className={`h-1 bg-black`}></div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-lg bg-black text-white mr-4`}>
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-white">{t(title, title)}</h3>
        </div>
        <p className="text-white/80 mb-6 flex-grow">{t(description, description)}</p>
        <div className="space-y-3 mt-auto">
          <div className="flex items-center text-white">
            <Calendar className="w-5 h-5 mr-2 text-white" strokeWidth={2.2} />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-white">
            <Clock className="w-5 h-5 mr-2 text-white" strokeWidth={2.2} />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-white">
            <MapPin className="w-5 h-5 mr-2 text-white" strokeWidth={2.2} />
            <span>{location}</span>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <a 
            href={buttonLink} 
            target="_self" 
            className={`bg-black hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg ${isPastEvent ? 'pointer-events-none opacity-60 cursor-not-allowed' : ''}`}
            aria-disabled={isPastEvent}
          >
            {isPastEvent ? t('eventEnded', 'Event Ended') : t(buttonLabel, buttonLabel)}
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const Events = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [eventsData, setEventsData] = useState<EventDataType[]>([]);

  // Load events from service
  useEffect(() => {
    const loadedEvents = eventService.getEvents();
    setEventsData(loadedEvents);
  }, []);

  // Map event categories to icons and gradients
  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'academic':
        return <BookOpen className="w-6 h-6 text-white" strokeWidth={2.2} />;
      case 'cultural':
        return <Sparkles className="w-6 h-6 text-white" strokeWidth={2.2} />;
      case 'workshop':
        return <PartyPopper className="w-6 h-6 text-white" strokeWidth={2.2} />;
      case 'social':
        return <PartyPopper className="w-6 h-6 text-white" strokeWidth={2.2} />;
      case 'orientation':
        return <MapPin className="w-6 h-6 text-white" strokeWidth={2.2} />;
      default:
        return <Sparkles className="w-6 h-6 text-white" strokeWidth={2.2} />;
    }
  };

  const getCategoryGradient = (category: string) => {
    return 'bg-black';
  };

  // Convert loaded events to event cards with icons and gradients
  const events: EventCardProps[] = eventsData.map(event => ({
    ...event,
    icon: getCategoryIcon(event.category),
    gradient: getCategoryGradient(event.category)
  }));

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || event.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const featuredEvents = filteredEvents.filter(event => event.featured);
  const regularEvents = filteredEvents.filter(event => !event.featured);

  return (
    <>
      <PageBgAndCursor>

        <section className="relative h-[420px] md:h-[640px] lg:h-[900px] w-full overflow-hidden flex items-center justify-center pointer-events-none">
          <div className="w-full h-[640px] md:h-[900px] lg:h-[1100px] flex items-center justify-center relative" style={{ willChange: 'transform' }}>
            <img
              src="/assets/eventcarosuel.jpg"
              alt="Events Carousel"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <button
              onClick={() => {
                const section = document.getElementById('events-section');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="hidden lg:flex absolute bottom-36 left-1/2 -translate-x-1/2 bg-white/30 backdrop-blur-lg text-2xl font-bold text-white px-10 py-5 rounded-full shadow-2xl border-2 border-white/40 hover:bg-white/40 transition-all duration-300 pointer-events-auto"
              style={{ letterSpacing: '0.05em' }}
              aria-label={t('viewEvents', 'View Events')}
            >
              {t('viewEvents', 'View Events')}
            </button>
          </div>
        </section>
      

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-black rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-white" strokeWidth={2.2} />
                </div>
                <input
                  type="text"
                  name="searchEvents"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={t('searchEvents', 'Search events...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-black text-white' : 'text-white hover:bg-gray-800'}`}
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5 text-white" strokeWidth={2.2} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-black text-white' : 'text-white hover:bg-gray-800'}`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5 text-white" strokeWidth={2.2} />
                </button>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-colors"
                >
                  <Filter className="w-5 h-5 text-white" strokeWidth={2.2} />
                  <span>{t('filter', 'Filter')}</span>
                </button>
              </div>
            </div>


            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">{t('categories', 'Categories')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                            activeCategory === category.id
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {t(category.nameKey, category.nameKey)}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          {featuredEvents.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">{t('featuredEvents', 'Featured Events')}</h2>
              <Slider
                dots
                infinite
                speed={500}
                slidesToShow={Math.min(2, featuredEvents.length)}
                slidesToScroll={1}
                responsive={[
                  { breakpoint: 1024, settings: { slidesToShow: Math.min(2, featuredEvents.length) } },
                  { breakpoint: 768, settings: { slidesToShow: 1 } }
                ]}
                className="px-2"
              >
                {featuredEvents.map((event) => (
                  <div key={event.id} className="px-2 py-4">
                    <EventCard {...event} />
                  </div>
                ))}
              </Slider>
            </div>
          )}


          <div className="mb-12" id="events-section">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{t('allEvents', 'All Events')}</h2>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">{t('noEventsFound', 'No events found')}</h3>
                <p className="mt-1 text-gray-500">{t('tryAdjusting', 'Try adjusting your search or filter criteria')}</p>
                <div className="mt-6">
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    {t('clearFilters', 'Clear filters')}
                  </button>
                </div>
              </div>
            ) : (
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}`}>
                {regularEvents.map((event) => (
                  <div key={event.id} className={viewMode === 'grid' ? 'h-full' : ''}>
                    <EventCard {...event} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageBgAndCursor>
    </>
  );
};

export default Events;