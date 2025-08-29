import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { router } from 'expo-router';
import { User, Settings, ShoppingBag, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تسجيل الخروج', style: 'destructive', onPress: signOut },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>مرحباً بك</Text>
        <Text style={styles.loginText}>يرجى تسجيل الدخول للوصول إلى حسابك</Text>
        
        <View style={styles.authButtons}>
          <Button onPress={() => router.push('/auth/login')} size="lg">
            تسجيل الدخول
          </Button>
          <Button 
            onPress={() => router.push('/auth/register')} 
            variant="outline" 
            size="lg"
          >
            إنشاء حساب جديد
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <User size={40} color="#FFFFFF" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{profile?.full_name || 'المستخدم'}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/profile/edit')}
        >
          <Settings size={24} color="#6B7280" />
          <Text style={styles.menuText}>تعديل الملف الشخصي</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/orders')}
        >
          <ShoppingBag size={24} color="#6B7280" />
          <Text style={styles.menuText}>طلباتي</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, styles.signOutItem]}
          onPress={handleSignOut}
        >
          <LogOut size={24} color="#EF4444" />
          <Text style={[styles.menuText, styles.signOutText]}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  authButtons: {
    width: '100%',
    gap: 12,
  },
  header: {
    backgroundColor: '#3B82F6',
    padding: 20,
    paddingTop: 60,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'right',
  },
  userEmail: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'right',
  },
  menuContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
    textAlign: 'right',
  },
  signOutItem: {
    marginTop: 20,
  },
  signOutText: {
    color: '#EF4444',
  },
});
