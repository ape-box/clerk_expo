import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

const TabsLayout = () => {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs screenOptions={{
      headerShown: false, // Hide the header
      tabBarStyle: { display: 'none' } // Hide the bottom tab bar
    }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false, // Ensure header is hidden for index specifically
          title: "" // Remove the title that shows "index"
        }}
      />
    </Tabs>  )
}

export default TabsLayout
