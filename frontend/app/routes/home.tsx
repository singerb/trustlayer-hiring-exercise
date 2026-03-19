import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Card, CardHeader, CardTitle } from "../../src/components/ui/card";
import { StarRating } from "../../src/components/StarRating";
export async function clientLoader() {
	let res: Response;
	try {
		res = await fetch("http://localhost:4000/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				query: `query GetEvents { events { id name averageRating reviewCount } }`,
			}),
		});
	} catch (e) {
		throw e instanceof Error ? e : new Error(String(e));
	}
	if (!res.ok) {
		throw new Error(`Server error: ${res.status} ${res.statusText}`);
	}
	const json = await res.json();
	return {
		events: json.data?.events as Array<{
			id: string;
			name: string;
			averageRating: number | null;
			reviewCount: number;
		}>,
	};
}

export const meta: Route.MetaFunction = () => [{ title: "Events" }];

export default function Home({ loaderData }: Route.ComponentProps) {
	const events = loaderData.events;

	return (
		<div className="flex flex-col gap-4">
			{events?.map((event) => (
				<Link key={event.id} to={`/events/${event.id}`}>
					<Card className="hover:bg-accent transition-colors">
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>{event.name}</CardTitle>
							<div className="flex flex-col items-end gap-1">
								<StarRating rating={event.averageRating ?? 0} />
								<span className="text-sm text-muted-foreground">
									{event.reviewCount}{" "}
									{event.reviewCount === 1 ? "review" : "reviews"}
								</span>
							</div>
						</CardHeader>
					</Card>
				</Link>
			))}
		</div>
	);
}
