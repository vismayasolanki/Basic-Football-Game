import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import Group1 from './objects.js';
import {FBXLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/FBXLoader.js';
import Avatar from "./avatar.js";
// import Group2 from './obstacle.js';



let mainCamera, avatarCamera, camera, scene, control;
let avatar, currCamera = "mainCamera", dirLight, trackLight,trackLight1,avatar_head_light, clock, delta, teapot;
let isAttached = 'none', groundMesh, loader, groundMaterial, texture_grass, texture_raod, curr_texture = 'road';
let player;
let ball, g1;
let count = 0;
let trackLight2;


let kick_counter = 0;
let is_kicked = false;


function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true,canvas});
    renderer.setClearColor(0xAAAAAA);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PVFSoftShadowMap;
    scene = new THREE.Scene();

    clock = new THREE.Clock();

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
		0.01,
		1000  
	);
    avatarCamera.position.set(0,3,-2.7);
    avatarCamera.lookAt(0,2,12);
    console.log("avatarcamera");
    console.log(avatarCamera);
    g1 = new Group1(scene);
    ball = g1.getball();

    // let g2 = new Group2(scene);


    avatar = new Avatar(scene, avatarCamera, g1);
    player = new Avatar(scene, avatarCamera, g1);
    avatar.avatar.add(avatarCamera);

    loader = new FBXLoader();
    loader.load('model/3d-model.fbx', (fbx) => {
        fbx.traverse( function ( object ) {
            if ( object.isMesh ) object.castShadow = true;
        } );
        scene.add(fbx);
    });
    //ball = new Group1(scene);
    //ball = new Ball(scene)
    camera = mainCamera;
    player.setposition(5, 0, 1);
    avatar.setposition(-5, 0, 2);
    g1.setposition(0, 2, 0);
    console.log(g1.getposition());
    //avatar.setposition(-5, -5, 0)
    avatar.getposition();
    {
	    dirLight = new THREE.DirectionalLight(0xffffff, 0.3 );
		dirLight.position.set(20, 100, 20);
		scene.add(dirLight);
	}

    {
        const light = new THREE.PointLight(0xffffff, 0.5, 100, 10);
        light.position.set( 0, 50, 0);
        light.castShadow = true;
        light.shadowCameraVisible = true;
        scene.add( light );
    }

    {
        avatar_head_light = new THREE.PointLight(0xffffff, 1, 100, 10);
        avatar_head_light.position.set( 0, 50, 0);
        avatar_head_light.castShadow = true;
        avatar_head_light.shadowCameraVisible = true;
        avatar.avatar.add( avatar_head_light );
    }


    // Child: ambient light 
    {
        const ambient = new THREE.AmbientLight( 0xffffff, 0.1);
        scene.add( ambient );
    }


    // spotlight
    {
        trackLight = new THREE.SpotLight(0xffffff,10,25.0,Math.PI/4.5,0.3,0.8);
        trackLight.position.set(0,15,0);
        trackLight.target = avatar.avatar;
        trackLight.castShadow = true;
        trackLight.shadowCameraVisible = true;
        scene.add(trackLight);
        scene.add(trackLight.target);
    }

    {
        trackLight1 = new THREE.SpotLight(0xffffff,5.0,25.0,Math.PI/4.5,0.3,0.8);
        trackLight1.position.set(0,15,0);
        trackLight1.target = player.avatar;
        trackLight1.castShadow = true;
        trackLight1.shadowCameraVisible = true;
        scene.add(trackLight1);
        scene.add(trackLight1.target);
    }

    
    
    control = new OrbitControls(camera, canvas);

    loader = new THREE.TextureLoader();
    texture_raod = loader.load( './model/footbal.jpg', function ( texture ) {
        texture.wrapS = texture.wrapT;
        texture.offset.set( 0, 0 );
    } );

    texture_grass = loader.load( './model/grass.jpg', function ( texture ) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set( 0, 0 );
        texture.repeat.set( 8, 8 );
    } );

	const groundGeometry = new THREE.PlaneGeometry(120, 120);
	groundMaterial = new THREE.MeshPhongMaterial({color: 0xCC8866,side: THREE.DoubleSide,map: texture_raod});
	groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
	groundMesh.rotation.x = Math.PI * -.5;
    groundMaterial.receiveShadow = true;
	scene.add(groundMesh);

    

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


    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }
    

function is_goal(){
    
    var a = g1.getposition();
    // console.log("ballPos : ");
    // console.log(a[0]);
    if(a[0] > 31 || a[0] <-31){
        count = 0;
        avatar.setposition(-5, 0, 2);
        g1.setposition(0, 2, 0);
    }
}
    

