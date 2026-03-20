import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.table("feedback", (table) => {
		table.index("event_id", "feedback_event_id_idx");
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.table("feedback", (table) => {
		table.dropIndex("event_id", "feedback_event_id_idx");
	});
}
