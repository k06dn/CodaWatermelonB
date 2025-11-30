import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageHelpers } from '../utils/storage';

export interface DyslexiaSettings {
  colorTheme?: string;
  lineSpacing?: number[];
  letterSpacing?: number[];
  wordSpacing?: number[];
  textSize?: number[];
  paragraphSpacing?: number[];
  fontFamily?: 'default' | 'dyslexic' | 'arial';
  colorOverlay?: string;
}

interface ThemeContextType {
  settings: DyslexiaSettings;
  updateSettings: (newSettings: DyslexiaSettings) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<DyslexiaSettings>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedSettings = await storageHelpers.loadDyslexiaSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
    setIsLoading(false);
  };

  const updateSettings = async (newSettings: DyslexiaSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await storageHelpers.saveDyslexiaSettings(updatedSettings);
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Get computed text styles based on dyslexia settings
 */
export function useTextStyles() {
  const { settings } = useTheme();

  const getFontFamily = () => {
    if (settings.fontFamily === 'dyslexic') {
      return 'System'; // React Native will use system font, can be customized
    } else if (settings.fontFamily === 'arial') {
      return 'Arial';
    }
    return undefined; // Use default
  };

  return {
    fontFamily: getFontFamily(),
    lineHeight: settings.lineSpacing ? settings.lineSpacing[0] / 100 : undefined,
    letterSpacing: settings.letterSpacing ? settings.letterSpacing[0] / 10 : undefined,
    fontSize: settings.textSize ? settings.textSize[0] / 100 : undefined,
  };
}
