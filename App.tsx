import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import WarehouseDashboard from './src/screens/WarehouseDashboard';
import IndustryDashboard from './src/screens/IndustryDashboard';
import SackDetailsScreen from './src/screens/SackDetailsScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import QRScannerMock from './src/components/QRScannerMock';

// Data
import { initialSensorReading } from './src/data/mockData';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Navigation & Role states
  const [userRole, setUserRole] = useState<'login' | 'warehouse' | 'industry'>('login');
  const [activeScreen, setActiveScreen] = useState<'dashboard' | 'scanner' | 'sack-detail' | 'analytics'>('dashboard');
  const [selectedSackId, setSelectedSackId] = useState<string>('SACK-20681');

  // Simulated IoT Hardware state (ESP32 node feeds)
  const [temperature, setTemperature] = useState<number>(initialSensorReading.temperature);
  const [humidity, setHumidity] = useState<number>(initialSensorReading.humidity);
  const [moisture, setMoisture] = useState<number>(initialSensorReading.moisture);
  const [co2, setCo2] = useState<number>(initialSensorReading.co2);
  const [pestInfestation, setPestInfestation] = useState<boolean>(false);

  const handleTelemetryChange = (key: string, value: any) => {
    switch (key) {
      case 'temperature':
        setTemperature(value);
        break;
      case 'humidity':
        setHumidity(value);
        break;
      case 'moisture':
        setMoisture(value);
        break;
      case 'co2':
        setCo2(value);
        break;
      case 'pestInfestation':
        setPestInfestation(value);
        break;
    }
  };

  const handleSelectRole = (role: 'warehouse' | 'industry') => {
    setUserRole(role);
    setActiveScreen('dashboard');
  };

  const handleLogout = () => {
    setUserRole('login');
    setActiveScreen('dashboard');
  };

  const handleScanSack = (sackId: string) => {
    setSelectedSackId(sackId);
    setActiveScreen('sack-detail');
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E293B' }]}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Role Selection / Login Onboarding */}
      {userRole === 'login' && (
        <LoginScreen onSelectRole={handleSelectRole} />
      )}

      {/* Warehouse Owner flow */}
      {userRole === 'warehouse' && (
        <>
          {activeScreen === 'dashboard' && (
            <WarehouseDashboard
              temperature={temperature}
              humidity={humidity}
              moisture={moisture}
              co2={co2}
              pestInfestation={pestInfestation}
              onTelemetryChange={handleTelemetryChange}
              onOpenScanner={() => setActiveScreen('scanner')}
              onNavigateToAnalytics={() => setActiveScreen('analytics')}
              onLogout={handleLogout}
            />
          )}

          {activeScreen === 'scanner' && (
            <View style={styles.fullscreenOverlay}>
              <QRScannerMock
                onScan={handleScanSack}
                onClose={() => setActiveScreen('dashboard')}
              />
            </View>
          )}

          {activeScreen === 'sack-detail' && (
            <SackDetailsScreen
              sackId={selectedSackId}
              onBack={() => setActiveScreen('dashboard')}
            />
          )}

          {activeScreen === 'analytics' && (
            <AnalyticsScreen
              onBack={() => setActiveScreen('dashboard')}
            />
          )}
        </>
      )}

      {/* Industry Buyer flow */}
      {userRole === 'industry' && (
        <>
          {activeScreen === 'dashboard' && (
            <IndustryDashboard
              currentTemp={temperature}
              currentHum={humidity}
              currentMoist={moisture}
              currentCO2={co2}
              pestInfestation={pestInfestation}
              onLogout={handleLogout}
            />
          )}

          {activeScreen === 'scanner' && (
            <View style={styles.fullscreenOverlay}>
              <QRScannerMock
                onScan={handleScanSack}
                onClose={() => setActiveScreen('dashboard')}
              />
            </View>
          )}

          {activeScreen === 'sack-detail' && (
            <SackDetailsScreen
              sackId={selectedSackId}
              onBack={() => setActiveScreen('dashboard')}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    padding: 16,
  },
});
