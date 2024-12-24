"use client";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { GitHubUser } from "@/lib/types";
import { MapPin, Building2, Calendar } from "lucide-react";
import Image from "next/image";

interface ProfileCardProps {
  user: GitHubUser;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <Avatar className="h-20 w-20">
          <Image src={user.avatarUrl} alt={user.name} width={80} height={80} />
        </Avatar>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">@{user.login}</p>
          {user.bio && <p className="text-sm">{user.bio}</p>}

          <div className="flex flex-wrap gap-4">
            {user.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {user.location}
              </div>
            )}

            {user.company && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Building2 className="mr-1 h-4 w-4" />
                {user.company}
              </div>
            )}

            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              Joined on{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
