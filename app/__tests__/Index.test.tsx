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

// Mock fetchGames to avoid real network requests
jest.mock('../../lib/gamesApi', () => ({
  fetchGames: jest.fn().mockResolvedValue([]),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from '../../lib/theme'; // ← correct import name
import IndexScreen from '../../app/index';

test('renders without crashing', () => {
  const tree = render(
    <PaperProvider>
      <ThemeProvider>
        <IndexScreen />
      </ThemeProvider>
    </PaperProvider>
  );
  expect(tree.getByText(/Powerpick/i)).toBeTruthy();
});
