import { Card, CardContent } from "./ui/card";
import { StarRating } from "./StarRating";
import { Spinner } from "./Spinner";

interface FeedbackItem {
	id: string;
	userName: string;
	rating: number;
	description: string;
}

interface FeedbackListProps {
	loading: boolean;
	feedback: FeedbackItem[] | undefined;
	feedbackCount: number | undefined;
	liveCount: number;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function FeedbackList({
	loading,
	feedback,
	feedbackCount,
	liveCount,
	page,
	totalPages,
	onPageChange,
}: FeedbackListProps) {
	return (
		<div className="flex flex-col gap-3">
			{loading ? (
				<div className="flex justify-center mt-8">
					<Spinner className="h-8 w-8 text-muted-foreground" />
				</div>
			) : (
				<>
					<div className="flex items-center justify-between text-sm text-muted-foreground">
						<span>
							{feedbackCount} {feedbackCount === 1 ? "review" : "reviews"}
						</span>
						{page === 1 ? (
							<span>● Live{liveCount > 0 ? ` · ${liveCount} new` : ""}</span>
						) : (
							<span>○ Live updates paused</span>
						)}
					</div>
					{feedback?.map((fb) => (
						<Card
							key={fb.id}
							className="animate-in slide-in-from-top-2 fade-in-0 duration-300"
						>
							<CardContent className="flex gap-4 pt-4">
								<div className="flex flex-col gap-1 min-w-[120px]">
									<StarRating rating={fb.rating} />
									<span className="text-sm text-muted-foreground">{fb.userName}</span>
								</div>
								<p className="text-sm">{fb.description}</p>
							</CardContent>
						</Card>
					))}
					{totalPages > 1 && (
						<div className="flex items-center justify-between text-sm">
							<button
								onClick={() => onPageChange(page - 1)}
								disabled={page === 1}
								className="px-3 py-1 border rounded disabled:opacity-40"
							>
								Previous
							</button>
							<span>
								Page {page} of {totalPages}
							</span>
							<button
								onClick={() => onPageChange(page + 1)}
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
	);
}
