exports.up = async function(db, client) {
  const collections = [
    'users', 'ideas', 'comments', 'notifications', 'categories', 'badges', 'ideaversions'
  ];

  for (const collectionName of collections) {
    const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
    if (!collectionExists) {
      console.log(`Creating collection: ${collectionName}`);
      await db.createCollection(collectionName);
    } else {
      console.log(`Collection ${collectionName} already exists, skipping creation.`);
    }
  }

  // Create indexes (these operations are idempotent, so we don't need to check if they exist)
  console.log('Creating indexes...');
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('ideas').createIndex({ author: 1 });
  await db.collection('ideas').createIndex({ category: 1 });
  await db.collection('comments').createIndex({ idea: 1 });
  await db.collection('notifications').createIndex({ recipient: 1 });
  await db.collection('ideaversions').createIndex({ idea: 1 });
  console.log('Indexes created successfully.');
};

exports.down = async function(db, client) {
  const collections = [
    'users', 'ideas', 'comments', 'notifications', 'categories', 'badges', 'ideaversions'
  ];

  for (const collectionName of collections) {
    const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
    if (collectionExists) {
      console.log(`Dropping collection: ${collectionName}`);
      await db.collection(collectionName).drop();
    } else {
      console.log(`Collection ${collectionName} does not exist, skipping drop.`);
    }
  }
};