<script>
	// @ts-nocheck

	import { extend, T } from '@threlte/core';
	import Crep from './Crep.svelte';
	import { Grid, OrbitControls, Sky, Suspense, Environment, SoftShadows, Stars, Float, ContactShadows } from '@threlte/extras';
	import { AutoColliders } from '@threlte/rapier';

	let darkMode = document?.documentElement?.classList?.contains('dark') ?? false;

	const observer = new MutationObserver((mutations) => {
		mutations.forEach(({ attributeName, target }) => {
			if (attributeName !== 'class') {
				return;
			}

			const currentClassState = target?.classList?.contains('dark');

			if (currentClassState !== darkMode) {
				darkMode = currentClassState;
			}
		});
	});

	observer.observe(document.documentElement, { attributes: true });
</script>

<Environment path="/" files="nebo.hdr" isBackground={true} format="hdr" />

<T.PerspectiveCamera makeDefault position={[-15, 25, 15]} zoom={2}>
	<OrbitControls minPolarAngle={1} maxPolarAngle={1.5} />
</T.PerspectiveCamera>
<Stars speed={2} />
<ContactShadows opacity={1} scale={20} blur={1} far={10} resolution={512} color="#000000" />
<Sky turbidity={darkMode ? 20 : 0.65} rayleigh={darkMode ? 0.57 : 0.17} azimuth={180} elevation={darkMode ? -5 : 85} mieCoefficient={darkMode ? 0.038 : 0.013} exposure={darkMode ? 0.26 : 1} />
<Grid cellSize={0} sectionSize={1} sectionColor={darkMode ? '#55555f' : '#fefecc'} sectionThickness={1} fadeDistance={50} fadeStrength={1} infiniteGrid />

<Float floatIntensity={1} rotationSpeed={1} rotationIntensity={1} speed={10}>
	<Crep />
</Float>

<!-- <T.SpotLight position={[0, 25, 30]} rotation={[-40,10,30]} castShadow /> -->
