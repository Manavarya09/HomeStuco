import InstagramContactBar from "@/components/ui/InstagramContactBar";
// Author: Manav Arya & Ashmit Dhown
import { useState } from 'react';
import { Heart, Star, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { FixedSizeList as ProductList } from 'react-window';
import Spline from '@splinetool/react-spline';

import { PageBgAndCursor } from "@/components/PageBgAndCursor";

interface Product {
  id: number;
  name: string;
  price: number | string;
  category: string;
  images: string[];
  isNew?: boolean;
  isSale?: boolean;
}

const ImageSlider = ({ images, productName }: { images: string[], productName: string }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-full group">
      <img 
        src={images[currentImageIndex]} 
        alt={`${productName} ${currentImageIndex + 1}`}
        className="w-full h-full object-contain p-4"
      />
      
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Merch = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const products: Product[] = [
    {
      id: 1,
      name: 'Black Hoodie / Sweatshirt',
      price: '80 / 65',
      category: 'Hoodie/Sweatshirt',
      images: [
        "/assets/MERCH/BlackHoodie1.png",
        "/assets/MERCH/BlackHoodie2.png",
        "/assets/MERCH/BlackHoodie3.png",
        "/assets/MERCH/BlackHoodie4.png",
      ],
      isNew: true,
      isSale: true
    },
    {
      id: 2,
      name: 'Maroon Hoodie / Sweatshirt',
      price: '80 / 65',
      category: 'Hoodie/Sweatshirt',
      images: [
        "/assets/MERCH/MaroonHoodie1.png",
        "/assets/MERCH/MaroonHoodie2.png",
        "/assets/MERCH/MaroonHoodie3.png",
        "/assets/MERCH/MaroonHoodie4.png",
      ],
      isNew: true,
      isSale: true
    },
    {
      id: 3,
      name: 'Grey Hoodie / Sweatshirt',
      price: '80 / 65',
      category: 'Hoodie/Sweatshirt',
      images: [
        "/assets/MERCH/GreyHoodie1.png",
        "/assets/MERCH/GreyHoodie2.png",
        "/assets/MERCH/GreyHoodie3.png",
        "/assets/MERCH/GreyHoodie4.png",
      ],
      isNew: true,
      isSale: true
    },
    {
      id: 4,
      name: 'Beige Hoodie / Sweatshirt',
      price: '80 / 65',
      category: 'Hoodie/Sweatshirt',
      images: [
        "/assets/MERCH/BeigeHoodie1.png",
        "/assets/MERCH/BeigeHoodie2.png",
        "/assets/MERCH/BeigeHoodie3.png",
        "/assets/MERCH/BeigeHoodie4.png",
      ],
      isNew: true,
      isSale: true
    },
    {
      id: 5,
      name: 'Black T-Shirt',
      price: 80,
      category: 'T-Shirts',
      images: [
        "/assets/MERCH/BlackTshirt1.png",
        "/assets/MERCH/BlackTshirt2.png",
      ],
      isNew: true,
      isSale: true
    },
    {
      id: 6,
      name: 'Maroon T-Shirt',
      price: 80,
      category: 'T-Shirts',
      images: [
        "/assets/MERCH/MaroonTshirt1.png",
        "/assets/MERCH/MaroonTshirt2.png",
      ],
      isNew: true,
      isSale: true
    },
    {
      id: 7,
      name: 'Navy Blue T-Shirt',
      price: 80,
      category: 'T-Shirts',
      images: [
        "/assets/MERCH/BlueNavyTshirt1.png",
        "/assets/MERCH/BlueNavyTshirt2.png",
      ],
      isNew: true,
      isSale: true
    },
    {
      id: 8,
      name: 'Lavender T-Shirt',
      price: 80,
      category: 'T-Shirts',
      images: [
        "/assets/MERCH/LavenderTshirt1.png",
        "/assets/MERCH/LavenderTshirt2.png",
      ],
      isNew: true,
      isSale: true
    },
    {
      id: 9,
      name: 'Tote Bag',
      price: 15,
      category: 'Bags',
      images: [
        "/assets/MERCH/ToteBag1.png",
        "/assets/MERCH/ToteBag2.png",
      ],
      isNew: true,
      isSale: true
    }
  ];

  const categories = ['All', 'Hoodie/Sweatshirt', 'T-Shirts', 'Bags'];
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleViewProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <PageBgAndCursor>
      <div className="min-h-screen">

        <div className="relative w-full overflow-hidden h-[34vh] md:h-screen">
          <div className="absolute inset-0 w-full h-full z-0">
            <Spline scene="https://prod.spline.design/E9Y1f0Wp36HmvzX0/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="absolute z-10 bottom-2 right-1 md:bottom-4 md:right-6">
            <button
              onClick={handleViewProducts}
              className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg font-semibold text-base hover:bg-gray-800 transition-colors duration-200"
              style={{ minWidth: 150 }}
            >
              BITS PILANI
            </button>
          </div>
        </div>


        <div id="products-section" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          

          {/* <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
            <h2 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-wider">
              Coming Soon
            </h2>
          </div> */}


          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>


          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-black/80 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full text-white">
                    <div className="relative h-96 flex items-center justify-center bg-black/60">
                      <ImageSlider images={product.images} productName={product.name} />
                      <div className="absolute top-3 left-3 flex flex-row space-x-2">
                        {product.isNew && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            NEW
                          </span>
                        )}
                        {product.isSale && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            SALE
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full ${
                          wishlist.includes(product.id) 
                            ? 'text-red-500 bg-white/90' 
                            : 'text-gray-400 bg-white/80 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="p-5 flex-grow flex flex-col mb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-indigo-400">
                            AED {product.price}
                          </div>
                        </div>
                      </div>


                      <div className="mt-auto pt-4">
                        <a
                          href="https://forms.gle/eFi38tMfhEiJMtps7"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          Buy Now
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      </PageBgAndCursor>
      <InstagramContactBar />
    </>
  );
};

export default Merch;
