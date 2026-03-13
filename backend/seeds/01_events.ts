import type { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  await knex('feedback').del()
  await knex('events').del()
  await knex('events').insert([
    { name: 'GraphQL Summit 2026' },
    { name: 'Node.js Conference 2026' },
  ])
  await knex('feedback').insert([
    { event_id: 1, user_name: 'Alice', rating: 5, description: 'Fantastic keynotes and workshops.' },
    { event_id: 1, user_name: 'Bob', rating: 4, description: 'Great content, venue was a bit crowded.' },
    { event_id: 2, user_name: 'Carol', rating: 5, description: 'Best Node conf yet. Loved the async track.' },
  ])
}
