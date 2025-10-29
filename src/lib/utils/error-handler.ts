import { logger } from './logger';

export class AppError extends Error {
	constructor(
		message: string,
		public readonly code: string,
		public readonly statusCode?: number,
		public readonly originalError?: unknown
	) {
		super(message);
		this.name = 'AppError';
		Object.setPrototypeOf(this, AppError.prototype);
	}
}

export class NetworkError extends AppError {
	constructor(message: string, originalError?: unknown) {
		super(message, 'NETWORK_ERROR', 0, originalError);
		this.name = 'NetworkError';
		Object.setPrototypeOf(this, NetworkError.prototype);
	}
}

export class ValidationError extends AppError {
	constructor(message: string, originalError?: unknown) {
		super(message, 'VALIDATION_ERROR', 400, originalError);
		this.name = 'ValidationError';
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}

export class AuthenticationError extends AppError {
	constructor(message: string, originalError?: unknown) {
		super(message, 'AUTHENTICATION_ERROR', 401, originalError);
		this.name = 'AuthenticationError';
		Object.setPrototypeOf(this, AuthenticationError.prototype);
	}
}

export type ErrorHandler = (error: unknown) => AppError;

export const handleError = (error: unknown): AppError => {
	if (error instanceof AppError) {
		return error;
	}

	if (error instanceof Error) {
		if (error.name === 'NetworkError' || error.message.includes('network')) {
			return new NetworkError('Network request failed', error);
		}

		if (error.message.includes('auth') || error.message.includes('sign')) {
			return new AuthenticationError('Authentication failed', error);
		}

		return new AppError(error.message, 'UNKNOWN_ERROR', undefined, error);
	}

	if (typeof error === 'string') {
		return new AppError(error, 'STRING_ERROR');
	}

	return new AppError('An unknown error occurred', 'UNKNOWN_ERROR', undefined, error);
};

export const safeAsync = async <T>(
	fn: () => Promise<T>,
	errorHandler?: ErrorHandler
): Promise<[T, null] | [null, AppError]> => {
	try {
		const result = await fn();
		return [result, null];
	} catch (error) {
		const appError = errorHandler ? errorHandler(error) : handleError(error);
		logger.error('Async operation failed', appError);
		return [null, appError];
	}
};

export const safeSync = <T>(fn: () => T, errorHandler?: ErrorHandler): [T, null] | [null, AppError] => {
	try {
		const result = fn();
		return [result, null];
	} catch (error) {
		const appError = errorHandler ? errorHandler(error) : handleError(error);
		logger.error('Sync operation failed', appError);
		return [null, appError];
	}
};

