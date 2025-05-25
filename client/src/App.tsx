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
  // Temporarily simplify routing for troubleshooting
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Импортируем все необходимые провайдеры
import { AuthProvider } from "@/hooks/use-auth";
import { LanguageProvider } from "@/contexts/LanguageContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
