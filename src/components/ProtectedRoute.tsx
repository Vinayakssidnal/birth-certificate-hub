import { useAuth, type UserRole } from "@/lib/auth";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated || !role) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center rounded-xl border border-border bg-card p-8 shadow-card">
        <h2 className="text-xl font-bold text-foreground mb-2">Authentication Required</h2>
        <p className="text-sm text-muted-foreground font-body mb-4">
          Please connect your wallet and login to access this page.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  if (!allowedRoles.includes(role)) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center rounded-xl border border-destructive/20 bg-destructive/5 p-8">
        <h2 className="text-xl font-bold text-destructive mb-2">Access Denied</h2>
        <p className="text-sm text-muted-foreground font-body">
          Your role (<span className="font-medium capitalize">{role}</span>) does not have permission to access this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
