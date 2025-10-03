import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FitnessContext } from "@/contexts/FitnessContext";
import { AuthContext } from "@/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="workout/[id]" 
        options={{ 
          headerShown: true,
          title: "Workout",
          presentation: "card"
        }} 
      />
      <Stack.Screen 
        name="program/[id]" 
        options={{ 
          headerShown: true,
          title: "Program",
          presentation: "card"
        }} 
      />
      <Stack.Screen 
        name="exercise-log" 
        options={{ 
          presentation: "modal",
          headerShown: true,
          title: "Log Exercise"
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext>
        <FitnessContext>
          <GestureHandlerRootView>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </FitnessContext>
      </AuthContext>
    </QueryClientProvider>
  );
}
