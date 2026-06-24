import { MongoClient } from 'mongodb';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = `mongodb://${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || '27017'}/${process.env.MONGO_DATABASE || 'bookify_mongo'}`;
const MONGO_DB = process.env.MONGO_DATABASE || 'bookify_mongo';

const MYSQL_CONFIG = {
  type: 'mysql' as const,
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  username: process.env.MYSQL_USER || 'user',
  password: process.env.MYSQL_PASSWORD || 'secret',
  database: process.env.MYSQL_DATABASE || 'bookify_db',
  entities: [path.resolve(__dirname, '../dist/**/*.entity{.ts,.js}')],
  synchronize: false,
};

const TABLES = [
  { collection: 'roles', table: 'roles', columns: ['id', 'name'], idField: '_id' },
  { collection: 'permissions', table: 'permissions', columns: ['id', 'resource', 'action'], idField: '_id' },
  { collection: 'role_permission', table: 'role_permission', columns: ['roleId', 'permissionId'], idField: null },
  { collection: 'publishers', table: 'publishers', columns: ['id', 'name'], idField: '_id' },
  { collection: 'languages', table: 'languages', columns: ['id', 'name'], idField: '_id' },
  { collection: 'authors', table: 'authors', columns: ['id', 'name'], idField: '_id' },
  { collection: 'genres', table: 'genres', columns: ['id', 'name'], idField: '_id' },
  { collection: 'users', table: 'users', columns: ['id', 'firstName', 'lastName', 'email', 'gender', 'password', 'isActive', 'roleId', 'createdAt'], idField: '_id' },
  { collection: 'customers', table: 'customers', columns: ['id', 'userId', 'phoneNumber', 'createdAt', 'updatedAt'], idField: '_id' },
  { collection: 'addresses', table: 'addresses', columns: ['id', 'customerId', 'street', 'provinceCode', 'provinceName', 'wardCode', 'wardName', 'isDefault'], idField: '_id' },
  { collection: 'books', table: 'books', columns: ['id', 'isbn', 'title', 'publisherId', 'description', 'originalPrice', 'discountPercentage', 'quantity', 'languageId', 'pageCount', 'createdAt', 'updatedAt'], idField: '_id' },
  { collection: 'book_covers', table: 'book_covers', columns: ['id', 'bookId', 'url', 'isPrimary', 'displayOrder', 'createdAt'], idField: '_id' },
  { collection: 'books_authors', table: 'books_authors', columns: ['bookId', 'authorId'], idField: null },
  { collection: 'books_genres', table: 'books_genres', columns: ['bookId', 'genreId'], idField: null },
  { collection: 'carts', table: 'carts', columns: ['id', 'userId', 'createdAt', 'updatedAt'], idField: '_id' },
  { collection: 'cart_items', table: 'cart_items', columns: ['id', 'cartId', 'productId', 'quantity', 'price', 'isActive', 'createdAt', 'updatedAt'], idField: '_id' },
  { collection: 'orders', table: 'orders', columns: ['id', 'orderCode', 'userId', 'status', 'paymentStatus', 'paymentMethod', 'shippingAddress', 'phoneNumber', 'createdAt', 'updatedAt'], idField: '_id' },
  { collection: 'order_items', table: 'order_items', columns: ['id', 'orderId', 'productId', 'quantity', 'price', 'createdAt', 'updatedAt'], idField: '_id' },
  { collection: 'payment_transactions', table: 'payment_transactions', columns: ['id', 'orderId', 'provider', 'status', 'amount', 'currency', 'providerOrderId', 'providerTransactionId', 'payUrl', 'rawResponse', 'createdAt', 'updatedAt'], idField: '_id' },
  { collection: 'audit_logs', table: 'audit_logs', columns: ['id', 'action', 'module', 'resource', 'performedBy', 'metadata', 'createdAt'], idField: '_id' },
];

async function migrate() {
  console.log('Connecting to MongoDB...');
  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const db = mongoClient.db(MONGO_DB);
  console.log('Connected to MongoDB');

  console.log('Connecting to MySQL...');
  const dataSource = new DataSource(MYSQL_CONFIG);
  await dataSource.initialize();
  console.log('Connected to MySQL');

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    for (const { collection, table, columns, idField } of TABLES) {
      if (!collectionNames.includes(collection)) {
        console.log(`  [SKIP] Collection "${collection}" not found in MongoDB`);
        continue;
      }

      const docs = await db.collection(collection).find().toArray();
      if (docs.length === 0) {
        console.log(`  [EMPTY] "${collection}" -> "${table}" (0 rows)`);
        continue;
      }

      const rows = docs.map((doc) => {
        const row: Record<string, any> = {};
        for (const col of columns) {
          if (col === 'id' && idField === '_id') {
            row.id = doc._id.toString();
          } else {
            row[col] = doc[col] ?? null;
          }
        }
        return row;
      });

      const placeholders = columns.map(() => '?').join(', ');
      const colNames = columns.join(', ');
      const upsertCols = columns.map((c) => `${c} = VALUES(${c})`).join(', ');

      for (const row of rows) {
        const values = columns.map((col) => {
          const val = row[col];
          if (val && typeof val === 'object' && val.toString() === '[object Object]') {
            return JSON.stringify(val);
          }
          return val;
        });

        await queryRunner.query(
          `INSERT INTO \`${table}\` (${colNames}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${upsertCols}`,
          values,
        );
      }

      console.log(`  [OK] "${collection}" -> "${table}": ${rows.length} rows`);
    }

    await queryRunner.commitTransaction();
    console.log('\nMigration completed successfully!');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await queryRunner.release();
    await dataSource.destroy();
    await mongoClient.close();
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
