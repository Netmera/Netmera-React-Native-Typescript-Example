/*
 * Copyright (c) 2026 Netmera Research.
 * AutoTracking FlatList test screen.
 */

import React, {useState} from 'react';
import {
  FlatList,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../Colors';

// ── Data ─────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {id: '1', name: 'Wireless Headphones', price: '₺1.299', category: 'Electronics', badge: 'New'},
  {id: '2', name: 'Running Shoes',        price: '₺899',   category: 'Sports',      badge: null},
  {id: '3', name: 'Coffee Maker',         price: '₺2.499', category: 'Home',        badge: 'Sale'},
  {id: '4', name: 'Yoga Mat',             price: '₺349',   category: 'Sports',      badge: null},
  {id: '5', name: 'Smart Watch',          price: '₺4.599', category: 'Electronics', badge: 'Hot'},
  {id: '6', name: 'Desk Lamp',            price: '₺499',   category: 'Home',        badge: null},
  {id: '7', name: 'Bluetooth Speaker',    price: '₺1.799', category: 'Electronics', badge: 'New'},
  {id: '8', name: 'Water Bottle',         price: '₺199',   category: 'Sports',      badge: null},
];

const SECTION_DATA = [
  {
    title: 'Featured',
    data: PRODUCTS.filter(p => p.badge !== null),
  },
  {
    title: 'All Products',
    data: PRODUCTS,
  },
];

const FILTERS = ['All', 'Electronics', 'Sports', 'Home'];

// ── Helpers ───────────────────────────────────────────────────────────────────

const log = (label: string) =>
  console.log(`[AutoTrackFlatList] action: "${label}"`);

// ── Sub-components ────────────────────────────────────────────────────────────

const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable
    style={[styles.chip, active && styles.chipActive]}
    accessibilityLabel={`filter-${label}`}
    onPress={onPress}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>
      {label}
    </Text>
  </Pressable>
);

type Product = (typeof PRODUCTS)[0];

const ProductCard = ({item}: {item: Product}) => (
  <Pressable
    style={styles.card}
    testID={`product-${item.id}`}>
    <View style={styles.cardLeft} testID={`product-${item.id}-left`}>
      <View style={styles.cardNameRow} testID={`product-${item.id}-name-row`}>
        <Text style={styles.cardName} testID={`product-${item.id}-name`}>{item.name}</Text>
        {item.badge && (
          <View style={styles.badge} testID={`product-${item.id}-badge`}>
            <Text style={styles.badgeText} testID={`product-${item.id}-badge-text`}>{item.badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.cardCategory} testID={`product-${item.id}-category`}>{item.category}</Text>
    </View>
    <View style={styles.cardRight} testID={`product-${item.id}-right`}>
      <Text style={styles.cardPrice} testID={`product-${item.id}-price`}>{item.price}</Text>
      <Pressable
        style={styles.addButton}
        testID={`add-to-cart-${item.id}`}
        onPress={() => log(`add-to-cart: ${item.name}`)}>
        <Text style={styles.addButtonText} testID={`add-to-cart-${item.id}-text`}>+ Add</Text>
      </Pressable>
      <TouchableOpacity
        style={styles.favoriteButton}
        testID={`favorite-${item.id}`}
        onPress={() => log(`favorite: ${item.name}`)}>
        <Text style={styles.favoriteText} testID={`favorite-${item.id}-text`}>♡</Text>
      </TouchableOpacity>
    </View>
  </Pressable>
);

const SectionHeader = ({title}: {title: string}) => (
  <Pressable
    style={styles.sectionHeader}
    accessibilityLabel={`section-${title}`}
    onPress={() => log(`section-header: ${title}`)}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </Pressable>
);

// ── Screen ────────────────────────────────────────────────────────────────────

type TabType = 'flatlist' | 'sectionlist';

const AutoTrackFlatListTest = () => {
  const [activeFilter, setActiveFilter] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('flatlist');

  const filteredData =
    activeFilter === 0
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === FILTERS[activeFilter]);

  return (
    <View style={styles.safe}>
      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'flatlist' && styles.tabActive]}
          accessibilityLabel="tab-flatlist"
          onPress={() => {
            setActiveTab('flatlist');
            log('tab-flatlist');
          }}>
          <Text style={[styles.tabText, activeTab === 'flatlist' && styles.tabTextActive]}>
            FlatList
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sectionlist' && styles.tabActive]}
          accessibilityLabel="tab-sectionlist"
          onPress={() => {
            setActiveTab('sectionlist');
            log('tab-sectionlist');
          }}>
          <Text style={[styles.tabText, activeTab === 'sectionlist' && styles.tabTextActive]}>
            SectionList
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {FILTERS.map((f, i) => (
          <FilterChip
            key={f}
            label={f}
            active={activeFilter === i}
            onPress={() => {
              setActiveFilter(i);
              log(`filter-chip: ${f}`);
            }}
          />
        ))}
      </View>

      {activeTab === 'flatlist' ? (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => <ProductCard item={item} />}
          ListHeaderComponent={
            <Text style={styles.listHeader}>
              {filteredData.length} products shown
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products in this category.</Text>
            </View>
          }
        />
      ) : (
        <SectionList
          sections={SECTION_DATA}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => <ProductCard item={item} />}
          renderSectionHeader={({section}) => (
            <SectionHeader title={section.title} />
          )}
          stickySectionHeadersEnabled
        />
      )}
    </View>
  );
};

export default AutoTrackFlatListTest;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.lighter},

  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText:       {fontSize: 14, color: Colors.dark, fontWeight: '500'},
  tabTextActive: {color: Colors.primary, fontWeight: '700'},

  filterRow: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: Colors.white,
  },
  chipActive:     {backgroundColor: Colors.primary, borderColor: Colors.primary},
  chipText:       {fontSize: 13, color: Colors.darker},
  chipTextActive: {color: Colors.white, fontWeight: '600'},

  listContent: {padding: 12, paddingBottom: 32},
  listHeader:  {fontSize: 12, color: Colors.dark, marginBottom: 10},

  emptyContainer: {padding: 40, alignItems: 'center'},
  emptyText:      {fontSize: 14, color: Colors.dark},

  sectionHeader: {
    backgroundColor: Colors.lighter,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    marginBottom: 4,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft:     {flex: 1},
  cardNameRow:  {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3},
  cardName:     {fontSize: 14, fontWeight: '600', color: Colors.darker},
  cardCategory: {fontSize: 12, color: Colors.dark},
  cardRight:    {alignItems: 'flex-end', gap: 6},
  cardPrice:    {fontSize: 14, fontWeight: '700', color: Colors.primary},

  badge: {
    backgroundColor: Colors.orange,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {color: Colors.white, fontSize: 10, fontWeight: '700'},

  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addButtonText: {color: Colors.white, fontSize: 12, fontWeight: '600'},

  favoriteButton: {
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  favoriteText: {fontSize: 16, color: Colors.dark},
});
