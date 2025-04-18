import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function OAuthCallbackScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        if (!isLoaded) {
          return;
        }

        if (isSignedIn) {
          router.replace('/(tabs)');
        } else {
          if (__DEV__ && Object.keys(params).length > 0) {
            setTimeout(() => {
              if (isSignedIn) {
                router.replace('/(tabs)');
              } else {
                router.replace('/sign-in');
              }
            }, 2000);
          } else {
            router.replace('/sign-in');
          }
        }
      } catch (error) {
        router.replace('/sign-in');
      }
    };

    handleOAuthCallback();
  }, [isLoaded, isSignedIn, router, params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});
