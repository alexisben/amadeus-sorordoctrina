import * as THREE from "three";
import signal from "signal-js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import {ObjectControls} from "threejs-object-controls";

import gsap from "gsap";

import sceneManager from "./scene";
import renderer from "./renderer";
import loaderManager from './loaderManager'
import assets from './assets'
import bridgeScene from './acts/act1-bridgeScene'
import Camera from "./Camera";
import audioManager from "./audioManager";
import bridgeLoop from "./archives/BridgeLoop";
import router from "./router";
import pointerManager from "./pointerManager";

const canvas = document.querySelector("canvas.webgl");

const experienceManager =
    {
        objects: {
            statue: null,
            bridge: null,
            clavecin: null,
            parchemin: null,
            bottle: null
        },
        currentObject : null,
        init()
        {
            // Scene
            sceneManager.create(canvas);

            this.textures = loaderManager.loadTextures();
            // bridgeScene.init();



            // Renderer
            renderer.init(canvas);

            signal.on('changeScreen', this.onChangeScreen)



            // Tick loop
            this.startLoopExperience();


            loaderManager.loadMultipleGLTFs({
                statue: assets.statue.url,
                bridge: assets.bridge.url,
                harpsichord: assets.harpsichord.url,
                parchemin: assets.parchemin.url,
                flask: assets.flask.url,
            }, this.onLoadComplete.bind(this));


            // // BIND ==> garder le scope de l'Experience Manager
            // loaderManager.loadGLTF(assets.mozart, this.setupIntro.bind(this))
            this.addLight();
        },

        addLight() {
            const light = new THREE.AmbientLight(0x404040); // soft white light
            // sceneManager.addObject(light);
        },

        onLoadComplete(){
            this.objects = loaderManager.loadedAssets;
            this.placeObjects();
            router.showScreen(1);

            // Pointer manager, for turning meshes feature
            pointerManager.init();


        },

        placeObjects() {
            const objectToBePlaced = ['statue', 'bridge', 'harpsichord', 'flask', 'parchemin'];
            objectToBePlaced.forEach((objectName) => {
                this.placeMesh(this.objects[objectName], assets[objectName]);
            });
        },

        placeMesh(mesh, data) {
            mesh.position.set(data.pX, data.pY, data.pZ);
            mesh.rotation.set(data.rX, data.rY, data.rZ);
            mesh.scale.set(data.sX, data.sY, data.sZ);
        },

        onChangeScreen(index)
        {

            console.log(`go to screen ${index} in three js scene`);
            experienceManager.fillScene(index);

            switch(index)
            {
                case 0:
                    canvas.style.display = 'none';
                    break;
                case 1:
                    canvas.style.display = 'block';
                    break;
                case 4:
                    audioManager.chooseSong();
                    break;
            }
        },



        fillScene(index)
        {

            // this.currentObject = this.objects.harpsichord;

            switch (index)
            {
                case 0:

                    break;
                case 1:

                    this.directionalLight = new THREE.DirectionalLight(0xfffffff, 0.7);
                    this.directionalLight.position.set(-2, 2, 1);

                    this.directionalLight.shadow.mapSize.width = 2048
                    this.directionalLight.shadow.mapSize.height = 2048
                    this.directionalLight.shadow.camera.far = 15;
                    console.log('bias')
                    console.log(this.directionalLight.shadow.bias)
                    // this.directionalLight.shadow.bias = 0.01


                    this.directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight)
                    sceneManager.addObject(this.directionalLightHelper);


                    this.ambientLight = new THREE.AmbientLight('#B9B9B9', 1);
                    sceneManager.addObject(this.ambientLight);


                    // this.directionalLight.castShadow = true
                    sceneManager.addObject(this.directionalLight);

                    // const lightAxisHelper = new THREE.DirectionalLightHelper(this.directionalLight, 0.5);
                    // sceneManager.addObject(lightAxisHelper)
                    this.changeFocusedObject(this.objects.statue);
                    break;

                case 2:
                    // ÉCRAN SCÈNE 3D ACTE 2
                    console.log('acte 2')
                    this.removeFocusedObject();
                    sceneManager.removeObject(this.directionalLight)
                    break;
                
                case 3:
                    this.removeFocusedObject();
                    sceneManager.removeObject(this.directionalLight)
                    break;

                case 4:
                    this.changeFocusedObject(this.objects.statue, true);
                    this.objects.statue.position.set(0, -0.330, -2.660)
                    this.objects.statue.rotation.set(0.170, - 1.6 * Math.PI, 0)
                    this.objects.statue.scale.set(0.250, 0.250, 0.250)

                    this.directionalLight.castShadow = true;
                    this.objects.statue.castShadow = true;
                    this.objects.bridge.castShadow = true;
                    this.objects.bridge.receiveShadow = true;
                    this.objects.bridge.children[0].castShadow = true;
                    this.objects.bridge.children[0].receiveShadow = true;

                    // this.objects.bridge.children[0].children[0].castShadow = true;
                    // this.objects.bridge.children[0].children[0].receiveShadow = true;
                    //
                    // this.objects.bridge.children[0].children[1].castShadow = true;
                    // this.objects.bridge.children[0].children[1].receiveShadow = true;
                    //
                    // this.objects.bridge.children[0].children[2].castShadow = true;
                    // this.objects.bridge.children[0].children[2].receiveShadow = true;
                    //
                    // this.objects.bridge.children[0].children[3].castShadow = true;
                    // this.objects.bridge.children[0].children[3].receiveShadow = true;
                    //
                    // this.objects.bridge.children[0].children[4].castShadow = true;
                    // this.objects.bridge.children[0].children[4].receiveShadow = true;
                    //
                    // this.objects.bridge.children[0].children[5].castShadow = true;
                    // this.objects.bridge.children[0].children[5].receiveShadow = true;

                    for (let i = 0; i < this.objects.bridge.children[0].children.length; i++)
                    {
                        console.log('ça fonctionne')
                        this.objects.bridge.children[0].children[i].castShadow = true;
                        this.objects.bridge.children[0].children[i].receiveShadow = true;
                        // this.objects.bridge.children[0].children[i].material =  new THREE.MeshNormalMaterial()
                    }



                    console.log('shadows')
                    console.log(this.objects.bridge)


                    bridgeScene.init();
                    bridgeScene.startAnimation();
                    bridgeScene.addActBridgeObject();
                    break;
                case 5:
                    this.changeFocusedObject(this.objects.harpsichord, true);
                    break;
                case 6:
                    this.changeFocusedObject(this.objects.parchemin, true);
                    break;
                case 7:
                    this.changeFocusedObject(this.objects.flask, true);
                    break;
                case 8:
                    this.removeFocusedObject();
                    break;
                default:
            }

        },
        removeFocusedObject() {
            if (this.currentObject) {
                sceneManager.removeObject(this.currentObject);
                this.currentObject = null;
            }
        },
        changeFocusedObject(object, animate = false) {
            // Enlève l'object courant s'il existe
            this.removeFocusedObject();
            // Ajoute l'objet dans la scene
            this.currentObject = object;
            sceneManager.addObject(this.currentObject);

            if (animate) {
                // Ici faire une animation d'apparition de l'objet 3D
            }
        },

        startLoopExperience(){
            this.clock = new THREE.Clock();
            this.lastElapsedTime = 0;

            this.tick = () =>
            {
                this.elapsedTime = this.clock.getElapsedTime()
                this.deltaTime = this.elapsedTime - this.lastElapsedTime
                this.lastElapsedTime = this.elapsedTime

                // Update controls
                // sceneManager.getCamera().update();


                // Start the bridge loop
                if (router.getCurrentScene() === 4 ||
                    router.getCurrentScene() === 5 ||
                    router.getCurrentScene() === 6
                )
                {
                    bridgeScene.bridgeLoop();
                }

                this.onUpdate();

                // Render
                renderer.draw(sceneManager);

                // Call tick again on the next frame
                window.requestAnimationFrame(this.tick);
            }

            this.tick();
        },

        onUpdate() {
            // Auto rotate current object
            if (this.currentObject) {
                // this.currentObject.rotation.y += 0.001;
            }
        }
    }

export default experienceManager;
