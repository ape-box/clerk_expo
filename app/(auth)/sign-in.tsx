import { useState, useEffect, useCallback } from "react";
import { Text, View, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useSSO } from "@clerk/clerk-expo";
import { AntDesign } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  useWarmUpBrowser();
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState(false);

  const onGoogleSignIn = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const baseRedirectUri = AuthSession.makeRedirectUri();
      const result = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: baseRedirectUri,
      });

      const { createdSessionId, setActive } = result;

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error(`Error in SSO flow for oauth_google:`, err);
    } finally {
      setLoading(false);
    }
  }, [startSSOFlow, loading, router]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <TouchableOpacity
            style={styles.oauthButton}
            onPress={onGoogleSignIn}
            disabled={loading}
          >
            <View style={styles.oauthButtonContent}>
              <AntDesign name="google" size={20} color="#DB4437" />
              <Text style={styles.oauthButtonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  keyboardAvoid: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 32,
    textAlign: "center",
  },
  oauthButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  oauthButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  oauthButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginLeft: 12,
  }
});
