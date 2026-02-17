import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Star, ShoppingCart, ArrowRight } from 'lucide-react';
import api from '../../../utils/api';
import './BestSellers.css';

const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                // sort=hot uses the algorithm: views * 0.3 + sold_count * 0.7
                const res = await api.get('/products/public?sort=hot&limit=4');
                setProducts(res.data.products || []);
            } catch (error) {
                console.error("Failed to fetch best sellers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    if (loading) {
        return (
            <div className="py-16 container mx-auto px-4">
                 <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-10 animate-pulse"></div>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     {[1,2,3,4].map(i => <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>)}
                 </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="text-red-500 font-bold tracking-wider text-sm uppercase mb-2 block flex items-center justify-center gap-2">
                        <Flame size={18} className="fill-red-500 animate-pulse" /> Trending Now
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        Best Selling Items
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Top rated and most loved products by our badminton community this week.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                        <div 
                            key={product.id} 
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 relative"
                        >
                            {/* Badger */}
                            <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                <Flame size={12} fill="white" /> #{index + 1}
                            </div>

                            {/* Image Config */}
                            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                                <Link to={`/products/product-details/${product.id}`}>
                                    <img 
                                        src={`http://localhost:5000${product.imageUrl}`} 
                                        alt={product.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                                        }}
                                    />
                                </Link>
                                
                                {/* Quick Action Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                                    <Link 
                                        to={`/products/product-details/${product.id}`}
                                        className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl shadow-lg hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={18} /> View Details
                                    </Link>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-center gap-1 mb-2">
                                    {[1,2,3,4,5].map(s => (
                                        <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                                    ))}
                                    <span className="text-xs text-gray-400 ml-1">({product.sold_count} sold)</span>
                                </div>
                                
                                <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                                    <Link to={`/products/product-details/${product.id}`}>
                                        {product.name}
                                    </Link>
                                </h3>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span className="text-xs text-gray-400 line-through">
                                                 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
                                            </span>
                                        )}
                                        <span className="text-lg font-bold text-blue-600">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                        <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestSellers;
