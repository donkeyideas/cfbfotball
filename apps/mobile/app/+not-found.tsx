import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to feed tab instead of showing an error screen
    router.replace('/(tabs)/feed');
  }, [router]);

  return null;
}
