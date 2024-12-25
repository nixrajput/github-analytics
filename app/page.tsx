"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGitHubData } from "@/hooks/use-github-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TimeRangeToggle } from "@/components/ui/time-range-toggle";
import { ProfileCard } from "@/components/profile-card";
import { StatsGrid } from "@/components/stats-grid";
import { CopyButton } from "@/components/copy-button";
import { Search, Loader2 } from "lucide-react";
import { LanguageChart } from "@/components/language-chart";
import { RepositoryCard } from "@/components/repository-card";
import { TimeRange } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [username, setUsername] = useState(
    searchParams.get("username") ||
      (process.env.NEXT_PUBLIC_GITHUB_USERNAME as string)
  );
  const [timeRange, setTimeRange] = useState<TimeRange>(
    (searchParams.get("timeRange") as TimeRange) || "current-year"
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGitHubData(username, timeRange);

  // Refetch data when data is not available
  useEffect(() => {
    if (!data) {
      refetch();
    }
  }, [data, refetch]);

  // Update URL when username or timeRange changes
  useEffect(() => {
    if (username || timeRange) {
      const params = new URLSearchParams();
      if (username) params.set("username", username);
      params.set("timeRange", timeRange);

      // Update URL without triggering navigation
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [username, timeRange, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  // Handle time range change
  const handleTimeRangeChange = (newRange: "current-year" | "all-time") => {
    setTimeRange(newRange);
  };

  return (
    <main className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-4xl font-bold">GitHub Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Visualize detailed GitHub statistics for any user
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-4 w-full max-w-lg mx-auto"
      >
        <Input
          placeholder="Enter GitHub username"
          value={username}
          disabled={isLoading || isFetching}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TimeRangeToggle
          value={timeRange}
          onChange={handleTimeRangeChange}
          disabled={isLoading || isFetching}
        />
        <Button type="submit" disabled={isLoading || isFetching}>
          {isLoading || isFetching ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          {isLoading || isFetching ? "Loading..." : "Search"}
        </Button>
      </form>

      {isError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
          {error instanceof Error ? error.message : "An error occurred"}
        </div>
      )}

      {(data || isLoading || isFetching) && (
        <div className="space-y-6">
          {data && !isLoading && !isFetching && (
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">GitHub Stats</h2>
              <CopyButton stats={data} />
            </div>
          )}

          {isLoading || isFetching ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            data && (
              <>
                <ProfileCard user={data.user} />
                <StatsGrid
                  user={data.user}
                  stats={data.contributions}
                  engagement={data.engagement}
                  repositories={data.repositories}
                />
                <RepositoryCard repositories={data.repositories} />
                <LanguageChart
                  languages={data.languages}
                  timeRange={timeRange}
                />
              </>
            )
          )}
        </div>
      )}
    </main>
  );
}
