import type { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  await knex('events').del()
  await knex('events').insert([
    { name: 'GraphQL Summit 2026' },
    { name: 'Node.js Conference 2026' },
  ])
}
