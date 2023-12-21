import { navigation } from './store';

export { default as Drawer } from './components/Drawer/index.svelte';
export { default as Header } from './components/Header/index.svelte';
export { default as Screen } from './components/Screen/index.svelte';
export { default as Stack } from './components/Stack/index.svelte';
export { default as Tab } from './components/Tab/index.svelte';
export { default as TabView } from './components/TabView/index.svelte';
export { default as NavigationBar } from './components/NavigationBar.svelte';

export { navigation } from './store';

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', (event) => {
    console.log(event);
    // Assuming navigation is a function that handles the back action
    navigation?.back();
  });
}
