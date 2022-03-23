// Tick to be able to use keys, storing it in a variable to be able to remove it later
let useCraneTick;

// Using crane? False or true, I have this to be able to use the command as an toggle
let usingCrane = false;

// The camera
let cam;

let soundID = {};

// Request sounds and animations
RequestAmbientAudioBank('Crane', false, -1);
RequestAmbientAudioBank('Crane_Stress', false, -1);
RequestAmbientAudioBank('Crane_Impact_Sweeteners', false, -1);
RequestScriptAudioBank('Container_Lifter', false, -1);
RequestAnimDict('map_objects');
RequestAnimDict('missheistdockssetup1trevor_crane');

// Crane movements, camera positioning and attaching/detaching containers
class Crane {
    constructor() {
        this.container;
        this.cameraAngle;
    }

    SetContainer( container ) {
        return this.container = container;
    }

    GetPos( object ) {
        return GetEntityCoords(createdObjects[object]);
    }

    Down() {
        let cable = `lifter-cables${ currentCable }`;

        // Change max Z value if there's a container attached so it won't clip through the ground
        let maxZ = this.container ? -2.16 : -2.5;

        if ( (Math.round((objects[cable].position.z - 0.06 + Number.EPSILON) * 100) / 100) >= maxZ ) {
            if ( !soundID['down'] ) {
                soundID['down'] = {
                    id: GetSoundId(),
                    played: true
                }

                PlaySoundFromEntity(
                    soundID['down'].id, 
                    'Move_U_D', 
                    createdObjects['cabin'], 
                    'CRANE_SOUNDS', 
                    0, 
                    false,
                    0
                );
            }

            objects[cable].position.z = objects[cable].position.z - 0.06;
            AttachEntityToEntity(createdObjects[cable], createdObjects[`lifter-cables${ currentCable - 1 }`], 0, 0.0, 0.0, objects[cable].position.z, 0.0, 0.0, 120.0, false, false, true, false, 0, false);
        } else {
            if ( currentCable != 6 ) {
                currentCable = currentCable + 1;
            }
        }
    }

    Up() {
        let cable = `lifter-cables${ currentCable }`;

        if ( (Math.round((objects[cable].position.z + 0.06 + Number.EPSILON) * 100) / 100) < 0.0 ) {
            if ( !soundID['up'] ) {
                soundID['up'] = {
                    id: GetSoundId(),
                    played: true
                }

                PlaySoundFromEntity(
                    soundID['up'].id, 
                    'Move_U_D', 
                    createdObjects['cabin'], 
                    'CRANE_SOUNDS', 
                    0, 
                    false,
                    0
                );
            }

            objects[cable].position.z = objects[cable].position.z + 0.06;
            AttachEntityToEntity(createdObjects[cable], createdObjects[`lifter-cables${ currentCable - 1 }`], 0, 0.0, 0.0, objects[cable].position.z, 0.0, 0.0, 120.0, false, false, true, false, 0, false);
        } else {
            if ( currentCable != 2 ) {
                currentCable = currentCable - 1;
            }
        }
    }

    Left() {
        if ( (Math.round((objects['cabin'].position.y - 0.02 + Number.EPSILON) * 100) / 100) > -7.0 ) {
            if ( !soundID['left'] ) {
                soundID['left'] = {
                    id: GetSoundId(),
                    played: true
                }

                PlaySoundFromEntity(
                    soundID['left'].id, 
                    'Move_L_R', 
                    createdObjects['cabin'], 
                    'CRANE_SOUNDS', 
                    0, 
                    false,
                    0
                );
            }

            objects['cabin'].position.y = objects['cabin'].position.y - 0.02;
            AttachEntityToEntity(createdObjects['cabin'], createdObjects['frame'], 0, -0.1, objects['cabin'].position.y, 18.0, 0.0, 0.0, 30.0, false, false, true, false, 0, false);
            this.Camera(this.cameraAngle, [ 1, objects['cabin'].position.y ]);
        }
    }

