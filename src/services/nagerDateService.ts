import logger from "@/logger/logger";
import axios, { AxiosInstance } from "axios";

export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: null;
  launchYear: null;
}

export interface NagerCountry {
  name: string;
  countryCode: string;
}

class NagerDateService {
  private static instance: NagerDateService;
  private subAxios: AxiosInstance;
  private constructor() {
    this.subAxios = axios.create({
      baseURL: "https://date.nager.at/api/v3/",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
  }
  static getInstance(): NagerDateService {
    if (!NagerDateService.instance) {
      NagerDateService.instance = new NagerDateService();
    }
    return NagerDateService.instance;
  }

  async AvaliavleCountries(): Promise<NagerCountry[] | null> {
    try {
      const response = await this.subAxios.get<NagerCountry[]>(
        "AvailableCountries"
      );
      return response.data;
    } catch (e) {
      logger.error(String(e));
      return null;
    }
  }

  async getPublicHolidaysByCountryCode(
    year: number,
    countryCode: string
  ): Promise<PublicHoliday[] | null> {
    try {
      const response = await this.subAxios.get<PublicHoliday[]>(
        `PublicHolidays/${year}/${countryCode}`
      );
      return response.data;
    } catch (e) {
      logger.error(String(e));
      return null;
    }
  }

  async getPublicHolidayByRange(
    startDate: Date,
    endDate: Date,
    countryCode?: string,
    filter?: string
  ): Promise<Map<string, PublicHoliday[] | null> | null> {
    try {
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      endDate.setHours(23, 59, 59, 999);

      const years = Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => startYear + i
      );
      const countryList = [];

      if (countryCode) {
        if (countryCode === "ALL") {
          const countries = await this.AvaliavleCountries();
          if (!countries) return null;
          countryList.push(...countries);
        } else {
          countryList.push({ countryCode });
        }
      } else {
        countryList.push({ countryCode: "UA" });
      }

      const AllHolidays: Map<string, PublicHoliday[] | null> = new Map();

      const holidayPromises = countryList.map((country) =>
        Promise.all(
          years.map((year) =>
            this.getPublicHolidaysByCountryCode(year, country.countryCode).then(
              (holidaysByCountry) => {
                if (!holidaysByCountry) {
                  logger.error("Failed to get public holidays by country");
                  throw new Error("Failed to get public holidays by country");
                }
                if (filter) {
                  holidaysByCountry = holidaysByCountry.filter((holiday) =>
                    holiday.name.toLowerCase().includes(filter.toLowerCase())
                  );
                }
                holidaysByCountry.forEach((holiday) => {
                  try {
                    const day = new Date(startDate);
                    const hLocalDate = new Date(holiday.date);
                    day.setFullYear(hLocalDate.getFullYear());
                    day.setMonth(hLocalDate.getMonth());
                    day.setDate(hLocalDate.getDate());
                    if (day >= startDate && day <= endDate) {
                      const holidays = AllHolidays.get(holiday.date) || [];

                      if (!holidays.some((h) => h.name === holiday.name)) {
                        holidays.push(holiday);
                        AllHolidays.set(holiday.date, holidays);
                      }
                    }
                  } catch (e: unknown) {
                    logger.error(String(e));
                  }
                });
              }
            )
          )
        )
      );
      await Promise.all(holidayPromises);
      return AllHolidays;
    } catch (e) {
      logger.error(String(e));
      return null;
    }
  }
}

export default NagerDateService.getInstance();
