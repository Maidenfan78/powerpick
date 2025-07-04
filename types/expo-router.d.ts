declare module "expo-router" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const navigateMock: jest.Mock<any, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const pushMock: jest.Mock<any, any>;
  export function useRouter(): any;
  export function useLocalSearchParams<T extends Record<string, string>>(): T;
  export function usePathname(): any;
  export const Stack: any;
}
