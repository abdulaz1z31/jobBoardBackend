// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
      client: 'pg',
      connection: {
          host: '127.0.0.1',
          port: 5432,
          user: 'postgres',
          password: 'root',
          database: 'job',
      },
  },

  staging: {
      client: 'postgresql',
      connection: {
          database: 'my_db',
          user: 'username',
          password: 'password',
      },
      pool: {
          min: 2,
          max: 10,
      },
      migrations: {
          tableName: 'knex_migrations',
      },
  },

  production: {
      client: 'postgresql',
      connection: {
          database: 'my_db',
          user: 'username',
          password: 'password',
      },
      pool: {
          min: 2,
          max: 10,
      },
      migrations: {
          tableName: 'knex_migrations',
      },
  },
}