import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchSingleProduct } from '../slices/singleProductSlice';
import { fetchReviews } from '../slices/reviewsSlice';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { toggleWishlist } from '../slices/wishlistSlice';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faStar, faTruck, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import Nav from '../components/common/Nav';
import PromoBar from '../components/common/PromoBar';
import Footer from '../components/common/Footer';


const SingleProduct = () => {
	const { id } = useParams();
	const { item: product, loading } = useSelector(state => state.singleProduct);
	const { items: cartItems = [] } = useSelector(state => state.cart);
	const wishlist = useSelector(state => state.wishlist.items || []);
	const { items: reviews = [], status: reviewsStatus } = useSelector(state => state.reviews);
	const [qty, setQty] = useState(1);
	const [activeTab, setActiveTab] = useState('description');
	const [isWishlisted, setIsWishlisted] = useState(false);

	const dispatch = useDispatch();

	// Helper to check if product is in cart
	const isInCart = () => cartItems.some(item => item.id === (product?._id || product?.id));

	// derive availability and wishlist state
	const available = (product?.quantity ?? product?.qty ?? product?.stock ?? 0) > 0;

	useEffect(() => {
		setIsWishlisted(!!wishlist.find(i => i.id === (product?._id || product?.id)));
	}, [product, wishlist]);

	useEffect(() => {
		// Scroll to top when opening a product page
		window.scrollTo(0, 0);
		// Default to demo product if no ID provided
		const productId = id || '68d7c7d2f4ad66bc3b3d8cdd';
		dispatch(fetchSingleProduct(productId));
		dispatch(fetchReviews(productId));
	}, [id, dispatch]);

	if (loading || !product) {
		return (
			<div className="w-full min-h-screen bg-white">
				{/* <PromoBar /> */}
				<Nav />
				<div className="max-w-6xl mx-auto px-6 py-20 text-center">
					<div className="inline-block">
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 2, repeat: Infinity }}
							className="w-12 h-12 border-4 border-[#8cc63f] border-t-transparent rounded-full"
						/>
					</div>
					<p className="mt-4 text-gray-600">Loading product details...</p>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className="w-full font-sans text-gray-800 bg-white">
			<PromoBar />
			<Nav />

			{/* Breadcrumb */}
			<div className="bg-gray-50 border-b">
				<div className="max-w-6xl mx-auto px-6 py-4 text-sm text-gray-600">
					<motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
						Home / Products / <span className="text-[#8cc63f] font-semibold">{product.name || product.title}</span>
					</motion.span>
				</div>
			</div>

			{/* Product Section */}
			<div className="max-w-6xl mx-auto px-6 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Product Image */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						className="relative"
					>
						<div className="relative bg-gray-100 rounded-xl overflow-hidden shadow-xl">
							<img 
								src={product.image || product.picture} 
								alt={product.name || product.title} 
								className="w-full h-full object-cover min-h-[500px]"
							/>
							<motion.div
								initial={{ opacity: 0 }}
								whileHover={{ opacity: 1 }}
								className="absolute inset-0 bg-black/10"
							/>
						</div>
						
						{/* Badge */}
						<motion.div 
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.3 }}
							className="absolute top-4 right-4 bg-[#8cc63f] text-white px-4 py-2 rounded-full text-sm font-bold"
						>
							FEATURED
						</motion.div>
					</motion.div>

					{/* Product Details */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1 
							className="text-4xl font-bold text-gray-900 mb-2"
							style={{ fontFamily: 'Bebas Neue, sans-serif' }}
						>
							{product.name || product.title}
						</h1>

						{/* Rating */}
						<div className="flex items-center gap-3 mb-6">
								<div className="flex gap-1">
									{[...Array(5)].map((_, i) => (
										<FontAwesomeIcon 
											key={i} 
											icon={faStar} 
											className={`text-sm ${i < (product?.rating || 0) ? 'text-[#8cc63f]' : 'text-gray-300'}`}
										/>
									))}
								</div>
								<span className="text-gray-600">({product?.reviews?.length || 0} reviews)</span>
						</div>

						{/* Price */}
						<motion.div 
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="mb-6 pb-6 border-b-2 border-gray-200"
						>
							<div className="flex items-baseline gap-4">
								<span className="text-4xl font-bold text-[#8cc63f]">
									${product.price || product.originalPrice || '99.99'}
								</span>
								{product.originalPrice && (
									<span className="text-xl text-gray-400 line-through">
										${product.originalPrice}
									</span>
								)}
								{product.discount && (
									<span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
										-{product.discount}%
									</span>
								)}
							</div>
						</motion.div>

						{/* Description */}
						<p className="text-gray-700 leading-relaxed mb-8">
							{product.description || 'Premium quality product designed with modern aesthetics and superior functionality. Perfect for your home and lifestyle needs.'}
						</p>

						{/* Features */}
						<div className="grid grid-cols-3 gap-4 mb-8">
							<motion.div 
								whileHover={{ scale: 1.05 }}
								className="bg-linear-to-br from-green-50 to-green-100 p-4 rounded-lg text-center"
							>
								<FontAwesomeIcon icon={faTruck} className="text-[#8cc63f] text-2xl mb-2" />
								<p className="text-sm font-semibold text-gray-900">Free Shipping</p>
							</motion.div>
							<motion.div 
								whileHover={{ scale: 1.05 }}
								className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center"
							>
								<FontAwesomeIcon icon={faShieldAlt} className="text-blue-600 text-2xl mb-2" />
								<p className="text-sm font-semibold text-gray-900">Secure Payment</p>
							</motion.div>
							<motion.div 
								whileHover={{ scale: 1.05 }}
								className="bg-linear-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center"
							>
								<FontAwesomeIcon icon={faStar} className="text-purple-600 text-2xl mb-2" />
								<p className="text-sm font-semibold text-gray-900">Top Rated</p>
							</motion.div>
						</div>

						{/* Quantity & Actions */}
						<div className="flex gap-4 mb-8">
							<div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
								<motion.button 
									whileTap={{ scale: 0.95 }}
									onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
									className="px-4 py-3 hover:bg-gray-100 transition"
								>
									−
								</motion.button>
								<input 
									type="number" 
									value={qty} 
									readOnly 
									className="w-16 text-center border-x-2 border-gray-300 py-3 font-semibold"
								/>
								<motion.button 
									whileTap={{ scale: 0.95 }}
									onClick={() => setQty(qty + 1)}
									className="px-4 py-3 hover:bg-gray-100 transition"
								>
									+
								</motion.button>
							</div>

							<motion.button 
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => {
									if (!available) return;
									if (isInCart()) {
										dispatch(removeFromCart(product._id || product.id));
										toast.success(`Removed from cart!`);
									} else {
										dispatch(addToCart({ id: product._id || product.id, title: product.name || product.title, price: product.price, image: product.image, qty }));
										toast.success(`Added ${qty} ${product.name || product.title} to cart!`);
									}
								}}
								className={`flex-1 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
									!available ? 'bg-gray-300 cursor-not-allowed' : (isInCart() ? 'bg-red-500 hover:bg-red-600' : 'bg-[#8cc63f] hover:bg-[#7ab02e]')
								}`}
								disabled={!available}
							>
								<FontAwesomeIcon icon={faShoppingCart} />
								{!available ? 'Unavailable' : (isInCart() ? 'Remove from Cart' : 'Add to Cart')}
							</motion.button>

							<motion.button 
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={() => { 
									dispatch(toggleWishlist({ id: product._id || product.id, title: product.name || product.title, price: product.price, image: product.image }));
									if (!isWishlisted) toast.success('Added to wishlist'); else toast.success('Removed from wishlist');
								}}
								className={`p-3 rounded-lg border-2 transition-all ${
									isWishlisted 
										? 'border-red-600 bg-red-600 text-white' 
										: 'border-gray-300 hover:border-[#8cc63f]'
								}`}
							>
								<FontAwesomeIcon 
									icon={faHeart} 
									className={isWishlisted ? 'text-white' : 'text-gray-600'}
								/>
							</motion.button>
						</div>

						{/* SKU & Category Info */}
						<div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
							<p><span className="font-semibold text-gray-900">SKU:</span> <span className="text-gray-600">PROD-{product._id?.slice(-6) || '001'}</span></p>
							<p><span className="font-semibold text-gray-900">Category:</span> <span className="text-gray-600">{product.category || 'Premium Furniture'}</span></p>
							<p><span className="font-semibold text-gray-900">Availability:</span> <span className="text-green-600 font-semibold">In Stock</span></p>
						</div>
					</motion.div>
				</div>

				{/* Tabs Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="mt-16"
				>
					<div className="flex gap-1 border-b-2 border-gray-200 mb-8">
						{['description', 'details', 'reviews'].map(tab => (
							<motion.button
								key={tab}
								onClick={() => setActiveTab(tab)}
								whileHover={{ y: -2 }}
								className={`px-6 py-3 font-semibold text-lg capitalize transition-all ${
									activeTab === tab
										? 'text-[#8cc63f] border-b-4 border-[#8cc63f] -mb-2'
										: 'text-gray-600 hover:text-gray-900'
								}`}
							>
								{tab}
							</motion.button>
						))}
					</div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3 }}
						className="bg-gray-50 rounded-lg p-8"
					>
						{activeTab === 'description' && (
							<div className="prose max-w-none">
								<p className="text-gray-700 leading-relaxed mb-4">
									{product.description || 'This premium product combines elegant design with exceptional functionality. Crafted from high-quality materials, it is built to last and enhance your lifestyle.'}
								</p>
								<ul className="list-disc list-inside text-gray-700 space-y-2">
									<li>Premium Quality Materials</li>
									<li>Modern & Elegant Design</li>
									<li>Eco-Friendly & Sustainable</li>
									<li>5-Year Warranty</li>
									<li>Free Lifetime Support</li>
								</ul>
							</div>
						)}

						{activeTab === 'details' && (
							<table className="w-full text-gray-700">
								<tbody>
									<tr className="border-b"><td className="py-3 font-semibold w-1/3">Weight</td><td>2.5 kg</td></tr>
									<tr className="border-b"><td className="py-3 font-semibold">Dimensions</td><td>100cm x 80cm x 45cm</td></tr>
									<tr className="border-b"><td className="py-3 font-semibold">Material</td><td>Premium Solid Wood & Upholstery</td></tr>
									<tr className="border-b"><td className="py-3 font-semibold">Color</td><td>Natural Black</td></tr>
									<tr><td className="py-3 font-semibold">Manufacturing Country</td><td>Germany</td></tr>
								</tbody>
							</table>
						)}

					{activeTab === 'reviews' && (
						<div>
							{reviewsStatus === 'loading' ? (
								<p className="text-center text-gray-600">Loading reviews...</p>
							) : reviews.length > 0 ? (
								<div className="space-y-6">
									{reviews.map((review) => (
										<div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6">
											<div className="flex items-start gap-4 mb-4">
												<div className="flex-1">
													<h4 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
													<p className="text-sm text-gray-500">{review.user?.email}</p>
												</div>
												<p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
											</div>
											<div className="flex gap-1 mb-3">
												{[...Array(5)].map((_, i) => (
													<FontAwesomeIcon 
														key={i} 
														icon={faStar} 
														className={`text-sm ${i < 5 ? 'text-[#8cc63f]' : 'text-gray-300'}`}
													/>
												))}
											</div>
											<p className="text-gray-700">{review.review}</p>
										</div>
									))}
								</div>
							) : (
								<div className="text-center text-gray-600">
									<p className="mb-4">No reviews yet</p>
									<button className="bg-[#8cc63f] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#7ab02e] transition">
										Write a Review
									</button>
								</div>
							)}
						</div>
					)}
					</motion.div>
				</motion.div>
			</div>

			<Footer />
		</div>
	);
};

export default SingleProduct;
