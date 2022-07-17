import { MongoClient, WithId } from 'mongodb';

type Post = {
  title: string;
  text: string;
};

type User = {
  name: string;
  age: number;
  posts?: Post[];
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

  await users.insertMany([
    { name: 'name1', age: 31 },
    { name: 'name2', age: 32 },
    { name: 'name3', age: 33 },
  ]);

  const updatedUserData = await users.updateOne(
    {
      name: 'name1',
    },
    {
      $set: {
        // для примера, простейшая реализация один-ко-многим,
        // по хорошему посты выносятся в отдельную коллекцию,
        // здесь же остаются ObjectId постов
        posts: [
          { title: 'title1', text: 'text1' },
          { title: 'title2', text: 'text2' },
          { title: 'title3', text: 'text3' },
        ],
      },
    }
  );
  console.log({ updatedUserData });

  const postsWithId = await users
    .find({ name: 'name1' })
    .project<WithId<Pick<User, 'posts'>>>({ posts: 1 })
    .toArray();
  console.log({ postsWithId });

  const postsWithoutId = await users
    .find({ name: 'name1' })
    .project<Pick<User, 'posts'>>({ posts: 1, _id: 0 })
    .toArray();
  console.log({ postsWithoutId });

  const foundUsers = await users
    .find({ posts: { $elemMatch: { title: 'title1' } } })
    .toArray();
  console.log({ foundUsers });

  const usersWithPosts = await users
    .find({ posts: { $exists: true } })
    .toArray();
  console.log({ usersWithPosts });

  await db.dropCollection(collectionName);
  await db.dropDatabase();
}

bootstrap()
  .catch(console.error)
  .finally(() => {
    mongoClient.close().catch(console.error);
  });
