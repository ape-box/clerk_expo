import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useUser, useSession, getClerkInstance } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from "react";

export default function Index() {
  const { isLoaded, signOut } = useAuth();
  const { session } = useSession();
  const router = useRouter();
  const [jwt, setJwt] = useState<string | null | undefined>(undefined);
  const [claims, setClaims] = useState<any>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const clerkInstance = getClerkInstance();
        const token = await clerkInstance.session?.getToken();
        setJwt(token);

        if (token) {
          const parts = token.split('.');
          if (parts.length === 3) {
            const decodedClaims = JSON.parse(atob(parts[1]));
            setClaims(decodedClaims);
          }
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    if (isLoaded && session) {
      fetchToken();
    }
  }, [isLoaded, session]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)');
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Extracted Claims</Text>
          <View style={styles.tokenContainer}>
            {claims ? (
              <Text style={styles.claimsText} selectable={true}>
                {JSON.stringify(claims, null, 2)}
              </Text>
            ) : (
              <Text style={styles.noDataText}>No claims extracted</Text>
            )}
          </View>
        </View>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Raw JWT Token</Text>
          <View style={styles.tokenContainer}>
            {jwt ? (
              <Text style={styles.tokenText} selectable={true}>{jwt}</Text>
            ) : (
              <Text style={styles.noDataText}>No JWT token available</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.signOutContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <View style={styles.settingIconContainer}>
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  box: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  tokenContainer: {
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    padding: 12,
    minHeight: 100,
  },
  tokenText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#374151",
    lineHeight: 18,
  },
  claimsText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#374151",
    lineHeight: 18,
  },
  noDataText: {
    color: "#6b7280",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 12,
  },
  signOutContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ef4444",
  },
});
