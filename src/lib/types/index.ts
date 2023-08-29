export interface NavPath {
  navigationType: 'Stack' | 'Tab' | 'Drawer';
  opened: boolean;
  index: number;
}

export interface NavPaths {
  screens: string;
  history: string;
  base: string;
}

export interface ScreenItem {
  path: string;
  fullPath: string;
  component: unknown;
  title: string;
  navigationPath: NavPath[];
  index: number;
  opened: boolean;
  animate: boolean;
  navigation: NavItem;
}

export interface NavItem {
  screens: ScreenItem[];
  history: number[];
}

export interface Navigate {
  navigation: NavItem;
  navigationPath: Record<string, any>;
  navigating: boolean;
  loaded: boolean;
}
