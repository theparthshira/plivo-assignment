import * as React from "react";
import { Spinner } from "../components/spinner";
import { ClerkProvider } from "@clerk/clerk-react";
import { Provider } from "react-redux";
import { persistor, store } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";

type AppProviderProps = {
  children: React.ReactNode;
};

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
            {children}
          </ClerkProvider>
        </PersistGate>
      </Provider>
    </React.Suspense>
  );
};
