// All the objects that the crane uses, including the containers which it can pick up
 objects = {
    'frame': {
        model: 'prop_dock_rtg_ld',
        coords: { x: 28.51, y: 6274.63, z: 30.33, },     //I change the coords
        heading: 30.0                                   // I add this line.Its the heading of the base estructure of the crane
    },
    'cabin': {
        model: 'p_dock_rtg_ld_cab',
        position: { x: -0.1, y: 0.0, z: 18.0 },
        rotation: { x: 0.0, y: 0.0, z: 30.0 },          // I add this line for the heading of the cabin. Always has to be the same heading of the "frame".    
        attachTo: 'frame'
    },
    'lifter-cables1': {
        model: 'p_dock_crane_cabl_s',
        position: { x: 0.1, y: -0.0, z: -5.5 },
        rotation: { x: 0.0, y: 0.0, z: 120.0 },         // I add this line for the heading of the lifter-cables1. Always has to be 90.0 more than the heading of the "frame".   
        attachTo: 'cabin'
    },
    'lifter-cables2': {
        model: 'p_dock_crane_cabl_s',
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0.0, y: 0.0, z: 120.0 },        // I add this line for the heading of the lifter-cables2. Always has to be 90.0 more than the heading of the "frame".
        attachTo: 'lifter-cables1'
    },
    'lifter-cables3': {
        model: 'p_dock_crane_cabl_s',
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0.0, y: 0.0, z: 120.0 },         // I add this line for the heading of the lifter-cables3. Always has to be 90.0 more than the heading of the "frame".
        attachTo: 'lifter-cables2'
    },
    'lifter-cables4': {
        model: 'p_dock_crane_cabl_s',
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0.0, y: 0.0, z: 120.0 },          // I add this line for the heading of the lifter-cables4. Always has to be 90.0 more than the heading of the "frame". 
        attachTo: 'lifter-cables3'
    },
    'lifter-cables5': {
        model: 'p_dock_crane_cabl_s',
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0.0, y: 0.0, z: 120.0 },          // I add this line for the heading of the lifter-cables5. Always has to be 90.0 more than the heading of the "frame". 
        attachTo: 'lifter-cables4'
    },
    'lifter-cables6': {
        model: 'p_dock_crane_cabl_s',
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0.0, y: 0.0, z: 120.0 },         // I add this line for the heading of the lifter-cables6. Always has to be 90.0 more than the heading of the "frame". 
        attachTo: 'lifter-cables5'
    },
    'lifter': {
        model: 'p_dock_crane_sld_s',
        position: { x: 0.0, y: 0.0, z: 1.3 },
        rotation: { x: 0.0, y: 0.0, z: 120.0 },        // I add this line for the heading of the lifter. Always has to be 90.0 more than the heading of the "frame". 
        attachTo: 'lifter-cables6'
    },
    'wheel': {                                        //HERE I CANT DO A HEADING FOR THE WHEELS, I TRY A LOT OF SHIT BUT ITS NOW WORKING
        model: 'p_dock_rtg_ld_wheel',
        positions: {
            leftFront: {
                2: { x: -5, y: -9.02, z: -2.65 },
                1: { x: -3.58, y: -9.02, z: -2.65 }       
                
            },

            leftBack: {
                2: { x: 3.3, y: -9.02, z: -2.65 },
                1: { x: 4.7, y: -9.02, z: -2.65 }       
            },
            rightFront: {
                2: { x: -5, y: 9.46, z: -2.65 },
                1: { x: -3.58, y: 9.46, z: -2.65 }       
            },
            rightBack: {
                2: { x: 3.3, y: 9.46, z: -2.65 },
                1: { x: 4.7, y: 9.46, z: -2.65 }         
            }
        },
        
        attachTo: 'frame'
    },

    
    'containers': {
        'container-red': {
            model: 'prop_container_01a'
        },
        'container-bilgeco-blue': {
            model: 'prop_container_01c'
            
        },

        'container-car': {                                     // I add this container for the vehicle but im no sure that its doing something hahaha
            model: GetHashKey('car')
            
        },


        'container-jetsam': {
            model: 'prop_container_01d'
        },
        'container-bilgeco-green': {
            model: 'prop_container_01e'
        },
        'container-krapea': {
            model: 'prop_container_01b'
        },
        'container-postop': {
            model: 'prop_container_01h'
        },
        'container-gopostal': {
            model: 'prop_container_01g'
        },
        'container-landocorp': {
            model: 'prop_container_01f'
        }
    }
}

// All the created objects will be stored in this object
let createdObjects = {};

// Starting position of the lifter cables, need this since there are 6 cables
let currentCable = 1;

// Tick to be able to check if the container hits the specific Z value, #NoCollisionWorkAround
let containerFallTick;

// Make sure every model has been requested
Object.keys( objects ).forEach(type => {
    if ( type === 'containers' ) {
        Object.keys( objects[type] ).forEach(container => {
            let model = objects[type][container].model;

            if ( !HasModelLoaded(model) && IsModelInCdimage(model) ) {
                RequestModel(model);
            }
        });
    } else {
        let model = objects[type].model;

        if ( !HasModelLoaded(model) && IsModelInCdimage(model) ) {
            RequestModel(model);
        }
    }
});

