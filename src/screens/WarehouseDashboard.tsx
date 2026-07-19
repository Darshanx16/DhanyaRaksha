import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { Bell, Mail, Landmark, TrendingUp, Compass, Scan, Sparkles, CheckCircle2, ShieldAlert, Thermometer, Droplet, Wind } from 'lucide-react-native';
import CustomChart from '../components/CustomChart';
import { TelemetryControl } from '../components/TelemetryControl';
import DigitalTwin from '../components/DigitalTwin';
import { mockStocks, mockAlerts, mockSacks } from '../data/mockData';
import { AlertMessage } from '../types';

interface WarehouseDashboardProps {
  temperature: number;
  humidity: number;
  moisture: number;
  co2: number;
  pestInfestation: boolean;
  onTelemetryChange: (key: string, value: any) => void;
  onOpenScanner: () => void;
  onNavigateToAnalytics: () => void;
  onLogout: () => void;
}

export const WarehouseDashboard: React.FC<WarehouseDashboardProps> = ({
  temperature,
  humidity,
  moisture,
  co2,
  pestInfestation,
  onTelemetryChange,
  onOpenScanner,
  onNavigateToAnalytics,
  onLogout,
}) => {
  const [activeAlerts, setActiveAlerts] = useState<AlertMessage[]>(mockAlerts);
  const [showDigitalTwin, setShowDigitalTwin] = useState(false);

  // Dynamic alert generator that triggers when telemetry values cross thresholds
  useEffect(() => {
    let updatedAlerts = [...activeAlerts];

    // 1. Humidity alert (> 70)
    const humAlertIdx = updatedAlerts.findIndex((a) => a.id === 'SIM-ALERT-HUM');
    if (humidity > 70) {
      if (humAlertIdx === -1) {
        updatedAlerts.unshift({
          id: 'SIM-ALERT-HUM',
          type: 'danger',
          title: '⚠ High Humidity Detected',
          message: `Humidity is ${humidity}% RH. Mold growth hazard high.`,
          timestamp: 'Just now',
          resolved: false,
          recommendedAction: 'Start ventilation fan relay now.',
        });
      }
    } else if (humAlertIdx !== -1) {
      updatedAlerts = updatedAlerts.filter((a) => a.id !== 'SIM-ALERT-HUM');
    }

    // 2. Temperature alert (> 35)
    const tempAlertIdx = updatedAlerts.findIndex((a) => a.id === 'SIM-ALERT-TEMP');
    if (temperature > 35) {
      if (tempAlertIdx === -1) {
        updatedAlerts.unshift({
          id: 'SIM-ALERT-TEMP',
          type: 'warning',
          title: '⚠ Critical Temp Rising',
          message: `Sensor MQ135 temp is ${temperature}°C. Possible fungal growth risk.`,
          timestamp: 'Just now',
          resolved: false,
          recommendedAction: 'Verify cooling vent shutter configuration.',
        });
      }
    } else if (tempAlertIdx !== -1) {
      updatedAlerts = updatedAlerts.filter((a) => a.id !== 'SIM-ALERT-TEMP');
    }

    // 3. Moisture leakage alert (> 13.5)
    const moistAlertIdx = updatedAlerts.findIndex((a) => a.id === 'SIM-ALERT-MOIST');
    if (moisture > 13.5) {
      if (moistAlertIdx === -1) {
        updatedAlerts.unshift({
          id: 'SIM-ALERT-MOIST',
          type: 'danger',
          title: '⚠ Moisture Level Alert',
          message: `Moisture level is ${moisture}%. Water leakage risk detected.`,
          timestamp: 'Just now',
          resolved: false,
          recommendedAction: 'Inspect Section D floor seals and dry incoming stocks.',
        });
      }
    } else if (moistAlertIdx !== -1) {
      updatedAlerts = updatedAlerts.filter((a) => a.id !== 'SIM-ALERT-MOIST');
    }

    // 4. Gas Fermentation alert (> 800)
    const gasAlertIdx = updatedAlerts.findIndex((a) => a.id === 'SIM-ALERT-GAS');
    if (co2 > 800) {
      if (gasAlertIdx === -1) {
        updatedAlerts.unshift({
          id: 'SIM-ALERT-GAS',
          type: 'danger',
          title: '⚠ Fermentation Detected',
          message: `CO₂ level is ${co2} ppm. Grain degradation started.`,
          timestamp: 'Just now',
          resolved: false,
          recommendedAction: 'Start high-speed exhaust extraction fans.',
        });
      }
    } else if (gasAlertIdx !== -1) {
      updatedAlerts = updatedAlerts.filter((a) => a.id !== 'SIM-ALERT-GAS');
    }

    // 5. Insect pest alert (Pest infestation true)
    const pestAlertIdx = updatedAlerts.findIndex((a) => a.id === 'SIM-ALERT-PEST');
    if (pestInfestation) {
      if (pestAlertIdx === -1) {
        updatedAlerts.unshift({
          id: 'SIM-ALERT-PEST',
          type: 'danger',
          title: '🐜 Pest Infestation Detected',
          message: 'AI Camera detects active insects in Wheat storage zone.',
          timestamp: 'Just now',
          resolved: false,
          recommendedAction: 'Isolate grains and queue fumigation.',
        });
      }
    } else if (pestAlertIdx !== -1) {
      updatedAlerts = updatedAlerts.filter((a) => a.id !== 'SIM-ALERT-PEST');
    }

    setActiveAlerts(updatedAlerts);
  }, [temperature, humidity, moisture, co2, pestInfestation]);

  // Spark-chart mock historical data
  const tempHistory = [26.0, 26.2, 26.5, 27.0, 27.2, 27.6];
  const humHistory = [58.0, 59.5, 60.2, 61.0, 61.8, 62.0];
  const moistHistory = [11.2, 11.3, 11.5, 11.6, 11.7, 11.8];
  const co2History = [390, 400, 405, 412, 418, 420];

  const getMetricStatus = (val: number, warnLimit: number, dangerLimit: number) => {
    if (val >= dangerLimit) return { label: 'Danger', color: '#DC2626', bg: '#FEE2E2' };
    if (val >= warnLimit) return { label: 'Warning', color: '#D97706', bg: '#FEF3C7' };
    return { label: 'Normal', color: '#16A34A', bg: '#DCFCE7' };
  };

  const tempStatus = getMetricStatus(temperature, 32, 35);
  const humStatus = getMetricStatus(humidity, 65, 70);
  const moistStatus = getMetricStatus(moisture, 12, 13.5);
  const co2Status = getMetricStatus(co2, 600, 800);

  // Dynamic Spoilage risk prediction calculation
  const calculatedRisk = Math.min(100, Math.round(
    (temperature > 30 ? (temperature - 30) * 4 : 0) +
    (humidity > 60 ? (humidity - 60) * 3 : 0) +
    (moisture > 11 ? (moisture - 11) * 12 : 0) +
    (co2 > 500 ? (co2 - 500) * 0.08 : 0) +
    (pestInfestation ? 40 : 0)
  ));

  const calculatedShelfLife = Math.max(2, Math.round(45 - (calculatedRisk / 2.5)));

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Landmark size={20} color="#2E7D32" />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.headerTitle}>DhānyaRakṣa AI</Text>
            <Text style={styles.headerSubtitle}>Coimbatore Godown-3</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <View style={styles.badge} />
            <Bell size={18} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileBtn} onPress={onLogout}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>RK</Text>
            </View>
            <View style={styles.profileTextCol}>
              <Text style={styles.profileName}>Ravi Kumar</Text>
              <Text style={styles.profileRole}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Dynamic Action Buttons Grid */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#E8F5E9' }]} onPress={onOpenScanner}>
            <Scan size={22} color="#2E7D32" />
            <Text style={styles.actionLabel}>Scan Grain Sack</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#E1F5FE' }]}
            onPress={() => setShowDigitalTwin(true)}
          >
            <Compass size={22} color="#0288D1" />
            <Text style={styles.actionLabel}>Digital Twin Map</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#F3E5F5' }]} onPress={onNavigateToAnalytics}>
            <TrendingUp size={22} color="#7B1FA2" />
            <Text style={styles.actionLabel}>System Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Live Telemetry Card Grid */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>ESP32 Telemetry (Live)</Text>
          <View style={styles.pulseContainer}>
            <View style={styles.pulsePoint} />
            <Text style={styles.liveLabel}>LIVE</Text>
          </View>
        </View>

        <View style={styles.telemetryGrid}>
          {/* Temperature */}
          <View style={styles.telemetryCard}>
            <View style={styles.cardHeader}>
              <View style={styles.labelGroup}>
                <Thermometer size={14} color="#D32F2F" />
                <Text style={styles.cardLabel}>Temperature</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: tempStatus.bg }]}>
                <Text style={[styles.statusBadgeText, { color: tempStatus.color }]}>{tempStatus.label}</Text>
              </View>
            </View>
            <Text style={styles.cardVal}>{temperature.toFixed(1)}°C</Text>
            <CustomChart data={[...tempHistory.slice(0, 5), temperature]} color="#EF4444" height={35} width={135} />
          </View>

          {/* Humidity */}
          <View style={styles.telemetryCard}>
            <View style={styles.cardHeader}>
              <View style={styles.labelGroup}>
                <Droplet size={14} color="#0D74CE" />
                <Text style={styles.cardLabel}>Humidity</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: humStatus.bg }]}>
                <Text style={[styles.statusBadgeText, { color: humStatus.color }]}>{humStatus.label}</Text>
              </View>
            </View>
            <Text style={styles.cardVal}>{humidity.toFixed(0)}% RH</Text>
            <CustomChart data={[...humHistory.slice(0, 5), humidity]} color="#3B82F6" height={35} width={135} />
          </View>

          {/* Moisture */}
          <View style={styles.telemetryCard}>
            <View style={styles.cardHeader}>
              <View style={styles.labelGroup}>
                <Droplet size={14} color="#F9A825" />
                <Text style={styles.cardLabel}>Moisture Level</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: moistStatus.bg }]}>
                <Text style={[styles.statusBadgeText, { color: moistStatus.color }]}>{moistStatus.label}</Text>
              </View>
            </View>
            <Text style={styles.cardVal}>{moisture.toFixed(1)}%</Text>
            <CustomChart data={[...moistHistory.slice(0, 5), moisture]} color="#F59E0B" height={35} width={135} />
          </View>

          {/* Air Quality */}
          <View style={styles.telemetryCard}>
            <View style={styles.cardHeader}>
              <View style={styles.labelGroup}>
                <Wind size={14} color="#7C3AED" />
                <Text style={styles.cardLabel}>CO₂ (Carbon)</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: co2Status.bg }]}>
                <Text style={[styles.statusBadgeText, { color: co2Status.color }]}>{co2Status.label}</Text>
              </View>
            </View>
            <Text style={styles.cardVal}>{co2} ppm</Text>
            <CustomChart data={[...co2History.slice(0, 5), co2]} color="#8B5CF6" height={35} width={135} />
          </View>
        </View>

        {/* AI Prediction Cards */}
        <View style={styles.spoilageCard}>
          <View style={styles.spoilageLeft}>
            <Sparkles size={20} color="#D97706" />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.spoilageTitle}>Edge-AI Spoilage Risk Predictor</Text>
              <Text style={styles.spoilageDesc}>
                Analyzing temperature gradients and carbon ferment rates.
              </Text>
            </View>
          </View>
          <View style={styles.spoilageRow}>
            <View style={styles.spoilageMetric}>
              <Text style={styles.spoilageLabel}>Spolage Risk (5 Days)</Text>
              <Text
                style={[
                  styles.spoilageVal,
                  { color: calculatedRisk > 50 ? '#DC2626' : calculatedRisk > 20 ? '#D97706' : '#16A34A' },
                ]}
              >
                {calculatedRisk}%
              </Text>
            </View>
            <View style={styles.spoilageDivider} />
            <View style={styles.spoilageMetric}>
              <Text style={styles.spoilageLabel}>Est. Remaining Shelf Life</Text>
              <Text style={[styles.spoilageVal, { color: '#2E7D32' }]}>{calculatedShelfLife} Days</Text>
            </View>
          </View>
        </View>

        {/* Dynamic Telemetry controller (ESP32 hardware console) */}
        <TelemetryControl
          temperature={temperature}
          humidity={humidity}
          moisture={moisture}
          co2={co2}
          pestInfestation={pestInfestation}
          onChange={onTelemetryChange}
        />

        {/* Shelf Life Countdown Bars */}
        <View style={styles.shelfLifeBox}>
          <Text style={styles.boxTitle}>Crop Shelf Life Predictions</Text>
          {mockStocks.map((stock) => {
            // Apply a modifier to the displayed shelf life based on current risk
            let displayLife = stock.shelfLifeDays;
            if (stock.grainType === 'Maize') {
              displayLife = calculatedShelfLife;
            }
            const percent = Math.min(100, (displayLife / 60) * 100);
            const barColor = displayLife > 30 ? '#10B981' : displayLife > 15 ? '#F59E0B' : '#EF4444';

            return (
              <View key={stock.id} style={styles.shelfLifeRow}>
                <View style={styles.shelfLifeLabelRow}>
                  <Text style={styles.shelfLifeCrop}>{stock.grainType} ({stock.grade})</Text>
                  <Text style={styles.shelfLifeDays}>{displayLife} days safe</Text>
                </View>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: barColor }]} />
                </View>
              </View>
            );
          })}
        </View>

        {/* Recent Alerts Feed */}
        <View style={styles.alertsBox}>
          <Text style={styles.boxTitle}>Recent System Alerts</Text>
          {activeAlerts.length === 0 ? (
            <View style={styles.noAlerts}>
              <CheckCircle2 size={16} color="#16A34A" />
              <Text style={styles.noAlertsText}>All sensors functioning within safety parameters.</Text>
            </View>
          ) : (
            activeAlerts.map((alert) => (
              <View
                key={alert.id}
                style={[
                  styles.alertCard,
                  alert.type === 'danger' ? styles.alertDanger : styles.alertWarning,
                ]}
              >
                <View style={styles.alertHeader}>
                  <Text
                    style={[
                      styles.alertTitleText,
                      { color: alert.type === 'danger' ? '#991B1B' : '#92400E' },
                    ]}
                  >
                    {alert.title}
                  </Text>
                  <Text style={styles.alertTime}>{alert.timestamp}</Text>
                </View>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertAction}>💡 Recommended: {alert.recommendedAction}</Text>
              </View>
            ))
          )}
        </View>

        {/* Revenue Overview Section */}
        <View style={styles.revenueBox}>
          <Text style={styles.boxTitle}>Financial Analytics (FCI & Trade)</Text>
          <View style={styles.revenueSummary}>
            <View>
              <Text style={styles.revLabel}>Total Revenue</Text>
              <Text style={styles.revVal}>₹ 3,45,600</Text>
            </View>
            <View style={styles.revStatBadge}>
              <TrendingUp size={12} color="#16A34A" />
              <Text style={styles.revStatText}>+18.6%</Text>
            </View>
          </View>

          <View style={styles.revGrid}>
            <View style={styles.revCell}>
              <Text style={styles.revCellLabel}>Grains Dispatched</Text>
              <Text style={styles.revCellVal}>245 Tons</Text>
            </View>
            <View style={styles.revCell}>
              <Text style={styles.revCellLabel}>Purchase Orders</Text>
              <Text style={styles.revCellVal}>18 Complete</Text>
            </View>
          </View>
          <View style={styles.chartWrapper}>
            <CustomChart data={[120000, 180000, 150000, 240000, 290000, 345600]} color="#10B981" fillColor="#ECFDF5" height={70} />
          </View>
        </View>
      </ScrollView>

      {/* Digital Twin Modal */}
      <Modal visible={showDigitalTwin} animationType="slide" transparent={false} onRequestClose={() => setShowDigitalTwin(false)}>
        <SafeAreaView style={styles.twinModalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>Digital Twin Heatmap</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowDigitalTwin(false)}>
              <Text style={styles.closeText}>Back</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ padding: 16 }}>
            <DigitalTwin
              currentTemp={temperature}
              currentHum={humidity}
              currentMoist={moisture}
              currentCO2={co2}
              pestInfestation={pestInfestation}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: '#1F2937',
  },
  headerSubtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: '#6B7280',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    zIndex: 1,
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingRight: 10,
    paddingLeft: 4,
    paddingVertical: 4,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  profileTextCol: {
    marginLeft: 6,
  },
  profileName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
  },
  profileRole: {
    fontSize: 8,
    color: '#D32F2F',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
    marginTop: 6,
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
  },
  pulseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pulsePoint: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  liveLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#EF4444',
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  telemetryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardLabel: {
    fontSize: 9.5,
    color: '#6B7280',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 8,
    fontWeight: '700',
  },
  cardVal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginVertical: 4,
  },
  spoilageCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 12,
  },
  spoilageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FEF3C7',
    paddingBottom: 6,
    marginBottom: 8,
  },
  spoilageTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  spoilageDesc: {
    fontSize: 9,
    color: '#B45309',
    marginTop: 1,
  },
  spoilageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spoilageMetric: {
    flex: 1,
    alignItems: 'center',
  },
  spoilageLabel: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '500',
  },
  spoilageVal: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  spoilageDivider: {
    width: 1,
    height: 25,
    backgroundColor: '#FEF3C7',
  },
  shelfLifeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  boxTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 10,
  },
  shelfLifeRow: {
    marginBottom: 8,
  },
  shelfLifeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  shelfLifeCrop: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  shelfLifeDays: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1F2937',
  },
  barBg: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  alertsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noAlerts: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 10,
    gap: 6,
  },
  noAlertsText: {
    fontSize: 10,
    color: '#065F46',
    fontWeight: '500',
  },
  alertCard: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  alertDanger: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FEE2E2',
  },
  alertWarning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  alertTime: {
    fontSize: 8.5,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  alertText: {
    fontSize: 10,
    lineHeight: 14,
  },
  alertMessage: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 14,
    marginBottom: 6,
  },
  alertAction: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#1F2937',
  },
  revenueBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  revenueSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  revLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  revVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  revStatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  revStatText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#16A34A',
  },
  revGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  revCell: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  revCellLabel: {
    fontSize: 9,
    color: '#6B7280',
  },
  revCellVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  chartWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  twinModalContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  modalHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  modalCloseBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
  },
  closeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
});
export default WarehouseDashboard;
