import { MongoClient } from 'mongodb';

type User = {
  name: string;
  age: number;
};

const url = 'mongodb://localhost:27017';
const mongoClient = new MongoClient(url);
const dbName = 'mongo';
const collectionName = 'users';

async function bootstrap(): Promise<void> {
  await mongoClient.connect();
  console.log('Successfully connected to database');

  const db = mongoClient.db(dbName);

  // для примера, далее db.collection
  await db.createCollection<User>(collectionName);

  const collections = await db.collections();
  const collectionNames = collections.map(
    (collection) => collection.collectionName
  );
  console.log({ collectionNames });

  await db.dropCollection(collectionName);
  await db.dropDatabase();
}

bootstrap()
  .catch(console.error)
  .finally(() => {
    mongoClient.close().catch(console.error);
  });
