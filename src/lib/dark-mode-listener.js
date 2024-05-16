// @ts-nocheck
const runColorMode = (fn) => {
	if (!window.matchMedia) {
		return;
	}

	const query = window.matchMedia('(prefers-color-scheme: dark)');

	fn(query.matches);

	query.addEventListener('change', (event) => fn(event.matches));

	return () => {
		query.removeEventListener('change', (event) => fn(event.matches));
	};
}

export const setUpColorMode = () => {
	const themeMode = document.documentElement.getAttribute('cl-theme-mode');

	if (themeMode?.length < 1) {
		return false;
	}

	if (themeMode === 'light' && document.documentElement.classList.contains('dark')) {
		document.documentElement.classList.remove('dark');
	} else if (themeMode === 'dark' && !document.documentElement.classList.contains('dark')) {
		document.documentElement.classList.add('dark');
	} else if (themeMode === 'system') {
		return runColorMode((isDarkMode) => {
			if (isDarkMode) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		});
	}

	return true;
};