
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const AgentRatingPage: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [review, setReview] = useState('');
  const [categories, setCategories] = useState({
    communication: 0,
    professionalism: 0,
    knowledge: 0,
    responsiveness: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle rating submission
    console.log({ agentId, rating, review, categories });
    alert('Rating submitted successfully!');
    navigate(-1);
  };

  const renderStars = (currentRating: number, onRate: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starNumber = i + 1;
      const isActive = starNumber <= (hoveredStar || currentRating);
      
      return (
        <button
          key={i}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHoveredStar(starNumber)}
          onMouseLeave={() => setHoveredStar(0)}
          onClick={() => onRate(starNumber)}
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              isActive ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            }`}
          />
        </button>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-gray-500 hover:text-beedab-blue"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Rate Your Agent Experience</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating
              </label>
              <div className="flex items-center space-x-1">
                {renderStars(rating, setRating)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Communication
                </label>
                <div className="flex items-center space-x-1">
                  {renderStars(categories.communication, (rating) => 
                    setCategories(prev => ({ ...prev, communication: rating }))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professionalism
                </label>
                <div className="flex items-center space-x-1">
                  {renderStars(categories.professionalism, (rating) => 
                    setCategories(prev => ({ ...prev, professionalism: rating }))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Knowledge
                </label>
                <div className="flex items-center space-x-1">
                  {renderStars(categories.knowledge, (rating) => 
                    setCategories(prev => ({ ...prev, knowledge: rating }))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsiveness
                </label>
                <div className="flex items-center space-x-1">
                  {renderStars(categories.responsiveness, (rating) => 
                    setCategories(prev => ({ ...prev, responsiveness: rating }))
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write a Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                placeholder="Share your experience with this agent..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-6 py-3 bg-beedab-blue text-white font-semibold rounded-lg hover:bg-beedab-darkblue transition-colors"
              >
                <Send className="h-5 w-5 mr-2" />
                Submit Rating
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AgentRatingPage;
