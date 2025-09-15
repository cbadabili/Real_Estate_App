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

interface PendingPayment {
  id: number;
  user_id: number;
  plan_id: number;
  amount_bwp: number;
  payment_method: string;
  payment_reference?: string;
  status: string;
  created_at: string;
  plan: {
    name: string;
    code: string;
  };
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface BillingStats {
  overview: {
    total_payments: number;
    pending_payments: number;
    approved_payments: number;
    rejected_payments: number;
    total_revenue: number;
    pending_revenue: number;
    active_subscriptions: number;
  };
  plan_distribution: Array<{
    plan_name: string;
    plan_code: string;
    subscription_count: number;
    revenue: number;
  }>;
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

  // Fetch pending payments
  const { data: pendingPayments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/billing/payments/pending'],
    queryFn: () => apiRequest('/api/billing/payments/pending'),
  });

  // Fetch billing statistics
  const { data: billingStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/billing/admin/stats'],
    queryFn: () => apiRequest('/api/billing/admin/stats'),
  });

  // Payment approval mutation
  const approvePaymentMutation = useMutation({
    mutationFn: (data: { paymentId: number; notes?: string }) =>
      apiRequest(`/api/billing/payments/${data.paymentId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ notes: data.notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/billing/payments/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/billing/admin/stats'] });
      toast({
        title: 'Success',
        description: 'Payment approved successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to approve payment: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Payment rejection mutation
  const rejectPaymentMutation = useMutation({
    mutationFn: (data: { paymentId: number; reason: string }) =>
      apiRequest(`/api/billing/payments/${data.paymentId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason: data.reason }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/billing/payments/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/billing/admin/stats'] });
      toast({
        title: 'Success',
        description: 'Payment rejected successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to reject payment: ${error.message}`,
        variant: 'destructive',
      });
    },
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

  const handlePaymentApproval = (paymentId: number) => {
    const notes = prompt('Optional approval notes:');
    approvePaymentMutation.mutate({ paymentId, notes: notes || undefined });
  };

  const handlePaymentRejection = (paymentId: number) => {
    const reason = prompt('Rejection reason (required):');
    if (reason && reason.trim()) {
      rejectPaymentMutation.mutate({ paymentId, reason: reason.trim() });
    } else {
      toast({
        title: 'Error',
        description: 'Rejection reason is required',
        variant: 'destructive',
      });
    }
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
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

        {/* Billing Management */}
        <TabsContent value="billing">
          <div className="space-y-6">
            {/* Billing Overview */}
            {billingStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {billingStats.overview.pending_payments}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      BWP {billingStats.overview.pending_revenue.toLocaleString()} pending
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      BWP {billingStats.overview.total_revenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {billingStats.overview.approved_payments} approved payments
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {billingStats.overview.active_subscriptions}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Currently active
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Rejected Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {billingStats.overview.rejected_payments}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Failed transactions
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Pending Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Pending Payment Approvals
                </CardTitle>
                <CardDescription>
                  Review and approve customer payments for plan subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="text-center py-8">Loading payments...</div>
                ) : pendingPayments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending payments to review
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingPayments.map((payment: PendingPayment) => (
                      <div key={payment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">
                                {payment.user.firstName} {payment.user.lastName}
                              </h3>
                              <Badge variant="outline">
                                {payment.plan.name}
                              </Badge>
                              <Badge variant="secondary">
                                BWP {payment.amount_bwp.toLocaleString()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              @{payment.user.username} • {payment.user.email}
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">
                              Payment Method: {payment.payment_method.replace('_', ' ')}
                              {payment.payment_reference && ` • Ref: ${payment.payment_reference}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Submitted: {new Date(payment.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handlePaymentApproval(payment.id)}
                              disabled={approvePaymentMutation.isPending}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handlePaymentRejection(payment.id)}
                              disabled={rejectPaymentMutation.isPending}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plan Distribution */}
            {billingStats && (
              <Card>
                <CardHeader>
                  <CardTitle>Plan Distribution</CardTitle>
                  <CardDescription>
                    Active subscriptions and revenue by plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {billingStats.plan_distribution.map((plan) => (
                      <div key={plan.plan_code} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{plan.plan_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {plan.subscription_count} active subscriptions
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">BWP {plan.revenue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Total revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
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
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {billingStats?.overview.active_subscriptions || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Paying customers
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {(billingStats?.overview.pending_payments || 0) + reviews.filter((r: AdminReview) => r.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Payments & reviews
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  BWP {billingStats?.overview.total_revenue.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Lifetime revenue
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}