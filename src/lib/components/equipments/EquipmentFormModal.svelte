<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { tick } from 'svelte';
	import {
		Camera,
		Plane,
		Plus,
		X
	} from 'lucide-svelte';

	import type { EquipmentForm } from '$lib/domain/equipments/types';
	import { getDefaultForm } from '$lib/domain/equipments/utils';
	import { t } from '$lib/i18n';
	import { equipmentFormSchema } from '$lib/domain/equipments/schemas';
	import { ValidationError } from '$lib/utils/error-handler';
	import { logger } from '$lib/utils/logger';
	import type { EquipmentFormModalEvents } from './events';
	import { ZodError } from 'zod';

	const dispatch = createEventDispatcher<EquipmentFormModalEvents>();

export let open = false;
export let initialForm: EquipmentForm = getDefaultForm();

let form: EquipmentForm = { ...initialForm };
let errorMessage = '';
let modalOverlay: HTMLDivElement | null = null;
let wasOpen = false;

$: isDroneForm = form.type === 'drone';

const inputClasses =
	'mt-2 block w-full rounded-xl border ui-border-subtle px-4 py-2.5 text-sm ui-text-secondary focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300';

	$: if (open && !wasOpen) {
		form = { ...initialForm };
		errorMessage = '';
		(async () => {
			await tick();
			modalOverlay?.focus();
		})();
	}

	$: wasOpen = open;

	const closeModal = () => {
		dispatch('close');
	};

	const validate = (): boolean => {
		try {
			equipmentFormSchema.parse(form);
			errorMessage = '';
			return true;
		} catch (error) {
			if (error instanceof ZodError) {
				const firstIssue = error.issues[0];
				if (firstIssue) {
					const fieldName = firstIssue.path.join('.');
					errorMessage = `${$t('equipments.form.validation')}: ${fieldName} - ${firstIssue.message}`;
				} else {
					errorMessage = $t('equipments.form.validation');
				}
			} else {
				const validationError = new ValidationError(
					error instanceof Error ? error.message : 'Validation failed',
					error
				);
				logger.error('Form validation failed', validationError);
				errorMessage = $t('equipments.form.validation');
			}
			return false;
		}
	};

	const handleSubmit = (): void => {
		if (!validate()) {
			return;
		}

		try {
			const validatedForm = equipmentFormSchema.parse(form);
			dispatch('submit', validatedForm);
		} catch (error) {
			logger.error('Failed to validate form on submit', error);
			errorMessage = $t('equipments.form.validation');
		}
	};
</script>

