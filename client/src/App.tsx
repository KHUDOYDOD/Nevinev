import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DashboardIndex from "@/pages/dashboard/index";
import DashboardDeposits from "@/pages/dashboard/deposits";
import DashboardTransactions from "@/pages/dashboard/transactions";
import DashboardCalculator from "@/pages/dashboard/calculator";
import DashboardReferral from "@/pages/dashboard/referral";
import DashboardSettings from "@/pages/dashboard/settings";
import AdminIndex from "@/pages/admin/index";
import AdminUsers from "@/pages/admin/users";
import AdminDeposits from "@/pages/admin/deposits";
import AdminWithdrawals from "@/pages/admin/withdrawals";
import AdminTariffs from "@/pages/admin/tariffs";
import AdminContent from "@/pages/admin/content";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

import '@/lib/i18n';

function Router() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (!isLoading && user && (location === "/login" || location === "/register")) {
      setLocation("/dashboard");
    }
  }, [user, isLoading, location, setLocation]);

  // Public routes
  if (!user && !isLoading) {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard">
          <Redirect to="/login" />
        </Route>
        <Route path="/admin">
          <Redirect to="/login" />
        </Route>
        <Route component={NotFound} />
      </Switch>
    );
  }

  // User authenticated routes
  if (user && user.role === "user") {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={DashboardIndex} />
        <Route path="/dashboard/deposits" component={DashboardDeposits} />
        <Route path="/dashboard/transactions" component={DashboardTransactions} />
        <Route path="/dashboard/calculator" component={DashboardCalculator} />
        <Route path="/dashboard/referral" component={DashboardReferral} />
        <Route path="/dashboard/settings" component={DashboardSettings} />
        <Route path="/admin">
          <Redirect to="/dashboard" />
        </Route>
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Admin authenticated routes
  if (user && user.role === "admin") {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={DashboardIndex} />
        <Route path="/dashboard/deposits" component={DashboardDeposits} />
        <Route path="/dashboard/transactions" component={DashboardTransactions} />
        <Route path="/dashboard/calculator" component={DashboardCalculator} />
        <Route path="/dashboard/referral" component={DashboardReferral} />
        <Route path="/dashboard/settings" component={DashboardSettings} />
        <Route path="/admin" component={AdminIndex} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/admin/deposits" component={AdminDeposits} />
        <Route path="/admin/withdrawals" component={AdminWithdrawals} />
        <Route path="/admin/tariffs" component={AdminTariffs} />
        <Route path="/admin/content" component={AdminContent} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Loading state
  return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
}

import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
