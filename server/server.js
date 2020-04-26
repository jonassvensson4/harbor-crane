let hasSpawnedObjects = false;

onNet('harbor-crane:spawn', () => {
    if ( !hasSpawnedObjects ) {
        hasSpawnedObjects = true;
        emitNet('harbor-crane:createObjects', source);
    }
});