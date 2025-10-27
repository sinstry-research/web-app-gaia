import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';

import { auth, googleProvider } from '$lib/services/firebase';

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
			console.error('Auth listener error:', error);
			errorStore.set(error.message);
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
		const message = err instanceof Error ? err.message : 'Unknown authentication error.';
		errorStore.set(message);
		throw err;
	}
};

export const signOutUser = async () => {
	try {
		await signOut(auth);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown sign-out error.';
		errorStore.set(message);
		throw err;
	}
};
