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
  const users = db.collection<User>(collectionName);

  const insertedUserData = await users.insertOne({ name: '0', age: 0 });
  console.log({ insertedUserData });

  const foundUsers = await users.find({}).toArray();
  console.log({ foundUsers });

  const insertedUsersData = await users.insertMany([
    { name: '1', age: 1 },
    { name: '2', age: 2 },
    { name: '3', age: 3 },
  ]);
  console.log({ insertedUsersData });
  console.log({ foundUsers: await users.find({}).toArray() });

  await db.dropCollection(collectionName);
  await db.dropDatabase();
}

bootstrap()
  .catch(console.error)
  .finally(() => {
    mongoClient.close().catch(console.error);
  });
