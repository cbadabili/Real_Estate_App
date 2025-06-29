import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Filter, Search, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UserReviewsProps {
  userId: number;
  userName: string;
  showWriteReview?: boolean;
  transactionId?: number;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  verifiedReviews: number;
  helpfulVotes: number;
}

export const UserReviews: React.FC<UserReviewsProps> = ({
  userId,
  userName,
  showWriteReview = false,
  transactionId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filters, setFilters] = useState({
    reviewType: '',
    minRating: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch review statistics
  const { data: reviewStats, isLoading: statsLoading } = useQuery<ReviewStats>({
    queryKey: [`/api/users/${userId}/review-stats`],
    enabled: !!userId
  });

  // Fetch reviews with filters
  const { data: reviews, isLoading: reviewsLoading, error } = useQuery({
    queryKey: ['/api/reviews', { 
      reviewee_id: userId,
      review_type: filters.reviewType || undefined,
      min_rating: filters.minRating || undefined,
      sort_by: filters.sortBy,
      sort_order: filters.sortOrder,
      status: 'active',
      is_public: true
    }],
    enabled: !!userId
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      return apiRequest(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/review-stats`] });
      toast({
        title: "Review deleted",
        description: "The review has been removed successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive"
      });
    }
  });

  const handleDeleteReview = (reviewId: number) => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteReviewMutation.mutate(reviewId);
    }
  };

  const handleEditReview = (reviewId: number) => {
    // TODO: Implement edit functionality
    toast({
      title: "Coming soon",
      description: "Edit functionality will be available soon"
    });
  };

  const filteredReviews = reviews?.filter((review: any) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      review.review?.toLowerCase().includes(searchLower) ||
      review.reviewer.firstName.toLowerCase().includes(searchLower) ||
      review.reviewer.lastName.toLowerCase().includes(searchLower)
    );
  }) || [];

  const renderRatingStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${starSize} ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderRatingDistribution = () => {
    if (!reviewStats?.ratingDistribution) return null;

    const maxCount = Math.max(...Object.values(reviewStats.ratingDistribution));
    
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = reviewStats.ratingDistribution[rating] || 0;
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center space-x-2 text-sm">
              <span className="w-6 text-right">{rating}</span>
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-xs text-gray-500">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (statsLoading || reviewsLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner type="reviews" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">
            Unable to load reviews. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      {reviewStats && reviewStats.totalReviews > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Review Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {reviewStats.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderRatingStars(reviewStats.averageRating)}
                </div>
                <p className="text-sm text-gray-500">
                  Based on {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
                </p>
                <div className="flex justify-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>{reviewStats.verifiedReviews} verified</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>{reviewStats.helpfulVotes} helpful votes</span>
                  </div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="md:col-span-2">
                <h4 className="font-medium mb-3">Rating Distribution</h4>
                {renderRatingDistribution()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Write Review Button */}
      {showWriteReview && user && user.id !== userId && (
        <div className="flex justify-center">
          <Button
            onClick={() => setShowReviewForm(true)}
            className="flex items-center space-x-2"
          >
            <Star className="w-4 h-4" />
            <span>Write a Review</span>
          </Button>
        </div>
      )}

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReviewForm(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <ReviewForm
                revieweeId={userId}
                revieweeName={userName}
                transactionId={transactionId}
                onClose={() => setShowReviewForm(false)}
                onSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/review-stats`] });
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filters.reviewType} onValueChange={(value) => setFilters(prev => ({ ...prev, reviewType: value }))}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="service_provider">Service Provider</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.minRating} onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All ratings</SelectItem>
                  <SelectItem value="5">5 stars</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                  <SelectItem value="2">2+ stars</SelectItem>
                  <SelectItem value="1">1+ stars</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Newest first</SelectItem>
                  <SelectItem value="rating">Highest rated</SelectItem>
                  <SelectItem value="helpful">Most helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {reviews?.length === 0 ? 'No reviews yet' : 'No matching reviews'}
                </h3>
                <p className="text-gray-500">
                  {reviews?.length === 0 
                    ? `${userName} hasn't received any reviews yet.`
                    : 'Try adjusting your filters to see more reviews.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredReviews.map((review: any) => (
              <ReviewCard
                key={review.id}
                review={review}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};