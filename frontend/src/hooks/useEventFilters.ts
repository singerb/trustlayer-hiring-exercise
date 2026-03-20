import { useSearchParams } from "react-router";
import { PAGE_SIZE } from "../lib/constants";

export function useEventFilters() {
	const [searchParams, setSearchParams] = useSearchParams();

	const page = Math.max(1, Number(searchParams.get("page") ?? 1));
	const minEnabled = searchParams.get("minEnabled") === "true";
	const minRating = Math.min(5, Math.max(1, Number(searchParams.get("minRating") ?? 1)));
	const maxEnabled = searchParams.get("maxEnabled") === "true";
	const maxRating = Math.min(5, Math.max(1, Number(searchParams.get("maxRating") ?? 5)));

	const filterVars = {
		minRating: minEnabled ? minRating : undefined,
		maxRating: maxEnabled ? maxRating : undefined,
	};

	const paginationVars = { offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };

	function setPage(newPage: number) {
		setSearchParams((p) => {
			const next = new URLSearchParams(p);
			next.set("page", String(newPage));
			return next;
		});
	}

	function setMinFilter(enabled: boolean, value?: number) {
		setSearchParams((p) => {
			const next = new URLSearchParams(p);
			if (enabled) next.set("minEnabled", "true");
			else next.delete("minEnabled");
			if (value !== undefined) next.set("minRating", String(value));
			next.set("page", "1");
			return next;
		});
	}

	function setMaxFilter(enabled: boolean, value?: number) {
		setSearchParams((p) => {
			const next = new URLSearchParams(p);
			if (enabled) next.set("maxEnabled", "true");
			else next.delete("maxEnabled");
			if (value !== undefined) next.set("maxRating", String(value));
			next.set("page", "1");
			return next;
		});
	}

	return {
		page,
		minEnabled,
		minRating,
		maxEnabled,
		maxRating,
		filterVars,
		paginationVars,
		setPage,
		setMinFilter,
		setMaxFilter,
	};
}
