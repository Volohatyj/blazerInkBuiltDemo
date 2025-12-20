// loaders.js

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// 1. Створюємо розпакувальник
const dracoLoader = new DRACOLoader();
// Вказуємо шлях до папки в public (зі слешами на початку і в кінці)
dracoLoader.setDecoderPath('draco/'); 

// 2. Створюємо завантажувач
const loader = new GLTFLoader();

// 3. ВАЖЛИВО: Передаємо розпакувальник у завантажувач
loader.setDRACOLoader(dracoLoader);

export function loadGLTFModel(path, onLoad, onProgress, onError) {
    loader.load(
        path,
        (gltf) => {
            console.log(`Модель успішно завантажена.`);
            onLoad(gltf);
        },
        (xhr) => {
            if (onProgress) onProgress(xhr.loaded / xhr.total);
        },
        (error) => {
            console.error(`Помилка:`, error);
            if (onError) onError(error);
        }
    );
}