let is_animation = false;
let direction,deltax = 0.1,curx = 0,cury = 0,s,d;
let iters = 0;
    
    

function render(time) {
        delta = clock.getDelta();
        time += delta;
        if(is_animation){
            curx += deltax;
            
            // var s = g1.getposition();
            // var d = [finalx, finalz];
            var m = (s[1] - d[1])/(s[0] - d[0]);
            // var delX = 0.1;
            var x = s[0] + curx;
            var z = m*(x-s[0]) + s[1];
            // if(x > d[0] || z > d[1]){
            //     is_animation = false;
            //     curx = 0;
        
            // }
            g1.setposition(x,2,z);

            if(iters > 100){
                curx = 0;
                is_animation = false;
                // is_kicked = false;
                iters = 0;
                // kick_counter = 0;
            }

            iters++;
            // kick_counter++
        }
        if(count == 4 || count ==3 || is_animation){
            ball.rotation.z = time/100;
        }
        else {
            ball.rotation.z = 0;
        }
        // console.log(count);

        if(count == 2){
            let n = 0;
            var p = avatar.getposition();
            let colliding_object = avatar.isCollision();
            if(colliding_object != null && n <=100 && !is_animation){
                is_animation = true;
                console.log("change direction");
                var finalx= -1 * p[0]/getRndInteger(2,10) + ((colliding_object.position.x - p[0])/10)*n/100;
                var finalz= -1 * p[2]/getRndInteger(2,10) + ((colliding_object.position.z - p[2])/10)*n/100;
                // var finalx = 0;
                // var finalz = 0;
                s = [p[0],p[2]];
                console.log("here")
                console.log(s);
                d = [finalx,finalz];
                
                
                
                // var s = g1.getposition();
                // var d = [finalx, finalz];
                // var m = (s[1] - d[1])/(s[0] - d[0]);
                // var delX = 0.1;
                // var x = s[0] + delX;
                // // for(let i = 0; i < 1000000 ; i += 1){
                //     var z = m*(x-s[0]) + s[1];
                //     // scene.add(g1.footballMesh);
                //     g1.setposition(x, 2, z);
                //     // g1.footballMesh.render();
                //     x += delX;
                // // }
                scene.add(g1.footballMesh);
                g1.setposition(finalx, 2, finalz);
                g1.footballMesh.scale.set(0.3, 0.3, 0.3);
                count = 0;
                n++;
            }
            n = 0;
        }


    if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        trackLight.position.x = avatar.avatar.position.x;
        trackLight.position.z = avatar.avatar.position.z;


        
        trackLight1.position.x = player.avatar.position.x;
        trackLight1.position.z = player.avatar.position.z;
    


        
    


        is_goal();

        avatar.animate(delta,g1);
        player.animate(delta, g1);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

window.addEventListener('keydown', function (e) {
    keyDown(e);
});
    
window.addEventListener('keyup', function (e) {
    keyUp(e);
});


function kick(){
        var p = avatar.getposition();

        
        var r = [33, 2, 0];
        var x = p[0] + (( r[0] - p[0])/2) + 10;
        var z = p[2] + ((r[2] - p[2])/2) + 10;
        
        console.log("kick detials")
        g1.setposition(x, p[1], z);

        
        count = 0;
    }


function keyDown(e) {
    
    // console.log(avatar);
    // console.log(g1.footballMesh);
    let keyCode = e.keyCode;
        // if(keyCode== 87){        //w
        //     if(isAttached == 'none'){
        //         avatar.forward = true;
        //     }
        // }
        if(keyCode == 68){//d
            var a = avatar.getposition();
            var b = g1.getposition();
            if(Math.hypot(a[0]-b[0], a[2]-b[2]) <10 ){
                console.log("yes dribble");
                count = 3;

            }
        }
        else if(keyCode ==67){//c
            console.log("adding");
            var a = avatar.getposition();
            var b = g1.getposition();
            // ball
            if(Math.hypot(a[0]-b[0], a[2]-b[2]) <5){
                console.log("yes carry");
                count = 2;
                avatar.avatar.add(g1.footballMesh);
            console.log(g1)

            g1.footballMesh.scale.set(4, 4, 4);

            let colliding_object = avatar.isCollision();
            // return;

            if(colliding_object != null){
                console.log("colliding position");
                console.log(colliding_object.position.x);
                
                let init_position = g1.getposition();
                let final_position = g1.getposition();;
                g1.setposition(final_position[0] + 10,final_position[1],final_position[2] + 10);
            }
            }
        }
        else if(keyCode== 75){//k
            g1.footballMesh.scale.set(0.3, 0.3, 0.3);
            var a = avatar.getposition();
            var b = g1.getposition();
            if(Math.hypot(a[0]-b[0], a[2]-b[2]) <20){
                console.log("yes kick");
                count = 4;
                scene.add(g1.footballMesh);
            console.log("kick");
            kick();
            }

        }
        else if(keyCode == 90){//z
            console.log("z");
            count = 0;
        } 
        else if(keyCode== 38 ){//up arrow
            var arr = avatar.getposition();
            //avatar.setposition(arr[0]+1, arr[1], arr[2]);
            avatar.forward = true;
            console.log(arr);
            if(count == 3){
                var arr1 = avatar.getposition();
                // ball set 
                g1.setposition(arr1[0]+5, 2, arr1[2]+5);
            }
            else if(count == 2){
                var arr1 = avatar.getposition();
                g1.setposition(arr1[0]+2, 2 , arr1[2]+2);
            }
        }
        else if(keyCode== 39){//right arrow
            var arr = avatar.getposition();
            avatar.right= true;
            if(count == 3){
                var arr1 = avatar.getposition();
                g1.setposition(arr1[0]+5, 2, arr1[2]+5);
            }
            else if(count == 2){
                var arr1 = avatar.getposition();
                g1.setposition(arr1[0]+2, 2, arr1[2]+2);
            }
        }
        else if(keyCode== 37 ){//left arrow
            var arr = avatar.getposition();
            //avatar.setposition(arr[0], arr[1], arr[2]-1);
            avatar.left = true;
            if(count == 3){
                var arr1 = avatar.getposition();
                g1.setposition(arr1[0]+5, 2, arr1[2]+5);
            }
            else if(count ==2){
                var arr1 = avatar.getposition();
                g1.setposition(arr1[0]+2, 2, arr1[2]+2);
            }
        } 
        else if(keyCode== 40){//down arrow
            var arr = avatar.getposition();
            //avatar.setposition(arr[0]-1, arr[1], arr[2]);
            avatar.backward = true;
            if(count == 3){
                var arr1 = avatar.getposition();
                g1.setposition(arr1[0]+5, 2, arr1[2]+5);
            }
            else if(count ==2){
                var arr1 = avatar.getposition();
                g1.setposition(arr1[0]+2, 2, arr1[2]+2);
            }
        }

        else if(keyCode == '1'.charCodeAt(0)){
            player.forward = true;
        }

        else if(keyCode == '2'.charCodeAt(0)){
            player.backward = true;
        }
        else if(keyCode == '3'.charCodeAt(0)){
            player.right = true;
        }
        else if(keyCode == '4'.charCodeAt(0)){
            player.left = true;
        }

        else if(keyCode == 84){//T
            if(curr_texture == 'road'){
                groundMesh.material.map = texture_grass;
                groundMesh.material.needsUpdate = true;
                curr_texture = 'grass';
            }
            else if(curr_texture == 'grass'){
                groundMesh.material.map = texture_raod;
                groundMesh.material.needsUpdate = true;
                curr_texture = 'road';
            }
        }
        else if(keyCode == '6'.charCodeAt(0)){
            g1.turnOffLights();
            trackLight.intensity = 0;
            trackLight1.intensity = 0;

        }

        else if(keyCode == '7'.charCodeAt(0)){
            g1.turnOnLights();
            trackLight.intensity = 10;
            trackLight1.intensity = 10;

        }
        else if(keyCode == '8'.charCodeAt(0)){
            g1.increaseIntensity();
        }
        else if(keyCode == '9'.charCodeAt(0)){
            g1.decreaseIntensity();
        }
}

function keyUp(e) {
    let keyCode = e.keyCode;

    switch (keyCode) {
        case 38:        //uparrow
            avatar.forward = false;
            break;
        case 37:        //leftarrow
            avatar.left = false;
            break;
        case 39:        //rightarrow
            avatar.right = false;
            break;
        case 40:        //downarrow
            avatar.backward = false;
            break;
        case '1'.charCodeAt(0):
            player.forward = false;
            break;

        case '2'.charCodeAt(0):
            player.backward = false;
            break;
        case '3'.charCodeAt(0):
            player.right = false;
            break;
        case '4'.charCodeAt(0):
            player.left = false;
            break;

        case 88:        //c
            if(currCamera == "mainCamera"){
                camera = avatarCamera;
                currCamera = "avatarCamera";
            }
            else if(currCamera == "avatarCamera"){
                camera = mainCamera;
                currCamera = "mainCamera"
            }
            
            break;
        default:
            break;
    }
}

main();
