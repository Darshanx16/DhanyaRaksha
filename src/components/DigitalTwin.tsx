import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Fan, Wifi, Battery, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { mockZones } from '../data/mockData';
import { WarehouseZone } from '../types';

interface DigitalTwinProps {
  currentTemp: number;
  currentHum: number;
  currentMoist: number;
  currentCO2: number;
  pestInfestation: boolean;
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({
  currentTemp,
  currentHum,
  currentMoist,
  currentCO2,
  pestInfestation,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'temp' | 'hum' | 'moist' | 'gas'>('temp');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('Zone A');

  // Synchronize simulated settings with the mockZones data array
  const zones: WarehouseZone[] = mockZones.map((z) => {
    if (z.id === 'Zone C') {
      // Zone C is tied directly to the simulated dials
      return {
        ...z,
        temperature: currentTemp,
        humidity: currentHum,
        moisture: currentMoist,
        gasLevel: currentCO2,
        fanActive: currentHum > 70 || currentTemp > 35 || currentCO2 > 800,
        fanFailureRisk: currentTemp > 38 ? 68 : 45,
      };
    }
    return z;
  });

  const activeZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  // Animated values for fans
  const spinAnims = {
    'Zone A': useRef(new Animated.Value(0)).current,
    'Zone B': useRef(new Animated.Value(0)).current,
    'Zone C': useRef(new Animated.Value(0)).current,
    'Zone D': useRef(new Animated.Value(0)).current,
  };

  useEffect(() => {
    // Control animation loops for each zone based on whether fan is active
    zones.forEach((z) => {
      const anim = spinAnims[z.id as keyof typeof spinAnims];
      if (z.fanActive) {
        Animated.loop(
          Animated.timing(anim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();
      } else {
        anim.stopAnimation();
        anim.setValue(0);
      }
    });
  }, [zones]);

  const getHeatColor = (zone: WarehouseZone) => {
    let value = 0;
    let warningLimit = 0;
    let dangerLimit = 0;

    switch (selectedMetric) {
      case 'temp':
        value = zone.temperature;
        warningLimit = 32;
        dangerLimit = 35;
        break;
      case 'hum':
        value = zone.humidity;
        warningLimit = 65;
        dangerLimit = 70;
        break;
      case 'moist':
        value = zone.moisture;
        warningLimit = 12.0;
        dangerLimit = 13.5;
        break;
      case 'gas':
        value = zone.gasLevel;
        warningLimit = 600;
        dangerLimit = 800;
        break;
    }

    if (value >= dangerLimit) return '#FEE2E2'; // Red light tint
    if (value >= warningLimit) return '#FEF3C7'; // Yellow light tint
    return '#EAFAF1'; // Green light tint
  };

  const getBorderColor = (zone: WarehouseZone) => {
    let value = 0;
    let warningLimit = 0;
    let dangerLimit = 0;

    switch (selectedMetric) {
      case 'temp':
        value = zone.temperature;
        warningLimit = 32;
        dangerLimit = 35;
        break;
      case 'hum':
        value = zone.humidity;
        warningLimit = 65;
        dangerLimit = 70;
        break;
      case 'moist':
        value = zone.moisture;
        warningLimit = 12.0;
        dangerLimit = 13.5;
        break;
      case 'gas':
        value = zone.gasLevel;
        warningLimit = 600;
        dangerLimit = 800;
        break;
    }

    if (value >= dangerLimit) return '#EF4444';
    if (value >= warningLimit) return '#F59E0B';
    return '#10B981';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Warehouse Digital Twin (3D Zonemap)</Text>
        <Text style={styles.subtitle}>
          Visualizing real-time sensor node placements, heatmaps, and fan relays.
        </Text>
      </View>

      {/* Heatmap Toggle Buttons */}
      <View style={styles.toggleRow}>
        {(['temp', 'hum', 'moist', 'gas'] as const).map((metric) => (
          <TouchableOpacity
            key={metric}
            style={[styles.toggleBtn, selectedMetric === metric && styles.toggleBtnActive]}
            onPress={() => setSelectedMetric(metric)}
          >
            <Text style={[styles.toggleText, selectedMetric === metric && styles.toggleTextActive]}>
              {metric.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grid Layout of Zones */}
      <View style={styles.grid}>
        {zones.map((zone) => {
          const isSelected = zone.id === selectedZoneId;
          const bg = getHeatColor(zone);
          const border = getBorderColor(zone);
          const spin = spinAnims[zone.id as keyof typeof spinAnims].interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          });

          return (
            <TouchableOpacity
              key={zone.id}
              style={[
                styles.zoneCard,
                { backgroundColor: bg, borderColor: isSelected ? '#111827' : border },
                isSelected && styles.zoneCardSelected,
              ]}
              onPress={() => setSelectedZoneId(zone.id)}
            >
              <View style={styles.zoneCardHeader}>
                <Text style={styles.zoneId}>{zone.id}</Text>
                {zone.fanActive && (
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Fan size={14} color="#059669" />
                  </Animated.View>
                )}
              </View>
              <Text style={styles.zoneName}>{zone.name.split(' ')[0]}</Text>
              
              <View style={styles.zoneMeta}>
                {selectedMetric === 'temp' && <Text style={styles.metricVal}>{zone.temperature.toFixed(1)}°C</Text>}
                {selectedMetric === 'hum' && <Text style={styles.metricVal}>{zone.humidity.toFixed(0)}%</Text>}
                {selectedMetric === 'moist' && <Text style={styles.metricVal}>{zone.moisture.toFixed(1)}%</Text>}
                {selectedMetric === 'gas' && <Text style={styles.metricVal}>{zone.gasLevel}ppm</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Active Zone Status Box (Predictive Maintenance & Details) */}
      <View style={styles.detailsBox}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>{activeZone.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: activeZone.fanActive ? '#D1FAE5' : '#F3F4F6' }]}>
            <Text style={[styles.statusBadgeText, { color: activeZone.fanActive ? '#065F46' : '#374151' }]}>
              {activeZone.fanActive ? 'Ventilation Active' : 'Ventilation Idle'}
            </Text>
          </View>
        </View>

        <View style={styles.detailRows}>
          <View style={styles.detailItem}>
            <Battery size={14} color="#6B7280" />
            <Text style={styles.detailLabel}>Node Battery:</Text>
            <Text style={[styles.detailValue, activeZone.batteryLevel < 80 && { color: '#D97706' }]}>
              {activeZone.batteryLevel}%
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Wifi size={14} color="#6B7280" />
            <Text style={styles.detailLabel}>WiFi Strength:</Text>
            <Text style={styles.detailValue}>{activeZone.wifiSignal}</Text>
          </View>

          <View style={styles.detailItem}>
            <Fan size={14} color="#6B7280" />
            <Text style={styles.detailLabel}>Fan Failure Risk:</Text>
            <Text
              style={[
                styles.detailValue,
                {
                  fontWeight: '700',
                  color: activeZone.fanFailureRisk > 40 ? '#D32F2F' : '#059669',
                },
              ]}
            >
              {activeZone.fanFailureRisk}%
            </Text>
          </View>
        </View>

        {/* Predictive Maintenance Warning */}
        {activeZone.fanFailureRisk > 40 ? (
          <View style={styles.warningAlert}>
            <AlertTriangle size={14} color="#B45309" />
            <Text style={styles.warningText}>
              Predictive Alert: Fan bearings showing friction anomalies. Replacement recommended within 12 days.
            </Text>
          </View>
        ) : (
          <View style={styles.okAlert}>
            <CheckCircle size={14} color="#047857" />
            <Text style={styles.okText}>All systems online. Node sensors operating within calibration thresholds.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2.5,
    marginBottom: 14,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#111827',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  zoneCard: {
    width: '48%',
    height: 75,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1.5,
    justifyContent: 'space-between',
  },
  zoneCardSelected: {
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  zoneCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneId: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  zoneName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  zoneMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  detailsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 6,
  },
  detailsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  detailRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#111827',
  },
  warningAlert: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    gap: 6,
  },
  warningText: {
    fontSize: 9.5,
    color: '#92400E',
    flex: 1,
    fontWeight: '500',
    lineHeight: 13,
  },
  okAlert: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    gap: 6,
  },
  okText: {
    fontSize: 9.5,
    color: '#065F46',
    flex: 1,
    fontWeight: '500',
    lineHeight: 13,
  },
});
export default DigitalTwin;
