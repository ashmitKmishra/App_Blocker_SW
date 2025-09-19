// Module shims for editor/TS diagnostics in this workspace. These are minimal and used to
// silence type errors while dev dependencies are installed. Replace with proper types
// by installing packages like @types/react, @reduxjs/toolkit, etc.

declare module 'react' {
  const React: any;
  export default React;
  export function useState<T = any>(initial?: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void];
  export function useEffect(cb: any, deps?: any[]): void;
  export function useRef<T = any>(init?: T): { current: T };
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps?: any[]): T;
  export function useMemo<T>(fn: () => T, deps?: any[]): T;
  export function createRef<T = any>(): { current: T | null };
  export type RefObject<T> = { current: T | null };
  export const Fragment: any;
}

declare module 'react/jsx-runtime' {
  const jsx: any;
  export { jsx };
}

declare module 'react-native' {
  // Provide minimal exports used across the app
  export const View: any;
  export const Text: any;
  export const Button: any;
  export const FlatList: any;
  export const StyleSheet: any;
  export const TouchableOpacity: any;
  export const TextInput: any;
  export const Image: any;
  export const Platform: any;
  export const Dimensions: any;
  export default any;
}

declare module 'react-native-gesture-handler' {
  export const GestureHandlerRootView: any;
  export default any;
}

declare module 'react-native-safe-area-context' {
  export const SafeAreaProvider: any;
}

declare module 'react-redux' {
  export const useSelector: any;
  export const useDispatch: any;
  export const Provider: any;
  export const connect: any;
  export default any;
}

declare module '@reduxjs/toolkit' {
  export const configureStore: any;
  export const combineReducers: any;
  export const createSlice: any;
  export const createAsyncThunk: any;
  export const createSelector: any;
  export default any;
}

declare module '@react-navigation/native' {
  export const NavigationContainer: any;
  export const useNavigation: any;
  export default any;
}

declare module '@react-navigation/native-stack' {
  export const createNativeStackNavigator: any;
  export type NativeStackScreenProps<ParamList = any, RouteName extends keyof ParamList = any> = any;
  export default any;
}

// Wildcard module support for local TS/TSX files when type checking is missing
declare module '*.ts' {
  const v: any;
  export default v;
}

declare module '*.tsx' {
  const v: any;
  export default v;
}

declare module '@react-native-async-storage/async-storage' {
  export = any;
}

declare module '@react-native-mmkv/mmkv' {
  export = any;
}

declare module 'react-native-reanimated' {
  export = any;
}

declare module 'react-native-reanimated/plugin' {
  export = any;
}

// Allow any jsx intrinsic elements in TSX while types are missing
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
