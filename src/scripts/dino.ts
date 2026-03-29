import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function initDino(containerId: string, canvasId: string) {
  const container = document.getElementById(containerId);
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

  if (!container || !canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 1.5, 6);
  camera.lookAt(0, 0.5, 0);

  function resize() {
    if (!container || !renderer) return;
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Soft formal lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xedf2f7, 1.0);
  fillLight.position.set(-5, 3, -5);
  scene.add(fillLight);

  let dinoModel: THREE.Group | null = null;
  const loader = new GLTFLoader();
  const modelUrl = '/model/dino.glb';
  
  async function loadModel() {
    let urlToLoad = modelUrl;
    let objectUrl: string | null = null;
    
    // Attempt to cache the model using the browser's Cache API
    if ('caches' in window) {
      try {
        const cacheName = 'nexus-models-v1';
        const cache = await caches.open(cacheName);
        let response = await cache.match(modelUrl);
        
        if (!response) {
          response = await fetch(modelUrl);
          if (response.ok) {
            await cache.put(modelUrl, response.clone());
          }
        }
        
        if (response && response.ok) {
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          urlToLoad = objectUrl;
        }
      } catch (e) {
        console.warn('Cache API fell back to network fetch:', e);
      }
    }
    
    loader.load(
      urlToLoad,
      (gltf) => {
        dinoModel = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(dinoModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 4.0;
        const scale = targetSize / maxDim;
        dinoModel.scale.set(scale, scale, scale);
        
        dinoModel.position.x = -center.x * scale;
        dinoModel.position.y = -center.y * scale - 0.5;
        dinoModel.position.z = -center.z * scale;
        
        dinoModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        scene.add(dinoModel);
        
        // Clean up ObjectURL if we created one
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      },
      undefined,
      (error) => {
        console.error('Error loading dino.glb:', error);
      }
    );
  }

  loadModel();

  let mx = 0, my = 0, tRotY = 0, tRotX = 0;
  
  // Create a subtle shadow plane
  const planeGeo = new THREE.PlaneGeometry(10, 10);
  const planeMat = new THREE.ShadowMaterial({ opacity: 0.1 });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -1.5;
  plane.receiveShadow = true;
  scene.add(plane);

  document.addEventListener('mousemove', e => {
    const r = container.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (dinoModel) {
      // Idle floating animation
      dinoModel.position.y += Math.sin(t * 1.5) * 0.002;
      
      // Mouse follow rotation with easing
      tRotY += (mx * 0.5 - tRotY) * 0.05;
      tRotX += (-my * 0.2 - tRotX) * 0.05;
      
      dinoModel.rotation.y = tRotY + Math.sin(t * 0.5) * 0.1;
      dinoModel.rotation.x = tRotX;
    }

    renderer.render(scene, camera);
  }

  animate();
}
