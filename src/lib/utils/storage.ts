import { browser } from '$app/environment';
import { logger } from './logger';
import { safeSync } from './error-handler';

export const storage = {
	get<T>(key: string): T | null {
		if (!browser) return null;

		const [result, error] = safeSync(() => {
			const item = localStorage.getItem(key);
			if (item === null) return null;

			try {
				return JSON.parse(item) as T;
			} catch {
				return item as unknown as T;
			}
		});

		if (error) {
			logger.warn(`Failed to get item from localStorage: ${key}`, error);
			return null;
		}

		return result ?? null;
	},

	set<T>(key: string, value: T): boolean {
		if (!browser) return false;

		const [, error] = safeSync(() => {
			const serialized = typeof value === 'string' ? value : JSON.stringify(value);
			localStorage.setItem(key, serialized);
		});

		if (error) {
			logger.warn(`Failed to set item in localStorage: ${key}`, error);
			if (error.originalError instanceof Error && error.originalError.name === 'QuotaExceededError') {
				logger.error('localStorage quota exceeded', error);
			}
			return false;
		}

		return true;
	},

	remove(key: string): boolean {
		if (!browser) return false;

		const [, error] = safeSync(() => {
			localStorage.removeItem(key);
		});

		if (error) {
			logger.warn(`Failed to remove item from localStorage: ${key}`, error);
			return false;
		}

		return true;
	},

	clear(): boolean {
		if (!browser) return false;

		const [, error] = safeSync(() => {
			localStorage.clear();
		});

		if (error) {
			logger.warn('Failed to clear localStorage', error);
			return false;
		}

		return true;
	},

	has(key: string): boolean {
		if (!browser) return false;
		return key in localStorage;
	}
};

