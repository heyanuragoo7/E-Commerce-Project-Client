import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../utils/auth';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = auth.getToken();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        toast.error('You must be logged in to view your profile');
        navigate('/login');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${auth.BASE_URL}/profile`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', ...auth.authHeader() },
          credentials: 'include',
        });

        if (res.status === 401) {
          auth.removeToken();
          toast.error('Session expired. Please log in again.');
          navigate('/login');
          return;
        }

        const data = await res.json();
        setProfile(data?.data || data);
      } catch (err) {
        toast.error('Could not load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);


  if (loading)
    return (
      <div className="text-center py-20 text-[#8cc63f] text-lg font-medium">
        Loading...
      </div>
    );

  if (!profile)
    return (
      <div className="text-center py-20 text-gray-600 text-lg font-medium">
        No profile found
      </div>
    );

  return (
    <div className="min-h-screen bg-white flex justify-center py-12 px-4">
      <div className="w-full max-w-5xl">

        {/* Cover Header */}
        <div className="bg-[#8cc63f] rounded-2xl h-40 mb-6 shadow-inner"></div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-8 -mt-24 relative">

          {/* Avatar & Summary */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">

            {/* Profile Image */}
            <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-md">
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name & Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                {profile.name}
              </h1>
              <p className="text-[#8cc63f] font-medium text-sm mt-1">
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </p>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => navigate('/edit-profile')}
                  className="px-5 py-2.5 rounded-lg bg-[#8cc63f] text-white text-sm font-medium hover:bg-emerald-500 transition"
                >
                  Edit profile
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-8 border-emerald-100" />

          {/* Details Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Info label="Email" value={profile.email} />
            <Info label="Phone" value={profile.phone} />
            <Info label="Address" value={profile.address} />
            <Info label="Role" value={profile.role} />
          </div>

        </div>
      </div>
    </div>
  );
};

// Reusable Info Component
const Info = ({ label, value }) => (
  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 shadow-sm">
    <p className="text-sm text-[#8cc63f] font-medium">{label}</p>
    <p className="text-gray-900 font-semibold text-base mt-1">{value || '—'}</p>
  </div>
);

export default Profile;
