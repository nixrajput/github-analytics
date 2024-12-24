import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Star, GitFork } from "lucide-react";
import { Badge } from "./ui/badge";
import type { Repository } from "@/lib/types";

interface RepositoryCardProps {
  repositories: Repository[];
}

export const RepositoryCard = ({ repositories }: RepositoryCardProps) => {
  // Sort and get top 8 repositories by stargazer count
  const topRepositories = [...repositories]
    .sort((a, b) => b.stargazerCount - a.stargazerCount)
    .slice(0, 8);

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-xl font-semibold mb-4">Top Repositories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {topRepositories.map((repo) => (
          <Card
            key={repo.name}
            className="flex flex-col h-full overflow-hidden"
          >
            <CardHeader className="flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 w-full overflow-hidden">
                <CardTitle
                  className="text-base truncate cursor-pointer :hover:underline :hover:text-blue-500"
                  onClick={() => window.open(repo.url, "_blank")}
                >
                  {repo.name}
                </CardTitle>

                {repo.isPrivate ? (
                  <Badge variant="outline" className="text-muted-foreground">
                    Private
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Public
                  </Badge>
                )}
              </div>
              <CardDescription className="line-clamp-2 h-10">
                {repo.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{repo.stargazerCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    <span>{repo.forkCount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {repo.primaryLanguage && (
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: repo.primaryLanguage.color }}
                    />
                  )}
                  {repo.primaryLanguage && (
                    <span className="ml-auto">{repo.primaryLanguage.name}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
