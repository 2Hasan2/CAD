<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script lang="ts">
	// import my component
	import ToolBar from '../components/ToolBar.svelte';
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<ToolBar />
	<div class="flex-1">
		<slot />
	</div>
</div>

<style lang="postcss">
</style>