    Right() {
        if ( (Math.round((objects['cabin'].position.y - 0.02 + Number.EPSILON) * 100) / 100) < 7.0 ) {
            if ( !soundID['right'] ) {
                soundID['right'] = {
                    id: GetSoundId(),
                    played: true
                }

                PlaySoundFromEntity(
                    soundID['right'].id, 
                    'Move_L_R', 
                    createdObjects['cabin'], 
                    'CRANE_SOUNDS', 
                    0, 
                    false,
                    0
                );
            }

            objects['cabin'].position.y = objects['cabin'].position.y + 0.02;
            AttachEntityToEntity(createdObjects['cabin'], createdObjects['frame'], 0, -0.1, objects['cabin'].position.y, 18.0, 0.0, 0.0, 30.0, false, false, true, false, 0, false);
            this.Camera(this.cameraAngle, [ 1, objects['cabin'].position.y ]);
        }
    }

    Forward() {
        if ( (Math.round((objects['frame'].coords.x - 0.05 + Number.EPSILON) * 100) / 100) > -109.34 ) {
            if ( !soundID['forward'] ) {
                soundID['forward'] = {
                    id: GetSoundId(),
                    played: true
                }

                PlaySoundFromEntity(
                    soundID['forward'].id, 
                    'Move_Base', 
                    createdObjects['cabin'], 
                    'CRANE_SOUNDS', 
                    0, 
                    false,
                    0
                );
            }

            objects['frame'].coords.x = objects['frame'].coords.x - 0.05;
            SetEntityCoords(createdObjects['frame'], objects['frame'].coords.x, objects['frame'].coords.y, objects['frame'].coords.z - 0.12);
            this.Camera(this.cameraAngle, [ 0, objects['cabin'].position.x ]);
        }
    }

    Backwards() {
        if ( (Math.round((objects['frame'].coords.x + 0.05 + Number.EPSILON) * 100) / 100) < -47.29 ) {
            if ( !soundID['backwards'] ) {
                soundID['backwards'] = {
                    id: GetSoundId(),
                    played: true
                }

                PlaySoundFromEntity(
                    soundID['backwards'].id, 
                    'Move_Base', 
                    createdObjects['cabin'], 
                    'CRANE_SOUNDS', 
                    0, 
                    false,
                    0
                );
            }

            objects['frame'].coords.x = objects['frame'].coords.x + 0.05;
            SetEntityCoords(createdObjects['frame'], objects['frame'].coords.x, objects['frame'].coords.y, objects['frame'].coords.z - 0.12);
            this.Camera(this.cameraAngle, [ 0, objects['cabin'].position.x ]);
        }
    }

    Attach() {
        Object.keys( objects.containers ).forEach(container => {
            let model = GetHashKey(objects.containers[container].model);
            let coords = this.GetPos('lifter');
            let closestContainer = GetClosestVehicle(coords[0], coords[1], coords[2], 4.0, 0, 127);    // I change this line so that the crane can catch the vehicle. Original Line : let closestContainer = GetClosestObjectOfType(coords[0], coords[1], coords[2] - 2.8, 1.0, model);

            if ( closestContainer && closestContainer ) {                                             // I change this line so that the crane recognize the vehicle like a container
                this.container = closestContainer;
//CAMBIAR EN LO SIGUIENTE EL HEADING (121.57) EN BASE AL HEADING DE ATTACH DE LOS COMPONENTES
SetEntityCollision(this.container, false, true);                
FreezeEntityPosition(this.container, false);
                AttachEntityToEntity(
                    this.container, 
                    createdObjects['lifter'], 
                    0, 
                    0.0, 
                    0.0, 
                    -1.0, 
                    0.0, 
                    0.0, 
                    120.0,                                                                          // I change this line for the Heading of the "container" when the crane attach
                    false, 
                    false, 
                    true, 
                    false, 
                    0, 
                    false
                );

                PlaySoundFromEntity(
                    -1, 
                    'Attach_Container', 
                    createdObjects['frame'], 
                    'CRANE_SOUNDS', 
                    false, 
                    false
                );

                PlayEntityAnim(createdObjects['lifter'], 'Dock_crane_SLD_load', 'map_objects', 8.0, false, true, 0, 0.0, 0);
            }
        });
    }

