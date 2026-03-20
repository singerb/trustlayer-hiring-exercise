#!/usr/bin/env -S npx tsx
import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { gql } from "@apollo/client/core";
import { Command } from "commander";
import { createClient } from "./client.js";
import type { GetEventsQuery } from "./generated/graphql.js";

const GET_EVENTS = gql`
	query GetEvents {
		events {
			id
			name
		}
	}
`;

interface WorkerInput {
	workerId: number;
	eventIds: string[];
	submissions: number;
}

interface WorkerResult {
	workerId: number;
	eventId: string;
	durations: number[];
}

function computeStats(d: number[]) {
	const sorted = [...d].sort((a, b) => a - b);
	const min = sorted[0];
	const max = sorted[sorted.length - 1];
	const median = sorted[Math.floor(sorted.length / 2)];
	const mean = d.reduce((s, x) => s + x, 0) / d.length;
	const stddev = Math.sqrt(d.reduce((s, x) => s + (x - mean) ** 2, 0) / d.length);
	return { min, max, median, mean, stddev };
}

function fmt(n: number) {
	return n.toFixed(2) + "ms";
}

const program = new Command();
program
	.option("--workers <n>", "number of parallel workers", "4")
	.option("--submissions <x>", "mutations per worker", "10")
	.option("--event-id <id>", "target event ID (repeatable)", (val, prev: string[]) => [...prev, val], [] as string[])
	.parse(process.argv);

const opts = program.opts<{ workers: string; submissions: string; eventId: string[] }>();
const numWorkers = parseInt(opts.workers, 10);
const numSubmissions = parseInt(opts.submissions, 10);

let eventIds: string[];

if (opts.eventId.length > 0) {
	eventIds = opts.eventId;
} else {
	const client = createClient();
	const result = await client.query<GetEventsQuery>({ query: GET_EVENTS });
	const events = result.data?.events ?? [];
	if (events.length === 0) {
		console.error("No events found. Create one first with yarn create-event.");
		process.exit(1);
	}
	eventIds = events.map((e) => e.id);
	console.log(`Loaded ${eventIds.length} event(s): ${eventIds.join(", ")}`);
}

console.log(`Spawning ${numWorkers} worker(s), ${numSubmissions} submission(s) each…\n`);

const workerFile = fileURLToPath(new URL("./load-test-worker.js", import.meta.url));

const results: WorkerResult[] = [];
const workers: Promise<void>[] = [];

for (let i = 1; i <= numWorkers; i++) {
	const workerInput: WorkerInput = { workerId: i, eventIds, submissions: numSubmissions };
	const p = new Promise<void>((resolve, reject) => {
		const w = new Worker(workerFile, {
			workerData: workerInput,
		});
		w.on("message", (msg: WorkerResult) => {
			results.push(msg);
		});
		w.on("error", reject);
		w.on("exit", (code) => {
			if (code !== 0) reject(new Error(`Worker ${i} exited with code ${code}`));
			else resolve();
		});
	});
	workers.push(p);
}

await Promise.all(workers);

// Sort results by workerId for consistent output
results.sort((a, b) => a.workerId - b.workerId);

const allDurations: number[] = [];
for (const r of results) {
	const s = computeStats(r.durations);
	allDurations.push(...r.durations);
	console.log(
		`Worker ${r.workerId} (event ${r.eventId}): ${r.durations.length} submissions` +
			`  min=${fmt(s.min)}  max=${fmt(s.max)}  median=${fmt(s.median)}  stddev=${fmt(s.stddev)}`,
	);
}

console.log("─".repeat(85));

const overall = computeStats(allDurations);
console.log(
	`Overall: ${allDurations.length} submissions` +
		`  min=${fmt(overall.min)}  max=${fmt(overall.max)}  median=${fmt(overall.median)}  stddev=${fmt(overall.stddev)}`,
);
