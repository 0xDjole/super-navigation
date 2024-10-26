import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import lodash from 'lodash';
import { getScreenPath, getPathFromUrl } from '../utils';
import type { Navigate } from '../types';

const createNavigateStore = () => {
	if (!browser) {
		return null;
	}

	let state = $state<Navigate>({
		loaded: false,
		navigating: false,
		url: '',
		navigationPath: {},
		navigation: {
			screens: [],
			history: []
		},
		afterBack: (basePath) => {
			state.navigating = false;

			const historyPath = basePath.history;
			const history = lodash.get(state.navigation, historyPath);
			lodash.set(state.navigation, historyPath, history.slice(0, -1));
		},
		back: async (isDefaultBack = false) => {
			if (state.navigating) {
				return null;
			}

			const navigationPath = state.navigationPath[window.location.pathname];

			state.navigating = true;

			const basePath = getScreenPath(navigationPath, true);

			if (basePath) {
				const parentNavigator = basePath.base
					? lodash.get(state.navigation, basePath.base).navigation
					: state.navigation;

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

				state.url = urlObject.toString();
			}

			setTimeout(() => {
				state.afterBack(basePath);
			}, 800);
		},
		loadUp: () => {
			state.loaded = true;
		},
		getSearchParam: (param) => {
			const url = new URL(window.location.href);
			return url.searchParams.get(param);
		},
		init: (screens, navigationType, urlObject, navigationPath, defaultIndex) => {
			const path = urlObject.pathname;
			const fullPath = `${urlObject.pathname}${urlObject.search}`;
			let activeScreenIndex = screens.findIndex((screen) => screen.path === path);

			if (activeScreenIndex === -1) {
				activeScreenIndex = defaultIndex;
			}

			const basePath = getScreenPath(navigationPath, false);
			const navScreens = lodash.get(state.navigation, basePath.base);

			const wantedScreen = screens.find((screen) => screen.path === window.location.pathname);

			if (wantedScreen && wantedScreen.onInit) {
				wantedScreen.onInit();
			}

			const parsedScreens = screens.map((screen, index) => {
				state.navigationPath[screen.path] = [
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

			state.url = url.toString();

			if (navigationType === 'Stack') {
				if (!navScreens?.navigation?.history.length) {
					lodash.set(state.navigation, basePath.screens, parsedScreens);
					lodash.set(state.navigation, basePath.history, [activeScreenIndex]);
				}

				return state;
			}

			if (navigationType === 'Drawer') {
				if (!navScreens?.navigation?.history.length) {
					lodash.set(state.navigation, basePath.screens, parsedScreens);
					lodash.set(state.navigation, basePath.history, [activeScreenIndex]);
				}

				return state;
			}

			if (navigationType === 'Tab') {
				if (!navScreens.navigation.history.length) {
					lodash.set(state.navigation, basePath.screens, parsedScreens);
				}

				return state;
			}
		},

		navigate: (url, { reload } = { reload: false }, callback = () => {}) => {
			const navigationPath = state.navigationPath[window.location.pathname];

			if (state.navigating) {
				return state;
			}

			state.navigating = true;

			if (reload) {
				goto(url);
				return null;
			}
			const path = getPathFromUrl(url);

			const currentBasePath = getScreenPath(navigationPath, true);
			const currentScreenIndex = navigationPath[navigationPath.length - 1].index;

			const wantedNavigationPath = state.navigationPath[path];

			console.log('wantedNavigationPath ', wantedNavigationPath);

			const urlObject = new URL(`${window.location.origin}${url}`);

			let navType = 'Stack';

			wantedNavigationPath.forEach((wantedPathItem, index) => {
				if (navigationPath[index]) {
					if (wantedPathItem.index !== navigationPath[index].index) {
						const wantedBasePath = getScreenPath(wantedNavigationPath.slice(0, index), false);
						const navScreens = lodash.get(state.navigation, wantedBasePath.screens);

						const wantedScreenIndex = navScreens.findIndex((sc) => sc.path === path);
						const wantedNavScreen = navScreens[wantedScreenIndex];

						if (wantedNavScreen.onNavigate) {
							const result = wantedNavScreen.onNavigate();

							if (!result) {
								return null;
							}
						}

						navType =
							wantedNavScreen.navigationPath[wantedNavScreen.navigationPath.length - 1]
								.navigationType;

						if (navType === 'Stack') {
							for (const [key, value] of urlObject.searchParams) {
								urlObject.searchParams.set(key, value);
							}
							window.history.replaceState(null, null, urlObject.toString());

							wantedNavScreen.opened = true;
							wantedNavScreen.animate = true;
							wantedNavScreen.fullPath = url;

							const history = lodash.get(state.navigation, wantedBasePath.history);

							if (history[history.length - 1] !== wantedScreenIndex) {
								lodash.set(state.navigation, wantedBasePath.history, [
									...history,
									wantedScreenIndex
								]);
							}
						}

						if (navType === 'Tab') {
							for (let i = 0; i < navScreens.length; i++) {
								navScreens[i].opened = i === wantedScreenIndex;

								if (i === wantedScreenIndex) {
									let currentScreen = navScreens[i];

									while (currentScreen?.navigation?.history?.length) {
										const lastHistoryIndex =
											currentScreen.navigation.history[currentScreen.navigation.history.length - 1];

										currentScreen = currentScreen.navigation.screens[lastHistoryIndex];
										window.history.replaceState({}, '', currentScreen.fullPath);

										state.url = currentScreen.fullPath;
									}
								}
							}
						}
					}
				}
			});

			setTimeout(() => {
				state.navigating = false;

				if (navType === 'Stack') {
					const screensPath = currentBasePath.screens;
					const screensNav = lodash.get(state.navigation, screensPath);

					if (screensNav && screensNav[currentScreenIndex]) {
						screensNav[currentScreenIndex].opened = false;
						console.log('c ', currentScreenIndex);
						console.log('eov', JSON.parse(JSON.stringify(screensNav)));
						console.log('eov nav', JSON.parse(JSON.stringify(state.navigation)));
					}
				}
			}, 5000);
		}
	});

	return state;
};

export const navigation = createNavigateStore();
