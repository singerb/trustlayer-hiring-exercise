import { useQuery } from "@apollo/client/react";
import { Link } from "react-router";
import { GetEventsDocument } from "../../src/generated/graphql";
import { Card, CardHeader, CardTitle } from "../../src/components/ui/card";
import { StarRating } from "../../src/components/StarRating";

export default function Home() {
	const { loading, error, data } = useQuery(GetEventsDocument);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<div className="flex flex-col gap-4">
			{data?.events?.map((event) => (
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
