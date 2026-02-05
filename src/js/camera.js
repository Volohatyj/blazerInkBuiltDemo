// src/js/camera.js

import * as THREE from 'three';

const cameraPosition = {
    x: 21,
    y: 1.8,
    z: -10
};

/**
 * Конвертація горизонтального кута огляду (3ds Max, Corona) у вертикальний кут для Three.js
 * @param {number} horizontalFovDeg Горизонтальний кут в градусах
 * @param {number} aspectRatio Співвідношення сторін (width / height)
 * @returns {number} Вертикальний кут в градусах
 */
function convertHorizontalFovToVerticalFov(horizontalFovDeg, aspectRatio) {
    const horizontalFovRad = THREE.MathUtils.degToRad(horizontalFovDeg);
    const verticalFovRad = 2 * Math.atan(Math.tan(horizontalFovRad / 2) / aspectRatio);
    return THREE.MathUtils.radToDeg(verticalFovRad);
}


export function initCamera() {
    // Ініціалізація камери
    const aspectRatio = 960 / 600;
    const horizontalFov = 48.455; // Кут з 3ds Max
    const verticalFov = convertHorizontalFovToVerticalFov(horizontalFov, aspectRatio);

    const camera = new THREE.PerspectiveCamera(
        verticalFov, // Кут огляду 48.455 в 3ds Max
       aspectRatio, // Співвідношення сторін
        0.1,                               // Ближня межа
        1000                               // Дальня межа
    );
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z); // Початкове положення камери

    return camera;
}
