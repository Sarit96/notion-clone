import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_CONVEX_URL: string;
      REACT_APP_CLERK_PUBLISHABLE_KEY: string;
    }
  }
}

const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
