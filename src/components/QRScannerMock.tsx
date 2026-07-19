import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Camera, Scan, ShieldAlert, Cpu } from 'lucide-react-native';

interface QRScannerMockProps {
  onScan: (sackId: string) => void;
  onClose: () => void;
}

export const QRScannerMock: React.FC<QRScannerMockProps> = ({ onScan, onClose }) => {
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous up-down animation for the scanner line
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateScanLine = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 160], // view height minus line height
  });

  const mockSackOptions = [
    { id: 'SACK-20681', label: '🌾 Paddy - Grade A (Raju Prasad)' },
    { id: 'SACK-20931', label: '🌾 Wheat - Grade A (Amit Singh)' },
    { id: 'SACK-20743', label: '🌽 Maize - Grade B (Venkatesh K.)' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Scan size={20} color="#FFFFFF" />
        <Text style={styles.title}>AI Sack Traceability Scanner</Text>
      </View>

      {/* Viewfinder Mock */}
      <View style={styles.viewfinderContainer}>
        <View style={styles.viewfinder}>
          {/* Camera icon center */}
          <Camera size={44} color="rgba(255,255,255,0.4)" style={styles.camIcon} />

          {/* Viewfinder Corners */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {/* Animated Laser Line */}
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY: translateScanLine }] },
            ]}
          />
        </View>
        <Text style={styles.instructions}>Align QR Code or RFID tag within frame</Text>
      </View>

      {/* Simulator Actions */}
      <View style={styles.simulationBox}>
        <View style={styles.simHeader}>
          <Cpu size={14} color="#F9A825" />
          <Text style={styles.simTitle}>Simulate RFID/QR Sack Tags:</Text>
        </View>
        <Text style={styles.simSubtitle}>
          Tap a grain sack below to simulate bringing the device camera/RFID reader close to it.
        </Text>

        <View style={styles.sackGrid}>
          {mockSackOptions.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={styles.sackBtn}
              onPress={() => onScan(opt.id)}
            >
              <Text style={styles.sackBtnText}>{opt.label}</Text>
              <Text style={styles.sackTagId}>{opt.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Cancel button */}
      <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
        <Text style={styles.cancelText}>Cancel / Return Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewfinderContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  viewfinder: {
    width: 200,
    height: 180,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camIcon: {
    position: 'absolute',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#10B981',
    borderWidth: 0,
  },
  topLeft: {
    top: 10,
    left: 10,
    borderLeftWidth: 3,
    borderTopWidth: 3,
  },
  topRight: {
    top: 10,
    right: 10,
    borderRightWidth: 3,
    borderTopWidth: 3,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: 10,
    right: 10,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  scanLine: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 3,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  instructions: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 10,
    fontWeight: '500',
  },
  simulationBox: {
    width: '100%',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  simTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F9A825',
  },
  simSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    lineHeight: 14,
    marginBottom: 10,
  },
  sackGrid: {
    gap: 8,
  },
  sackBtn: {
    backgroundColor: '#2D3748',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A5568',
  },
  sackBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sackTagId: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: 'bold',
    backgroundColor: '#1A202C',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cancelBtn: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 10,
  },
  cancelText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
});
export default QRScannerMock;
