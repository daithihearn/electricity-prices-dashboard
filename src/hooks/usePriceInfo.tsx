import { useQuery } from "@tanstack/react-query"
import { useDateTime } from "./RegionalDateTime"
import { getDailyAverages, getDailyPriceInfo } from "services/PriceService"
import { useCallback, useMemo } from "react"
import { DailyPriceInfo } from "models/DailyPriceInfo"
import { DailyAverage } from "models/DailyAverage"
import { DayType } from "models/DayType"

export const usePriceInfo = (day: DayType) => {
    const { now } = useDateTime()

    const getDateTime = useCallback(() => {
        if (day === "today") {
            return now()
        }
        if (day === "tomorrow") {
            return now().plus({ days: 1 })
        }
        return day
    }, [day, now])

    const dailyInfoResp = useQuery<DailyPriceInfo | null>({
        queryKey: ["dailyInfo", day],
        queryFn: async () => getDailyPriceInfo(getDateTime()),
        refetchInterval: 5 * 60_000,
    })

    const averagesResp = useQuery<DailyAverage[]>({
        queryKey: ["dailyAverages", day],
        queryFn: async () => getDailyAverages(getDateTime()),
        refetchInterval: 5 * 60_000,
    })

    const thirtyDayAverage = useMemo(() => {
        if (averagesResp.isLoading || !averagesResp.data) {
            return 0
        }
        return (
            averagesResp.data.reduce(
                (accumulator, med) => accumulator + med.average,
                0,
            ) / averagesResp.data.length
        )
    }, [averagesResp])

    return {
        isLoading: dailyInfoResp.isLoading || averagesResp.isLoading,
        dailyInfo: dailyInfoResp.data,
        dailyAverages: averagesResp.data ?? [],
        thirtyDayAverage,
    }
}
