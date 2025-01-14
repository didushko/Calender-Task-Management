import { CalendarData } from "@/components/calendar/View";
import { ViewMode } from "@/components/calendar/ViewMode";
import dailyListService from "@/services/dailyList-service";
import nagerDateService from "@/services/nagerDateService";

export function convertToIsoDate(str?: string) {
  if (str && !isNaN(Date.parse(str))) {
    return new Date(str);
  } else {
    return new Date();
  }
}

export function checkIsoStr(str?: string) {
  if (str && !isNaN(Date.parse(str))) {
    const date = new Date(str);
    return date.toISOString();
  } else {
    return new Date().toISOString();
  }
}

export function generateDateGrid(date: Date, weekLimit: number = 6): Date[][] {
  const firstDayAtMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - date.getDay()
  );
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
  currentDate: Date,
  viewMode: ViewMode,
  country?: string,
  search?: string
): Promise<CalendarData[]> => {
  const viewData = viewMode.getDateGrid(currentDate);
  const firstDate = viewData[0][0];
  const lastDate =
    viewData[viewData.length - 1][viewData[viewData.length - 1].length - 1];
  firstDate.setUTCHours(0, 0, 0, 0);
  lastDate.setUTCHours(0, 0, 0, 0);
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
  const data = viewData.map((week, i1) => {
    const weekData = week.map((day, i2) => {
      const dayData = dailyTasksList.find(
        (task) => task.date.valueOf() === day.valueOf()
      ) || {
        _id: `${currentDate.valueOf()}_${i1}_${i2}`,
        date: day,
        tasks: [],
      };
      const holidays = holidaysData?.get(day.valueOf()) || [];

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

export { getCalendarData, findDayDataById, generateShortHex };
