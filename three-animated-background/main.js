import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';

const gui = new GUI();
const props = {
    plane: {
        width: 400,
        height: 400,
        widthSegments: 50,
        heightSegments: 50,
    }
};

gui.add(props.plane, 'width', 1, 800).onChange(generatePlane);
gui.add(props.plane, 'height', 1, 800).onChange(generatePlane);
gui.add(props.plane, 'widthSegments', 1, 100).onChange(generatePlane);
gui.add(props.plane, 'heightSegments', 1, 100).onChange(generatePlane);

function generatePlane() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(
        props.plane.width, 
        props.plane.height, 
        props.plane.widthSegments, 
        props.plane.heightSegments,
    );
    const {array} = planeMesh.geometry.attributes.position;

    for (let i = 0; i < array.length; i += 3) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];

        array[i + 2] = z + Math.random();
    }

    const colors = [];
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(0, 0.19, 0.4);
    };

    planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
};

const raycaster = new THREE.Raycaster();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75, 
    innerWidth / innerHeight, 
    0.1, 
    1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);
camera.position.z = 10;

const planeGeometry = new THREE.PlaneGeometry(
    400,
    400,
    500,
    500,
);
const planeMaterial = new THREE.MeshPhongMaterial(
    { 
        side: THREE.DoubleSide,
        flatShading: THREE.FlatShading,
        vertexColors: true,
    },
);
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

const {array} = planeMesh.geometry.attributes.position;

for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i + 2] = z + Math.random();
}

const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
};

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

const light = new THREE.DirectionalLight(
    0xffffff,
    1,
);
light.position.set(0, 1, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(
    0xffffff,
    1,
);
backLight.position.set(0, 0, -1);
scene.add(backLight);

const mouse = {
    x: undefined,
    y: undefined,
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planeMesh);
    if (intersects.length > 0) {
        const {color} = intersects[0].object.geometry.attributes;
        color.setX(intersects[0].face.a, 0.1);
        color.setY(intersects[0].face.a, 0.5);
        color.setZ(intersects[0].face.a, 1);

        color.setX(intersects[0].face.b, 0.1);
        color.setY(intersects[0].face.b, 0.5);
        color.setZ(intersects[0].face.b, 1);

        color.setX(intersects[0].face.c, 0.1);
        color.setY(intersects[0].face.c, 0.5);
        color.setZ(intersects[0].face.c, 1);
        color.needsUpdate = true;
    }
};

animate();

addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
