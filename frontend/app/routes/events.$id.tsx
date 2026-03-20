import { useParams, Link } from "react-router";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import type { Route } from "./+types/events.$id";
import { gqlFetch } from "../../src/lib/gql-fetch";
import { PAGE_SIZE } from "../../src/lib/constants";
import { useEventFeedback } from "../../src/hooks/useEventFeedback";
import { useEventFilters } from "../../src/hooks/useEventFilters";
import { FeedbackFilters } from "../../src/components/FeedbackFilters";
import { FeedbackList } from "../../src/components/FeedbackList";
import { ChevronLeft } from "lucide-react";
import { ErrorDisplay } from "../../src/components/ErrorDisplay";
import { GetEventNameDocument } from "../../src/generated/graphql";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const data = await gqlFetch(GetEventNameDocument, { id: params.id! });
	return { name: data?.event?.name as string | undefined };
}

export function shouldRevalidate({ currentUrl, nextUrl }: ShouldRevalidateFunctionArgs) {
	return currentUrl.pathname !== nextUrl.pathname;
}

export const meta: Route.MetaFunction = ({ data, location }) => {
	const page = new URLSearchParams(location.search).get("page");
	const suffix = page && Number(page) > 1 ? ` · Page ${page}` : "";
	return [{ title: `${data?.name ?? "Event"}${suffix}` }];
};

export default function EventPage({ loaderData }: Route.ComponentProps) {
	const { id } = useParams();
	const { page, minEnabled, minRating, maxEnabled, maxRating, filterVars, paginationVars, setPage, setMinFilter, setMaxFilter } =
		useEventFilters();
	const { loading, error, event, liveCount } = useEventFeedback(
		id!,
		filterVars,
		paginationVars,
		page,
	);

	if (error) return <ErrorDisplay error={error} />;

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

			<FeedbackFilters
				minEnabled={minEnabled}
				minRating={minRating}
				maxEnabled={maxEnabled}
				maxRating={maxRating}
				onMinChange={(enabled, value) => setMinFilter(enabled, value)}
				onMaxChange={(enabled, value) => setMaxFilter(enabled, value)}
			/>

			<FeedbackList
				loading={loading}
				feedback={event?.feedback}
				feedbackCount={event?.feedbackCount}
				liveCount={liveCount}
				page={page}
				totalPages={totalPages}
				onPageChange={setPage}
			/>
		</div>
	);
}
