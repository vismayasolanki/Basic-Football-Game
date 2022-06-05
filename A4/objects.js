import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';

export default class Group1{
    constructor(scene){
        this.scene = scene;
        this.leaderG1 = new THREE.Object3D();
        this.obstacles = new Array(4);
        this.streetLights = new Array(6);
        this.scene.add(this.leaderG1);
        this.ball_mode = 'kick';
        

        this.football = new THREE.Object3D();
        this.leaderG1.add(this.football);
        this.footballMesh = new THREE.Object3D();
        this.footballMesh.scale.set(0.3,0.3,0.3);
        this.football.add(this.footballMesh);
        this.BBox = new THREE.Box3().setFromObject(this.footballMesh);

        const mtlLoader = new MTLLoader();
        mtlLoader.load('./model/Sphere/sphere.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('./model/Sphere/sphere.obj', (root) => {
                var texture = new THREE.TextureLoader().load('./model/ball_text.jpeg');
                root.traverse(function (child){
                    if(child instanceof THREE.Mesh){
                        child.material.map = texture;
                    }
                });
                root.castShadow = true;
                root.receiveShadow = true;
                this.footballMesh.add(root);
            });
        });
        this.football.BBox = new THREE.Box3().setFromObject(this.football);

        // obstacles
        let s1 = new THREE.Object3D();
            this.scene.add(s1);
            mtlLoader.load('./model/Sphere/sphere.mtl', (mtl) => {
                mtl.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(mtl);
                objLoader.load('./model/Sphere/sphere.obj', (root) => {
                    root.scale.set(0.5,0.5,0.5);

                    s1.position.set(25, 4, 25);
                    s1.add(root);
                });
            });
            
            let s2 = new THREE.Object3D();
            this.scene.add(s2);
            mtlLoader.load('./model/Sphere/sphere.mtl', (mtl) => {
                mtl.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(mtl);
                objLoader.load('./model/Sphere/sphere.obj', (root) => {
                    root.scale.set(0.5,0.5,0.5);
               
                    s2.position.set(-25, 4, 25);
                    s2.add(root);
                });
            });

            let t1 = new THREE.Object3D();
            this.scene.add(t1);
            mtlLoader.load('./model/Teapot/teapot.mtl', (mtl) => {
                mtl.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(mtl);
                objLoader.load('./model/Teapot/teapot.obj', (root) => {
                    root.scale.set(0.5,0.5,0.5);
                    t1.position.set(-25, 4, -25);
                    t1.add(root);
                });
            });
            
            let t2 = new THREE.Object3D();
            this.scene.add(t2);
            mtlLoader.load('./model/Teapot/teapot.mtl', (mtl) => {
                mtl.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(mtl);
                objLoader.load('./model/Teapot/teapot.obj', (root) => {
                    root.scale.set(0.5,0.5,0.5);
                    // t2.position.set(points[i].x+3,0,points[i].y+3);
                    // t2.position.set(corners[i]);
                    t2.position.set(25, 4, -25);
                    t2.add(root);
                });
            });

        // this.obstacles.add(1);
        console.log("hey");
        console.log(typeof(this.obstacles));
        console.log((t1));
        // console.log(t1.BBox);
        this.obstacles[0] = t1;
        this.obstacles[1] = t2;
        this.obstacles[2] = s1;
        this.obstacles[3] = s2;

        for(let i=0;i<this.obstacles.length;i++){
            this.obstacles[i].BBox = new THREE.Box3().setFromObject(this.obstacles[i]);

        }

        
        let corners = [[50,2,50],[50,2,-50],[-50,2,-50],[-50,2,50],[0,2,-50],[0,2,50],[50,2,0],[-50,2,0]];

        let focus = [[40,2,40],[40,2,-40],[-40,2,-40],[-40,2,40],[0,2,-40],[0,2,40],[40,2,0],[-40,2,0]];



        for(let i=0;i<corners.length;i++){
            let streetLamp = new THREE.Object3D();
            this.scene.add(streetLamp);
            mtlLoader.load('./model/streetlamp.mtl', (mtl) => {
                mtl.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(mtl);
                objLoader.load('./model/streetlamp.obj', (root) => {
                    root.scale.set(1.0,1.0,1.0);
                    // streetLamp.position.set(points[i].x+3,0,points[i].y+3);
                    // streetLamp.position.set(corners[i]);
                    streetLamp.position.set(corners[i][0],corners[i][1],corners[i][2]);
                    streetLamp.add(root);
                });
            });
            var street_light = new THREE.PointLight(0xffffff, 30, 100, 10);
            street_light.position.set(corners[i][0],corners[i][1]+4,corners[i][2]);
            street_light.castShadow = true;
            street_light.shadowCameraVisible = true;
            scene.add( street_light );
            this.streetLights[i] = street_light;

        }


        this.leaderG1.add(this.football);

        this.busPosition = [new THREE.Vector2(),new THREE.Vector2()];
	    this.busTarget = [new THREE.Vector2(),new THREE.Vector2()];
        this.busSpeed = 0.001;

        this.clock = 0;
        this.stop = false;
        this.BBox = new THREE.Box3().setFromObject(this.footballMesh);
    }
    setposition(x, y, z){
        this.footballMesh.position.x = x;
        this.footballMesh.position.y = y;
        this.footballMesh.position.z = z;
    }
    getposition(){
        return [this.footballMesh.position.x, this.footballMesh.position.y, this.footballMesh.position.z];
    }

    getball(){
        console.log(this.footballMesh);
        return this.footballMesh;
    }

    getball_mode(){
        return this.ball_mode;
    }

    getObstacles(){
        return this.obstacles;
    }

    increaseIntensity(){
        var delta = 1;
        this.streetLights.forEach(element => {
            element.intensity += delta;
        });
    }

    decreaseIntensity(){
        var delta = 1;
        this.streetLights.forEach(element => {
            element.intensity -= delta;
        });
    }

    turnOffLights(){

        this.streetLights.forEach(element => {
            console.log("elemet");
            console.log(element);
            element.intensity = 0;
        });

    }

    turnOnLights(){

        this.streetLights.forEach(element => {
            element.intensity = 10;
        });
    }
    
    


}