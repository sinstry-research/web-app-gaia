import { browser } from '$app/environment';
import { dev } from '$app/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
	level: LogLevel;
	message: string;
	data?: unknown;
	timestamp: string;
}

class Logger {
	private logs: LogEntry[] = [];
	private readonly maxLogs = 100;

	private createEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
		return {
			level,
			message,
			data,
			timestamp: new Date().toISOString()
		};
	}

	private log(level: LogLevel, message: string, data?: unknown): void {
		const entry = this.createEntry(level, message, data);

		if (dev) {
			this.logs.push(entry);
			if (this.logs.length > this.maxLogs) {
				this.logs.shift();
			}

			const consoleMethod = level === 'debug' ? console.log : console[level];
			const prefix = `[${level.toUpperCase()}]`;

			if (data !== undefined) {
				consoleMethod(prefix, message, data);
			} else {
				consoleMethod(prefix, message);
			}
		} else if (level === 'error') {
			const errorData = {
				message,
				data: data instanceof Error ? { name: data.name, message: data.message, stack: data.stack } : data,
				timestamp: entry.timestamp
			};

			if (browser) {
				try {
					const existingLogs = localStorage.getItem('app-error-logs');
					const logs: LogEntry[] = existingLogs ? JSON.parse(existingLogs) : [];
					logs.push(entry);
					if (logs.length > this.maxLogs) {
						logs.shift();
					}
					localStorage.setItem('app-error-logs', JSON.stringify(logs.slice(-50)));
				} catch {
				}
			}
		}
	}

	debug(message: string, data?: unknown): void {
		this.log('debug', message, data);
	}

	info(message: string, data?: unknown): void {
		this.log('info', message, data);
	}

	warn(message: string, data?: unknown): void {
		this.log('warn', message, data);
	}

	error(message: string, error?: unknown): void {
		const errorData = error instanceof Error ? error : error;
		this.log('error', message, errorData);
	}

	getLogs(): readonly LogEntry[] {
		return [...this.logs];
	}

	clearLogs(): void {
		this.logs = [];
	}
}

export const logger = new Logger();

