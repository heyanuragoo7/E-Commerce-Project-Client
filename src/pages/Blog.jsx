import React from 'react';
import Nav from '../components/common/Nav';
import PromoBar from '../components/common/PromoBar';
import Footer from '../components/common/Footer';
import { Link } from 'react-router-dom';
import img1 from '../assets/img22.jpg';
import img2 from '../assets/img11.jpg';

const samplePosts = [
  {
    id: 'p1',
    title: 'Designing the Future: Modern Furniture Trends',
    excerpt: 'Explore the latest trends in furniture design for 2025 — minimal lines, sustainable materials, and smart integrations.',
    date: 'Dec 1, 2025',
    image: img2
  },
  {
    id: 'p2',
    title: 'How to Style Your Living Room for a Futuristic Look',
    excerpt: 'Practical tips and moodboard ideas to make your living space feel contemporary and elegant.',
    date: 'Nov 18, 2025',
    image: img1
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* <PromoBar /> */}
      <Nav />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Our Blog</h1>
        <p className="text-gray-600 mb-8">Latest articles about design, lifestyle, and product updates.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {samplePosts.map(post => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
                <Link to={`/post`} className="inline-block text-[#8cc63f] font-semibold">Read more →</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
