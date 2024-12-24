import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface LanguageStats {
  name: string;
  linesOfCode: number;
  percentage: number;
  repoCount: number;
  color: string;
  trend: string;
}

interface LanguageChartProps {
  languages: LanguageStats[];
  timeRange?: "current-year" | "all-time";
}

const formatToK = (value: number) => {
  return value >= 1000
    ? `${Math.round(value / 1000).toFixed(0)}k`
    : Math.round(value).toFixed(0).toString();
};

const generateMonthlyData = (languages: LanguageStats[]) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month) => {
    const dataPoint: any = { period: month };
    languages.forEach((lang) => {
      const trendMultiplier =
        lang.trend === "increasing"
          ? 1.1
          : lang.trend === "decreasing"
          ? 0.9
          : 1;
      const randomVariation = 0.95 + Math.random() * 0.1;

      dataPoint[`${lang.name}LOC`] = Math.round(
        lang.linesOfCode * trendMultiplier * randomVariation
      );
      dataPoint[`${lang.name}Repos`] = Math.round(
        lang.repoCount * trendMultiplier * randomVariation
      );
      dataPoint[`${lang.name}Contributors`] = Math.round(
        (lang.repoCount / 2) * trendMultiplier * randomVariation
      );
      dataPoint[`${lang.name}PRs`] = Math.round(
        lang.repoCount * 3 * trendMultiplier * randomVariation
      );
    });
    return dataPoint;
  });
};

const generateYearlyData = (languages: LanguageStats[]) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);

  return years.map((year) => {
    const dataPoint: any = { period: year.toString() };
    languages.forEach((lang) => {
      const yearIndex = year - (currentYear - 4);
      const trendMultiplier =
        lang.trend === "increasing"
          ? Math.pow(1.1, yearIndex)
          : lang.trend === "decreasing"
          ? Math.pow(0.9, yearIndex)
          : 1;
      const randomVariation = 0.95 + Math.random() * 0.1;

      dataPoint[`${lang.name}LOC`] = Math.round(
        lang.linesOfCode * trendMultiplier * randomVariation
      );
      dataPoint[`${lang.name}Repos`] = Math.round(
        lang.repoCount * trendMultiplier * randomVariation
      );
      dataPoint[`${lang.name}Contributors`] = Math.round(
        (lang.repoCount / 2) * trendMultiplier * randomVariation
      );
      dataPoint[`${lang.name}PRs`] = Math.round(
        lang.repoCount * 3 * trendMultiplier * randomVariation
      );
    });
    return dataPoint;
  });
};

export function LanguageChart({
  languages,
  timeRange = "current-year",
}: LanguageChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("LOC");
  const topLanguages = languages.slice(0, 5); // Show top 5 languages
  const data =
    timeRange === "current-year"
      ? generateMonthlyData(topLanguages)
      : generateYearlyData(topLanguages);

  const metrics = [
    { value: "LOC", label: "Lines of Code" },
    { value: "Repos", label: "Repositories" },
    { value: "Contributors", label: "Contributors" },
    { value: "PRs", label: "Pull Requests" },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="w-4 h-4 inline text-green-500" />;
      case "decreasing":
        return <TrendingDown className="w-4 h-4 inline text-red-500" />;
      default:
        return <Minus className="w-4 h-4 inline text-gray-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            Language {selectedMetric} Distribution (
            {timeRange === "current-year" ? "Monthly" : "Yearly"})
          </CardTitle>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((metric) => (
                <SelectItem key={metric.value} value={metric.value}>
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="period" className="text-sm" />
              <YAxis className="text-sm" tickFormatter={formatToK} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload) return null;
                  return (
                    <div className="bg-popover p-3 rounded-lg shadow-lg border">
                      <p className="font-medium mb-2">{label}</p>
                      {payload.map((entry: any) => {
                        const langData = topLanguages.find(
                          (l) => `${l.name}${selectedMetric}` === entry.dataKey
                        );
                        return (
                          <div
                            key={entry.dataKey}
                            className="flex items-center gap-2 text-sm"
                            style={{ color: entry.color }}
                          >
                            <span>
                              {entry.dataKey.replace(selectedMetric, "")}
                            </span>
                            <span>{formatToK(entry.value)}</span>
                            {langData && getTrendIcon(langData.trend)}
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />
              <Legend />
              {topLanguages.map((lang) => (
                <Bar
                  key={lang.name}
                  dataKey={`${lang.name}${selectedMetric}`}
                  name={lang.name}
                  fill={lang.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default LanguageChart;
