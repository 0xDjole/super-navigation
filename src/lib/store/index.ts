import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import lodash from 'lodash';
import { getScreenPath, getPathFromUrl } from '../utils';
import type { Navigate } from '../types';

const createNavigateStore = () => {
	if (!browser) {
		return null;
	}

	const { subscribe, update } = writable<Navigate>({
		loaded: false,
		navigating: false,
		url: '',
		navigationPath: {},
		navigation: {
			screens: [],
			history: []
		}
	});

	const afterBack = (basePath) => {
		update((prevState) => {
			prevState.navigating = false;

			const historyPath = basePath.history;
			const history = lodash.get(prevState.navigation, historyPath);
			lodash.set(prevState.navigation, historyPath, history.slice(0, -1));
			return prevState;
		});
	};

	const back = async (isDefaultBack = false) =>
		update((prevState) => {
			if (prevState.navigating) {
				return prevState;
			}

			const navigationPath = prevState.navigationPath[window.location.pathname];

			prevState.navigating = true;

			const basePath = getScreenPath(navigationPath, true);

			if (basePath) {
				const parentNavigator = basePath.base
					? lodash.get(prevState.navigation, basePath.base).navigation
					: prevState.navigation;

				const navHistory = parentNavigator.history;
				const navScreens = parentNavigator.screens;
				const lastHistoryScreen = navHistory[navHistory.length - 1];

				parentNavigator.screens[lastHistoryScreen].opened = false;
				parentNavigator.screens[lastHistoryScreen].animate = true;

				let backFullPath;

				const currentUrl = new URL(window.location.href);

				const persistentParams = parentNavigator.screens[lastHistoryScreen].persistentParams;

				for (const [key, value] of currentUrl.searchParams) {
					if (!persistentParams.includes(key)) {
						currentUrl.searchParams.delete(key, value);
					}
				}

				let params = currentUrl.searchParams.toString();

				if (!isDefaultBack && navHistory && navHistory.length > 1) {
					const beforeLastHistoryScreen = navHistory[navHistory.length - 2];

					backFullPath = parentNavigator.screens[beforeLastHistoryScreen].fullPath + '?' + params;
					parentNavigator.screens[beforeLastHistoryScreen].opened = true;
					parentNavigator.screens[beforeLastHistoryScreen].animate = false;
				} else {
					const backScreenIdx = navScreens.findIndex(
						(screen) => screen.path === parentNavigator.screens[lastHistoryScreen].backDefault
					);

					const backScreen = navScreens[backScreenIdx];

					parentNavigator.screens[backScreenIdx].opened = true;
					parentNavigator.screens[backScreenIdx].animate = false;

					parentNavigator.history = [backScreen.index, lastHistoryScreen];

					backFullPath = parentNavigator.screens[lastHistoryScreen].backDefault + '?' + params;
				}

				const urlObject = new URL(`${window.location.origin}${backFullPath}`);

				for (const [key, value] of urlObject.searchParams) {
					urlObject.searchParams.set(key, value);
				}

				window.history.replaceState({}, '', urlObject.toString());
				prevState.url = urlObject.toString();
			}

			setTimeout(() => {
				afterBack(basePath);
			}, 800);

			return prevState;
		});

	const loadUp = () => {
		update((prevState) => {
			prevState.loaded = true;
			return prevState;
		});
	};

	return {
		subscribe,
		back,

		getSearchParam: (param) => {
			const url = new URL(window.location.href);
			return url.searchParams.get(param);
		},
		init: (screens, navigationType, urlObject, navigationPath, defaultIndex) =>
			update((prevState) => {
				const path = urlObject.pathname;
				const fullPath = `${urlObject.pathname}${urlObject.search}`;
				let activeScreenIndex = screens.findIndex((screen) => screen.path === path);

				if (activeScreenIndex === -1) {
					activeScreenIndex = defaultIndex;
				}

				const basePath = getScreenPath(navigationPath, false);
				const navScreens = lodash.get(prevState.navigation, basePath.base);

				const wantedScreen = screens.find((screen) => screen.path === window.location.pathname);

				if (wantedScreen && wantedScreen.onInit) {
					wantedScreen.onInit();
				}

				const parsedScreens = screens.map((screen, index) => {
					prevState.navigationPath[screen.path] = [
						...navigationPath,
						{
							navigationType,
							index
						}
					];

					return {
						component: screen.component,
						loader: screen.loader,
						backComponent: screen.backComponent,
						props: screen.props,
						title: screen.title,
						path: screen.path,
						fullPath: urlObject.pathname == screen.path ? fullPath : screen.path,
						onNavigate: screen.onNavigate,
						onInit: screen.onInit,
						backDefault: screen.backDefault,
						persistentParams: screen.persistentParams,
						navigation: {
							history: [],
							screens: []
						},
						index,
						opened:
							navigationType === 'Stack' || navigationType === 'Drawer'
								? true
								: activeScreenIndex === index,
						animate: false,
						navigationPath: [
							...navigationPath,
							{
								navigationType,
								index,
								active: true
							}
						]
					};
				});

				const url = new URL(window.location.href);

				for (const [key, value] of url.searchParams) {
					url.searchParams.set(key, value);
				}
				window.history.replaceState({}, '', url.toString());

				prevState.url = url.toString();

				if (navigationType === 'Stack') {
					if (!navScreens?.navigation?.history.length) {
						lodash.set(prevState.navigation, basePath.screens, parsedScreens);
						lodash.set(prevState.navigation, basePath.history, [activeScreenIndex]);
					}

					return prevState;
				}

				if (navigationType === 'Drawer') {
					if (!navScreens?.navigation?.history.length) {
						lodash.set(prevState.navigation, basePath.screens, parsedScreens);
						lodash.set(prevState.navigation, basePath.history, [activeScreenIndex]);
					}

					return prevState;
				}

				if (navigationType === 'Tab') {
					if (!navScreens.navigation.history.length) {
						lodash.set(prevState.navigation, basePath.screens, parsedScreens);
					}

					return prevState;
				}
			}),

		navigate: (url, { reload } = { reload: false }, callback = () => {}) =>
			update((prevState) => {
				const navigationPath = prevState.navigationPath[window.location.pathname];

				if (prevState.navigating) {
					return prevState;
				}

				prevState.navigating = true;

				if (reload) {
					goto(url);
					return null;
				}
				const path = getPathFromUrl(url);

				const wantedNavigationPath = prevState.navigationPath[path];

				const urlObject = new URL(`${window.location.origin}${url}`);
				console.log('url ', urlObject);

				wantedNavigationPath.forEach((wantedPathItem, index) => {
					if (navigationPath[index]) {
						if (wantedPathItem.index !== navigationPath[index].index) {
							const wantedBasePath = getScreenPath(wantedNavigationPath.slice(0, index), false);
							const navScreens = lodash.get(prevState.navigation, wantedBasePath.screens);

							const wantedScreenIndex = navScreens.findIndex((sc) => sc.path === path);
							const wantedNavScreen = navScreens[wantedScreenIndex];

							if (wantedNavScreen.onNavigate) {
								const result = wantedNavScreen.onNavigate();

								if (!result) {
									return null;
								}
							}

							const navType =
								wantedNavScreen.navigationPath[wantedNavScreen.navigationPath.length - 1]
									.navigationType;

							if (navType === 'Stack') {
								for (const [key, value] of urlObject.searchParams) {
									urlObject.searchParams.set(key, value);
								}
								window.history.replaceState({}, '', urlObject.toString());

								wantedNavScreen.opened = true;
								wantedNavScreen.animate = true;
								wantedNavScreen.fullPath = url;

								const history = lodash.get(prevState.navigation, wantedBasePath.history);

								if (history[history.length - 1] !== wantedScreenIndex) {
									lodash.set(prevState.navigation, wantedBasePath.history, [
										...history,
										wantedScreenIndex
									]);
								}
							}

							if (navType === 'Drawer') {
								for (const [key, value] of urlObject.searchParams) {
									urlObject.searchParams.set(key, value);
								}
								window.history.replaceState({}, '', urlObject.toString());

								prevState.url = urlObject.toString();

								wantedNavScreen.opened = true;
								wantedNavScreen.animate = true;
								wantedNavScreen.fullPath = url;

								const history = lodash.get(prevState.navigation, wantedBasePath.history);

								// Keep only the last screen and the new screen in history
								const newHistory = [history[history.length - 1], wantedScreenIndex];
								lodash.set(prevState.navigation, wantedBasePath.history, newHistory);

								setTimeout(() => {
									update((prevState) => {
										const currentScreenPath = wantedBasePath + `screens[${history[0]}]`;
										const openedPath = currentScreenPath + '.opened';
										const animatePath = currentScreenPath + '.animate';

										const updatedHistory = lodash.get(prevState.navigation, wantedBasePath.history);

										lodash.set(prevState.navigation, wantedBasePath.history, [updatedHistory[1]]);
										lodash.set(prevState.navigation, openedPath, false);
										lodash.set(prevState.navigation, animatePath, false);

										prevState.navigating = false;
										return prevState;
									});
								}, 800);
							}

							if (navType === 'Tab') {
								for (let i = 0; i < navScreens.length; i++) {
									navScreens[i].opened = i === wantedScreenIndex;

									if (i === wantedScreenIndex) {
										let currentScreen = navScreens[i];

										while (currentScreen?.navigation?.history?.length) {
											const lastHistoryIndex =
												currentScreen.navigation.history[
													currentScreen.navigation.history.length - 1
												];

											currentScreen = currentScreen.navigation.screens[lastHistoryIndex];
											window.history.replaceState({}, '', currentScreen.fullPath);

											prevState.url = currentScreen.fullPath;
										}
									}
								}
							}
						}
					}
				});

				setTimeout(() => {
					prevState.navigating = false;
					return prevState;
				}, 800);

				return prevState;
			}),
		loadUp
	};
};

export const navigation = createNavigateStore();
