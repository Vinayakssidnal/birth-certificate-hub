import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";
import AppLayout from "@/components/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import HospitalDashboard from "./pages/HospitalDashboard";
import RegistrarDashboard from "./pages/RegistrarDashboard";
import VerifyCertificate from "./pages/VerifyCertificate";
import BlockchainExplorer from "./pages/BlockchainExplorer";
import ActivityLog from "./pages/ActivityLog";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <StoreProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hospital" element={
                  <ProtectedRoute allowedRoles={["hospital"]}>
                    <HospitalDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/registrar" element={
                  <ProtectedRoute allowedRoles={["registrar"]}>
                    <RegistrarDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/verify" element={<VerifyCertificate />} />
                <Route path="/explorer" element={<BlockchainExplorer />} />
                <Route path="/activity" element={<ActivityLog />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </StoreProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
