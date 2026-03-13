import type { Knex } from 'knex'

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3',
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './seeds',
    extension: 'ts',
  },
  useNullAsDefault: true,
}

export default config
