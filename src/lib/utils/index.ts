import type { NavPath, NavPaths } from '../types';

export const getScreenPath = (navigationPath: NavPath[], parentPath: boolean): NavPaths => {
	const wantedPathLength = parentPath ? navigationPath.length - 1 : navigationPath.length;

	let basePath = '';

	if (wantedPathLength) {
		basePath = 'screens';
		for (let i = 0; i < wantedPathLength; i++) {
			const navItem = navigationPath[i];
			const navItemIndex = navItem.index;

			const isLast = i === wantedPathLength - 1;

			if (isLast) {
				basePath = basePath.concat(`[${navItemIndex}]`);
				break;
			}

			basePath = basePath.concat(`[${navItemIndex}].navigation.screens`);
		}
	}

	return {
		base: basePath,
		screens: basePath ? basePath.concat('navigation.screens') : 'screens',
		history: basePath ? basePath.concat('navigation.history') : 'history'
	};
};

export const getPathFromUrl = (url) => {
	return url.split('?')[0];
};
