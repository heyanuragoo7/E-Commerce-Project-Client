import React from 'react';
import Nav from '../components/common/Nav';
import PromoBar from '../components/common/PromoBar';
import Footer from '../components/common/Footer';
import image1 from '../assets/futuristic-lounge-furniture.jpg';
import { useParams } from 'react-router-dom';

const demoPost = {
  id: 'p1',
  title: 'Designing the Future: Modern Furniture Trends',
  date: 'Dec 1, 2025',
  author: 'Studio X',
  content: `
    <p>Discover how designers are embracing minimalism, sustainability, and technology to craft furniture that feels both timeless and futuristic. From modular sofas to adaptive lighting, the new generation of home pieces blends form with function.</p>
    <p>Materials like recycled woods, carbon-neutral composites, and smart fabrics are becoming mainstream. Designers focus on longevity, repairability, and adaptable aesthetics to keep spaces fresh without waste.</p>
  `,
  image: image1
};

const SinglePost = () => {
  const { id } = useParams();
  const post = demoPost; // demo mapping; in real app fetch by id

  return (
    <div className="min-h-screen bg-white">
      {/* <PromoBar /> */}
      <Nav />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg shadow-md" />
        </div>
        <div className="text-sm text-gray-500 mb-2">{post.date} • by {post.author}</div>
        <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{post.title}</h1>
        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Comments (2)</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-semibold">Jane Doe</div>
              <div className="text-sm text-gray-600">Love the insights on materials!</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-semibold">DesignFan</div>
              <div className="text-sm text-gray-600">Great read — excited to try some of these tips.</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SinglePost;
