import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
	GetEventDocument,
	type GetEventQuery,
	FeedbackAddedDocument,
} from "../generated/graphql";
import { PAGE_SIZE } from "../lib/constants";

export function useEventFeedback(
	id: string,
	filterVars: { minRating?: number; maxRating?: number },
	paginationVars: { offset: number; limit: number },
	page: number,
) {
	const [liveCount, setLiveCount] = useState(0);
	const { minRating, maxRating } = filterVars;

	const { loading, error, data, subscribeToMore } = useQuery(GetEventDocument, {
		variables: { id, ...filterVars, ...paginationVars },
	});

	// Reset live count whenever filter/page context changes
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setLiveCount(0);
	}, [id, minRating, maxRating, page]);

	// Subscribe to more when on page 1
	useEffect(() => {
		if (!id || page !== 1) return;
		return subscribeToMore({
			document: FeedbackAddedDocument,
			variables: { eventId: id, minRating, maxRating },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data || !prev.event) return prev as GetEventQuery;
				setLiveCount((c) => c + 1);
				const newFeedback = subscriptionData.data.feedbackAdded;
				return {
					...prev,
					event: {
						...prev.event,
						feedbackCount: (prev.event.feedbackCount ?? 0) + 1,
						feedback: [newFeedback, ...(prev.event.feedback ?? [])].slice(0, PAGE_SIZE),
					},
				} as GetEventQuery;
			},
		});
	}, [id, subscribeToMore, minRating, maxRating, page]);

	const event = data?.event;

	return { loading, error, event, liveCount };
}
