import Calendar from "@/components/calendar/Calendar";
import ViewSceleton from "@/components/calendar/ViewSceleton";
import { Suspense } from "react";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: {
    view?: string;
    date?: string;
    country?: string;
    search?: string;
  };
}) {
  return (
    <Suspense fallback={<ViewSceleton />}>
      <Calendar
        date={searchParams.date}
        view={searchParams?.view}
        country={searchParams?.country}
        search={searchParams?.search}
      />
    </Suspense>
  );
}
