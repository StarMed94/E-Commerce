import { View, Text, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('خطأ في تسجيل الدخول', error);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>تسجيل الدخول</Text>
        <Text style={styles.subtitle}>أدخل بياناتك للوصول إلى حسابك</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="البريد الإلكتروني"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="example@email.com"
        />

        <Input
          label="كلمة المرور"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="أدخل كلمة المرور"
        />

        <Button
          onPress={handleLogin}
          loading={loading}
          size="lg"
        >
          تسجيل الدخول
        </Button>

        <View style={styles.footer}>
          <Text style={styles.footerText}>ليس لديك حساب؟</Text>
          <Button
            onPress={() => router.push('/auth/register')}
            variant="outline"
          >
            إنشاء حساب جديد
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#3B82F6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
  },
  form: {
    padding: 20,
    marginTop: 20,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
