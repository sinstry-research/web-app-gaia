import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';

import { auth, googleProvider } from '$lib/services/firebase';
import { logger } from '$lib/utils/logger';
import { AuthenticationError, handleError } from '$lib/utils/error-handler';

type AuthStatus = 'loading' | 'ready';

const userStore = writable<User | null>(null);
const statusStore = writable<AuthStatus>('loading');
const errorStore = writable<string | null>(null);

if (browser) {
	onAuthStateChanged(
		auth,
		(currentUser) => {
			userStore.set(currentUser);
			statusStore.set('ready');
			errorStore.set(null);
		},
		(error) => {
			const appError = handleError(error);
			logger.error('Auth listener error', appError);
			errorStore.set(appError.message);
			statusStore.set('ready');
		}
	);
} else {
	statusStore.set('ready');
}

export const user = userStore;
export const status = statusStore;
export const error = errorStore;

export const loading = derived(statusStore, ($status) => $status === 'loading');
export const isAuthenticated = derived(userStore, ($user) => Boolean($user));

export const signInWithGoogle = async () => {
	errorStore.set(null);

	try {
		const result = await signInWithPopup(auth, googleProvider);
		return result.user;
	} catch (err) {
		const appError = handleError(err);
		if (appError instanceof AuthenticationError) {
			logger.error('Authentication failed', appError);
		} else {
			logger.error('Sign in failed', appError);
		}
		errorStore.set(appError.message);
		throw appError;
	}
};

export const signOutUser = async () => {
	try {
		await signOut(auth);
	} catch (err) {
		const appError = handleError(err);
		logger.error('Sign out failed', appError);
		errorStore.set(appError.message);
		throw appError;
	}
};
