import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useParams, Link, useSearchParams } from "react-router";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import type { Route } from "./+types/events.$id";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const res = await fetch("http://localhost:4000/", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			query: `query GetEventName($id: ID!) { event(id: $id) { name } }`,
			variables: { id: params.id },
		}),
	});
	const json = await res.json();
	return { name: json.data?.event?.name as string | undefined };
}

export function shouldRevalidate({ currentUrl, nextUrl }: ShouldRevalidateFunctionArgs) {
	return currentUrl.pathname !== nextUrl.pathname;
}

export const meta: Route.MetaFunction = ({ data, location }) => {
	const page = new URLSearchParams(location.search).get("page");
	const suffix = page && Number(page) > 1 ? ` · Page ${page}` : "";
	return [{ title: `${data?.name ?? "Event"}${suffix}` }];
};
import {
	GetEventDocument,
	type GetEventQuery,
	FeedbackAddedDocument,
} from "../../src/generated/graphql";
import { Card, CardContent } from "../../src/components/ui/card";
import { StarRating } from "../../src/components/StarRating";
import { ChevronLeft } from "lucide-react";
import { Spinner } from "../../src/components/Spinner";

const PAGE_SIZE = 10;

export default function EventPage({ loaderData }: Route.ComponentProps) {
	const { id } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const page = Math.max(1, Number(searchParams.get("page") ?? 1));
	const minEnabled = searchParams.get("minEnabled") === "true";
	const minRating = Math.min(
		5,
		Math.max(1, Number(searchParams.get("minRating") ?? 1)),
	);
	const maxEnabled = searchParams.get("maxEnabled") === "true";
	const maxRating = Math.min(
		5,
		Math.max(1, Number(searchParams.get("maxRating") ?? 5)),
	);
	const [liveCount, setLiveCount] = useState(0);

	const filterVars = {
		minRating: minEnabled ? minRating : undefined,
		maxRating: maxEnabled ? maxRating : undefined,
	};

	const paginationVars = { offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };

	const { loading, error, data, subscribeToMore } = useQuery(GetEventDocument, {
		variables: { id: id!, ...filterVars, ...paginationVars },
	});

	// Reset live count whenever filter/page context changes
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setLiveCount(0);
	}, [id, minEnabled, minRating, maxEnabled, maxRating, page]);

	// Subscribe to more when on page 1
	useEffect(() => {
		if (!id || page !== 1) return;
		return subscribeToMore({
			document: FeedbackAddedDocument,
			variables: { eventId: id, ...filterVars },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data || !prev.event) return prev as GetEventQuery;
				setLiveCount((c) => c + 1);
				const newFeedback = subscriptionData.data.feedbackAdded;
				return {
					...prev,
					event: {
						...prev.event,
						feedback: [newFeedback, ...(prev.event.feedback ?? [])], // prepend because we're in reverse order
					},
				} as GetEventQuery;
			},
		});
	}, [id, subscribeToMore, minEnabled, minRating, maxEnabled, maxRating, page]);

	if (error) return <p>Error: {error.message}</p>;

	const event = data?.event;
	const totalPages = event ? Math.ceil(event.feedbackCount / PAGE_SIZE) : 0;

	return (
		<div className="flex flex-col gap-6">
			<Link
				to="/"
				className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
			>
				<ChevronLeft size={16} /> Events
			</Link>

			<div>
				<h1 className="text-3xl font-bold">{loaderData.name ?? "Event"}</h1>
				<Link
					to={`/events/${id}/add-feedback`}
					className="mt-2 inline-block text-sm text-primary underline"
				>
					Submit feedback
				</Link>
			</div>

			<div className="flex flex-col gap-2">
				<label className="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						checked={minEnabled}
						onChange={(e) => {
							setSearchParams((p) => {
								const next = new URLSearchParams(p);
								if (e.target.checked) next.set("minEnabled", "true");
								else next.delete("minEnabled");
								next.set("page", "1");
								return next;
							});
						}}
					/>
					Min stars:
					<input
						type="number"
						min={1}
						max={5}
						value={minRating}
						disabled={!minEnabled}
						onChange={(e) => {
							setSearchParams((p) => {
								const next = new URLSearchParams(p);
								next.set("minRating", e.target.value);
								next.set("page", "1");
								return next;
							});
						}}
						className="w-16 border rounded px-1"
					/>
				</label>
				<label className="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						checked={maxEnabled}
						onChange={(e) => {
							setSearchParams((p) => {
								const next = new URLSearchParams(p);
								if (e.target.checked) next.set("maxEnabled", "true");
								else next.delete("maxEnabled");
								next.set("page", "1");
								return next;
							});
						}}
					/>
					Max stars:
					<input
						type="number"
						min={1}
						max={5}
						value={maxRating}
						disabled={!maxEnabled}
						onChange={(e) => {
							setSearchParams((p) => {
								const next = new URLSearchParams(p);
								next.set("maxRating", e.target.value);
								next.set("page", "1");
								return next;
							});
						}}
						className="w-16 border rounded px-1"
					/>
				</label>
			</div>

			<div className="flex flex-col gap-3">
				{loading ? (
					<div className="flex justify-center mt-8">
						<Spinner className="h-8 w-8 text-muted-foreground" />
					</div>
				) : (
					<>
						<div className="flex items-center justify-between text-sm text-muted-foreground">
							<span>
								{event?.feedbackCount}{" "}
								{event?.feedbackCount === 1 ? "review" : "reviews"}
							</span>
							{page === 1 ? (
								<span>● Live{liveCount > 0 ? ` · ${liveCount} new` : ""}</span>
							) : (
								<span>○ Live updates paused</span>
							)}
						</div>
						{event?.feedback.map((fb) => (
							<Card
								key={fb.id}
								className="animate-in slide-in-from-top-2 fade-in-0 duration-300"
							>
								<CardContent className="flex gap-4 pt-4">
									<div className="flex flex-col gap-1 min-w-[120px]">
										<StarRating rating={fb.rating} />
										<span className="text-sm text-muted-foreground">
											{fb.userName}
										</span>
									</div>
									<p className="text-sm">{fb.description}</p>
								</CardContent>
							</Card>
						))}
						{totalPages > 1 && (
							<div className="flex items-center justify-between text-sm">
								<button
									onClick={() =>
										setSearchParams((p) => {
											const next = new URLSearchParams(p);
											next.set("page", String(page - 1));
											return next;
										})
									}
									disabled={page === 1}
									className="px-3 py-1 border rounded disabled:opacity-40"
								>
									Previous
								</button>
								<span>
									Page {page} of {totalPages}
								</span>
								<button
									onClick={() =>
										setSearchParams((p) => {
											const next = new URLSearchParams(p);
											next.set("page", String(page + 1));
											return next;
										})
									}
									disabled={page >= totalPages}
									className="px-3 py-1 border rounded disabled:opacity-40"
								>
									Next
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
