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

// Mock supabase client to avoid real network requests
jest.mock('../../lib/supabase', () => {
  const from = jest.fn(() => ({
    select: jest.fn().mockResolvedValue({ count: 1, data: [], error: null }),
  }));
  return { supabase: { from } };
});

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