    Detach() {
        let zValue = 31.20;
        
        Object.keys( objects.containers ).forEach(( container, i ) => {
            let model = GetHashKey(objects.containers[container].model);
            let coords = this.GetPos('lifter');
            let closestContainer = GetClosestVehicle(coords[0], coords[1], zValue, 2.0,0, 127);                // I change this line so the crane can detach the vehicle. Original Line: GetClosestObjectOfType(coords[0], coords[1], zValue, 1.5, model);

            if ( closestContainer && this.container != closestContainer ) {
                zValue = GetEntityCoords(closestContainer)[2] + 2.8;
            }
        });

        DetachEntity(this.container,true);                              // I know that the problem its here when i detach the vehicle,start make rounds. Some definition of the object its not working.
        SetEntityCollision(this.container, false, true);
        FreezeEntityPosition(this.container, false);
        SetEntityDynamic(this.container, true);

        PlaySoundFromEntity(
            -1, 
            'Detach_Container', 
            createdObjects['frame'], 
            'CRANE_SOUNDS', 
            false, 
            false
        );

        

        containerFallTick = setTick(() => {
            if ( GetEntityCoords(this.container)[2] <= zValue ) {
                FreezeEntityPosition(this.container, false);
                SetEntityCollision(this.container, true, true);
                clearTick(containerFallTick);
                this.container = false;                             //Esto hace que vuelva a reconocer el auto o no!!!
            }
        });
    }

    AttachOrDetach() {
        if ( !this.container ) {
            this.Attach();
        } else {
            this.Detach();
        }
    }

    Camera( angle, coords ) {
        let frameCoords = this.GetPos('frame');
        let cabinCoords = this.GetPos('cabin');

        if ( !DoesCamExist(cam) ) {
            cam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);
        }

        switch ( angle ) {
            case 0:
                // Reset camera
                RenderScriptCams(false,  false,  0,  true,  true);
                DestroyCam(cam);
                this.cameraAngle = 0;
                break;
            case 1:
                // Camera from above
                if ( coords ) {
                    if ( cabinCoords[coords[0]] < coords[1] ) {
                        cabinCoords[coords[0]] = cabinCoords[coords[0]] + coords[1];
                    } else {
                        cabinCoords[coords[0]] = cabinCoords[coords[0]] - coords[1];
                    }
                }

                this.cameraAngle = 1;

                SetCamCoord(cam, cabinCoords[0], cabinCoords[1] + 1, cabinCoords[2] - 2.8);
                PointCamAtCoord(cam, cabinCoords[0], cabinCoords[1] + 1, cabinCoords[2] - 10);
                RenderScriptCams(true, true, 0, true, true);
                break;
            case 2: 
                // Camera from the right side
                this.cameraAngle = 2;

                SetCamCoord(cam, frameCoords[0] - 5, frameCoords[1] + 8, frameCoords[2] + 10);
                PointCamAtCoord(cam, cabinCoords[0], cabinCoords[1], cabinCoords[2] - 20);
                RenderScriptCams(true, true, 0, true, true);
                break;
            case 3: 
                // Camera from the right side
                this.cameraAngle = 3;

                SetCamCoord(cam, frameCoords[0] + 5, frameCoords[1] - 8, frameCoords[2] + 10);
                PointCamAtCoord(cam, cabinCoords[0], cabinCoords[1], cabinCoords[2] - 20);
                RenderScriptCams(true, true, 0, true, true);
                break;
        }
    }
}

let crane = new Crane();

// Stops and removes the sound
function releaseSound( sound ) {
    if ( soundID[sound] ) {
        StopSound(soundID[sound].id);
        ReleaseSoundId(soundID[sound].id);
        delete soundID[sound];
    }
}

