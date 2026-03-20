interface FeedbackFiltersProps {
	minEnabled: boolean;
	minRating: number;
	maxEnabled: boolean;
	maxRating: number;
	onMinChange: (enabled: boolean, value?: number) => void;
	onMaxChange: (enabled: boolean, value?: number) => void;
}

export function FeedbackFilters({
	minEnabled,
	minRating,
	maxEnabled,
	maxRating,
	onMinChange,
	onMaxChange,
}: FeedbackFiltersProps) {
	return (
		<div className="flex flex-col gap-2">
			<label className="flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					checked={minEnabled}
					onChange={(e) => onMinChange(e.target.checked)}
				/>
				Min stars:
				<input
					type="number"
					min={1}
					max={5}
					value={minRating}
					disabled={!minEnabled}
					onChange={(e) => onMinChange(minEnabled, Number(e.target.value))}
					className="w-16 border rounded px-1"
				/>
			</label>
			<label className="flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					checked={maxEnabled}
					onChange={(e) => onMaxChange(e.target.checked)}
				/>
				Max stars:
				<input
					type="number"
					min={1}
					max={5}
					value={maxRating}
					disabled={!maxEnabled}
					onChange={(e) => onMaxChange(maxEnabled, Number(e.target.value))}
					className="w-16 border rounded px-1"
				/>
			</label>
		</div>
	);
}
