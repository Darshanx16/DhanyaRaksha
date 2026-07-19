import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { ChevronLeft, Info, Calendar, User, Landmark, Tag, TrendingUp, BadgeAlert } from 'lucide-react-native';
import CustomChart from '../components/CustomChart';
import { mockSacks } from '../data/mockData';

interface SackDetailsScreenProps {
  sackId: string;
  onBack: () => void;
}

export const SackDetailsScreen: React.FC<SackDetailsScreenProps> = ({ sackId, onBack }) => {
  const sack = mockSacks[sackId as keyof typeof mockSacks] || mockSacks['SACK-20681'];

  // Price forecast calculations
  const priceTrendValues = sack.priceTrend.map((t) => t.price);
  const priceTrendLabels = sack.priceTrend.map((t) => {
    if (t.dayOffset === 0) return 'Today';
    return `${t.dayOffset > 0 ? '+' : ''}${t.dayOffset}d`;
  });

  const currentPrice = sack.priceTrend.find((t) => t.dayOffset === 0)?.price || 2300;
  const targetPrice = sack.priceTrend.find((t) => t.dayOffset === 10)?.price || 2460;
  const priceDiff = targetPrice - currentPrice;
  const percentGain = ((priceDiff / currentPrice) * 100).toFixed(1);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={20} color="#374151" />
          <Text style={styles.backText}>Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sack Traceability Report</Text>
        <View style={{ width: 60 }} /> {/* Spacer */}
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Core Sack Info Badge */}
        <View style={styles.identityCard}>
          <View style={styles.identityRow}>
            <View>
              <Text style={styles.sackIdText}>Sack ID: {sack.id}</Text>
              <Text style={styles.rfidText}>RFID Tag: {sack.rfidTag}</Text>
            </View>
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeText}>{sack.grade}</Text>
            </View>
          </View>

          <View style={styles.scoreRow}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNum}>{sack.qualityScore}</Text>
              <Text style={styles.scoreLabel}>AI Score</Text>
            </View>
            <View style={styles.scoreSummary}>
              <Text style={styles.summaryTitle}>Excellent Quality Grains</Text>
              <Text style={styles.summaryDesc}>
                Broken Grains: &lt;1.8% | Discoloration: &lt;0.5% | Moisture content compliant.
              </Text>
            </View>
          </View>
        </View>

        {/* Traceability Logs */}
        <Text style={styles.sectionTitle}>Sack Life Cycle Timeline</Text>
        <View style={styles.timelineCard}>
          {/* Step 1: Harvest */}
          <View style={styles.timelineStep}>
            <View style={styles.timelineIconFrame}>
              <Calendar size={14} color="#2E7D32" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.stepTitle}>Grain Harvested</Text>
              <View style={styles.stepMetaRow}>
                <View style={styles.metaLabelGroup}>
                  <User size={10} color="#6B7280" />
                  <Text style={styles.stepMetaText}>Farmer: {sack.farmerName}</Text>
                </View>
                <Text style={styles.stepMetaDate}>{sack.harvestDate}</Text>
              </View>
              <Text style={styles.stepDesc}>Harvest location: fields of {sack.origin}.</Text>
            </View>
          </View>

          {/* Line separator */}
          <View style={styles.timelineLine} />

          {/* Step 2: Storage entry */}
          <View style={styles.timelineStep}>
            <View style={[styles.timelineIconFrame, { backgroundColor: '#E1F5FE' }]}>
              <Landmark size={14} color="#0288D1" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.stepTitle}>Checked in Warehouse</Text>
              <View style={styles.stepMetaRow}>
                <Text style={styles.stepMetaText}>Location: Silo Zone A</Text>
                <Text style={styles.stepMetaDate}>Stored {sack.storageDurationDays} days</Text>
              </View>
              <Text style={styles.stepDesc}>Passed AI automated gate scanner check.</Text>
            </View>
          </View>

          {/* Line separator */}
          <View style={styles.timelineLine} />

          {/* Step 3: Current State */}
          <View style={styles.timelineStep}>
            <View style={[styles.timelineIconFrame, { backgroundColor: '#FFF3E0' }]}>
              <Tag size={14} color="#E65100" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.stepTitle}>Monitoring Conditions (Live)</Text>
              <View style={styles.stepMetaRow}>
                <Text style={styles.stepMetaText}>Current Moisture: {sack.currentMoisture}%</Text>
                <Text style={styles.stepStatusGreen}>HEALTHY</Text>
              </View>
              <Text style={styles.stepDesc}>
                Environmental temperature average is 26.5°C over the last 24 hours.
              </Text>
            </View>
          </View>
        </View>

        {/* AI Market Recommendation (Price forecasting) */}
        <Text style={styles.sectionTitle}>AI Grain Pricing Advisor</Text>
        <View style={styles.priceForecastCard}>
          <View style={styles.priceHeaderRow}>
            <TrendingUp size={18} color="#2E7D32" />
            <Text style={styles.priceTitle}>Market Forecast & Trade Recommender</Text>
          </View>
          <Text style={styles.priceSubtitle}>
            Comparing local agricultural futures, warehouse stock metrics, and regional grain demands.
          </Text>

          <View style={styles.priceGrid}>
            <View style={styles.priceBlock}>
              <Text style={styles.priceLabel}>Current Price</Text>
              <Text style={styles.priceVal}>₹ {currentPrice} /qtl</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceBlock}>
              <Text style={styles.priceLabel}>10d Predicted Price</Text>
              <Text style={[styles.priceVal, { color: '#2E7D32' }]}>₹ {targetPrice} /qtl</Text>
            </View>
          </View>

          <View style={styles.forecastInfoBox}>
            <Text style={styles.forecastInfoTitle}>
              💡 AI recommendation: HOLD SELL FOR 10 DAYS
            </Text>
            <Text style={styles.forecastInfoDesc}>
              Market volume is expected to decline temporarily, driving prices up by{' '}
              <Text style={{ fontWeight: 'bold' }}>₹{priceDiff} ({percentGain}%)</Text> in the next 10 days. Holding grain is highly recommended.
            </Text>
          </View>

          <Text style={styles.chartTitle}>Predicted Price Trend (Next 10 Days)</Text>
          <View style={styles.chartWrapper}>
            <CustomChart
              data={priceTrendValues}
              labels={priceTrendLabels}
              color="#10B981"
              fillColor="#ECFDF5"
              height={90}
            />
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  identityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  identityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
    marginBottom: 12,
  },
  sackIdText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  rfidText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
  },
  gradeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  gradeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2E7D32',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    borderWidth: 3,
    borderColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNum: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2E7D32',
  },
  scoreLabel: {
    fontSize: 8,
    color: '#4B5563',
    fontWeight: '600',
  },
  scoreSummary: {
    flex: 1,
    marginLeft: 14,
  },
  summaryTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1F2937',
  },
  summaryDesc: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 14,
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 10,
    marginTop: 4,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  timelineStep: {
    flexDirection: 'row',
  },
  timelineIconFrame: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  stepMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  metaLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepMetaText: {
    fontSize: 9.5,
    color: '#6B7280',
    fontWeight: '500',
  },
  stepMetaDate: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  stepDesc: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 14,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    height: 18,
    backgroundColor: '#E5E7EB',
    marginLeft: 13,
    marginVertical: 4,
  },
  stepStatusGreen: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A34A',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  priceForecastCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  priceTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2E7D32',
  },
  priceSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 14,
    marginBottom: 12,
  },
  priceGrid: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 12,
  },
  priceBlock: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 9.5,
    color: '#6B7280',
  },
  priceVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 2,
  },
  priceDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  forecastInfoBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginBottom: 14,
  },
  forecastInfoTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 4,
  },
  forecastInfoDesc: {
    fontSize: 9.5,
    color: '#388E3C',
    lineHeight: 14,
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  chartWrapper: {
    alignItems: 'center',
  },
});
export default SackDetailsScreen;
