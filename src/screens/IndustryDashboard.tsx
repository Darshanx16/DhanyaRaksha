import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Alert, Modal, Platform, StatusBar } from 'react-native';
import { Search, Filter, Phone, ShoppingBag, ClipboardList, Bookmark, Sprout, MapPin, ChevronRight, MessageSquare, Check, Sparkles } from 'lucide-react-native';
import { mockStocks, mockIndustryRequirements } from '../data/mockData';
import { GrainStock, GrainType, Grade } from '../types';

interface IndustryDashboardProps {
  currentTemp: number;
  currentHum: number;
  currentMoist: number;
  currentCO2: number;
  pestInfestation: boolean;
  onLogout: () => void;
}

export const IndustryDashboard: React.FC<IndustryDashboardProps> = ({
  currentTemp,
  currentHum,
  currentMoist,
  currentCO2,
  pestInfestation,
  onLogout,
}) => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrain, setFilterGrain] = useState<string>('All');
  const [filterGrade, setFilterGrade] = useState<string>('All');
  const [filterMoisture, setFilterMoisture] = useState<string>('All');
  const [showOrderDrawer, setShowOrderDrawer] = useState(false);
  const [selectedStock, setSelectedStock] = useState<GrainStock | null>(null);
  const [orderQuantity, setOrderQuantity] = useState('50');

  // Synchronize mock stocks with telemetry simulator values for simulated interactive reactivity!
  const stocks: GrainStock[] = mockStocks.map((stock) => {
    // If it's Maize, connect it to the simulation state
    if (stock.grainType === 'Maize') {
      const calculatedRisk = Math.min(100, Math.round(
        (currentTemp > 30 ? (currentTemp - 30) * 4 : 0) +
        (currentHum > 60 ? (currentHum - 60) * 3 : 0) +
        (currentMoist > 11 ? (currentMoist - 11) * 12 : 0) +
        (pestInfestation ? 40 : 0)
      ));
      const calculatedShelfLife = Math.max(2, Math.round(45 - (calculatedRisk / 2.5)));
      
      return {
        ...stock,
        moisture: currentMoist,
        shelfLifeDays: calculatedShelfLife,
        spoilageRisk: calculatedRisk,
        grade: currentMoist > 13.5 ? 'Grade C' : currentMoist > 12.0 ? 'Grade B' : 'Grade A',
      };
    }
    return stock;
  });

  // Filter stocks according to selected parameters
  const filteredStocks = stocks.filter((stock) => {
    // Search filter
    if (searchQuery && !stock.grainType.toLowerCase().includes(searchQuery.toLowerCase()) && !stock.origin.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Grain Type filter
    if (filterGrain !== 'All' && stock.grainType !== filterGrain) {
      return false;
    }
    // Grade filter
    if (filterGrade !== 'All' && stock.grade !== filterGrade) {
      return false;
    }
    // Moisture filter
    if (filterMoisture !== 'All') {
      const maxMoist = parseFloat(filterMoisture);
      if (stock.moisture > maxMoist) return false;
    }
    return true;
  });

  // Interactive Match Algorithm: Let's find matches for "Agri Foods Ltd" requirement
  // Requires: Paddy, Moisture < 13%, Grade A, Min 120 Tons
  const paddyRequirement = mockIndustryRequirements[0];
  const matchingPaddyStock = stocks.find(
    (s) =>
      s.grainType === 'Paddy' &&
      s.moisture <= paddyRequirement.maxMoisture &&
      s.grade === 'Grade A' &&
      s.quantity >= 100 // relaxed slightly for demo
  );

  // Check Maize match for Mehta Oils: Maize, Moisture < 12%, Grade B, Min 60 Tons
  const maizeRequirement = mockIndustryRequirements[1];
  const matchingMaizeStock = stocks.find(
    (s) =>
      s.grainType === 'Maize' &&
      s.moisture <= maizeRequirement.maxMoisture &&
      (s.grade === 'Grade A' || s.grade === 'Grade B')
  );

  const handleQuickAction = (action: string) => {
    Alert.alert('Action Triggered', `${action} flow initiated. Connecting to Warehouse owner...`);
  };

  const handlePlaceOrder = () => {
    if (!selectedStock) return;
    Alert.alert(
      'Order Submitted!',
      `Your request for ${orderQuantity} Tons of ${selectedStock.grainType} has been dispatched to ${selectedStock.farmerName}. You will receive a notification once accepted.`,
      [{ text: 'OK', onPress: () => setShowOrderDrawer(false) }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Sprout size={20} color="#F9A825" />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.headerTitle}>DhānyaMarket</Text>
            <Text style={styles.headerSubtitle}>Verified Grain Sourcing</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.profileBtn} onPress={onLogout}>
          <View style={[styles.avatar, { backgroundColor: '#F9A825' }]}>
            <Text style={styles.avatarText}>AF</Text>
          </View>
          <View style={styles.profileTextCol}>
            <Text style={styles.profileName}>Agri Foods Ltd</Text>
            <Text style={styles.profileRole}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Search Bar */}
        <View style={styles.searchBarBox}>
          <Search size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            placeholder="Search grain types, locations, farmers..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Quality Filter Panel */}
        <View style={styles.filterCard}>
          <View style={styles.filterTitleRow}>
            <Filter size={14} color="#4B5563" />
            <Text style={styles.filterTitle}>Smart Quality Filters</Text>
          </View>

          {/* Grain Type Row */}
          <Text style={styles.filterLabel}>Grain Type</Text>
          <View style={styles.chipRow}>
            {['All', 'Paddy', 'Wheat', 'Maize', 'Rice'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.chip, filterGrain === t && styles.chipActive]}
                onPress={() => setFilterGrain(t)}
              >
                <Text style={[styles.chipText, filterGrain === t && styles.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quality Grade Row */}
          <Text style={styles.filterLabel}>Minimum Grade</Text>
          <View style={styles.chipRow}>
            {['All', 'Grade A', 'Grade B', 'Grade C'].map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.chip, filterGrade === g && styles.chipActive]}
                onPress={() => setFilterGrade(g)}
              >
                <Text style={[styles.chipText, filterGrade === g && styles.chipTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Max Moisture Limit Row */}
          <Text style={styles.filterLabel}>Max Moisture Limit</Text>
          <View style={styles.chipRow}>
            {['All', '11%', '12%', '13%', '14%'].map((m) => {
              const val = m === 'All' ? 'All' : m.replace('%', '');
              return (
                <TouchableOpacity
                  key={m}
                  style={[styles.chip, filterMoisture === val && styles.chipActive]}
                  onPress={() => setFilterMoisture(val)}
                >
                  <Text style={[styles.chipText, filterMoisture === val && styles.chipTextActive]}>{m}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Smart Matching Algorithm (Innovation Block) */}
        <View style={styles.matchingPanel}>
          <View style={styles.matchHeader}>
            <Sparkles size={16} color="#B45309" />
            <Text style={styles.matchTitle}>AI Real-Time Procurement Matcher</Text>
          </View>
          <Text style={styles.matchSubtitle}>
            Our matchmaking engine scans IoT sensor networks for stocks complying with your company settings.
          </Text>

          {/* Paddy Match status */}
          {matchingPaddyStock ? (
            <View style={styles.matchAlert}>
              <View style={styles.matchAlertLeft}>
                <Check size={14} color="#065F46" />
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.matchAlertTitle}>Matching Paddy Found</Text>
                  <Text style={styles.matchAlertDesc}>
                    {matchingPaddyStock.origin} stock: {matchingPaddyStock.quantity} Tons ({matchingPaddyStock.moisture}% moisture, {matchingPaddyStock.grade}).
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.matchOrderBtn}
                onPress={() => {
                  setSelectedStock(matchingPaddyStock);
                  setShowOrderDrawer(true);
                }}
              >
                <Text style={styles.matchOrderBtnText}>Procure</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.noMatchText}>No Paddy currently meets your 13% Moisture Grade A limit.</Text>
          )}

          {/* Maize Match status (Reactivity check) */}
          {matchingMaizeStock ? (
            <View style={[styles.matchAlert, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}>
              <View style={styles.matchAlertLeft}>
                <Check size={14} color="#0369A1" />
                <View style={{ marginLeft: 6 }}>
                  <Text style={[styles.matchAlertTitle, { color: '#0369A1' }]}>Maize Matches Mehta Oils (Your Subsidiary)</Text>
                  <Text style={[styles.matchAlertDesc, { color: '#0EA5E9' }]}>
                    Salem stock: {matchingMaizeStock.quantity} Tons ({matchingMaizeStock.moisture}% moisture, {matchingMaizeStock.grade}).
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.matchOrderBtn, { backgroundColor: '#0288D1' }]}
                onPress={() => {
                  setSelectedStock(matchingMaizeStock);
                  setShowOrderDrawer(true);
                }}
              >
                <Text style={styles.matchOrderBtnText}>Procure</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.matchAlertNegative}>
              <Text style={styles.matchAlertNegText}>
                ⚠️ Maize Match Offline: Simulated moisture is {currentMoist}% (exceeds Mehta Oils 12% Max moisture limit).
              </Text>
            </View>
          )}
        </View>

        {/* Nearby Warehouses List */}
        <Text style={styles.sectionTitle}>Regional Grain Stocks ({filteredStocks.length} found)</Text>

        {filteredStocks.length === 0 ? (
          <View style={styles.emptyResults}>
            <Text style={styles.emptyText}>No stocks match your quality metrics. Try widening filters.</Text>
          </View>
        ) : (
          filteredStocks.map((stock) => {
            const isMatchPaddy = stock.grainType === 'Paddy' && stock.moisture <= 13.0 && stock.grade === 'Grade A';
            const isMatchMaize = stock.grainType === 'Maize' && stock.moisture <= 12.0;

            return (
              <View key={stock.id} style={styles.stockCard}>
                <View style={styles.stockCardTop}>
                  <View>
                    <Text style={styles.cropTitle}>
                      {stock.grainType} - {stock.grade}
                    </Text>
                    <View style={styles.locRow}>
                      <MapPin size={10} color="#6B7280" />
                      <Text style={styles.locText}>{stock.origin}</Text>
                    </View>
                  </View>
                  <View style={styles.qtyBadge}>
                    <Text style={styles.qtyVal}>{stock.quantity} Tons</Text>
                  </View>
                </View>

                {/* Quality Metrics */}
                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Moisture</Text>
                    <Text style={styles.metricVal}>{stock.moisture}%</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Protein</Text>
                    <Text style={styles.metricVal}>{stock.protein}%</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Storage Zone</Text>
                    <Text style={styles.metricVal}>{stock.zone}</Text>
                  </View>
                </View>

                {/* Match badges */}
                {(isMatchPaddy || isMatchMaize) && (
                  <View style={styles.dealBadge}>
                    <Sparkles size={10} color="#047857" />
                    <Text style={styles.dealBadgeText}>Pre-approved Quality Match</Text>
                  </View>
                )}

                {/* Card footer buttons */}
                <View style={styles.cardActions}>
                  <View style={styles.ownerInfo}>
                    <Text style={styles.ownerLabel}>Farmer / Manager</Text>
                    <Text style={styles.ownerName}>{stock.farmerName}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.detailsBtn}
                    onPress={() => {
                      setSelectedStock(stock);
                      setShowOrderDrawer(true);
                    }}
                  >
                    <Text style={styles.detailsBtnText}>Place Offer</Text>
                    <ChevronRight size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        {/* Quick Actions Panel */}
        <Text style={styles.sectionTitle}>Procurement Tools</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleQuickAction('Direct Owner Contact')}
          >
            <View style={[styles.actionIconFrame, { backgroundColor: '#E0F2FE' }]}>
              <MessageSquare size={18} color="#0288D1" />
            </View>
            <Text style={styles.actionItemTitle}>Contact Owner</Text>
            <Text style={styles.actionItemDesc}>Open Live Chat / Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleQuickAction('Batch Order Request')}
          >
            <View style={[styles.actionIconFrame, { backgroundColor: '#DCFCE7' }]}>
              <ShoppingBag size={18} color="#16A34A" />
            </View>
            <Text style={styles.actionItemTitle}>Order Request</Text>
            <Text style={styles.actionItemDesc}>Place grain bulk order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleQuickAction('Quality Report Viewer')}
          >
            <View style={[styles.actionIconFrame, { backgroundColor: '#FEF3C7' }]}>
              <ClipboardList size={18} color="#D97706" />
            </View>
            <Text style={styles.actionItemTitle}>Quality Reports</Text>
            <Text style={styles.actionItemDesc}>View Lab Certificates</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleQuickAction('AddToWishlist')}
          >
            <View style={[styles.actionIconFrame, { backgroundColor: '#F3E8FF' }]}>
              <Bookmark size={18} color="#7C3AED" />
            </View>
            <Text style={styles.actionItemTitle}>Add to Wishlist</Text>
            <Text style={styles.actionItemDesc}>Track price updates</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Order Drawer Modal */}
      {selectedStock && (
        <Modal visible={showOrderDrawer} animationType="slide" transparent={true}>
          <View style={styles.modalBg}>
            <View style={styles.drawerCard}>
              <Text style={styles.drawerTitle}>Procure {selectedStock.grainType}</Text>
              <Text style={styles.drawerDesc}>
                Stock ID: {selectedStock.id} | Warehoused at {selectedStock.origin}
              </Text>

              <View style={styles.drawerDetailGrid}>
                <View style={styles.drawerCell}>
                  <Text style={styles.drawerCellLbl}>Quality Grade</Text>
                  <Text style={styles.drawerCellVal}>{selectedStock.grade}</Text>
                </View>
                <View style={styles.drawerCell}>
                  <Text style={styles.drawerCellLbl}>Moisture level</Text>
                  <Text style={styles.drawerCellVal}>{selectedStock.moisture}%</Text>
                </View>
                <View style={styles.drawerCell}>
                  <Text style={styles.drawerCellLbl}>Available Stock</Text>
                  <Text style={styles.drawerCellVal}>{selectedStock.quantity} Tons</Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>Required Procurement Quantity (Tons)</Text>
              <TextInput
                style={styles.qtyInput}
                keyboardType="numeric"
                value={orderQuantity}
                onChangeText={setOrderQuantity}
              />

              <View style={styles.drawerActionRow}>
                <TouchableOpacity
                  style={styles.drawerCancelBtn}
                  onPress={() => setShowOrderDrawer(false)}
                >
                  <Text style={styles.drawerCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.drawerConfirmBtn}
                  onPress={handlePlaceOrder}
                >
                  <Text style={styles.drawerConfirmText}>Send Purchase Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 24,
    paddingRight: 10,
    paddingLeft: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    color: '#B45309',
  },
  profileRole: {
    fontSize: 8.5,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    fontSize: 12.5,
    color: '#1F2937',
    flex: 1,
    padding: 0,
  },
  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  filterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 6,
  },
  filterTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#374151',
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 6,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  chipText: {
    fontSize: 10,
    color: '#4B5563',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#B45309',
    fontWeight: '700',
  },
  matchingPanel: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  matchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  matchSubtitle: {
    fontSize: 10.5,
    color: '#B45309',
    lineHeight: 14,
    marginBottom: 10,
  },
  matchAlert: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  matchAlertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  matchAlertTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#065F46',
  },
  matchAlertDesc: {
    fontSize: 9.5,
    color: '#059669',
    marginTop: 1,
  },
  matchOrderBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  matchOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '700',
  },
  matchAlertNegative: {
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 8,
  },
  matchAlertNegText: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '500',
  },
  noMatchText: {
    fontSize: 10,
    color: '#B45309',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 10,
    marginTop: 6,
  },
  emptyResults: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  stockCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  stockCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cropTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locText: {
    fontSize: 10.5,
    color: '#6B7280',
  },
  qtyBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  qtyVal: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2E7D32',
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 10,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  metricVal: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#374151',
    marginTop: 2,
  },
  dealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  dealBadgeText: {
    fontSize: 9,
    color: '#065F46',
    fontWeight: '700',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerLabel: {
    fontSize: 8.5,
    color: '#9CA3AF',
  },
  ownerName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  detailsBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIconFrame: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionItemTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1F2937',
  },
  actionItemDesc: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  drawerCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  drawerDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  drawerDetailGrid: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginVertical: 14,
    gap: 10,
  },
  drawerCell: {
    flex: 1,
    alignItems: 'center',
  },
  drawerCellLbl: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  drawerCellVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6,
  },
  qtyInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 16,
  },
  drawerActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  drawerCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  drawerCancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  drawerConfirmBtn: {
    flex: 2,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  drawerConfirmText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
export default IndustryDashboard;
