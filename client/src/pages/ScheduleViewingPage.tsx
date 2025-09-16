
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare,
  MapPin,
  Home,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

const ScheduleViewingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  // Fetch actual property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Property not found');
          }
          throw new Error('Failed to load property');
        }
        const propertyData = await response.json();
        
        // Parse images safely
        let images = ['/api/placeholder/600/400'];
        if (propertyData.images) {
          try {
            images = Array.isArray(propertyData.images) 
              ? propertyData.images 
              : JSON.parse(propertyData.images);
          } catch (e) {
            console.warn('Failed to parse property images:', e);
          }
        }

        setProperty({
          id: propertyData.id,
          title: propertyData.title,
          address: propertyData.address || `${propertyData.city}, ${propertyData.state}`,
          price: `P${parseFloat(propertyData.price || 0).toLocaleString()}`,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          images: images,
          agent: {
            name: 'Sarah Johnson',
            phone: '+267 1234 5678',
            email: 'sarah@beedab.com'
          }
        });
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error(error.message || 'Failed to load property details');
        // Don't redirect immediately, let user see the error
        setTimeout(() => {
          navigate('/properties');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    if (id && !isNaN(parseInt(id))) {
      fetchProperty();
    } else {
      setLoading(false);
      toast.error('Invalid property ID');
      navigate('/properties');
    }
  }, [id, navigate]);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Convert date and time to timestamp
      const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
      const appointmentTimestamp = Math.floor(appointmentDateTime.getTime() / 1000);

      const appointmentData = {
        propertyId: parseInt(id!),
        buyerId: 1, // Mock user ID - should be actual logged-in user
        appointmentDate: appointmentTimestamp,
        type: 'viewing',
        notes: data.specialRequests || '',
        status: 'pending'
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to schedule appointment');
      }

      toast.success('Viewing scheduled successfully!');
      navigate(`/properties/${id}`);
    } catch (error) {
      console.error('Error scheduling viewing:', error);
      toast.error('Failed to schedule viewing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate next 14 days for date selection
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (day 0)
      if (date.getDay() !== 0) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          }),
          disabled: false
        });
      }
    }
    return dates;
  };

  const availableDates = generateDates();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beedab-blue mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Property Not Found</h2>
          <p className="text-neutral-600 mb-4">The property you're trying to schedule a viewing for doesn't exist.</p>
          <button 
            onClick={() => navigate('/properties')}
            className="bg-beedab-blue text-white px-6 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-beedab-blue hover:text-beedab-darkblue mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Property
          </button>
          
          <div className="flex items-center mb-4">
            <Calendar className="h-8 w-8 text-beedab-blue mr-3" />
            <h1 className="text-3xl font-bold text-neutral-900">Schedule Property Viewing</h1>
          </div>
          <p className="text-neutral-600">Book a viewing appointment for this property</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Property Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 sticky top-8">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {property.title}
              </h3>
              
              <div className="flex items-center text-neutral-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.address}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
                <span className="flex items-center">
                  <Home className="h-4 w-4 mr-1" />
                  {property.bedrooms} bed, {property.bathrooms} bath
                </span>
                <span className="text-lg font-bold text-beedab-blue">
                  {property.price}
                </span>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-neutral-900 mb-2">Contact Agent</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-neutral-400" />
                    <span>{property.agent.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-neutral-400" />
                    <span>{property.agent.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-neutral-400" />
                    <span>{property.agent.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
                <div className="space-y-8">
                  {/* Date Selection */}
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                      Select Date
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availableDates.map((date) => (
                        <label
                          key={date.value}
                          className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                            selectedDate === date.value
                              ? 'border-beedab-blue bg-beedab-blue text-white'
                              : 'border-neutral-200 hover:border-beedab-blue hover:bg-beedab-blue/5'
                          }`}
                        >
                          <input
                            type="radio"
                            value={date.value}
                            checked={selectedDate === date.value}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="sr-only"
                          />
                          <div className="text-sm font-medium">{date.label}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                        Select Time
                      </h3>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {timeSlots.map((time) => (
                          <label
                            key={time}
                            className={`cursor-pointer p-3 border-2 rounded-lg text-center transition-all ${
                              selectedTime === time
                                ? 'border-beedab-blue bg-beedab-blue text-white'
                                : 'border-neutral-200 hover:border-beedab-blue hover:bg-beedab-blue/5'
                            }`}
                          >
                            <input
                              type="radio"
                              value={time}
                              checked={selectedTime === time}
                              onChange={(e) => setSelectedTime(e.target.value)}
                              className="sr-only"
                            />
                            <div className="flex items-center justify-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span className="text-sm font-medium">{time}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Contact Information */}
                  {selectedDate && selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-neutral-900">
                        Contact Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            {...register('fullName', { required: 'Full name is required' })}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                            placeholder="John Doe"
                          />
                          {errors.fullName && (
                            <p className="text-red-600 text-sm mt-1">{errors.fullName.message as string}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            {...register('phone', { required: 'Phone number is required' })}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                            placeholder="+267 1234 5678"
                          />
                          {errors.phone && (
                            <p className="text-red-600 text-sm mt-1">{errors.phone.message as string}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                            placeholder="john@example.com"
                          />
                          {errors.email && (
                            <p className="text-red-600 text-sm mt-1">{errors.email.message as string}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Preferred Contact Method
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...register('contactPreference')}
                              value="phone"
                              className="mr-2"
                            />
                            <span className="text-sm">Phone</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...register('contactPreference')}
                              value="email"
                              className="mr-2"
                            />
                            <span className="text-sm">Email</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...register('contactPreference')}
                              value="whatsapp"
                              className="mr-2"
                            />
                            <span className="text-sm">WhatsApp</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Special Requests or Questions
                        </label>
                        <textarea
                          {...register('specialRequests')}
                          rows={4}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                          placeholder="Any specific areas you'd like to focus on during the viewing..."
                        />
                      </div>

                      {/* Important Information */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-medium text-blue-800">Important Information</span>
                        </div>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Please arrive 5 minutes before your scheduled time</li>
                          <li>• Bring valid identification</li>
                          <li>• Viewings typically last 30-45 minutes</li>
                          <li>• You'll receive a confirmation call/email within 2 hours</li>
                        </ul>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-beedab-blue hover:bg-beedab-darkblue text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Scheduling...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Schedule Viewing
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleViewingPage;
