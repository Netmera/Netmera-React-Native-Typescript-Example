/*
 * Copyright (c) 2026 Netmera Research.
 */

import {NMCategoryChannel, NMCategoryChannelPreference} from 'react-native-netmera';

export const ALL_CATEGORY_CHANNELS: NMCategoryChannel[] = Object.values(NMCategoryChannel);

export const isKnownCategoryChannel = (
  channel?: string,
): channel is NMCategoryChannel =>
  channel !== undefined && (ALL_CATEGORY_CHANNELS as string[]).includes(channel);

export interface ChannelPreferenceEntry {
  channel?: string;
  optInStatus?: boolean;
}

/** Dedupes by channel; entries with an unrecognized/missing channel are all kept. */
export const dedupeChannelPreferences = (
  preferences?: NMCategoryChannelPreference[],
): ChannelPreferenceEntry[] => {
  const seenChannels = new Set<string>();
  const result: ChannelPreferenceEntry[] = [];
  (preferences ?? []).forEach(preference => {
    if (preference.channel !== undefined) {
      if (seenChannels.has(preference.channel)) {
        return;
      }
      seenChannels.add(preference.channel);
    }
    result.push({channel: preference.channel, optInStatus: preference.optInStatus});
  });
  return result;
};

export type RowSaveStatus =
  | {kind: 'idle'}
  | {kind: 'saving'; enabled: boolean}
  | {kind: 'failed'; reason: string};

export const IDLE_STATUS: RowSaveStatus = {kind: 'idle'};

export const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);
