import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/FBXLoader.js';
function main(){
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true,canvas});
    var avatar1;
    var avatar2;
    var football;
    mainCamera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	mainCamera.position.set(-40,40,40);
    
    avatarCamera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		0.1,
		60  
	);
    avatarCamera.position.set(0,3,-2.7);
    avatarCamera.lookAt(0,2,12);
    control = new OrbitControls(camera, canvas);
    scene = new THREE.Scene();
	const dirLight = new THREE.DirectionalLight(0xffffff, 0.3 );
	dirLight.position.set(20, 100, 20);
	scene.add(dirLight);
    const light = new THREE.PointLight(0xffffff, 0.5, 100, 10);
    light.position.set( 0, 50, 0);
    light.castShadow = true;
    light.shadowCameraVisible = true;
    scene.add( light );
    clock = new THREE.Clock();
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    const fbxLoader = new FBXLoader()
fbxLoader.load(
    'model/3d-model.fbx',
    (object) => {
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)
    function render(time) {
        delta = clock.getDelta();

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        
        renderer.render(scene, maincamera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}