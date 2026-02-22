import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import api from "@/lib/api";

const ProtectedRoute = () => {
  const token = localStorage.getItem("auth_token");
  const location = useLocation();
  const [checking, setChecking] = useState(!!token);
  const [valid, setValid] = useState<boolean | null>(token ? null : false);

  useEffect(() => {
    if (!token) {
      setValid(false);
      setChecking(false);
      return;
    }

    let cancelled = false;

    const validate = async () => {
      try {
        await api.get("/auth/users");
        if (!cancelled) {
          setValid(true);
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem("auth_token");
          setValid(false);
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    };

    validate();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-stone-100/80 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-500">A verificar sessão...</p>
        </div>
      </div>
    );
  }

  if (valid === false) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
