import React, { useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";

function Auth({ onSignIn }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const authClient = await AuthClient.create();

      const isAuthenticated = await authClient.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        setPrincipal(identity.getPrincipal().toText());
        onSignIn(identity.getPrincipal().toText());
      } else {
        authClient.login({
          identityProvider: process.env.II_CANISTER_URL || "https://identity.ic0.app", // II URL
          onSuccess: async () => {
            const identity = authClient.getIdentity();
            setPrincipal(identity.getPrincipal().toText());
            setIsAuthenticated(true);
            onSignIn(identity.getPrincipal().toText());
          },
        });
      }
    };

    initAuth();
  }, [onSignIn]);

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome! Your Principal ID: {principal}</p>
      ) : (
        <p>Signing in...</p>
      )}
    </div>
  );
}

export default Auth;
