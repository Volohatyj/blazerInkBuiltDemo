import * as THREE from 'three';
import { initCamera } from './src/js/camera.js'; // Імпортуємо камеру
import { initRenderer } from './src/js/renderer.js'; // Імпортуємо рендерер
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initScene } from './src/js/scene.js'; // Імпортуємо ініціалізацію сцени
import { loadGLTFModel } from './src/js/loaders.js';



// Рендерер
const renderer = initRenderer();

// Ініціалізація сцени
const scene = initScene();

// Ініціалізація камери через імпортовану функцію
const camera = initCamera();

// Положення точки обертання камери в сцені 3ds Max
const cameraTargetMaxPosition = {
    x: 4602.723,
    y: 4508.343,
    z: 1668.936
};

const cameraTargetPosition = {
    x: 0,
    y: 0.4,
    z: 0
};


// Додаємо OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Додаємо інерцію руху
controls.dampingFactor = 0.05; // Фактор інерції
controls.target.set(cameraTargetPosition.x, cameraTargetPosition.y, cameraTargetPosition.z); // Центр обертання камери (положення моделі)
controls.maxPolarAngle = Math.PI / 2 + 0.1; 

const dirLight = new THREE.DirectionalLight( 0xff6000, 0.5);
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( 2, 2, 0.2);
dirLight.position.multiplyScalar( 30 );
scene.add( dirLight );

dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 4096;
dirLight.shadow.mapSize.height = 4096;
dirLight.shadow.intensity = 6;

const d = 150;

dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;

dirLight.shadow.camera.far = 3500;
dirLight.shadow.bias = - 0.0001;

const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
// scene.add( dirLightHelper );

// Створюємо геометрію площини
const catcherPlaneGeometry = new THREE.PlaneGeometry(20, 10); // розміри площини: 5х5 одиниць (можеш змінити)
// Створюємо матеріал зі світло-сірим кольором
// const catcherMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
const catcherMaterial = new THREE.ShadowMaterial({opacity: 0.02});
// Створюємо меш (об'єкт) і додаємо в сцену
const catcherPlaneMesh = new THREE.Mesh(catcherPlaneGeometry, catcherMaterial);
catcherPlaneMesh.position.y = .005
scene.add(catcherPlaneMesh);
// catcherPlaneMesh.position.z = 1.15;
// Якщо потрібно, щоб площина лежала горизонтально:
catcherPlaneMesh.rotation.x = -Math.PI / 2; // Повертаємо площину, щоб вона "лежала" як підлога
catcherPlaneMesh.receiveShadow = true;


loadGLTFModel('assets/glb/Alfa4c_22_V45SubD1DRC.glb', (gltf) => {
    const model = gltf.scene;
    
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Оновлюємо матеріали ТУТ, коли модель вже завантажена
            if (child.material) {
                child.material.needsUpdate = true;
                // Якщо є HDR оточення, Three.js підхопить його автоматично, 
                // якщо матеріал Standard або Physical.
            }
        }
    });
    
    scene.add(model);
    console.log("Модель додана до сцени");
});

// Це примушує матеріали об'єктів оновитися і врахувати нове scene.environment.
scene.traverse((object) => {
    if (object.isMesh && object.material) {
        // Якщо матеріал є масивом (наприклад, для складних моделей)
        if (Array.isArray(object.material)) {
            object.material.forEach(m => {
                if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
                    m.needsUpdate = true;
                }
            });
        } else {
            // Якщо це єдиний матеріал
            if (object.material.isMeshStandardMaterial || object.material.isMeshPhysicalMaterial) {
                object.material.needsUpdate = true;
            }
        }
    }
});
  
// -- ОБМЕЖЕННЯ ПОЗИЦІЇ КАМЕРИ --
const maxCameraRadius = 15; // Максимальний радіус у площині xz
const cameraMinY = 0.5;
const cameraMaxY = 15;



// Рендер сцени в циклі
function animate() {
    requestAnimationFrame(animate); // Циклічний виклик
    controls.update(); // Оновлюємо контроллер

    // // 2. Застосовуємо обмеження до позиції камери після її оновлення контролерами
    // camera.position.x = Math.max(cameraMinX, Math.min(cameraMaxX, camera.position.x));
    camera.position.y = Math.max(cameraMinY, Math.min(cameraMaxY, camera.position.y));
    // camera.position.z = Math.max(cameraMinZ, Math.min(cameraMaxZ, camera.position.z));

    // 2. Застосовуємо обмеження до позиції камери після її оновлення контролерами

    // camera.position.y / cameraFixedY

    // 2.2 Обмежуємо положення в площині XZ радіусом
    // Спочатку обчислюємо поточний радіус камери відносно початку координат (0,0) в площині xz
    const currentRadius = Math.sqrt(
        camera.position.x * camera.position.x +
        camera.position.z * camera.position.z
    );

    // Якщо поточний радіус перевищує максимальний
    if (currentRadius > maxCameraRadius) {
        // Обчислюємо коефіцієнт масштабування
        const scaleXZ = maxCameraRadius / currentRadius;
        const scaleY = camera.position.y / cameraMaxY;

        // Масштабуємо координати x і z, щоб вони знаходилися в межах радіуса
        camera.position.x *= scaleXZ;
        camera.position.z *= scaleXZ;
    }

    // camera.position.y /= scaleY;

    renderer.render(scene, camera); // Рендеринг сцени
}
animate();
