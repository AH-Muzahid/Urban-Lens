"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NominatimResult = {
	place_id: number;
	display_name: string;
	lat: string;
	lon: string;
};

export function SearchBar() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const initialName = searchParams.get("name") || "";
	const [query, setQuery] = useState(initialName);
	const [results, setResults] = useState<NominatimResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState(-1);

	const containerRef = useRef<HTMLDivElement>(null);

	const canSearch = useMemo(() => query.trim().length >= 3, [query]);

	useEffect(() => {
		const onClickOutside = (event: MouseEvent) => {
			if (!containerRef.current) return;
			if (!containerRef.current.contains(event.target as Node)) {
				setOpen(false);
				setFocusedIndex(-1);
			}
		};

		document.addEventListener("mousedown", onClickOutside);
		return () => document.removeEventListener("mousedown", onClickOutside);
	}, []);

	useEffect(() => {
		if (!canSearch) {
			return;
		}

		const controller = new AbortController();
		const timeout = setTimeout(async () => {
			try {
				setLoading(true);
				const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&q=${encodeURIComponent(query.trim())}`;
				const response = await fetch(url, {
					method: "GET",
					signal: controller.signal,
				});

				if (!response.ok) {
					throw new Error(`Search failed (${response.status})`);
				}

				const data = (await response.json()) as NominatimResult[];
				setResults(data);
				setOpen(true);
				setFocusedIndex(-1);
			} catch {
				if (!controller.signal.aborted) {
					setResults([]);
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		}, 350);

		return () => {
			controller.abort();
			clearTimeout(timeout);
		};
	}, [canSearch, query]);

	const selectResult = (result: NominatimResult) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("lat", Number(result.lat).toFixed(5));
		params.set("lng", Number(result.lon).toFixed(5));
		if (!params.get("z")) {
			params.set("z", "13");
		}

		const shortName = result.display_name.split(",")[0]?.trim() || result.display_name;
		params.set("name", shortName);

		setQuery(shortName);
		setOpen(false);
		setFocusedIndex(-1);

		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const clearSearch = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("name");
		setQuery("");
		setResults([]);
		setOpen(false);
		setFocusedIndex(-1);
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (!open || results.length === 0) {
			if (event.key === "Enter" && results[0]) {
				event.preventDefault();
				selectResult(results[0]);
			}
			return;
		}

		if (event.key === "ArrowDown") {
			event.preventDefault();
			setFocusedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
			return;
		}

		if (event.key === "ArrowUp") {
			event.preventDefault();
			setFocusedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
			return;
		}

		if (event.key === "Escape") {
			setOpen(false);
			setFocusedIndex(-1);
			return;
		}

		if (event.key === "Enter" && focusedIndex >= 0 && results[focusedIndex]) {
			event.preventDefault();
			selectResult(results[focusedIndex]);
		}
	};

	return (
		<div ref={containerRef} className="relative w-full">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
				<input
					type="text"
					value={query}
					onChange={(event) => {
						const nextQuery = event.target.value;
						setQuery(nextQuery);

						if (nextQuery.trim().length < 3) {
							setResults([]);
							setOpen(false);
							setFocusedIndex(-1);
							setLoading(false);
							return;
						}

						if (!open) setOpen(true);
					}}
					onFocus={() => {
						if (results.length > 0) setOpen(true);
					}}
					onKeyDown={onKeyDown}
					placeholder="Search city, neighborhood, or address"
					className="h-10 w-full rounded-lg border border-black/10 dark:border-white/[0.08] bg-white/80 dark:bg-[#0b1220]/70 pl-10 pr-16 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500/80 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
				/>

				<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
					{loading && <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />}
					{query.length > 0 && (
						<button
							type="button"
							onClick={clearSearch}
							className="p-1 rounded-md text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10"
							aria-label="Clear search"
						>
							<X className="w-3.5 h-3.5" />
						</button>
					)}
				</div>
			</div>

			{open && (results.length > 0 || (canSearch && !loading)) && (
				<div className="absolute mt-2 w-full rounded-xl border border-black/10 dark:border-white/[0.08] bg-white/95 dark:bg-[#0b1220]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
					{results.length === 0 ? (
						<div className="px-3 py-3 text-xs text-zinc-500">No results found.</div>
					) : (
						<ul className="max-h-72 overflow-y-auto custom-scrollbar">
							{results.map((result, index) => {
								const main = result.display_name.split(",")[0]?.trim() || result.display_name;
								return (
									<li key={result.place_id}>
										<button
											type="button"
											onClick={() => selectResult(result)}
											onMouseEnter={() => setFocusedIndex(index)}
											className={cn(
												"w-full text-left px-3 py-2.5 border-b last:border-b-0 border-black/5 dark:border-white/[0.04] hover:bg-black/5 dark:hover:bg-white/[0.05] transition-colors",
												focusedIndex === index && "bg-black/5 dark:bg-white/[0.06]"
											)}
										>
											<div className="flex items-start gap-2">
												<MapPin className="w-3.5 h-3.5 mt-0.5 text-primary" />
												<div className="min-w-0">
													<p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{main}</p>
													<p className="text-[11px] text-zinc-500 truncate">{result.display_name}</p>
												</div>
											</div>
										</button>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			)}
		</div>
	);
}
