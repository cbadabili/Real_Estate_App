import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { StarIcon, ShieldIcon, UserIcon, FlagIcon } from 'lucide-react';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

interface AdminReview {
  id: number;
  revieweeId: number;
  reviewerId: number;
  rating: number;
  review: string;
  status: string;
  isPublic: boolean;
  createdAt: string;
  reviewer: {
    firstName: string;
    lastName: string;
  };
  reviewee: {
    firstName: string;
    lastName: string;
  };
}

interface AuditLogEntry {
  id: number;
  adminId: number;
  action: string;
  targetType: string;
  targetId: number;
  details: string;
  createdAt: string;
}

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userFilter, setUserFilter] = useState('');
  const [reviewFilter, setReviewFilter] = useState('pending');

  // Redirect if not admin
  if (!isAdmin()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Fetch users for management
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users', userFilter],
    queryFn: () => apiRequest(`/api/admin/users?search=${userFilter}`),
  });

  // Fetch reviews for moderation
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['/api/admin/reviews', reviewFilter],
    queryFn: () => apiRequest(`/api/admin/reviews?status=${reviewFilter}`),
  });

  // Fetch audit log
  const { data: auditLog = [], isLoading: auditLoading } = useQuery({
    queryKey: ['/api/admin/audit-log'],
    queryFn: () => apiRequest('/api/admin/audit-log?limit=50'),
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (data: { userId: number; updates: Partial<AdminUser> }) =>
      apiRequest(`/api/admin/users/${data.userId}`, {
        method: 'PATCH',
        body: JSON.stringify(data.updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update user: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Moderate review mutation
  const moderateReviewMutation = useMutation({
    mutationFn: (data: { reviewId: number; status: string; notes?: string }) =>
      apiRequest(`/api/admin/reviews/${data.reviewId}/moderate`, {
        method: 'PATCH',
        body: JSON.stringify({ status: data.status, moderatorNotes: data.notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      toast({
        title: 'Success',
        description: 'Review moderated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to moderate review: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleUserStatusToggle = (userId: number, currentStatus: boolean) => {
    updateUserMutation.mutate({
      userId,
      updates: { isActive: !currentStatus },
    });
  };

  const handleUserVerification = (userId: number, currentVerification: boolean) => {
    updateUserMutation.mutate({
      userId,
      updates: { isVerified: !currentVerification },
    });
  };

  const handleReviewModeration = (reviewId: number, status: string) => {
    moderateReviewMutation.mutate({ reviewId, status });
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      super_admin: 'bg-red-100 text-red-800',
      admin: 'bg-purple-100 text-purple-800',
      moderator: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800',
    };
    return colors[role as keyof typeof colors] || colors.user;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      flagged: 'bg-orange-100 text-orange-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, moderate reviews, and monitor system activity
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        {/* Users Management */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts, verify users, and control access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search users by name or email..."
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {usersLoading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : (
                <div className="space-y-4">
                  {users.map((user: AdminUser) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">
                              {user.firstName} {user.lastName}
                            </h3>
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {user.role}
                            </Badge>
                            <Badge variant={user.isVerified ? 'default' : 'secondary'}>
                              {user.isVerified ? 'Verified' : 'Unverified'}
                            </Badge>
                            <Badge variant={user.isActive ? 'default' : 'destructive'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            @{user.username} • {user.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.userType} • Joined {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={user.isVerified ? 'destructive' : 'default'}
                            onClick={() => handleUserVerification(user.id, user.isVerified)}
                            disabled={updateUserMutation.isPending}
                          >
                            <ShieldIcon className="w-4 h-4 mr-1" />
                            {user.isVerified ? 'Unverify' : 'Verify'}
                          </Button>
                          <Button
                            size="sm"
                            variant={user.isActive ? 'destructive' : 'default'}
                            onClick={() => handleUserStatusToggle(user.id, user.isActive)}
                            disabled={updateUserMutation.isPending}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Moderation */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlagIcon className="w-5 h-5" />
                Review Moderation
              </CardTitle>
              <CardDescription>
                Review and moderate user reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={reviewFilter} onValueChange={setReviewFilter}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Reviews</SelectItem>
                    <SelectItem value="flagged">Flagged Reviews</SelectItem>
                    <SelectItem value="approved">Approved Reviews</SelectItem>
                    <SelectItem value="rejected">Rejected Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reviewsLoading ? (
                <div className="text-center py-8">Loading reviews...</div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review: AdminReview) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge className={getStatusBadgeColor(review.status)}>
                              {review.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            From: {review.reviewer.firstName} {review.reviewer.lastName} →{' '}
                            {review.reviewee.firstName} {review.reviewee.lastName}
                          </p>
                          <p className="text-sm mb-2">{review.review}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {review.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleReviewModeration(review.id, 'approved')}
                                disabled={moderateReviewMutation.isPending}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReviewModeration(review.id, 'rejected')}
                                disabled={moderateReviewMutation.isPending}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {review.status === 'flagged' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleReviewModeration(review.id, 'approved')}
                                disabled={moderateReviewMutation.isPending}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReviewModeration(review.id, 'rejected')}
                                disabled={moderateReviewMutation.isPending}
                              >
                                Remove
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>System Audit Log</CardTitle>
              <CardDescription>
                Track all administrative actions and system changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auditLoading ? (
                <div className="text-center py-8">Loading audit log...</div>
              ) : (
                <div className="space-y-2">
                  {auditLog.map((entry: AuditLogEntry) => (
                    <div key={entry.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{entry.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.targetType} #{entry.targetId} • {entry.details}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reviews.filter((r: AdminReview) => r.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting moderation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter((u: AdminUser) => u.isVerified).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Verified accounts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">System Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditLog.length}</div>
                <p className="text-xs text-muted-foreground">
                  Recent admin actions
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}