import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/custom.css";
import toast from "react-hot-toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../slices/productsSlice";
import { fetchCategories } from "../slices/categoriesSlice";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { toggleWishlist } from "../slices/wishlistSlice";
import { Link } from 'react-router-dom';

import Nav from "../components/common/Nav";
import PromoBar from "../components/common/PromoBar";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import images from "../assets/images";
import Footer from "../components/common/Footer";

// Small Wishlist button component to reflect wishlist state
const WishlistButton = ({ product }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlist.items || []);
  const isWishlisted = wishlist.some(i => i.id === product.id);
  return (
    <button
      onClick={() => {
        dispatch(toggleWishlist({ id: product.id, title: product.title, price: product.price, image: product.image }));
        if (!isWishlisted) {
          toast.success('Added to wishlist');
        } else {
          toast.success('Removed from wishlist');
        }
      }}
      className={`p-2 rounded-lg transition-all ${isWishlisted ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
    >
      <FontAwesomeIcon icon={faHeart} />
    </button>
  );
};

/* ===============================
   ANIMATION VARIANTS
================================= */

// Background image fade + zoom
const backgroundVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  zoom: {
    scale: [1, 1.08],
    transition: { delay: 1, duration: 5, ease: "linear" }
  }
};

// Text panel
const panelVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Heading
const headingVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

// Subtitle
const subtitleVariants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

// Bold Word
const boldWordVariants = {
  hidden: { opacity: 0.7 },
  show: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

// Dots
const dotVariants = {
  hidden: { opacity: 0 },
  active: { scale: 1.1, backgroundColor: "#fff" },
  inactive: { scale: 1, backgroundColor: "rgba(255,255,255,0.5)" }
};

/* ===============================
   DUMMY DATA
================================= */

const heroSlides = [
  {
    id: 1,
    image: images.slide01,
    title: "AWESOME FURNITURE",
    subtitle: "50% OFF — TRENDY",
    boldWord: "DESIGNS"
  },
  {
    id: 2,
    image: images.slide02,
    title: "MODERN COLLECTION",
    subtitle: "NEW ARRIVALS",
    boldWord: "2024"
  },
  {
    id: 3,
    image: images.slide03,
    title: "LUXURY COMFORT",
    subtitle: "PREMIUM",
    boldWord: "QUALITY"
  }
];

const productImages = [
  images.homeDefault1,
  images.homeDefault2,
  images.homeDefault3,
  images.homeDefault4
];

const dummyProducts = new Array(12).fill(0).map((_, i) => ({
  id: i + 1,
  title: "Product Name",
  image: productImages[i % productImages.length]
}));

const brands = [
  images.brand5,
  images.brand6,
  images.brand7,
  images.brand8,
  images.brand5,
  images.brand6
];

/* ===============================
   CUSTOM DOTS COMPONENT
================================= */
const CustomDots = ({ dots, activeIndex, onClick }) => (
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
    {dots.map((_, index) => (
      <motion.button
        key={index}
        variants={dotVariants}
        animate={activeIndex === index ? "active" : "inactive"}
        className="w-3 h-3 rounded-full"
        onClick={() => onClick(index)}
      />
    ))}
  </div>
);

/* ===============================
   SLIDE CONTENT
================================= */
const SlideContent = ({ slide, isActive }) => {
  return (
    <div className="relative w-full h-screen max-h-[80vh] overflow-hidden">

      <motion.div
        className="absolute inset-0"
        variants={backgroundVariants}
        initial="hidden"
        animate={["show", "zoom"]}
      >
        <img src={slide.image} className="w-full h-full object-cover object-center" />
      </motion.div>

      {isActive && (
        <motion.div
          className="absolute left-10 md:left-20 bottom-20"
          variants={panelVariants}
          initial="hidden"
          animate="show"
        >
          <div className="bg-black/45 px-8 py-6 rounded-lg backdrop-blur-sm">
            <motion.h2
              variants={headingVariants}
              initial="hidden"
              animate="show"
              className="text-4xl md:text-5xl font-bold text-white mb-2"
            >
              {slide.title}
            </motion.h2>

            <motion.div
              variants={subtitleVariants}
              initial="hidden"
              animate="show"
              className="text-lg md:text-xl text-white flex items-baseline"
            >
              <span>{slide.subtitle}</span>
              <span className="mx-1">—</span>
              <motion.span
                variants={boldWordVariants}
                initial="hidden"
                animate="show"
                className="font-bold"
              >
                {slide.boldWord}
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ===============================
   MAIN COMPONENT
================================= */

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = React.useRef(null);

  const dispatch = useDispatch();
  const { items: apiProducts, loading } = useSelector((state) => state.products);
  const { items: apiCategories = [] } = useSelector((state) => state.categories);
  const { items: cartItems = [] } = useSelector((state) => state.cart);

  // Helper to check if product is in cart
  const isInCart = (productId) => cartItems.some(item => item.id === productId);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 12, sort: "desc" }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const displayProducts = apiProducts.length > 0
    ? apiProducts.map((p, i) => {
        let imageUrl = p.image || '';
        // If image doesn't have full URL, prepend API base
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `http://localhost:5000/api/v1/${imageUrl}`;
        }
        return {
          id: p._id || p.id,
          title: p.name || p.raw?.title || 'Product',
          price: p.price,
          image: imageUrl || productImages[i % productImages.length],
          quantity: p.quantity ?? p.raw?.quantity ?? 0
        };
      })
    : dummyProducts;

  const categoriesToRender =
    apiCategories.length > 0
      ? apiCategories.map((c, i) => ({
          id: c._id || i,
          title: c.name || "Category",
          image: c.image || images.cat01
        }))
      : [];

  /* Hero Slider */
  const heroSettings = {
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 6000,
    infinite: true,
    slidesToShow: 1,
    fade: true,
    speed: 800,
    cssEase: "ease-out",
    appendDots: (dots) => (
      <CustomDots
        dots={dots}
        activeIndex={activeSlide}
        onClick={(i) => sliderRef.current?.slickGoTo(i)}
      />
    ),
    beforeChange: (_, next) => setActiveSlide(next)
  };

  /* Product Slider */
  const productSettings = {
    dots: false,
    arrows: true,
    infinite: false,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  /* Brand Slider */
  const brandSettings = {
    arrows: false,
    infinite: true,
    autoplay: true,
    slidesToShow: 6,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } }
    ]
  };

  return (
    <div className="w-full bg-white">

      {/* <PromoBar /> */}
      <Nav />

      {/* HERO */}
      <div className="w-full relative">
        <Slider ref={sliderRef} {...heroSettings}>
          {heroSlides.map((slide, index) => (
            <SlideContent
              key={slide.id}
              slide={slide}
              isActive={activeSlide === index}
            />
          ))}
        </Slider>
      </div>

      {/* ===============================
          CATEGORIES
      =============================== */}
      <section className="w-full py-12">
        <div className="max-w-6xl mx-auto px-6">
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoriesToRender.slice(0,3).map((c) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative shadow-lg overflow-hidden rounded-xl group cursor-pointer"
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className="relative overflow-hidden h-48 md:h-64"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={c.image}
                    className="w-full h-full object-cover"
                    alt={c.title}
                  />

                  {/* Gradients */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute inset-0 bg-linear-to-r from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

                  {/* Center Label */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="text-center">
                      <h3 className="text-white text-2xl font-bold tracking-wider mb-1">
                        {c.title}
                      </h3>
                      <motion.div
                        className="h-1 w-12 bg-[#8cc63f] mx-auto rounded-full"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                      />
                    </div>
                  </motion.div>

                  {/* Bottom Label */}
                  <div className="absolute bottom-0 left-0 right-0 text-center pb-4">
                    <p className="text-white text-sm tracking-wider opacity-90">
                      Explore Collection
                    </p>
                  </div>
                </motion.div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="w-full py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-2">FEATURED PRODUCTS</h2>

          {loading ? (
            <div className="h-64 flex justify-center items-center">
              Loading products...
            </div>
          ) : (
            <>
              {/* First 4 products as a 4-column grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayProducts.slice(0,4).map(p => (
                  <motion.div key={p.id} className="bg-white rounded-lg shadow overflow-hidden" whileHover={{ y: -6 }}>
                    <div className="relative bg-gray-100 h-56 overflow-hidden">
                      <Link to={`/product/${p.id}`} className="block w-full h-full">
                        <img src={p.image} className="w-full h-full object-cover" alt={p.title} />
                      </Link>
                    </div>
                    <div className="p-4">
                      <Link to={`/product/${p.id}`} className="block">
                        <h3 className="text-sm font-semibold line-clamp-2">{p.title}</h3>
                      </Link>
                      {p.price && <div className="text-lg text-[#8cc63f] font-bold mt-2">${p.price}</div>}
                      <div className="mt-3 flex gap-2">
                        {p.quantity > 0 ? (
                          isInCart(p.id) ? (
                            <button onClick={() => { dispatch(removeFromCart(p.id)); toast.success(`${p.title} removed from cart`); }} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm">
                              <FontAwesomeIcon icon={faShoppingCart} /> Remove
                            </button>
                          ) : (
                            <button onClick={() => { dispatch(addToCart({ id: p.id, title: p.title, price: p.price, image: p.image })); toast.success(`${p.title} added to cart!`); }} className="flex-1 bg-[#8cc63f] text-white py-2 rounded-lg text-sm">
                              <FontAwesomeIcon icon={faShoppingCart} /> Add
                            </button>
                          )
                        ) : (
                          <button disabled className="flex-1 bg-gray-300 text-white py-2 rounded-lg text-sm">Unavailable</button>
                        )}

                        <WishlistButton product={p} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===============================
          RECENT PRODUCTS
      =============================== */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-2">RECENT PRODUCTS</h2>

          {loading ? (
            <div className="h-64 flex justify-center items-center">
              Loading products...
            </div>
          ) : (
            <>
              {/* First 4 products as a 4-column grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayProducts.slice(0,4).map(p => (
                  <motion.div key={p.id} className="bg-white rounded-lg shadow overflow-hidden" whileHover={{ y: -6 }}>
                    <div className="relative bg-gray-100 h-56 overflow-hidden">
                      <Link to={`/product/${p.id}`} className="block w-full h-full">
                        <img src={p.image} className="w-full h-full object-cover" alt={p.title} />
                      </Link>
                    </div>
                    <div className="p-4">
                      <Link to={`/product/${p.id}`} className="block">
                        <h3 className="text-sm font-semibold line-clamp-2">{p.title}</h3>
                      </Link>
                      {p.price && <div className="text-lg text-[#8cc63f] font-bold mt-2">${p.price}</div>}
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => { dispatch(addToCart({ id: p.id, title: p.title, price: p.price, image: p.image })); toast.success(`${p.title} added to cart!`); }} className="flex-1 bg-[#8cc63f] text-white py-2 rounded-lg text-sm">
                          <FontAwesomeIcon icon={faShoppingCart} /> Add
                        </button>
                        <button onClick={() => dispatch(toggleWishlist({ id: p.id, title: p.title, price: p.price, image: p.image }))} className="bg-gray-100 p-2 rounded-lg">
                          <FontAwesomeIcon icon={faHeart} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===============================
          BRANDS
      =============================== */}
      <section className="w-full py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-2">TRUSTED BRANDS</h2>

          <Slider {...brandSettings}>
            {brands.map((b, index) => (
              <motion.div
                key={index}
                className="flex justify-center px-4"
                whileHover={{ scale: 1.1 }}
              >
                <div className="bg-white rounded-lg p-4 shadow">
                  <img
                    src={b}
                    className="h-16 object-contain grayscale hover:grayscale-0 transition"
                  />
                </div>
              </motion.div>
            ))}
          </Slider>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
