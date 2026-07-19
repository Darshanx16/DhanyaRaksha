import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Thermometer, Droplet, Wind, Activity, Bug } from 'lucide-react-native';

interface TelemetryControlProps {
  temperature: number;
  humidity: number;
  moisture: number;
  co2: number;
  pestInfestation: boolean;
  onChange: (key: string, value: any) => void;
}

export const TelemetryControl: React.FC<TelemetryControlProps> = ({
  temperature,
  humidity,
  moisture,
  co2,
  pestInfestation,
  onChange,
}) => {
  const adjustValue = (key: string, current: number, increment: number, min: number, max: number) => {
    const newVal = Math.min(max, Math.max(min, Number((current + increment).toFixed(1))));
    onChange(key, newVal);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Activity size={18} color="#2E7D32" />
        <Text style={styles.headerTitle}>IoT Hardware Simulator (ESP32 Console)</Text>
      </View>
      <Text style={styles.subtitle}>
        Adjust the simulated sensor knobs below to trigger real-time AI spoilage predictions, automatic ventilation fan relays, and match alerts.
      </Text>

      {/* Row 1: Temperature & Humidity */}
      <View style={styles.row}>
        {/* Temperature Control */}
        <View style={styles.controlBox}>
          <View style={styles.labelRow}>
            <Thermometer size={14} color="#D32F2F" />
            <Text style={styles.controlName}>Temp (°C)</Text>
          </View>
          <Text style={[styles.controlValue, temperature > 35 && styles.textAlert]}>
            {temperature.toFixed(1)}°C
          </Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.adjustBtn}
              onPress={() => adjustValue('temperature', temperature, -1, 15, 50)}
            >
              <Text style={styles.btnText}>-1°</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adjustBtn}
              onPress={() => adjustValue('temperature', temperature, 1, 15, 50)}
            >
              <Text style={styles.btnText}>+1°</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Humidity Control */}
        <View style={styles.controlBox}>
          <View style={styles.labelRow}>
            <Droplet size={14} color="#0D74CE" />
            <Text style={styles.controlName}>Humidity (%)</Text>
          </View>
          <Text style={[styles.controlValue, humidity > 70 && styles.textAlert]}>
            {humidity.toFixed(0)}% RH
          </Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.adjustBtn}
              onPress={() => adjustValue('humidity', humidity, -5, 30, 95)}
            >
              <Text style={styles.btnText}>-5%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adjustBtn}
              onPress={() => adjustValue('humidity', humidity, 5, 30, 95)}
            >
              <Text style={styles.btnText}>+5%</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Row 2: Moisture & CO2 */}
      <View style={styles.row}>
        {/* Moisture Control */}
        <View style={styles.controlBox}>
          <View style={styles.labelRow}>
            <Droplet size={14} color="#F9A825" />
            <Text style={styles.controlName}>Moisture (%)</Text>
          </View>
          <Text style={[styles.controlValue, moisture > 13.5 && styles.textAlert]}>
            {moisture.toFixed(1)}%
          </Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.adjustBtn}
              onPress={() => adjustValue('moisture', moisture, -0.5, 8, 20)}
            >
              <Text style={styles.btnText}>-0.5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adjustBtn}
              onPress={() => adjustValue('moisture', moisture, 0.5, 8, 20)}
            >
              <Text style={styles.btnText}>+0.5</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CO2 Control */}
        <View style={styles.controlBox}>
          <View style={styles.labelRow}>
            <Wind size={14} color="#7C3AED" />
            <Text style={styles.controlName}>Air quality (CO₂)</Text>
          </View>
          <Text style={[styles.controlValue, co2 > 800 && styles.textAlert]}>
            {co2} ppm
          </Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.adjustBtn}
              onPress={() => adjustValue('co2', co2, -50, 300, 1500)}
            >
              <Text style={styles.btnText}>-50</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adjustBtn}
              onPress={() => adjustValue('co2', co2, 50, 300, 1500)}
            >
              <Text style={styles.btnText}>+50</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Insect / Pest Toggle */}
      <View style={styles.pestRow}>
        <View style={styles.pestLeft}>
          <Bug size={18} color={pestInfestation ? '#D32F2F' : '#6B7280'} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.pestTitle}>AI Insect / Pest Detection</Text>
            <Text style={styles.pestSubtitle}>Simulate insects detected by camera module</Text>
          </View>
        </View>
        <Switch
          value={pestInfestation}
          onValueChange={(val) => onChange('pestInfestation', val)}
          trackColor={{ false: '#D1D5DB', true: '#FCA5A5' }}
          thumbColor={pestInfestation ? '#D32F2F' : '#F3F4F6'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 6,
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 15,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  controlBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  controlName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 4,
  },
  controlValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 4,
  },
  textAlert: {
    color: '#D32F2F',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  adjustBtn: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    paddingVertical: 5,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
  },
  pestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  pestLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pestTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
  pestSubtitle: {
    fontSize: 10,
    color: '#7F1D1D',
    marginTop: 1,
  },
});
