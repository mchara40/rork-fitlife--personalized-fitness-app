import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Not Found",
          headerStyle: {
            backgroundColor: Colors.backgroundCard,
          },
          headerTintColor: Colors.text,
        }} 
      />
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.background, Colors.backgroundLight]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.subtitle}>This screen doesn&apos;t exist.</Text>

        <Link href="/" style={styles.link}>
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.linkGradient}
          >
            <Text style={styles.linkText}>Go to Home</Text>
          </LinearGradient>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  link: {
    borderRadius: 16,
    overflow: "hidden",
  },
  linkGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.white,
  },
});
