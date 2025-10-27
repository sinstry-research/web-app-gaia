<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import type { Chart as ChartInstance } from 'chart.js';

	export let data: number[] = [];
	export let labels: string[] = [];
	export let stroke = '#6366f1';
	export let fill = 'rgba(99, 102, 241, 0.12)';
	export let height = 140;
	export let showDots = false;
	export let tension = 0.35;
	export let tooltipLabel: string | null = null;
	export let yMin: number | null = null;
	export let yMax: number | null = null;

	let canvas: HTMLCanvasElement;
	let chart: ChartInstance<'line'> | null = null;

	const getResolvedData = () => (data.length > 0 ? data : [0]);
	const getResolvedLabels = () => {
		const resolved = getResolvedData();
		return labels.length === resolved.length ? labels : resolved.map((_, index) => `${index + 1}`);
	};

	const updateChart = () => {
		if (!chart) return;
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

	const createChart = () => {
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

	onMount(() => {
		createChart();
	});

	onDestroy(() => {
		chart?.destroy();
		chart = null;
	});

	$: updateChart();
</script>

<div style={`height: ${height}px`}>
	<canvas bind:this={canvas} aria-hidden="true"></canvas>
</div>