// Place and attach objects to the crane
function placeCrane() {
    Object.keys( objects ).forEach(type => {
        let model = GetHashKey(objects[type].model);

        if ( objects[type].coords ) {
            // Object has coords set, should just be placed with the CreateObject native
            createdObjects[type] = CreateObject(model, objects[type].coords.x, objects[type].coords.y, objects[type].coords.z, true, true, true);
            
            if ( objects[type].heading ) {
                SetEntityHeading(createdObjects[type], objects[type].heading);
            }
        } else if ( objects[type].positions ) {
            // Object has multiple positions set, it should then be attached to the frame object
            const positions = objects[type].positions;

            Object.keys( positions ).forEach(group => {
                Object.keys( positions[group] ).forEach(num => {
                    createdObjects[`${ type }-${ group }-${ num }`] = CreateObject(
                        model, 
                        objects.frame.coords.x, 
                        objects.frame.coords.y, 
                        objects.frame.coords.z, 
                        1.0, 
                        true, 
                        false
                    );
                    AttachEntityToEntity(
                        createdObjects[`${ type }-${ group }-${ num }`], 
                        createdObjects[objects[type].attachTo], 
                        0, 
                        positions[group][num].x, 
                        positions[group][num].y, 
                        positions[group][num].z, 
                        0.0, 
                        0.0, 
                        0.0, 
                        false, 
                        false, 
                        true, 
                        false, 
                        0, 
                        false
                    );
                });
            });
        } else if ( objects[type].position ) {
            let collision = true;

            if ( type === 'cabin' ) {
                collision = true;
            }

            // Object has just one position set, attach it
            createdObjects[type] = CreateObject(
                model, 
                objects.frame.coords.x, 
                objects.frame.coords.y, 
                objects.frame.coords.z + 15.5, 
                1.0, 
                true, 
                false
            );

            AttachEntityToEntity(
                createdObjects[type], 
                createdObjects[objects[type].attachTo], 
                0, 
                objects[type].position.x, 
                objects[type].position.y, 
                objects[type].position.z, 
                objects[type].rotation ? objects[type].rotation.x : 0.0, 
                objects[type].rotation ? objects[type].rotation.y : 0.0, 
                objects[type].rotation ? objects[type].rotation.z : 0.0,
                false, 
                false, 
                collision,
                false, 
                0, 
                false
            );
            // AttachEntityToEntityPhysically(
            //     createdObjects[type], 
            //     createdObjects[objects[type].attachTo],
            //     0,
            //     0, 
            //     objects[type].position.x, 
            //     objects[type].position.y, 
            //     objects[type].position.z, 
            //     objects[type].position.x, 
            //     objects[type].position.y, 
            //     objects[type].position.z, 
            //     objects[type].rotation ? objects[type].rotation.x : 0.0, 
            //     objects[type].rotation ? objects[type].rotation.y : 0.0, 
            //     objects[type].rotation ? objects[type].rotation.z : 0.0,
            //     10.0,
            //     false, 
            //     false, 
            //     true, 
            //     false, 
            //     0
            // );
        }
    });
}

// Place random containers
function placeContainers() {
    // Coordinates where the containers can spawn at
    const containerSpawn = {
        x: [ -52.990, -66.80324, -80.80324, -94.80324 ],
        y: [ -2420.99, -2418.29, -2415.59, -2412.92, -2410.22 ],
        z: [ 5, 7.82, 10.64 ],
        heading: 90.0
    }

    // Array of all the containers, to make sure it doesn't spawn two containers at the same location
    let containerPlacements = [
        [
            [],
            [],
            []
        ],
        [
            [],
            [],
            []
        ],
        [
            [],
            [],
            []
        ],
        [
            [],
            [],
            []
        ],
    ];

    let containerAmount = Math.floor(Math.random() * 60) + 3;
    let xPlacement = 0;
    let zPlacement = 0;

    function SpawnContainer( data ) {
        let name = `${ data.color }-${ data.x }-${ data.index }-${ data.z }`;

        createdObjects[name] = CreateObject(
            GetHashKey(objects.containers[data.color].model), 
            containerSpawn.x[data.x], 
            containerSpawn.y[data.index], 
            containerSpawn.z[data.z], 
            true, 
            true, 
            false
        );
    
        SetEntityHeading(createdObjects[name], containerSpawn.heading);
        FreezeEntityPosition(createdObjects[name], true);

        containerPlacements[data.x][data.z].push({
            color: data.color,
            coords: [ containerSpawn.x[data.x], containerSpawn.y[data.index], containerSpawn.z[data.z] ],
            entity: createdObjects[name]
        });
    }

    for ( let i = 0; i < containerAmount; i++ ) {
        for ( let x = 0; x < containerPlacements.length; x++ ) {
            for ( let z = 0; z < containerPlacements[x].length; z++ ) {
                let containerColor = Object.keys( objects.containers )[Math.floor(Math.random() * Math.floor(Object.keys( objects.containers ).length))];
                let index = containerPlacements[xPlacement][zPlacement].length;

                if ( !containerPlacements[xPlacement][zPlacement].length || containerPlacements[xPlacement][zPlacement].length < 5 ) {
                    SpawnContainer({
                        x: xPlacement,
                        z: zPlacement,
                        index: index,
                        color: containerColor
                    });
                    break;
                } else {
                    if ( zPlacement != 2 ) {
                        zPlacement = zPlacement + 1;

                        SpawnContainer({
                            x: xPlacement,
                            z: zPlacement,
                            index: index,
                            color: containerColor
                        });
                    } else {
                        if ( xPlacement < containerPlacements.length - 1 ) {
                            zPlacement = 0;
                            xPlacement = xPlacement + 1;

                            SpawnContainer({
                                x: xPlacement,
                                z: zPlacement,
                                index: index,
                                color: containerColor
                            });
                        }
                    }
                    break;
                }
            }
            break;
        }
    }
}

emitNet('harbor-crane:spawn');
onNet('harbor-crane:createObjects', () => {
    placeCrane();
    // Wait a couple of seconds before spawning in the containers, a ladder on the crane seems to break if it's spawning in the containers too quickly
    setTimeout(() => {
        placeContainers();
    }, 8000);
});