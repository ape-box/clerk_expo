import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo'

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href={'/(tabs)'} />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Welcome', headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ title: 'Sign In', headerShown: false }} />
    </Stack>
  );
}
