// src/js/scene.js

import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'; 



export function initScene() {
    const scene = new THREE.Scene();

    // Додаємо фон
    // const imgLoader = new THREE.TextureLoader();
    // imgLoader.load('./src/assets/img/bckgrndCameraPersp_50000.jpg', function(texture){
    //     scene.background = texture;
    //     texture.colorSpace = THREE.SRGBColorSpace;
    // });
    // scene.background = new THREE.Color(0xeeeeee); // Світло-сірий фон
    // const pmremGenerator = new PMREMGenerator(renderer);
   

    // Завантаження HDR для середовища
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('assets/hdr/cedar_bridge_05k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.LinearSRGBColorSpace; 
        

/*
        // Генеруємо PMREM (Prefiltered Mipmaped Radiance Environment Map)
        // Це покращує якість віддзеркалень
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;

            // *** ЗМЕНШУЄМО ІНТЕНСИВНІСТЬ ОСВІТЛЕННЯ ВІД HDR-КАРТИ ***
        scene.environmentIntensity = 1; // Значення від 0 до 1, де 1 - повна інтенсивність HDR.
        scene.environment = envMap; // Використовуємо HDR як освітлення + pmremGenerator
        */
        scene.environment = texture; // Використовуємо HDR як освітлення без pmremGenerator
        scene.background = new THREE.Color(0xeeeeee);
    });

    return scene;
}
