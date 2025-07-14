import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Flag, 
  Edit, 
  Trash,
  CheckCircle,
  Calendar,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ReviewCardProps {
  review: {
    id: number;
    revieweeId: number;
    reviewerId: number;
    rating: number;
    review: string | null;
    reviewType: string;
    transactionId?: number | null;
    isVerified: boolean;
    isPublic: boolean;
    status: string;
    createdAt: string;
    reviewer: {
      firstName: string;
      lastName: string;
      avatar?: string | null;
    };
    reviewee: {
      firstName: string;
      lastName: string;
      avatar?: string | null;
    };
    responsesCount?: number;
    helpfulCount?: number;
    notHelpfulCount?: number;
  };
  showActions?: boolean;
  onEdit?: (reviewId: number) => void;
  onDelete?: (reviewId: number) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  showActions = true,
  onEdit,
  onDelete
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showResponse, setShowResponse] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [userVote, setUserVote] = useState<boolean | null>(null);

  const isReviewOwner = user?.id === review.reviewerId;
  const isRevieweeOwner = user?.id === review.revieweeId;
  const canEdit = isReviewOwner;
  const canDelete = isReviewOwner || (user as any)?.type === 'admin';
  const canRespond = isRevieweeOwner || (user as any)?.type === 'admin';

  // Vote on review helpfulness
  const voteHelpfulMutation = useMutation({
    mutationFn: async (isHelpful: boolean) => {
      return apiRequest(`/api/reviews/${review.id}/helpful`, {
        method: 'POST',
        body: JSON.stringify({ isHelpful })
      });
    },
    onSuccess: (data) => {
      setUserVote(data.vote.isHelpful);
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      toast({
        title: "Vote recorded",
        description: "Thank you for your feedback!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record your vote",
        variant: "destructive"
      });
    }
  });

  // Flag review
  const flagReviewMutation = useMutation({
    mutationFn: async (reason: string) => {
      return apiRequest(`/api/reviews/${review.id}/flag`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      toast({
        title: "Review flagged",
        description: "The review has been reported for moderation"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to flag review",
        variant: "destructive"
      });
    }
  });

  // Submit response
  const responseSubmitMutation = useMutation({
    mutationFn: async (response: string) => {
      return apiRequest(`/api/reviews/${review.id}/responses`, {
        method: 'POST',
        body: JSON.stringify({ 
          response,
          isOfficial: isRevieweeOwner 
        })
      });
    },
    onSuccess: () => {
      setResponseText('');
      setShowResponse(false);
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      toast({
        title: "Response posted",
        description: "Your response has been published"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post response",
        variant: "destructive"
      });
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleVote = (isHelpful: boolean) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to vote on reviews",
        variant: "destructive"
      });
      return;
    }
    voteHelpfulMutation.mutate(isHelpful);
  };

  const handleFlag = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to flag reviews",
        variant: "destructive"
      });
      return;
    }
    const reason = prompt("Please provide a reason for flagging this review:");
    if (reason) {
      flagReviewMutation.mutate(reason);
    }
  };

  const handleSubmitResponse = () => {
    if (!responseText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a response",
        variant: "destructive"
      });
      return;
    }
    responseSubmitMutation.mutate(responseText);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={review.reviewer.avatar || undefined} />
                <AvatarFallback>
                  {review.reviewer.firstName[0]}{review.reviewer.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-sm">
                    {review.reviewer.firstName} {review.reviewer.lastName}
                  </h4>
                  {review.isVerified && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(review.createdAt)}</span>
                  <Badge variant="outline" className="text-xs">
                    {review.reviewType}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {review.review && (
            <p className="text-sm text-gray-700 mb-4">{review.review}</p>
          )}

          {/* Review about section */}
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
            <User className="w-3 h-3" />
            <span>
              Review about {review.reviewee.firstName} {review.reviewee.lastName}
            </span>
          </div>

          {/* Action buttons */}
          {showActions && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Helpful votes */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(true)}
                    className={`px-2 py-1 ${userVote === true ? 'bg-green-100' : ''}`}
                    disabled={voteHelpfulMutation.isPending}
                  >
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    {review.helpfulCount || 0}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(false)}
                    className={`px-2 py-1 ${userVote === false ? 'bg-red-100' : ''}`}
                    disabled={voteHelpfulMutation.isPending}
                  >
                    <ThumbsDown className="w-3 h-3 mr-1" />
                    {review.notHelpfulCount || 0}
                  </Button>
                </div>

                {/* Response button */}
                {canRespond && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResponse(!showResponse)}
                  >
                    <Reply className="w-3 h-3 mr-1" />
                    Respond
                  </Button>
                )}

                {/* Responses count */}
                {(review.responsesCount || 0) > 0 && (
                  <span className="text-xs text-gray-500">
                    {review.responsesCount} response{review.responsesCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {/* Edit button */}
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e: React.MouseEvent) => onEdit?.(review.id)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                )}

                {/* Delete button */}
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e: React.MouseEvent) => onDelete?.(review.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash className="w-3 h-3" />
                  </Button>
                )}

                {/* Flag button */}
                {!isReviewOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFlag}
                    disabled={flagReviewMutation.isPending}
                  >
                    <Flag className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Response form */}
          {showResponse && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t"
            >
              <Textarea
                placeholder="Write your response..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="min-h-[80px] mb-3"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResponse(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitResponse}
                  disabled={responseSubmitMutation.isPending || !responseText.trim()}
                >
                  {responseSubmitMutation.isPending ? 'Posting...' : 'Post Response'}
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};