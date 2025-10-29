<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Chart as ChartInstance } from 'chart.js';

	interface Props {
		data?: number[];
		labels?: string[];
		stroke?: string;
		fill?: string;
		height?: number;
		showDots?: boolean;
		tension?: number;
		tooltipLabel?: string | null;
		yMin?: number | null;
		yMax?: number | null;
	}

	const {
		data = [],
		labels = [],
		stroke = '#6366f1',
		fill = 'rgba(99, 102, 241, 0.12)',
		height = 140,
		showDots = false,
		tension = 0.35,
		tooltipLabel = null,
		yMin = null,
		yMax = null
	}: Props = $props();

	let canvas = $state<HTMLCanvasElement | null>(null);
	let chart = $state<ChartInstance<'line'> | null>(null);
	let Chart = $state<typeof import('chart.js/auto').default | null>(null);
	let isLoading = $state(false);

	const getResolvedData = () => (data.length > 0 ? data : [0]);
	const getResolvedLabels = () => {
		const resolved = getResolvedData();
		return labels.length === resolved.length ? labels : resolved.map((_, index) => `${index + 1}`);
	};

	const updateChart = () => {
		if (!chart || !Chart) return;
		const resolvedData = getResolvedData();
		const resolvedLabels = getResolvedLabels();

		chart.data.labels = resolvedLabels;
		chart.data.datasets[0].data = resolvedData;
		chart.data.datasets[0].borderColor = stroke;
		chart.data.datasets[0].backgroundColor = fill;
		chart.data.datasets[0].pointRadius = showDots ? 4 : 0;
		chart.data.datasets[0].pointHoverRadius = showDots ? 5 : 1;
		chart.data.datasets[0].pointBackgroundColor = stroke;
		chart.data.datasets[0].tension = tension;
		if (chart.options.scales?.y) {
			chart.options.scales.y.suggestedMin = yMin ?? undefined;
			chart.options.scales.y.suggestedMax = yMax ?? undefined;
		}
		chart.update('resize');
	};

	const loadChartLibrary = async (): Promise<void> => {
		if (Chart) return;
		isLoading = true;
		try {
			const chartModule = await import('chart.js/auto');
			Chart = chartModule.default;
		} catch (error) {
			console.error('Failed to load Chart.js', error);
		} finally {
			isLoading = false;
		}
	};

	const createChart = async () => {
		if (!Chart) {
			await loadChartLibrary();
		}
		if (!Chart || !canvas) return;

		const context = canvas.getContext('2d');
		if (!context) return;

		chart = new Chart(context, {
			type: 'line',
			data: {
				labels: getResolvedLabels(),
				datasets: [
					{
						data: getResolvedData(),
						fill: true,
						borderColor: stroke,
						backgroundColor: fill,
						borderWidth: 2,
						pointRadius: showDots ? 4 : 0,
						pointHoverRadius: showDots ? 5 : 1,
						pointBackgroundColor: stroke,
						tension
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						display: false
					},
					y: {
						display: false,
						suggestedMin: yMin ?? undefined,
						suggestedMax: yMax ?? undefined
					}
				},
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						enabled: true,
						displayColors: false,
						callbacks: {
							label(context) {
								const value = context.parsed.y ?? 0;
								return tooltipLabel ? `${tooltipLabel}: ${value}` : `${value}`;
							}
						}
					}
				}
			}
		});
	};

	onMount(async () => {
		await loadChartLibrary();
	});

	$effect(() => {
		if (canvas && Chart && !chart) {
			createChart();
		}
	});

	onDestroy(() => {
		chart?.destroy();
		chart = null;
	});

	$effect(() => {
		updateChart();
	});
</script>

<div style={`height: ${height}px`}>
	{#if isLoading}
		<div class="flex h-full items-center justify-center ui-text-subtle text-sm">Loading chart...</div>
	{:else}
		<canvas bind:this={canvas} aria-hidden="true"></canvas>
	{/if}
</div>
