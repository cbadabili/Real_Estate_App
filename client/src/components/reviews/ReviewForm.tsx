import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewFormProps {
  revieweeId: number;
  revieweeName: string;
  transactionId?: number;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  revieweeId,
  revieweeName,
  transactionId,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewType, setReviewType] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      return apiRequest('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      toast({
        title: "Review submitted",
        description: "Your review has been published successfully"
      });
      onSuccess?.();
      onClose?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to submit a review",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating",
        variant: "destructive"
      });
      return;
    }

    if (!reviewType) {
      toast({
        title: "Review type required",
        description: "Please select the type of interaction",
        variant: "destructive"
      });
      return;
    }

    const reviewData = {
      revieweeId,
      rating,
      review: reviewText.trim() || null,
      reviewType,
      transactionId: transactionId || null
    };

    submitReviewMutation.mutate(reviewData);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starNumber = i + 1;
      const isActive = starNumber <= (hoveredStar || rating);
      
      return (
        <button
          key={i}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHoveredStar(starNumber)}
          onMouseLeave={() => setHoveredStar(0)}
          onClick={() => setRating(starNumber)}
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              isActive ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            }`}
          />
        </button>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Review {revieweeName}
            </CardTitle>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Overall Rating</Label>
              <div className="flex items-center space-x-1">
                {renderStars()}
              </div>
              {rating > 0 && (
                <p className="text-xs text-gray-500">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>

            {/* Review Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Type of Interaction</Label>
              <Select value={reviewType} onValueChange={setReviewType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">As a Buyer</SelectItem>
                  <SelectItem value="seller">As a Seller</SelectItem>
                  <SelectItem value="agent">Through Agent Services</SelectItem>
                  <SelectItem value="service_provider">Service Provider</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Your Review (Optional)</Label>
              <Textarea
                placeholder="Share your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="min-h-[100px] resize-none"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 text-right">
                {reviewText.length}/1000 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              {onClose && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={submitReviewMutation.isPending}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={submitReviewMutation.isPending || rating === 0 || !reviewType}
                className="flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>
                  {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};