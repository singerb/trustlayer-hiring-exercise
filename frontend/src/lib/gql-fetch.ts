export async function gqlFetch<TData, TVars = Record<string, never>>(
	query: string,
	variables?: TVars,
): Promise<TData> {
	let res: Response;
	try {
		res = await fetch("http://localhost:4000/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query, variables }),
		});
	} catch (e) {
		throw e instanceof Error ? e : new Error(String(e));
	}
	if (!res.ok) {
		throw new Error(`Server error: ${res.status} ${res.statusText}`);
	}
	const json = await res.json();
	return json.data as TData;
}
