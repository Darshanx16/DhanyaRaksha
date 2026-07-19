import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Landmark, Briefcase, ChevronRight, Sprout } from 'lucide-react-native';

interface LoginScreenProps {
  onSelectRole: (role: 'warehouse' | 'industry') => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSelectRole }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          {/* Top Decorative App Brand */}
          <View style={styles.brandBox}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>DhānyaRakṣa AI</Text>
            <Text style={styles.tagline}>Smart Grain Storage & AI Industry Marketplace</Text>
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeBox}>
            <Text style={styles.welcomeTitle}>Choose Your Workspace</Text>
            <Text style={styles.welcomeDesc}>
              Log in to view live warehouse telemetry, run insect computer-vision scans, or connect with grain buyers.
            </Text>
          </View>

          {/* Role Options */}
          <View style={styles.roleCardContainer}>
            {/* Warehouse Owner / Farmer Option */}
            <TouchableOpacity
              style={[styles.roleCard, styles.warehouseCard]}
              onPress={() => onSelectRole('warehouse')}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.iconFrame, { backgroundColor: '#E8F5E9' }]}>
                  <Landmark size={24} color="#2E7D32" />
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>Warehouse Owner / Farmer</Text>
                  <Text style={styles.cardDesc}>
                    Monitor silos, track moisture levels, predict shelf life, and scan sacks.
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Industry Buyer Option */}
            <TouchableOpacity
              style={[styles.roleCard, styles.industryCard]}
              onPress={() => onSelectRole('industry')}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.iconFrame, { backgroundColor: '#FFF9C4' }]}>
                  <Briefcase size={24} color="#F9A825" />
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>Food Industry Buyer</Text>
                  <Text style={styles.cardDesc}>
                    Search regional stock, filter grains by moisture/grade, and match requirements.
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by ESP32 Controller & Edge AI Analytics</Text>
          <Text style={styles.footerVersion}>v1.0.0 (Expo SDK 57)</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E293B', // Sleek slate dark background
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  brandBox: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  appName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tagline: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'center',
  },
  welcomeBox: {
    marginVertical: 10,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#F8FAFC',
    textAlign: 'center',
  },
  welcomeDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    paddingHorizontal: 12,
  },
  roleCardContainer: {
    gap: 16,
    marginVertical: 20,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  warehouseCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#2E7D32',
  },
  industryCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#F9A825',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconFrame: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#0F172A',
  },
  cardDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#64748B',
    lineHeight: 14,
    marginTop: 3,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: '#64748B',
  },
  footerVersion: {
    fontFamily: 'Inter_400Regular',
    fontSize: 9,
    color: '#475569',
    marginTop: 2,
  },
});
export default LoginScreen;
