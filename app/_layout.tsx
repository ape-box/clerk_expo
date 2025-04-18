import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { useSegments, useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { tokenCache } from "@/src/utils/tokenCache";

function useProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoaded || isRedirecting) return;

    const inAuthGroup = segments[0] === "(auth)";
    if (!isSignedIn && !inAuthGroup) {
      setIsRedirecting(true);
      router.replace("/(auth)/sign-in");
    }
    else if (isSignedIn && inAuthGroup) {
      setIsRedirecting(true);
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, segments, router, isRedirecting]);

  return { isLoaded };
}

function RootLayoutNav() {
  const { isLoaded } = useProtectedRoute();

  if (!isLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>  );
}

export default function RootLayout() {
  const publishableKey = Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY ||
                         process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing Clerk publishable key. Add it to app.json or .env file.");
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootLayoutNav />
    </ClerkProvider>
  );
}