// Crane controls
function useCrane() {
    useCraneTick = setTick(() => {
        // Hide the weapon wheel since I'm using some of the buttons that opens it
        HideHudComponentThisFrame(19);

        // Key: Arrow down
        if ( IsControlPressed(1, 173) ) {
            crane.Left();
        }

        if ( IsControlJustReleased(1, 173) ) {
            releaseSound('left');
        }

        // Key: Arrow up
        if ( IsControlPressed(1, 172) ) {
            crane.Right();
        }

        if ( IsControlJustReleased(1, 172) ) {
            releaseSound('right');
        }

        // Key: W
        if ( IsControlPressed(1, 32) ) {
            crane.Up();
        }

        if ( IsControlJustReleased(1, 32) ) {
            releaseSound('up');
        }

        // Key: S
        if ( IsControlPressed(1, 33) ) {
            crane.Down();
        }

        if ( IsControlJustReleased(1, 33) ) {
            releaseSound('down');
        }

        // Key: A
        

        // Key: D
        

        // Key: Enter
        if ( IsControlJustReleased(1, 191) ) {
            crane.AttachOrDetach();
        }

        // Key: 1
        if ( IsControlJustReleased(1, 157) ) {
            crane.Camera(0);
        }

        // Key: 2
        if ( IsControlJustReleased(1, 158) ) {
            crane.Camera(1);
        }

        // Key: 3
        if ( IsControlJustReleased(1, 160) ) {
            crane.Camera(2);
        }

        // Key: 4
        if ( IsControlJustReleased(1, 164) ) {
            crane.Camera(3);
        }
    });
}

// usecrane command, first use will enter the crane, second use will exit the crane
RegisterCommand('usecrane', () => {
    let playerPed = PlayerPedId();
    let coordsPlayer = GetEntityCoords(playerPed);
    let coordsCabin = crane.GetPos('cabin');
    let distance = GetDistanceBetweenCoords(coordsPlayer[0], coordsPlayer[1], coordsPlayer[2] + 1, coordsCabin[0], coordsCabin[1] - 2, coordsCabin[2], true);

    if ( !usingCrane ) {
        // Enter the crane
        usingCrane = true;

        if ( distance < 2.2 ) {
            // Enter animation scene
            scene = CreateSynchronizedScene(-0.1, -0.1, -0.35, 0, 0, 0, 2);
            AttachSynchronizedSceneToEntity(scene, createdObjects['cabin'], -1);
            TaskSynchronizedScene(PlayerPedId(), scene, 'missheistdockssetup1trevor_crane', 'get_in', 1000.0, -8.0, 0, 0, 1148846080, 0);
            SetSynchronizedSceneOcclusionPortal(scene, true);

            // Let the animation run for a couple of seconds
            setTimeout(() => {
                // Change to first person
                SetFollowPedCamViewMode(4);
                // Enable crane controls
                useCrane();
            }, 2000);
        } else {
            // Player is standing too far away
            emit('chat:addMessage', {
                color: [255, 0, 0],
                multiline: true,
                args: ['Crane', `Estas muy lejos de la grua!`]
            });
        }
    } else {
        // Exit the crane, reset everything
        usingCrane = false;
        

        // Remove the useCrane tick, crane controls will be disabled
        clearTick(useCraneTick); 
        
        // Exit animation scene
        scene = CreateSynchronizedScene(-0.1, -0.1, -0.35, 0, 0, 0, 2);
        SetSynchronizedSceneOcclusionPortal(scene, true);
        SetSynchronizedSceneLooped(scene, false)
        AttachSynchronizedSceneToEntity(scene, createdObjects['cabin'], -1);
        TaskSynchronizedScene(PlayerPedId(), scene, 'missheistdockssetup1trevor_crane', 'get_out', 1000.0, -8.0, 0, 0, 1148846080, 0);
        

        // Give the animation some time to finish
        setTimeout(() => {
            SetFollowPedCamViewMode(3); // Reset to third person
            SetEntityCollision(playerPed, true, true); // Set ped collision since it seems to be gone without it(?)
            ClearPedTasks(playerPed); // Clear the ped task
            DetachEntity(playerPed, false, true); // Detach the player from the cabin
        }, 4000);
    }
});

//Used in development
 //setTick(() => {
    // Remove all the created objects by pressing E
    // if ( IsControlJustReleased(0, 38) ) {
       //  Object.keys( createdObjects ).forEach(type => {
       //      DeleteObject(createdObjects[type]);
       //  });
       // RopeUnloadTextures()
 	 //   DeleteRope(createdObjects['rope']);
    // }
//});