{#if open}
	<div
		class="ui-backdrop fixed inset-0 z-40 flex items-center justify-center backdrop-blur"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		bind:this={modalOverlay}
		on:click|self={closeModal}
		on:keydown={(event) => {
			if (event.key === 'Escape') {
				closeModal();
			}
		}}
	>
		<form
			class="ui-surface-base ui-border-soft ui-shadow-elevated w-full max-w-3xl rounded-2xl border p-6 sm:p-8"
			on:submit|preventDefault={handleSubmit}
		>
			<div class="flex items-start justify-between gap-4">
				<div>
					<h2 class="text-2xl font-semibold ui-text-primary">
						{$t('equipments.form.title')}
					</h2>
					<p class="mt-1 text-sm ui-text-muted">
						{$t('equipments.actions.addDescription')}
					</p>
				</div>
				<button type="button" class="ui-icon-button" on:click={closeModal} aria-label={$t('equipments.form.cancel')}>
					<X size={18} />
				</button>
			</div>

			<div class="mt-6 space-y-6">
				<div>
					<span class="text-sm font-medium ui-text-secondary">{$t('equipments.form.type')}</span>
					<div class="mt-3 grid grid-cols-2 gap-2">
						<button
							type="button"
							class={`ui-selectable-card ${form.type === 'drone' ? 'is-active' : ''}`}
							on:click={() => (form.type = 'drone')}
							aria-pressed={form.type === 'drone'}
						>
							<Plane size={18} />
							<span>{$t('equipments.types.drone')}</span>
						</button>
						<button
							type="button"
							class={`ui-selectable-card ${form.type === 'camera' ? 'is-active' : ''}`}
							on:click={() => (form.type = 'camera')}
							aria-pressed={form.type === 'camera'}
						>
							<Camera size={18} />
							<span>{$t('equipments.types.camera')}</span>
						</button>
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label class="text-sm font-medium ui-text-secondary" for="equipment-name">
							{$t('equipments.form.name')}
						</label>
						<input id="equipment-name" type="text" class={inputClasses} bind:value={form.name} placeholder="GAIA unit" />
					</div>
					<div>
						<label class="text-sm font-medium ui-text-secondary" for="equipment-identifier">
							{$t('equipments.form.identifier')}
						</label>
						<input
							id="equipment-identifier"
							type="text"
							class={inputClasses}
							bind:value={form.identifier}
							placeholder="DR-305"
						/>
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label class="text-sm font-medium ui-text-secondary" for="equipment-location">
							{$t('equipments.form.location')}
						</label>
						<input
							id="equipment-location"
							type="text"
							class={inputClasses}
							bind:value={form.location}
							placeholder="North vineyard"
						/>
					</div>
					<div>
						<label class="text-sm font-medium ui-text-secondary" for="equipment-status">
							{$t('equipments.form.status')}
						</label>
						<select id="equipment-status" class={inputClasses} bind:value={form.status}>
							<option value="operational">{$t('equipments.statuses.operational')}</option>
							<option value="standby">{$t('equipments.statuses.standby')}</option>
							<option value="maintenance">{$t('equipments.statuses.maintenance')}</option>
						</select>
					</div>
				</div>

				{#if isDroneForm}
					<div class="grid gap-4 sm:grid-cols-3">
						<div>
							<label class="text-sm font-medium ui-text-secondary" for="drone-battery">
								{$t('equipments.form.battery')}
							</label>
							<input id="drone-battery" type="number" min="0" max="100" class={inputClasses} bind:value={form.battery} />
						</div>
						<div>
							<label class="text-sm font-medium ui-text-secondary" for="drone-altitude">
								{$t('equipments.form.altitude')}
							</label>
							<input id="drone-altitude" type="number" min="0" class={inputClasses} bind:value={form.altitude} />
						</div>
						<div>
							<label class="text-sm font-medium ui-text-secondary" for="drone-speed">
								{$t('equipments.form.speed')}
							</label>
							<input id="drone-speed" type="number" min="0" class={inputClasses} bind:value={form.speed} />
						</div>
					</div>
					<div>
						<label class="text-sm font-medium ui-text-secondary" for="drone-mission">
							{$t('equipments.form.mission')}
						</label>
						<input
							id="drone-mission"
							type="text"
							class={inputClasses}
							bind:value={form.mission}
							placeholder="Thermal sweep"
						/>
					</div>
				{:else}
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<label class="text-sm font-medium ui-text-secondary" for="camera-resolution">
								{$t('equipments.form.resolution')}
							</label>
							<input
								id="camera-resolution"
								type="text"
								class={inputClasses}
								bind:value={form.resolution}
								placeholder="4K HDR"
							/>
						</div>
						<div>
							<label class="text-sm font-medium ui-text-secondary" for="camera-fov">
								{$t('equipments.form.fieldOfView')}
							</label>
							<input
								id="camera-fov"
								type="number"
								min="20"
								class={inputClasses}
								bind:value={form.fieldOfView}
							/>
						</div>
					</div>
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<label class="text-sm font-medium ui-text-secondary" for="camera-service">
								{$t('equipments.form.lastService')}
							</label>
							<input id="camera-service" type="date" class={inputClasses} bind:value={form.lastService} />
						</div>
						<div>
							<label class="text-sm font-medium ui-text-secondary" for="camera-connectivity">
								{$t('equipments.form.connectivity')}
							</label>
							<input
								id="camera-connectivity"
								type="text"
								class={inputClasses}
								bind:value={form.connectivity}
								placeholder="PoE"
							/>
						</div>
					</div>
				{/if}

				{#if errorMessage}
					<div class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
						{errorMessage}
					</div>
				{/if}
			</div>

			<div class="mt-8 flex justify-end gap-3">
				<button type="button" class="ui-secondary-button" on:click={closeModal}>
					{$t('equipments.form.cancel')}
				</button>
				<button type="submit" class="ui-primary-button px-5">
					<Plus size={18} />
					<span>{$t('equipments.form.submit')}</span>
				</button>
			</div>
		</form>
	</div>
{/if}
