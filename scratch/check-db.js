const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
async function run() {
  await client.connect();
  const db = client.db('webdev-mentor-ai');
  const convs = await db.collection('conversations').find({}).toArray();
  const msgs = await db.collection('messages').find({}).toArray();
  console.log('Conversations:', convs.length);
  console.log('Messages:', msgs.length);
  await client.close();
}
run().catch(console.dir);
