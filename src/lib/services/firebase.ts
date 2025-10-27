import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyCnblCLxZ2Pqy8TrzuZeSG5p_1VDM5gwSY',
	authDomain: 'web-app-gaia.firebaseapp.com',
	projectId: 'web-app-gaia',
	storageBucket: 'web-app-gaia.appspot.com',
	messagingSenderId: '479023709315',
	appId: '1:479023709315:web:gaia-app'
} as const;

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
