import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes('node_modules')) {
						if (id.includes('leaflet')) return 'map';
						if (id.includes('chart.js')) return 'charts';
						if (id.includes('firebase')) return 'firebase';
						if (id.includes('lucide-svelte')) return 'icons';
						if (id.includes('svelte')) return 'svelte-vendor';
						return 'vendor';
					}
				},
				chunkFileNames: 'chunks/[name]-[hash].js',
				entryFileNames: 'entries/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]'
			}
		},
		chunkSizeWarningLimit: 1000,
		target: 'esnext',
		minify: 'esbuild'
	},
	optimizeDeps: {
		include: ['lucide-svelte'],
		exclude: ['@sveltejs/kit']
	}
});
