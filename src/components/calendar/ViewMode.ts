import { generateDateGrid, parseStringToDate } from "../../../lib/utils";

export interface ViewMode {
  value: string;
  label: string;
  getPrevDate: (date: string) => string;
  getNextDate: (date: string) => string;
  getDisplayDate: (date: string) => string;
  getDateGrid: (date: Date) => Date[][];
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const modeList: ViewMode[] = [
  {
    value: "default",
    label: "Month",
    getPrevDate: (date: string) => {
      const d = parseStringToDate(date);
      d.setMonth(d.getMonth() - 1);
      return `${d.valueOf()}T${d.getTimezoneOffset()}`;
    },
    getNextDate: (date: string) => {
      const d = parseStringToDate(date);
      d.setMonth(d.getMonth() + 1);
      return `${d.valueOf()}T${d.getTimezoneOffset()}`;
    },
    getDisplayDate: (dateStr: string) => {
      const date = parseStringToDate(dateStr);
      return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
    },
    getDateGrid: (date: Date) => generateDateGrid(date),
  },
  {
    value: "week",
    label: "Week",
    getPrevDate: (date: string) => {
      const d = parseStringToDate(date);
      d.setDate(d.getDate() - 7);
      return `${d.valueOf()}T${d.getTimezoneOffset()}`;
    },
    getNextDate: (date: string) => {
      const d = parseStringToDate(date);
      d.setDate(d.getDate() + 7);
      return `${d.valueOf()}T${d.getTimezoneOffset()}`;
    },

    getDisplayDate: (dateStr: string) => {
      const date = parseStringToDate(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      return `${day} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
    },
    getDateGrid: (date: Date) => generateDateGrid(date, 1),
  },
  {
    value: "day",
    label: "Day",
    getPrevDate: (date: string) => {
      const d = parseStringToDate(date);
      d.setDate(d.getDate() - 1);
      return `${d.valueOf()}T${d.getTimezoneOffset()}`;
    },
    getNextDate: (date: string) => {
      const d = parseStringToDate(date);
      d.setDate(d.getDate() + 1);
      return `${d.valueOf()}T${d.getTimezoneOffset()}`;
    },

    getDisplayDate: (dateStr: string) => {
      const date = parseStringToDate(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      return `${day} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
    },
    getDateGrid: (date: Date) => {
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      const prev = new Date(date);
      prev.setDate(prev.getDate() - 1);
      return [[prev, date, next]];
    },
  },
];

export function getModeByValue(value?: string) {
  return modeList.find((mode) => mode.value === value) || modeList[0];
}

export function getModesToDisplay() {
  return modeList.map((mode) => ({ value: mode.value, label: mode.label }));
}
