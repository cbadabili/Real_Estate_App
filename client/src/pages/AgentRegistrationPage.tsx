import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, MapPin, Phone, Mail, Award, User, Building } from 'lucide-react';

const AgentRegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    specialization: '',
    reacNumber: '',
    companyName: '',
    bio: '',
    profileImage: null as File | null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Agent registration:', formData);
    alert('Registration submitted successfully! We will review your application.');
  };

  const locations = [
    // South-East District
    'Gaborone', 'Lobatse', 'Ramotswa', 'Mogoditshane', 'Gabane', 'Tlokweng', 'Mmopane', 'Kumakwane',
    'Phakalane', 'Sebele', 'Broadhurst', 'Block 3', 'Block 5', 'Block 8', 'Extension 9',

    // Central District
    'Serowe', 'Palapye', 'Mahalapye', 'Botswana Central', 'Tutume', 'Nkange', 'Bobonong',

    // North-East District
    'Francistown', 'Selebi-Phikwe', 'Tonota', 'Tati Siding', 'Nyangabgwe', 'Gerald Estate',
    'Copper Sunrise', 'Monarch', 'Tshesebe', 'Donga',

    // North-West District
    'Maun', 'Shakawe', 'Gumare', 'Nokaneng', 'Sepopa', 'Mohembo', 'Etsha', 'Tubu',
    'Boro', 'Disaneng', 'Mathiba', 'Sexaxa',

    // Kgalagadi District
    'Ghanzi', 'Tsabong', 'Kang', 'Hukuntsi', 'Lokgwabe', 'Werda', 'Bere',

    // Kgatleng District
    'Mochudi', 'Oodi', 'Malolwane', 'Sikwane', 'Segwagwa', 'Mmakgodumo',

    // Kweneng District
    'Molepolole', 'Thamaga', 'Ntlhantlhe', 'Gakgatla', 'Lentsweletau', 'Kopong',

    // Southern District
    'Kanye', 'Jwaneng', 'Good Hope', 'Tsabong', 'Sekoma', 'Hukuntsi', 'Selokolela',
    'Mmankgodi', 'Takatokwane',

    // Chobe District
    'Kasane', 'Kazungula', 'Pandamatenga', 'Lesoma', 'Kavimba'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Agent Network</h1>
            <p className="text-gray-600">Register as a REAC certified agent and grow your business</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                >
                  <option value="">Select Location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                >
                  <option value="">Select Experience</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization *
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                >
                  <option value="">Select Specialization</option>
                  <option value="Residential">Residential Properties</option>
                  <option value="Commercial">Commercial Properties</option>
                  <option value="Luxury">Luxury Properties</option>
                  <option value="Investment">Investment Properties</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  REAC Registration Number *
                </label>
                <input
                  type="text"
                  name="reacNumber"
                  value={formData.reacNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Bio *
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                placeholder="Tell us about your experience and what makes you a great agent..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="flex items-center px-8 py-3 bg-beedab-blue text-white font-semibold rounded-lg hover:bg-beedab-darkblue transition-colors"
              >
                <Award className="h-5 w-5 mr-2" />
                Submit Application
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AgentRegistrationPage;