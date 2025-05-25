import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatCurrency, formatNumber } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

import Navigation from "@/components/Navigation";
import AdminSidebar from "@/components/AdminSidebar";
import Statistics from "@/components/Statistics";
import { User, Transaction } from "@shared/schema";

export default function AdminPanel() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetch admin stats
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    initialData: {
      totalUsers: 5840,
      totalInvested: 1458750,
      totalPaid: 892340,
      pendingWithdrawals: 34500,
      userGrowth: 12,
      investmentGrowth: 8,
      paymentGrowth: 5,
      pendingWithdrawalCount: 45
    }
  });

  // Fetch users
  const { data: users = [] } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Fetch withdrawals
  const { data: withdrawals = [] } = useQuery({
    queryKey: ["/api/admin/withdrawals"],
  });

  // Fetch investment plans
  const { data: plans = [] } = useQuery({
    queryKey: ["/api/plans"],
  });

  // Mutation for approving withdrawal
  const approveWithdrawalMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("POST", `/api/admin/withdrawals/${id}/approve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: t("admin.withdrawals"),
        description: t("admin.approve") + " " + t("dashboard.completed"),
        variant: "success",
      });
    },
  });

  // Mutation for rejecting withdrawal
  const rejectWithdrawalMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("POST", `/api/admin/withdrawals/${id}/reject`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: t("admin.withdrawals"),
        description: t("admin.reject") + " " + t("dashboard.completed"),
        variant: "success",
      });
    },
  });

  // Mutation for updating plans
  const updatePlansMutation = useMutation({
    mutationFn: async (updatedPlans: any) => {
      return apiRequest("PUT", "/api/admin/plans", { plans: updatedPlans });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      toast({
        title: t("admin.tariffs"),
        description: t("admin.saveChanges") + " " + t("dashboard.completed"),
        variant: "success",
      });
    },
  });

  const [editedPlans, setEditedPlans] = useState<any[]>([]);

  // When plans data is loaded, initialize editedPlans
  React.useEffect(() => {
    if (plans.length > 0 && editedPlans.length === 0) {
      setEditedPlans([...plans]);
    }
  }, [plans]);

  const handlePlanChange = (index: number, field: string, value: any) => {
    const newPlans = [...editedPlans];
    if (field === 'active') {
      newPlans[index] = { ...newPlans[index], [field]: value };
    } else {
      newPlans[index] = { ...newPlans[index], [field]: parseFloat(value) };
    }
    setEditedPlans(newPlans);
  };

  const handleSaveChanges = () => {
    updatePlansMutation.mutate(editedPlans);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
            </div>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              You don't have permission to access this page.
            </p>
            
            <div className="mt-6">
              <Link href="/dashboard">
                <Button className="w-full">Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navigation />

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <AdminSidebar activeItem={activeTab} onItemClick={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="container mx-auto">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-8">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">
                  {t("admin.dashboard")}
                </h1>

                {/* Admin Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-gray-500 text-sm dark:text-gray-400">{t("admin.totalUsers")}</p>
                          <p className="text-3xl font-bold dark:text-white">{formatNumber(stats?.totalUsers)}</p>
                        </div>
                        <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary dark:bg-primary/20">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-success flex items-center dark:text-green-400">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          {stats?.userGrowth}% {t("dashboard.lastDays")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-gray-500 text-sm dark:text-gray-400">{t("admin.totalInvested")}</p>
                          <p className="text-3xl font-bold dark:text-white">${formatNumber(stats?.totalInvested)}</p>
                        </div>
                        <div className="w-10 h-10 bg-success bg-opacity-10 rounded-full flex items-center justify-center text-success dark:bg-success/20">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-success flex items-center dark:text-green-400">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          {stats?.investmentGrowth}% {t("dashboard.lastDays")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-gray-500 text-sm dark:text-gray-400">{t("admin.totalPaid")}</p>
                          <p className="text-3xl font-bold dark:text-white">${formatNumber(stats?.totalPaid)}</p>
                        </div>
                        <div className="w-10 h-10 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center text-secondary dark:bg-secondary/20">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-success flex items-center dark:text-green-400">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          {stats?.paymentGrowth}% {t("dashboard.lastDays")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-gray-500 text-sm dark:text-gray-400">{t("admin.pendingWithdrawals")}</p>
                          <p className="text-3xl font-bold dark:text-white">${formatNumber(stats?.pendingWithdrawals)}</p>
                        </div>
                        <div className="w-10 h-10 bg-danger bg-opacity-10 rounded-full flex items-center justify-center text-danger dark:bg-danger/20">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm flex items-center dark:text-gray-300">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                          {stats?.pendingWithdrawalCount} {t("admin.withdrawalRequests")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Users and Withdrawals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Users */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>{t("admin.newUsers")}</CardTitle>
                      <Link href="#users">
                        <Button variant="link">{t("dashboard.viewAll")}</Button>
                      </Link>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {users.slice(0, 4).map((user: User) => (
                          <div key={user.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">
                                {user.fullName ? user.fullName.substring(0, 1) : user.username.substring(0, 1)}
                              </div>
                              <div>
                                <p className="font-medium dark:text-white">{user.fullName || user.username}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium dark:text-white">
                                {t("dashboard.balance")}: {formatCurrency(user.balance)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pending Withdrawals */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>{t("admin.withdrawalRequests")}</CardTitle>
                      <Link href="#withdrawals">
                        <Button variant="link">{t("dashboard.viewAll")}</Button>
                      </Link>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {withdrawals
                          .filter((w: Transaction) => w.status === "pending")
                          .slice(0, 3)
                          .map((withdrawal: Transaction) => (
                            <div key={withdrawal.id} className="p-3 border border-gray-200 rounded-lg dark:border-gray-700">
                              <div className="flex justify-between mb-2">
                                <p className="font-medium dark:text-white">
                                  {users.find((u: User) => u.id === withdrawal.userId)?.username || "Unknown"}
                                </p>
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                  {t("admin.pending")}
                                </Badge>
                              </div>
                              <div className="flex justify-between text-sm text-gray-500 mb-2 dark:text-gray-400">
                                <p>ID: W-{withdrawal.id}</p>
                                <p>{new Date(withdrawal.createdAt).toLocaleDateString()} {new Date(withdrawal.createdAt).toLocaleTimeString()}</p>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="font-bold dark:text-white">{formatCurrency(withdrawal.amount)}</p>
                                <div className="space-x-2">
                                  <Button
                                    onClick={() => approveWithdrawalMutation.mutate(withdrawal.id)}
                                    size="sm"
                                    className="bg-success text-white hover:bg-success/90"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg> 
                                    {t("admin.approve")}
                                  </Button>
                                  <Button
                                    onClick={() => rejectWithdrawalMutation.mutate(withdrawal.id)}
                                    size="sm"
                                    variant="destructive"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    {t("admin.reject")}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tariff Settings */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t("admin.tariffSettings")}</CardTitle>
                    <Button
                      onClick={handleSaveChanges}
                      disabled={updatePlansMutation.isPending}
                    >
                      {t("admin.saveChanges")}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {editedPlans.map((plan, index) => (
                        <div key={plan.id} className="border border-gray-200 rounded-xl p-4 dark:border-gray-700">
                          <h3 className="font-bold text-lg mb-3 dark:text-white">{plan.name}</h3>
                          <div className="space-y-4">
                            <div>
                              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                                {t("admin.minAmount")}
                              </Label>
                              <Input
                                type="number"
                                value={plan.minAmount}
                                onChange={(e) => handlePlanChange(index, 'minAmount', e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                                {t("admin.profitability")}
                              </Label>
                              <Input
                                type="number"
                                value={plan.dailyInterestRate}
                                onChange={(e) => handlePlanChange(index, 'dailyInterestRate', e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                                {t("admin.refBonus")}
                              </Label>
                              <Input
                                type="number"
                                value={plan.referralBonus}
                                step="0.1"
                                onChange={(e) => handlePlanChange(index, 'referralBonus', e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div className="flex items-center">
                              <Checkbox
                                id={`plan-active-${plan.id}`}
                                checked={plan.active}
                                onCheckedChange={(checked) => handlePlanChange(index, 'active', !!checked)}
                              />
                              <Label
                                htmlFor={`plan-active-${plan.id}`}
                                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                              >
                                {t("admin.active")}
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-8">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">
                  {t("admin.users")}
                </h1>

                <Card>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>{t("auth.username")}</TableHead>
                            <TableHead>{t("auth.email")}</TableHead>
                            <TableHead>{t("dashboard.balance")}</TableHead>
                            <TableHead>{t("dashboard.deposits")}</TableHead>
                            <TableHead>{t("dashboard.referrals")}</TableHead>
                            <TableHead>{t("dashboard.date")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user: any) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">
                                    {user.fullName ? user.fullName.substring(0, 1) : user.username.substring(0, 1)}
                                  </div>
                                  <div>
                                    <div className="font-medium dark:text-white">
                                      {user.username}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {user.fullName}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{formatCurrency(user.balance)}</TableCell>
                              <TableCell>{user.activeDeposits || 0}</TableCell>
                              <TableCell>{user.referralCount || 0}</TableCell>
                              <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Withdrawals Tab */}
              <TabsContent value="withdrawals" className="space-y-8">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">
                  {t("admin.withdrawals")}
                </h1>

                <Card>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>{t("auth.username")}</TableHead>
                            <TableHead>{t("dashboard.amount")}</TableHead>
                            <TableHead>{t("dashboard.date")}</TableHead>
                            <TableHead>{t("dashboard.status")}</TableHead>
                            <TableHead>{t("admin.approvalStatus")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {withdrawals.map((withdrawal: any) => {
                            const user = users.find((u: User) => u.id === withdrawal.userId);
                            return (
                              <TableRow key={withdrawal.id}>
                                <TableCell>W-{withdrawal.id}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">
                                      {user?.fullName ? user.fullName.substring(0, 1) : user?.username.substring(0, 1) || 'U'}
                                    </div>
                                    <div>
                                      <div className="font-medium dark:text-white">
                                        {user?.username || 'Unknown'}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {user?.email || 'Unknown'}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium dark:text-white">
                                  {formatCurrency(withdrawal.amount)}
                                </TableCell>
                                <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(withdrawal.createdAt).toLocaleDateString()} {new Date(withdrawal.createdAt).toLocaleTimeString()}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      withdrawal.status === "completed"
                                        ? "success"
                                        : withdrawal.status === "pending"
                                        ? "outline"
                                        : "destructive"
                                    }
                                  >
                                    {withdrawal.status === "completed"
                                      ? t("dashboard.completed")
                                      : withdrawal.status === "pending"
                                      ? t("admin.pending")
                                      : t("general.error")}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {withdrawal.status === "pending" ? (
                                    <div className="flex space-x-2">
                                      <Button
                                        onClick={() => approveWithdrawalMutation.mutate(withdrawal.id)}
                                        size="sm"
                                        className="bg-success text-white hover:bg-success/90"
                                      >
                                        {t("admin.approve")}
                                      </Button>
                                      <Button
                                        onClick={() => rejectWithdrawalMutation.mutate(withdrawal.id)}
                                        size="sm"
                                        variant="destructive"
                                      >
                                        {t("admin.reject")}
                                      </Button>
                                    </div>
                                  ) : (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      {withdrawal.status === "completed"
                                        ? t("dashboard.completed")
                                        : t("admin.reject")}
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-8">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">
                  {t("admin.contentManagement")}
                </h1>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("admin.contentManagement")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <Label className="font-medium mb-3 dark:text-white">
                          {t("admin.mainPageTitle")}
                        </Label>
                        <Input
                          value={t("hero.title")}
                          className="w-full dark:bg-gray-700"
                        />
                      </div>
                      
                      <div>
                        <Label className="font-medium mb-3 dark:text-white">
                          {t("admin.mainPageSubtitle")}
                        </Label>
                        <Input
                          value={t("hero.subtitle")}
                          className="w-full dark:bg-gray-700"
                        />
                      </div>
                      
                      <div>
                        <Label className="font-medium mb-3 dark:text-white">
                          {t("admin.statistics")}
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              {t("admin.totalUsers")}
                            </Label>
                            <Input
                              type="number"
                              value={stats?.totalUsers}
                              className="w-full dark:bg-gray-700"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              {t("admin.totalInvested")}
                            </Label>
                            <Input
                              type="number"
                              value={stats?.totalInvested}
                              className="w-full dark:bg-gray-700"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              {t("admin.totalPaid")}
                            </Label>
                            <Input
                              type="number"
                              value={stats?.totalPaid}
                              className="w-full dark:bg-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Button disabled>
                        {t("admin.saveChanges")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
