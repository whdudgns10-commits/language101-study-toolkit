import type { Activity, ActivityCategory, ActivityLevel } from "@/types/activity";

export type ActivityFilters = {
  search: string;
  level: ActivityLevel | "All";
  duration: "All" | "5" | "10" | "15" | "20+";
  groupSize: "All" | "2 people" | "3–4 people" | "5–8 people" | "9+ people";
  category: ActivityCategory | "All";
};

export const defaultFilters: ActivityFilters = {
  search: "",
  level: "All",
  duration: "All",
  groupSize: "All",
  category: "All",
};

export function filterActivities(items: Activity[], filters: ActivityFilters) {
  const query = filters.search.trim().toLowerCase();
  return items.filter((activity) => {
    const searchable = [activity.title, activity.category, activity.description, ...activity.tags]
      .join(" ")
      .toLowerCase();
    const levelMatches = filters.level === "All" || activity.level === "All Level" || activity.level === filters.level;
    const durationMatches = filters.duration === "All" || (filters.duration === "20+" ? activity.durationMinutes >= 20 : activity.durationMinutes === Number(filters.duration));
    const groupMatches = filters.groupSize === "All" || activity.groupSizes.includes(filters.groupSize);
    const categoryMatches = filters.category === "All" || activity.category === filters.category;
    return (!query || searchable.includes(query)) && levelMatches && durationMatches && groupMatches && categoryMatches;
  });
}
