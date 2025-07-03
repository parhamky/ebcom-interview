require('dotenv').config();
const couchbase = require('couchbase');
// Load Couchbase config from environment variables
const clusterConnStr = process.env.COUCHBASE_CONNSTR;
const username = process.env.COUCHBASE_USER;
const password = process.env.COUCHBASE_PASS;
const bucketName = process.env.COUCHBASE_BUCKET;

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


