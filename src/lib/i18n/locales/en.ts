const en = {
	common: {
		home: 'Home',
		equipments: 'Equipments',
		settings: 'Settings',
		parcelHealth: 'Parcel health',
		welcome: 'Welcome to GAIA',
		loginSubtitle: 'Sign in to access your personal space',
		signInWithGoogle: 'Sign in with Google',
		signingIn: 'Signing in...',
		loading: 'Loading...',
		signOut: 'Sign out',
		connectedWithGoogle: 'Connected with Google',
		user: 'User',
		termsAcceptance: 'By signing in, you accept our terms of service',
		copyright: '(c) 2024 GAIA. All rights reserved.'
	},
	dashboard: {
		title: 'Dashboard',
		overview: 'Field overview',
		totalUsers: 'Producers onboarded',
		fireDetected: 'Fire alerts (24h)',
		humansDetected: 'Intrusion alerts',
		greeting_day: 'Good morning',
		greeting_night: 'Good evening',
		activeDrones: 'Active drone missions',
		missionsToday: 'Fields monitored',
		avgResponseTime: 'Incident response time',
		detectionsResolved: 'Alerts resolved',
		detectionAccuracy: 'Detection accuracy',
		weeklyFlightHours: 'Drone flight hours',
		alertTrend: 'Alert trend',
		missionSuccessRate: 'Field coverage rate',
		liveAlerts: 'Live alerts',
		environmentReadings: 'Field vitals',
		humidity: 'Leaf moisture',
		temperature: 'Soil temperature',
		windSpeed: 'Canopy wind speed',
		airQuality: 'Air quality index',
		lastUpdated: 'Updated'
	},
	equipments: {
		title: 'Equipments',
		battery: 'Battery',
		status: 'Status',
		altitude: 'Altitude',
		speed: 'Speed',
		summary: {
			total: 'Total devices',
			drones: 'Active drones',
			cameras: 'Fixed cameras',
			offline: 'Offline / maintenance'
		},
		summaryCaption: {
			total: 'Across all zones',
			drones: 'Operational missions',
			cameras: 'Perimeter coverage',
			offline: 'Needs attention'
		},
		filters: {
			all: 'All devices',
			drones: 'Drones',
			cameras: 'Fixed cameras'
		},
		actions: {
			add: 'Add device',
			addDescription: 'Register a new unit to make it available in missions.'
		},
		form: {
			title: 'Register equipment',
			type: 'Type',
			name: 'Name',
			identifier: 'Identifier',
			location: 'Location',
			status: 'Status',
			battery: 'Battery (%)',
			altitude: 'Altitude (m)',
			speed: 'Cruise speed (km/h)',
			resolution: 'Resolution',
			fieldOfView: 'Field of view (°)',
			lastService: 'Last maintenance',
			connectivity: 'Power / link',
			mission: 'Current mission',
			cancel: 'Cancel',
			submit: 'Add equipment',
			validation: 'Fill in the required fields to continue.'
		},
		statuses: {
			operational: 'Operational',
			standby: 'Standby',
			maintenance: 'Maintenance'
		},
		types: {
			drone: 'Drone',
			camera: 'Fixed camera'
		},
		details: {
			health: 'Service health',
			lastCheck: 'Last check',
			location: 'Location',
			identifier: 'Identifier'
		},
		empty: {
			all: 'No devices registered yet.',
			drones: 'No drones available for now.',
			cameras: 'No fixed cameras available for now.'
		}
	},
	settings: {
		title: 'Settings',
		language: 'Language',
		theme: 'Theme',
		themeDescription: 'Choose the interface appearance.',
		themeLight: 'Light',
		themeDark: 'Dark'
	},
	parcelHealth: {
		title: 'Health map',
		subtitle: 'Live vegetation insights and stress monitoring will appear here soon.',
		placeholderTag: 'Preview mode',
		mapPlaceholder: {
			label: 'Health map placeholder',
			description: 'Connect sensors or imagery sources to display soil moisture and stress overlays.'
		},
		legend: {
			title: 'Legend',
			canopy: 'High canopy vigor',
			moderate: 'Moderate vegetation',
			low: 'Low vigor / dry zone',
			alert: 'Attention required'
		},
		nextSteps: {
			title: 'What\'s coming next',
			description: 'Upload drone flights or enable satellite feeds to unlock the interactive map experience.'
		},
		metrics: {
			coverage: {
				label: 'Coverage',
				caption: 'Field area scanned (placeholder)'
			},
			vigor: {
				label: 'Avg. vigor score',
				caption: 'Placeholder data'
			},
			stress: {
				label: 'Stress alerts',
				caption: 'Pending integration'
			},
			update: {
				label: 'Last update',
				caption: 'Sync once data is connected'
			}
		}
	},
	errors: {
		generic: {
			title: 'Something went wrong',
			description: 'An unexpected error occurred. Please try again later.'
		},
		notFound: {
			title: 'Page not found',
			description: 'The page you are looking for does not exist or has been moved.'
		},
		forbidden: {
			title: 'Access denied',
			description: 'You do not have permission to access this resource.'
		},
		server: {
			title: 'Server error',
			description: 'The server encountered an error. Please try again later.'
		},
		statusCode: 'Status code',
		details: {
			title: 'Error details',
			code: 'Code',
			message: 'Message',
			id: 'Error ID',
			path: 'Path'
		},
		actions: {
			goHome: 'Go home',
			goBack: 'Go back',
			reload: 'Reload page'
		},
		help: {
			text: 'If this problem persists, please contact support with the error ID below:'
		}
	}
} as const;

export default en;
