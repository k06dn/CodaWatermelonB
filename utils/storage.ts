import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage utility to replace localStorage with AsyncStorage for React Native
 * Provides a similar API to localStorage but with async operations
 */

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

/**
 * Hook-friendly storage functions that can be used in effects
 */
export const storageHelpers = {
  async loadDyslexiaSettings() {
    const savedSettings = await storage.getItem('coda-dyslexia-settings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error('Failed to parse dyslexia settings', e);
        return null;
      }
    }
    return null;
  },

  async saveDyslexiaSettings(settings: any) {
    await storage.setItem('coda-dyslexia-settings', JSON.stringify(settings));
  },

  async isOnboardingComplete(): Promise<boolean> {
    const complete = await storage.getItem('coda-onboarding-complete');
    return complete === 'true';
  },

  async getUserName(): Promise<string | null> {
    return await storage.getItem('coda-user-name');
  },

  async setOnboardingComplete(data: {
    name: string;
    communicationMethods: string[];
    challenges: string[];
  }) {
    await storage.setItem('coda-onboarding-complete', 'true');
    await storage.setItem('coda-user-name', data.name);
    await storage.setItem('coda-communication-methods', JSON.stringify(data.communicationMethods));
    await storage.setItem('coda-challenges', JSON.stringify(data.challenges));
  },
};
