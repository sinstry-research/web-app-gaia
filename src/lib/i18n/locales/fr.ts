const fr = {
	common: {
		home: 'Accueil',
		equipments: 'Équipements',
		settings: 'Paramètres',
		parcelHealth: 'Sante parcellaire',
		welcome: 'Bienvenue sur GAIA',
		loginSubtitle: 'Connectez-vous pour accéder à votre espace personnel',
		signInWithGoogle: 'Se connecter avec Google',
		signingIn: 'Connexion en cours...',
		loading: 'Chargement...',
		signOut: 'Se déconnecter',
		connectedWithGoogle: 'Connecté avec Google',
		user: 'Utilisateur',
		termsAcceptance: 'En vous connectant, vous acceptez nos conditions d’utilisation',
		copyright: '(c) 2024 GAIA. Tous droits réservés.'
	},
	dashboard: {
		title: 'Tableau opérationnel',
		overview: 'Vue parcellaire',
		totalUsers: 'Exploitants connectés',
		fireDetected: 'Alertes incendie (24h)',
		humansDetected: 'Alertes intrusion',
		greeting_day: 'Bonjour',
		greeting_night: 'Bonsoir',
		activeDrones: 'Missions drones actives',
		missionsToday: 'Parcelles surveillées',
		avgResponseTime: 'Temps de réponse incidents',
		detectionsResolved: 'Alertes résolues',
		detectionAccuracy: 'Précision des détections',
		weeklyFlightHours: 'Heures de vol drone',
		alertTrend: 'Tendance des alertes',
		missionSuccessRate: 'Couverture parcellaire',
		liveAlerts: 'Alertes en direct',
		environmentReadings: 'Signaux agrométriques',
		humidity: 'Humidité foliaire',
		temperature: 'Température du sol',
		windSpeed: 'Vent au couvert',
		airQuality: 'Indice qualite de l\'air',
		lastUpdated: 'Actualisé'
	},
	equipments: {
		title: 'Équipements',
		battery: 'Batterie',
		status: 'Statut',
		altitude: 'Altitude',
		speed: 'Vitesse',
		summary: {
			total: 'Parc total',
			drones: 'Drones actifs',
			cameras: 'Caméras fixes',
			offline: 'Hors ligne / maintenance'
		},
		summaryCaption: {
			total: 'Répartis sur les zones',
			drones: 'Missions en cours',
			cameras: 'Surveillance périmétrique',
			offline: 'À vérifier rapidement'
		},
		filters: {
			all: 'Tous les équipements',
			drones: 'Drones',
			cameras: 'Caméras fixes'
		},
		actions: {
			add: 'Ajouter un équipement',
			addDescription: 'Enregistrez un nouvel équipement pour l’ajouter aux missions.'
		},
		form: {
			title: 'Enregistrer un équipement',
			type: 'Type',
			name: 'Nom',
			identifier: 'Identifiant',
			location: 'Localisation',
			status: 'Statut',
			battery: 'Batterie (%)',
			altitude: 'Altitude (m)',
			speed: 'Vitesse de croisière (km/h)',
			resolution: 'Résolution',
			fieldOfView: 'Angle de vue (°)',
			lastService: 'Dernière maintenance',
			connectivity: 'Alimentation / liaison',
			mission: 'Mission en cours',
			cancel: 'Annuler',
			submit: 'Ajouter l’équipement',
			validation: 'Renseignez les champs obligatoires pour continuer.'
		},
		statuses: {
			operational: 'Opérationnel',
			standby: 'En veille',
			maintenance: 'En maintenance'
		},
		types: {
			drone: 'Drone',
			camera: 'Caméra fixe'
		},
		details: {
			health: 'État de service',
			lastCheck: 'Dernier contrôle',
			location: 'Localisation',
			identifier: 'Identifiant'
		},
		empty: {
			all: 'Aucun équipement enregistré pour le moment.',
			drones: 'Aucun drone disponible pour l’instant.',
			cameras: 'Aucune caméra fixe disponible pour l’instant.'
		}
	},
	settings: {
		title: 'Paramètres',
		language: 'Langue',
		theme: 'Thème',
		themeDescription: 'Sélectionnez l’apparence de l’interface.',
		themeLight: 'Clair',
		themeDark: 'Sombre'
	},
	parcelHealth: {
		title: 'Carte de sante parcellaire',
		subtitle: 'Les donnees de vigueur et de stress apparaitront ici prochainement.',
		placeholderTag: 'Mode demonstration',
		mapPlaceholder: {
			label: 'Apercu de la carte',
			description: 'Connectez des capteurs ou des images pour afficher les couches d\'humidite et de stress.'
		},
		legend: {
			title: 'Legende',
			canopy: 'Canopee vigoureuse',
			moderate: 'Vegetation moderee',
			low: 'Zone faible / seche',
			alert: 'Zone a surveiller'
		},
		nextSteps: {
			title: 'Prochaines etapes',
			description: 'Importez des vols drone ou activez les flux satellites pour deverrouiller la carte interactive.'
		},
		metrics: {
			coverage: {
				label: 'Couverture',
				caption: 'Surface analysee (placeholder)'
			},
			vigor: {
				label: 'Score moyen de vigueur',
				caption: 'Donnees fictives'
			},
			stress: {
				label: 'Alertes stress',
				caption: 'En attente d integration'
			},
			update: {
				label: 'Derniere mise a jour',
				caption: 'Synchronisation active lorsque les donnees seront liees'
			}
		}
	}
} as const;

export default fr;
