import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ChevronLeft, Leaf, Fan, Cpu, RefreshCw, BarChart2, ShieldCheck, AlertTriangle } from 'lucide-react-native';
import CustomChart from '../components/CustomChart';

interface AnalyticsScreenProps {
  onBack: () => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onBack }) => {
  // Energy history mock data
  const energyHistory = [750, 780, 810, 840, 800, 820];
  const carbonHistory = [0.29, 0.30, 0.31, 0.33, 0.31, 0.32];

  const maintenanceItems = [
    {
      id: 'M-1',
      component: 'Exhaust Fan Bearing (Zone C)',
      type: 'Fan failure risk',
      status: 'warning',
      risk: 45,
      action: 'Replace lubrication bearings within 12 days to avoid seizure.',
    },
    {
      id: 'M-2',
      component: 'Gateway GSM Router',
      type: 'Network failure risk',
      status: 'warning',
      risk: 28,
      action: 'Relocate antenna to avoid signal attenuation (-82dBm).',
    },
    {
      id: 'M-3',
      component: 'DHT22 Temp/Hum Sensor (Zone A)',
      type: 'Sensor calibration drift',
      status: 'healthy',
      risk: 4,
      action: 'All parameters healthy. Drift within tolerance limits (<1.5%).',
    },
    {
      id: 'M-4',
      component: 'MQ135 Gas Sensor Battery',
      type: 'Battery replacement',
      status: 'healthy',
      risk: 12,
      action: 'Battery charge at 85%. No service required.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={20} color="#374151" />
          <Text style={styles.backText}>Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>System Analytics & Carbon</Text>
        <View style={{ width: 60 }} /> {/* Spacer */}
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Carbon Footprint Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Leaf size={18} color="#2E7D32" />
            <Text style={styles.cardTitle}>Carbon Footprint & Energy Tracking</Text>
          </View>
          <Text style={styles.cardDesc}>
            Fulfilling Warehouse Sustainability Goals through real-time exhaust fan and ventilation scheduling.
          </Text>

          <View style={styles.energyGrid}>
            <View style={styles.energyCell}>
              <Text style={styles.energyLabel}>Power Consumed</Text>
              <Text style={styles.energyVal}>820 kWh</Text>
              <Text style={styles.energySubtitle}>This month</Text>
            </View>
            <View style={styles.energyDivider} />
            <View style={styles.energyCell}>
              <Text style={styles.energyLabel}>Carbon Emissions</Text>
              <Text style={[styles.energyVal, { color: '#2E7D32' }]}>0.32 tCO₂</Text>
              <Text style={styles.energySubtitle}>Estimated offset</Text>
            </View>
          </View>

          {/* AI Energy Tip */}
          <View style={styles.sustainabilityTip}>
            <Text style={styles.tipTitle}>🍃 AI Carbon Saver Suggestion</Text>
            <Text style={styles.tipDesc}>
              Outside humidity is below 55% in mornings (06:00 - 09:00). Open ventilation shutters manually to bypass fan relays, saving up to{' '}
              <Text style={{ fontWeight: 'bold' }}>14% electricity</Text> daily.
            </Text>
          </View>

          <Text style={styles.chartTitle}>Monthly Power Usage Trends (kWh)</Text>
          <View style={styles.chartWrapper}>
            <CustomChart
              data={energyHistory}
              labels={['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
              color="#2E7D32"
              fillColor="#E8F5E9"
              height={90}
            />
          </View>
        </View>

        {/* Predictive Maintenance Section */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <View style={styles.cardHeader}>
            <RefreshCw size={16} color="#7C3AED" />
            <Text style={styles.cardTitle}>Predictive Maintenance Dashboard</Text>
          </View>
          <Text style={styles.cardDesc}>
            AI checks hardware waveforms and battery telemetry to foresee parts failure before it interrupts grain cooling.
          </Text>

          <View style={styles.maintenanceList}>
            {maintenanceItems.map((item) => {
              const isWarning = item.status === 'warning';
              return (
                <View key={item.id} style={[styles.mItemCard, isWarning ? styles.mWarning : styles.mHealthy]}>
                  <View style={styles.mItemHeader}>
                    <View style={styles.mItemLeft}>
                      {isWarning ? <AlertTriangle size={14} color="#B45309" /> : <ShieldCheck size={14} color="#047857" />}
                      <Text style={[styles.mItemCompText, { color: isWarning ? '#92400E' : '#065F46' }]}>
                        {item.component}
                      </Text>
                    </View>
                    <View style={[styles.riskBadge, { backgroundColor: isWarning ? '#FEF3C7' : '#DCFCE7' }]}>
                      <Text style={[styles.riskBadgeText, { color: isWarning ? '#D97706' : '#16A34A' }]}>
                        {item.risk}% Failure Risk
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.mItemActionText}>{item.action}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 90,
  },
  backText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#374151',
    marginLeft: 2,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#1F2937',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1F2937',
  },
  cardDesc: {
    fontSize: 10.5,
    color: '#6B7280',
    lineHeight: 14,
    marginBottom: 14,
  },
  energyGrid: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 14,
  },
  energyCell: {
    flex: 1,
    alignItems: 'center',
  },
  energyLabel: {
    fontSize: 9.5,
    color: '#6B7280',
  },
  energyVal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  energySubtitle: {
    fontSize: 8.5,
    color: '#9CA3AF',
    marginTop: 1,
  },
  energyDivider: {
    width: 1,
    height: 35,
    backgroundColor: '#E5E7EB',
  },
  sustainabilityTip: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 4,
  },
  tipDesc: {
    fontSize: 9.5,
    color: '#388E3C',
    lineHeight: 14,
  },
  chartTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  chartWrapper: {
    alignItems: 'center',
  },
  maintenanceList: {
    gap: 10,
  },
  mItemCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  mWarning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
  },
  mHealthy: {
    backgroundColor: '#ECFDF5',
    borderColor: '#D1FAE5',
  },
  mItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  mItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  mItemCompText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  riskBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  riskBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
  },
  mItemActionText: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 14,
  },
});
export default AnalyticsScreen;
