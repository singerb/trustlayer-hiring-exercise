import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Card, CardHeader, CardTitle } from "../../src/components/ui/card";
import { StarRating } from "../../src/components/StarRating";
import { gqlFetch } from "../../src/lib/gql-fetch";

type GetEventsData = {
	events: Array<{
		id: string;
		name: string;
		averageRating: number | null;
		reviewCount: number;
	}>;
};

export async function clientLoader() {
	const data = await gqlFetch<GetEventsData>(
		`query GetEvents { events { id name averageRating reviewCount } }`,
	);
	return { events: data.events };
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
