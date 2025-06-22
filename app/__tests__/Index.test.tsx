jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        SUPABASE_URL: 'https://test.supabase',
        SUPABASE_ANON_KEY: 'anon-test-key',
      },
    },
  },
}));


// Avoid requiring the real expo-router module in tests
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

// Simplify native modules that rely on browser APIs
jest.mock('expo-status-bar', () => ({ StatusBar: () => null }));

// Mock SVG imports used in components
jest.mock('../../assets/powerpick_logo_full.svg', () => 'PowerpickLogo');

import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from '../../lib/theme'; // ← correct import name
import IndexScreen from '../../app/index';

test('renders default region label', () => {
  const tree = render(
    <PaperProvider>
      <ThemeProvider>
        <IndexScreen />
      </ThemeProvider>
    </PaperProvider>
  );
  // Assert on visible UI text rather than accessibility label
  expect(tree.getByText('Australia')).toBeTruthy();
});
