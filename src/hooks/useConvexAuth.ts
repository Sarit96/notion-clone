import { useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";

/**
 * Custom hook that combines Clerk and Convex authentication
 * This ensures that Convex authentication is properly synced with Clerk
 */
export function useAuth() {
  const { isSignedIn, user } = useUser();
  const { isLoading, isAuthenticated } = useConvexAuth();

  // You can add additional logic here if needed
  // For example, you could check if the user has specific roles or permissions

  return {
    isSignedIn,
    isAuthenticated,
    isLoading,
    user,
  };
} 