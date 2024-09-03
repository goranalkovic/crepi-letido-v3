<script>
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { DisplayP3ColorSpace } from 'three';
</script>

<svelte:head>
	<title>Črep-storm™ | ČL</title>
</svelte:head>

<div class="absolute bottom-0 right-0 top-16 left-14">
	<Canvas colorSpace={DisplayP3ColorSpace}>
		<Scene />
	</Canvas>
</div>
