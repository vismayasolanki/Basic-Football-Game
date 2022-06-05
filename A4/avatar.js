import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {FBXLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/FBXLoader.js';

export default class Avatar{
    constructor(scene,avatarCamera,g1){
        this.scene = scene;

        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        this.g1 = g1;              
        this.avatar = new THREE.Object3D();
        this.avatar.scale.set(0.075,0.075,0.075);
        this.avatar.rotateOnAxis(new THREE.Vector3(0,1,0), 1.57);
        this.scene.add(this.avatar);
        this.target = null;
        this.camera = avatarCamera;

        const loader = new FBXLoader();

        this.mixerForward = new THREE.AnimationMixer();
        loader.setPath('./model/');
        loader.load('avtar.fbx', (fbx) => {
            fbx.traverse( function ( object ) {
                if ( object.isMesh ) object.castShadow = true;
            } );

            this.target = fbx;
            const anim = new FBXLoader();
            anim.setPath("./model/");
            anim.load('Walking_forward.fbx', (anim) =>{
                this.mixerForward = new THREE.AnimationMixer(fbx);
                const idle = this.mixerForward.clipAction(anim.animations[0]);
                idle.play();
            })
            this.avatar.add(fbx);
        });

        this.mixerBackward = new THREE.AnimationMixer();
        const anim = new FBXLoader();
        anim.setPath("./model/");
        anim.load('Walking_Backwards.fbx', (anim) =>{
            this.mixerBackward = new THREE.AnimationMixer(this.target);
            const idle = this.mixerBackward.clipAction(anim.animations[0]);
            idle.play();
        });

        this.mixerFalling = new THREE.AnimationMixer();
        anim.setPath("./model/");
        anim.load('Floating.fbx', (anim) =>{
            this.mixerFalling = new THREE.AnimationMixer(this.target);
            const idle = this.mixerFalling.clipAction(anim.animations[0]);
            idle.play();
        });

        this.mixerIdle = new THREE.AnimationMixer();
        anim.setPath("./model/");
        anim.load('Idle.fbx', (anim) =>{
            this.mixerIdle = new THREE.AnimationMixer(this.target);
            const idle = this.mixerIdle.clipAction(anim.animations[0]);
            idle.play();
        });

        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(1, 0.25, 50.0);
        this.decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
        this.BBox = new THREE.Box3().setFromObject(this.avatar);
        this.isJumping = false;
        this.jumpingVelocity = 0;
        this.jumpingVelocityDir = null;
        this.gravityAcc = 18.8;
    }
    setposition(x, y, z){
        this.avatar.position.x = x;
        this.avatar.position.y = y;
        this.avatar.position.z = z;
    }
    getposition(){
        return [this.avatar.position.x, this.avatar.position.y, this.avatar.position.z];
    }
    getbox(){
        return this.avatar.BBox;
    }
    animate(delta,g1){
        if(this.isJumping){
            this.jumpingAnimation(delta);
            // return;
        }
        
        this.BBox = new THREE.Box3().setFromObject(this.avatar);

        const velocity = this.velocity;
        const frameDecceleration = new THREE.Vector3(
            velocity.x * this.decceleration.x,
            velocity.y * this.decceleration.y,
            velocity.z * this.decceleration.z
        );
        frameDecceleration.multiplyScalar(delta);
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
            Math.abs(frameDecceleration.z), Math.abs(velocity.z));
    
        velocity.add(frameDecceleration);

        const controlObject = this.avatar;
        const _Q = new THREE.Quaternion();
        const _A = new THREE.Vector3();
        const _R = controlObject.quaternion.clone();
        const acc = this.acceleration.clone();

        if (this.forward) {
            velocity.z += acc.z * delta;
        }
        if (this.backward) {
            velocity.z -= acc.z * delta;
        }
        if (this.left) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * this.acceleration.y);
            _R.multiply(_Q);
        }
        if (this.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * this.acceleration.y);
            _R.multiply(_Q);
        }
    
        controlObject.quaternion.copy(_R);
    
        const oldPosition = new THREE.Vector3();
        oldPosition.copy(controlObject.position);
    
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();
    
        const sideways = new THREE.Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();
    
        sideways.multiplyScalar(velocity.x * delta);
        forward.multiplyScalar(velocity.z * delta);
    
        controlObject.position.add(forward);
        controlObject.position.add(sideways);

        this.BBox = new THREE.Box3().setFromObject(this.avatar);
        
        if(this.BBox.intersectsBox(g1.BBox)){
            if(controlObject.position.distanceTo(g1.footballMesh.position) <= oldPosition.distanceTo(g1.footballMesh.position)){
                controlObject.position.add((new THREE.Vector3(0,0,0)).sub(forward));
                controlObject.position.add((new THREE.Vector3(0,0,0)).sub(sideways));
            }
        }

        

        if(controlObject.position.x >= 60 || controlObject.position.x <= -60 || controlObject.position.z >= 60 || controlObject.position.z <= -60){
            controlObject.position.add((new THREE.Vector3(0,0,0)).sub(forward));
            controlObject.position.add((new THREE.Vector3(0,0,0)).sub(sideways));
        }

        if(this.forward){
            this.mixerForward.update(delta);
            return ;
        }

        if(this.backward){
            this.mixerBackward.update(delta);
            return;
        }

        if(!this.isJumping){
            this.mixerIdle.update(delta);
        }
    }
       
    isCollision(){
        // console.log("AJAY");

        let obstacles = this.g1.obstacles;
        for(let i=0;i<obstacles.length;i++){
            let ob = obstacles[i];
            let a = this.avatar.position;
            let b = ob.position;
            // console.log(a);
            // console.log(b);
            // console.log(a.x-b.x);
            if(Math.hypot(a.x-b.x, a.z-b.z) < 10){
                console.log("collided");
                // count = 2;
                this.avatar.velocity = 0;
                return ob;
            }
        }
        return null;
    }

    

    getAvatar(){
        return this.avatar;
    }
}