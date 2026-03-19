import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useMutation } from "@apollo/client/react";
import {
	GetEventDocument,
	AddFeedbackDocument,
} from "../../src/generated/graphql";
import { ChevronLeft } from "lucide-react";

export default function AddFeedbackPage() {
	const { id } = useParams();
	const navigate = useNavigate();

	const { loading, error, data } = useQuery(GetEventDocument, {
		variables: { id: id! },
	});

	const [addFeedback] = useMutation(AddFeedbackDocument);

	const [userName, setUserName] = useState("");
	const [description, setDescription] = useState("");
	const [rating, setRating] = useState(0);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;
	if (!data?.event) return <p>Event not found</p>;

	const { event } = data;

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		await addFeedback({
			variables: { eventId: id!, userName, rating, description },
			// TODO: this is a bit much in terms of coupling with the events page (knowing the pagination vars), but works to refresh correctly
			refetchQueries: [
				{
					query: GetEventDocument,
					variables: { id: id!, offset: 0, limit: 10 },
				},
			],
			awaitRefetchQueries: true,
		});
		navigate(`/events/${id}`);
	}

	return (
		<div className="flex flex-col gap-6">
			<Link
				to={`/events/${id}`}
				className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
			>
				<ChevronLeft size={16} /> {event.name}
			</Link>

			<h1 className="text-3xl font-bold">
				Submit feedback for &apos;{event.name}&apos;
			</h1>

			<form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
				<div className="flex flex-col gap-1">
					<label htmlFor="userName" className="text-sm font-medium">
						User name
					</label>
					<input
						id="userName"
						type="text"
						required
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
						className="border rounded px-3 py-2 text-sm"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="description" className="text-sm font-medium">
						Description
					</label>
					<textarea
						id="description"
						required
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="border rounded px-3 py-2 text-sm min-h-[80px]"
					/>
				</div>

				<div className="flex flex-col gap-1">
					{/* TODO: replace with clickable star input */}
					<label htmlFor="rating" className="text-sm font-medium">
						Star rating
					</label>
					<input
						id="rating"
						type="number"
						required
						min={0}
						max={5}
						value={rating}
						onChange={(e) => setRating(Number(e.target.value))}
						className="border rounded px-3 py-2 text-sm w-24"
					/>
				</div>

				<button
					type="submit"
					className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm font-medium w-fit"
				>
					Submit
				</button>
			</form>
		</div>
	);
}
