import { CalendarData } from "@/components/calendar/View";
import { ViewMode } from "@/components/calendar/ViewMode";
import logger from "@/logger/logger";
import dailyListService from "@/services/dailyList-service";
import nagerDateService from "@/services/nagerDateService";

const formatDateToString = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};
const parseStringToDate = (dateString?: string | null) => {
  try {
    if (!dateString) {
      throw new Error("Invalid date string");
    }
    const [value, offset] = dateString.split("T").map(Number);
    if (!value || !offset) {
      throw new Error("Invalid date components");
    }

    const dateLocal = new Date(value);
    const dateClient = new Date(dateLocal.valueOf() + offset * 60 * 1000);
    return dateClient;
  } catch (error: unknown) {
    logger.error(`Error parsing date string '${dateString}' ${String(error)}`);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return currentDate;
  }
};

export function generateDateGrid(date: Date, weekLimit: number = 6): Date[][] {
  const firstDayAtMonth = new Date(date);
  firstDayAtMonth.setDate(1);
  const firstDayOfWeek = new Date(date);
  firstDayOfWeek.setDate(date.getDate() - date.getDay());

  const startDate = weekLimit !== 6 ? firstDayOfWeek : firstDayAtMonth;

  const monthData = [];

  const currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() - currentDate.getDay());

  for (let week = 0; week < weekLimit; week++) {
    const weekData = [];
    for (let day = 0; day < 7; day++) {
      weekData.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    monthData.push(weekData);
    if (
      date.getMonth() === 11
        ? currentDate.getMonth() === 0
        : currentDate.getMonth() > date.getMonth()
    ) {
      break;
    }
  }
  return monthData;
}

const getCalendarData = async (
  clientDate: string | undefined | null,
  viewMode: ViewMode,
  country?: string,
  search?: string
): Promise<CalendarData[]> => {
  const currentDate = parseStringToDate(clientDate);
  const viewDates = viewMode.getDateGrid(currentDate);

  const firstDate = new Date(viewDates[0][0]);
  const lastDate = new Date(
    viewDates[viewDates.length - 1][viewDates[viewDates.length - 1].length - 1]
  );

  const dailyTasksList = await dailyListService.getDailyTaskLists(
    firstDate,
    lastDate,
    search
  );
  const holidaysData = await nagerDateService.getPublicHolidayByRange(
    firstDate,
    lastDate,
    country
  );
  const data = viewDates.map((week, i1) => {
    const weekData = week.map((day, i2) => {
      const dayMidnight = new Date(day);
      dayMidnight.setUTCHours(0, 0, 0, 0);
      const dayData = dailyTasksList.find(
        (task) => task.date.toUTCString() === dayMidnight.toUTCString()
      ) || {
        _id: `${currentDate.toDateString()}_${i1}_${i2}_${day.valueOf()}`,
        date: day,
        tasks: [],
      };
      const holidays = holidaysData?.get(formatDateToString(day)) || [];

      const ids =
        dayData.tasks.reduce(
          (add, task) => add + task._id + `${task.priority}`,
          ""
        ) + holidays.reduce((add, holiday) => add + holiday.name, "");
      const key =
        dayData.date.valueOf() +
        generateShortHex(ids) +
        viewMode.value +
        search;

      return {
        dayData: { ...dayData, holidays },
        key,
      };
    });
    return {
      weekData,
      key: generateShortHex(
        weekData.reduce((add, daily) => add + daily.key, "")
      ),
    };
  });
  return data;
};

function findDayDataById(data: CalendarData[], dayDataId: string) {
  for (const week of data) {
    const dayDataEntry = week.weekData.find(
      (entry) => entry.dayData._id === dayDataId
    );
    if (dayDataEntry) {
      return dayDataEntry;
    }
  }
  return null;
}

function generateShortHex(srt: string) {
  let hash = 0;
  for (let i = 0; i < srt.length; i++) {
    hash = (hash << 5) - hash + srt.charCodeAt(i);
    hash |= 0;
  }

  return hash.toString(36);
}

export {
  formatDateToString,
  parseStringToDate,
  getCalendarData,
  findDayDataById,
  generateShortHex,
};
