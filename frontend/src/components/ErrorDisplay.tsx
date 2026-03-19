import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

function getErrorDetails(error: unknown): { message: string; stack?: string; type: string } {
	if (error instanceof Error) {
		return { message: error.message, stack: error.stack, type: error.constructor.name };
	}
	if (typeof error === "string") {
		return { message: error, type: "Error" };
	}
	if (
		error !== null &&
		typeof error === "object" &&
		"message" in error &&
		typeof (error as { message: unknown }).message === "string"
	) {
		const e = error as { message: string; status?: number };
		const type = "status" in e ? `HTTP ${e.status}` : "Error";
		return { message: e.message, type };
	}
	return { message: String(error), type: "Error" };
}

export function ErrorDisplay({ error }: { error: unknown }) {
	const { message, stack, type } = getErrorDetails(error);

	return (
		<Card className="border-destructive/50 bg-destructive/5">
			<CardHeader>
				<CardTitle className="text-destructive">Something went wrong</CardTitle>
			</CardHeader>
			{import.meta.env.DEV && (
				<CardContent>
					<p className="text-sm text-destructive/80 mb-2">
						{type}: {message}
					</p>
					<pre className="text-xs text-muted-foreground overflow-auto whitespace-pre-wrap">
						{stack || "(no stack trace available)"}
					</pre>
				</CardContent>
			)}
		</Card>
	);
}
