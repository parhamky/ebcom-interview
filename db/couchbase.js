const couchbase = require('couchbase');
// Update these with your Couchbase server details
const clusterConnStr = 'couchbase://127.0.0.1';
const username = 'Administrator';
const password = 'password';
const bucketName = 'vouchers';

let cluster, bucket, collection;

async function initCouchbase() {
    cluster = await couchbase.connect(clusterConnStr, {
        username,
        password
    });
    bucket = cluster.bucket(bucketName);
    collection = await bucket.scope('encrypted').collection('encryptedvouchers')
    console.log('Connected to Couchbase and opened bucket:', bucketName);
}

async function getCollection() {
    await initCouchbase(); // Ensure the cluster is initialized
    if (!collection) throw new Error('Couchbase not initialized. Call initCouchbase first.');
    return collection;
}

async function getCluster(){
    if(!cluster) {
        await initCouchbase(); // Ensure the cluster is initialized
    }
    return cluster;
    
}

module.exports = {
    getCollection,
    getCluster
};


