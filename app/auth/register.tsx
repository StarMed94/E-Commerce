import { View, Text, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthStore();

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('خطأ', 'كلمتا المرور غير متطابقتان');
      return;
    }

    if (password.length < 6) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون على الأقل 6 أحرف');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);

    if (error) {
      Alert.alert('خطأ في إنشاء الحساب', error);
    } else {
      Alert.alert(
        'تم إنشاء الحساب بنجاح',
        'يمكنك الآن تسجيل الدخول',
        [{ text: 'موافق', onPress: () => router.replace('/auth/login') }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>إنشاء حساب جديد</Text>
        <Text style={styles.subtitle}>أدخل بياناتك لإنشاء حساب جديد</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="الاسم الكامل"
          value={fullName}
          onChangeText={setFullName}
          placeholder="أدخل اسمك الكامل"
        />

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

        <Input
          label="تأكيد كلمة المرور"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="أعد إدخال كلمة المرور"
        />

        <Button
          onPress={handleRegister}
          loading={loading}
          size="lg"
        >
          إنشاء الحساب
        </Button>

        <View style={styles.footer}>
          <Text style={styles.footerText}>لديك حساب بالفعل؟</Text>
          <Button
            onPress={() => router.push('/auth/login')}
            variant="outline"
          >
            تسجيل الدخول
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
