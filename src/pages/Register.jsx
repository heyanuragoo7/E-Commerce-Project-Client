import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import auth from '../utils/auth';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', phone: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = e => setFile(e.target.files && e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = `${auth.BASE_URL}/register`;
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('password', form.password);
      fd.append('address', form.address);
      fd.append('phone', form.phone);
      if (file) fd.append('profileImage', file);

      const res = await fetch(url, {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data?.message || data?.error || 'Register failed';
        toast.error(msg);
        setLoading(false);
        return;
      }

      // The API might return token at root or in data
      const token = data?.token || data?.data?.token;
      if (token) {
        auth.saveToken(token);
        toast.success('Registered and logged in');
        navigate('/');
      } else {
        toast.success('Registered successfully');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      toast.error('Register error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded" />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
        <div>
          <label className="block text-sm mb-1">Profile Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleFile} />
        </div>
        <button disabled={loading} className="px-4 py-2 bg-[#8cc63f] text-white rounded">{loading ? 'Registering...' : 'Register'}</button>
      </form>
    </div>
  );
};

export default Register;
