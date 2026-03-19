import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("events", (table) => {
		table.increments("id").primary();
		table.string("name").notNullable();
	});

	await knex.schema.createTable("feedback", (table) => {
		table.increments("id").primary();
		table.integer("event_id").notNullable().references("id").inTable("events");
		table.string("user_name").notNullable();
		table.integer("rating").notNullable();
		table.text("description").notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("feedback");
	await knex.schema.dropTable("events");
}
