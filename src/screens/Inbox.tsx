/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation, usePreventRemove} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  Netmera,
  NetmeraCategory,
  NetmeraCategoryFilter,
  NetmeraInboxFilter,
  NetmeraPushObject,
  NMInboxStatus,
  NMInboxStatusCountFilter,
} from 'react-native-netmera';
import ActionMenu from '../ui/ActionMenu';
import TextButton from '../ui/TextButton';
import AppColors from '../ui/AppColors';
import {errorMessage} from '../helpers/CategoryChannelUtils';

type Chip = {kind: 'all'} | {kind: 'unread'} | {kind: 'category'; name: string};

interface Counts {
  total: number;
  unread: number;
  deleted: number;
}

const PAGE_SIZES = [1, 2, 5, 10, 20];

const chipKey = (chip: Chip) => (chip.kind === 'category' ? chip.name : chip.kind);

const formatDate = (sendDate?: string) => {
  if (!sendDate) {
    return '';
  }
  const date = new Date(isNaN(Number(sendDate)) ? sendDate : Number(sendDate));
  if (isNaN(date.getTime())) {
    return sendDate;
  }
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'});
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString(undefined, {day: 'numeric', month: 'short'});
};

const distinctCategoryCount = (categories: NetmeraCategory[]) =>
  new Set(categories.map(category => category.categoryName)).size;

const toRanges = (indexes: number[]): [number, number][] => {
  const ranges: [number, number][] = [];
  [...indexes]
    .sort((a, b) => a - b)
    .forEach(index => {
      const last = ranges[ranges.length - 1];
      if (last && last[1] === index) {
        last[1] = index + 1;
      } else {
        ranges.push([index, index + 1]);
      }
    });
  return ranges;
};

const Inbox = () => {
  const navigation = useNavigation<any>();

  const [chip, setChip] = useState<Chip>({kind: 'all'});
  const [showDeleted, setShowDeleted] = useState(false);
  const [includeExpired, setIncludeExpired] = useState(true);
  const [pageSize, setPageSize] = useState(10);

  const [messages, setMessages] = useState<NetmeraPushObject[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [counts, setCounts] = useState<Counts>();
  const [preferenceCategories, setPreferenceCategories] = useState<{id?: number; name: string}[]>(
    [],
  );
  const [summary, setSummary] = useState<NetmeraCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>();
  // Only the latest request may write: index-based updates point into the SDK's last list.
  const fetchGeneration = useRef(0);
  const summaryGeneration = useRef(0);

  const [selection, setSelection] = useState<Set<number> | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const selectedCategory = chip.kind === 'category' ? chip.name : undefined;
  const selectedCategoryId = preferenceCategories.find(c => c.name === selectedCategory)?.id;
  const listStatus =
    chip.kind === 'unread'
      ? NMInboxStatus.STATUS_UNREAD
      : showDeleted
      ? NMInboxStatus.STATUS_ALL
      : NMInboxStatus.STATUS_READ_OR_UNREAD;

  const fetchCounts = useCallback(async () => {
    const filter = new NMInboxStatusCountFilter();
    filter.nmInboxStatus = NMInboxStatus.STATUS_ALL;
    filter.includeExpired = includeExpired;
    if (selectedCategoryId !== undefined) {
      filter.categoryList = [selectedCategoryId];
    }
    try {
      const result = await Netmera.getInboxCountForStatus(filter);
      const unread = Number(result[NMInboxStatus.STATUS_UNREAD] ?? 0);
      setCounts({
        total: Number(result[NMInboxStatus.STATUS_READ] ?? 0) + unread,
        unread,
        deleted: Number(result[NMInboxStatus.STATUS_DELETED] ?? 0),
      });
    } catch {
      setCounts(undefined);
    }
  }, [includeExpired, selectedCategoryId]);

  const loadCategorySummary = useCallback(async () => {
    const filter = new NetmeraCategoryFilter();
    filter.status = showDeleted ? NMInboxStatus.STATUS_ALL : NMInboxStatus.STATUS_READ_OR_UNREAD;
    filter.pageSize = pageSize;
    filter.includeExpiredObjects = includeExpired;
    const generation = ++summaryGeneration.current;
    const isLatest = () => generation === summaryGeneration.current;
    try {
      // Kept as the SDK has it: category updates go by index into this list.
      let categories = await Netmera.fetchCategory(filter);
      if (!isLatest()) {
        return;
      }
      setSummary(categories);
      // A page can repeat known categories, which the SDK still appends.
      for (;;) {
        const known = distinctCategoryCount(categories);
        try {
          categories = await Netmera.fetchNextCategoryPage();
        } catch {
          break;
        }
        if (!isLatest()) {
          return;
        }
        setSummary(categories);
        if (distinctCategoryCount(categories) <= known) {
          break;
        }
      }
    } catch {
      if (isLatest()) {
        setSummary([]);
      }
    }
  }, [includeExpired, pageSize, showDeleted]);

  const fetchMessages = useCallback(async () => {
    const filter = new NetmeraInboxFilter();
    filter.status = listStatus;
    filter.pageSize = pageSize;
    filter.includeExpiredObjects = includeExpired;
    if (selectedCategory) {
      filter.categories = [selectedCategory];
    }
    const generation = ++fetchGeneration.current;
    setSelection(null);
    setLoading(true);
    try {
      const fetched = await Netmera.fetchInbox(filter);
      if (generation !== fetchGeneration.current) {
        return;
      }
      setMessages(fetched);
      setHasNextPage(true);
      setError(undefined);
      fetchCounts();
      loadCategorySummary();
    } catch (e) {
      if (generation === fetchGeneration.current) {
        setError(errorMessage(e));
      }
    } finally {
      if (generation === fetchGeneration.current) {
        setLoading(false);
      }
    }
  }, [includeExpired, listStatus, pageSize, selectedCategory, fetchCounts, loadCategorySummary]);

  const loadPreferenceCategories = useCallback(async () => {
    try {
      const preferences = await Netmera.getUserCategoryPreferenceList();
      setPreferenceCategories(
        preferences
          .filter(preference => preference.categoryName)
          .map(preference => ({id: preference.categoryId, name: preference.categoryName!})),
      );
    } catch {
      setPreferenceCategories([]);
    }
  }, []);

  useEffect(() => {
    setMessages([]);
  }, [listStatus, selectedCategory, includeExpired, pageSize]);

  useFocusEffect(
    useCallback(() => {
      fetchMessages();
    }, [fetchMessages]),
  );

  useFocusEffect(
    useCallback(() => {
      loadPreferenceCategories();
    }, [loadPreferenceCategories]),
  );

  const refresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
  };

  usePreventRemove(selection !== null, () => setSelection(null));

  const loadNextPage = async () => {
    const generation = fetchGeneration.current;
    try {
      const all = await Netmera.fetchNextPage();
      if (generation === fetchGeneration.current) {
        setHasNextPage(all.length > messages.length);
        setMessages(all);
      }
    } catch {
      if (generation === fetchGeneration.current) {
        setHasNextPage(false);
      }
    }
  };

  const runUpdate = async (update: () => Promise<unknown>) => {
    try {
      await update();
      Toast.show({type: 'info', text1: 'Inbox updated.', position: 'bottom'});
    } catch (e) {
      Toast.show({type: 'error', text1: 'Something went wrong', text2: errorMessage(e)});
    }
    fetchMessages();
  };

  const updateAllMessages = (status: NMInboxStatus) => {
    if (!selectedCategory) {
      runUpdate(() => Netmera.updateAll(status));
      return;
    }
    const index = summary.findIndex(category => category.categoryName === selectedCategory);
    if (index < 0) {
      Toast.show({type: 'error', text1: `"${selectedCategory}" is not in the category summary`});
      return;
    }
    runUpdate(() => Netmera.updateStatusByCategories(index, index + 1, status));
  };

  const confirmDeleteAll = () => {
    Alert.alert(
      'Delete all messages?',
      selectedCategory
        ? `All messages in "${selectedCategory}" will be deleted.`
        : 'All inbox messages will be deleted.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => updateAllMessages(NMInboxStatus.STATUS_DELETED),
        },
      ],
    );
  };

  const updateSelection = (status: NMInboxStatus) => {
    const ranges = toRanges([...(selection ?? [])]);
    setSelection(null);
    runUpdate(async () => {
      for (const [from, to] of ranges) {
        await Netmera.inboxUpdateStatus(from, to, status);
      }
    });
  };

  const toggleSelected = (index: number) => {
    setSelection(current => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const openMessage = async (message: NetmeraPushObject, index: number) => {
    let opened = message;
    if (message.inboxStatus === NMInboxStatus.STATUS_UNREAD) {
      try {
        await Netmera.inboxUpdateStatus(index, index + 1, NMInboxStatus.STATUS_READ);
        opened = {...message, inboxStatus: NMInboxStatus.STATUS_READ};
      } catch (e) {
        Toast.show({type: 'error', text1: 'Something went wrong', text2: errorMessage(e)});
      }
    }
    navigation.navigate('InboxDetail', {message: opened, index});
  };

  useLayoutEffect(() => {
    navigation.setOptions(
      selection
        ? {
            title: `${selection.size} selected`,
            headerBackVisible: false,
            headerLeft: () => (
              <TextButton
                testID="inbox.selection.cancel"
                title="Cancel"
                onPress={() => setSelection(null)}
              />
            ),
            headerRight: undefined,
          }
        : {
            title: 'Inbox',
            headerBackVisible: true,
            headerLeft: undefined,
            headerRight: () => (
              <TextButton
                testID="inbox.list.menu"
                title="⋯"
                accessibilityLabel="Inbox options"
                onPress={() => setMenuVisible(true)}
              />
            ),
          },
    );
  }, [navigation, selection]);

  const chips: Chip[] = [
    {kind: 'all'},
    {kind: 'unread'},
    ...[
      ...new Set([
        ...preferenceCategories.map(category => category.name),
        ...summary
          .map(category => category.categoryName ?? '')
          .filter(Boolean)
          .sort(),
      ]),
    ].map(name => ({kind: 'category' as const, name})),
  ];

  const chipTitle = (item: Chip) => {
    if (item.kind === 'all') {
      return 'All';
    }
    if (item.kind === 'unread') {
      return 'Unread';
    }
    const unread = summary.find(category => category.categoryName === item.name)?.unreadCount ?? 0;
    return unread > 0 ? `${item.name} · ${unread}` : item.name;
  };

  const summaryText =
    counts && messages.length > 0
      ? `${counts.total} message(s) · ${counts.unread} unread` +
        (showDeleted ? ` · ${counts.deleted} deleted` : '')
      : '';

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        testID="inbox.list.chips"
        showsHorizontalScrollIndicator={false}
        style={styles.chipBar}
        contentContainerStyle={styles.chipBarContent}
      >
        {chips.map(item => {
          const isSelected = chipKey(item) === chipKey(chip);
          return (
            <Pressable
              key={chipKey(item)}
              testID={`inbox.list.chip.${item.kind === 'category' ? item.name : chipTitle(item)}`}
              accessibilityRole="button"
              accessibilityState={{selected: isSelected, disabled: selection !== null}}
              disabled={selection !== null}
              onPress={() => setChip(item)}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {chipTitle(item)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {error ? (
        <View testID="inbox.list.errorBanner" style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TextButton testID="inbox.list.retry" title="Retry" destructive onPress={fetchMessages} />
        </View>
      ) : null}

      <FlatList
        testID="inbox.list"
        data={messages}
        keyExtractor={(item, index) => item.pushInstanceId ?? `${item.pushId}-${index}`}
        refreshControl={
          selection ? undefined : <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        ListHeaderComponent={
          summaryText ? (
            <Text testID="inbox.list.summary" style={styles.summary}>
              {summaryText}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          loading ? null : (
            <View testID="inbox.list.emptyState" style={styles.empty}>
              <Text style={styles.emptyTitle}>No messages</Text>
              <Text style={styles.emptyHint}>Pull down to refresh</Text>
            </View>
          )
        }
        renderItem={({item, index}) => (
          <InboxRow
            message={item}
            index={index}
            selected={selection?.has(index) ?? false}
            selecting={selection !== null}
            disabled={loading}
            onPress={() => (selection ? toggleSelected(index) : openMessage(item, index))}
            onLongPress={() => setSelection(current => current ?? new Set([index]))}
          />
        )}
      />

      {selection ? (
        <View testID="inbox.list.selectionToolbar" style={styles.toolbar}>
          {(
            [
              ['read', 'Mark as read', NMInboxStatus.STATUS_READ],
              ['unread', 'Mark as unread', NMInboxStatus.STATUS_UNREAD],
              ['delete', 'Delete', NMInboxStatus.STATUS_DELETED],
            ] as const
          ).map(([id, title, status]) => (
            <TextButton
              key={id}
              testID={`inbox.list.selection.${id}`}
              title={title}
              destructive={id === 'delete'}
              disabled={selection.size === 0}
              onPress={() => updateSelection(status)}
            />
          ))}
        </View>
      ) : null}

      <ActionMenu
        visible={menuVisible}
        testID="inbox.menu"
        onClose={() => setMenuVisible(false)}
        sections={[
          [
            {
              id: 'select',
              title: 'Select messages',
              disabled: messages.length === 0,
              onPress: () => setSelection(new Set()),
            },
            {
              id: 'markAllRead',
              title: 'Mark all as read',
              onPress: () => updateAllMessages(NMInboxStatus.STATUS_READ),
            },
            {
              id: 'markAllUnread',
              title: 'Mark all as unread',
              onPress: () => updateAllMessages(NMInboxStatus.STATUS_UNREAD),
            },
            {id: 'deleteAll', title: 'Delete all', destructive: true, onPress: confirmDeleteAll},
          ],
          [
            {
              id: 'showDeleted',
              title: 'Show deleted messages',
              checked: showDeleted,
              onPress: () => setShowDeleted(value => !value),
            },
            {
              id: 'includeExpired',
              title: 'Include expired messages',
              checked: includeExpired,
              onPress: () => setIncludeExpired(value => !value),
            },
            {
              id: 'loadNextPage',
              title: 'Load next page',
              disabled: !hasNextPage || loading,
              onPress: loadNextPage,
            },
          ],
          PAGE_SIZES.map(size => ({
            id: `pageSize.${size}`,
            title: `Page size: ${size}`,
            checked: size === pageSize,
            onPress: () => setPageSize(size),
          })),
        ]}
      />
    </View>
  );
};

interface InboxRowProps {
  message: NetmeraPushObject;
  index: number;
  selected: boolean;
  selecting: boolean;
  disabled: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

// Disabled while fetching: actions go by index into the SDK's list, which may already differ.
const InboxRow = ({
  message,
  index,
  selected,
  selecting,
  disabled,
  onPress,
  onLongPress,
}: InboxRowProps) => {
  const isUnread = message.inboxStatus === NMInboxStatus.STATUS_UNREAD;
  const isDeleted = message.inboxStatus === NMInboxStatus.STATUS_DELETED;
  const title = message.title || message.body || '(No content)';
  const body = message.title ? message.body : undefined;

  return (
    <Pressable
      testID={`inbox.list.cell.${index}`}
      accessibilityRole="button"
      accessibilityState={{selected, disabled}}
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({pressed}) => [styles.row, (pressed || selected) && styles.rowHighlighted]}
    >
      {selecting ? <Text style={styles.selectMark}>{selected ? '●' : '○'}</Text> : null}
      <View style={[styles.rowContent, isDeleted && styles.deleted]}>
        <View style={styles.rowHeader}>
          {isUnread ? <View style={styles.unreadDot} /> : null}
          <Text style={[styles.rowTitle, isUnread && styles.rowTitleUnread]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.rowDate}>{isDeleted ? 'Deleted' : formatDate(message.sendDate)}</Text>
        </View>
        {body ? (
          <Text style={styles.rowBody} numberOfLines={2}>
            {body}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.surface,
  },
  chipBar: {
    flexGrow: 0,
  },
  chipBarContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    justifyContent: 'center',
    backgroundColor: AppColors.groupedBackground,
  },
  chipSelected: {
    backgroundColor: AppColors.primary,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '500',
    color: AppColors.label,
  },
  chipTextSelected: {
    color: AppColors.surface,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 4,
    paddingLeft: 12,
    paddingRight: 4,
    borderRadius: 8,
    backgroundColor: AppColors.destructiveBackground,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: AppColors.destructive,
  },
  summary: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    fontSize: 13,
    color: AppColors.mutedText,
  },
  empty: {
    alignItems: 'center',
    padding: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.mutedText,
  },
  emptyHint: {
    fontSize: 14,
    color: AppColors.mutedText,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.divider,
  },
  rowHighlighted: {
    backgroundColor: AppColors.selected,
  },
  selectMark: {
    marginRight: 12,
    fontSize: 18,
    color: AppColors.primary,
  },
  rowContent: {
    flex: 1,
    gap: 4,
  },
  deleted: {
    opacity: 0.5,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
  },
  rowTitle: {
    flex: 1,
    fontSize: 16,
    color: AppColors.label,
  },
  rowTitleUnread: {
    fontWeight: '600',
  },
  rowDate: {
    fontSize: 13,
    color: AppColors.mutedText,
  },
  rowBody: {
    fontSize: 15,
    color: AppColors.mutedText,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: AppColors.divider,
    backgroundColor: AppColors.surface,
  },
});

export default Inbox;
