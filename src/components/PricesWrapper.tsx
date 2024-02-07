import { Container, Typography } from "@mui/material"
import React, { useCallback, useMemo } from "react"
import PriceChart from "./PriceChart"
import { DayType } from "models/DayType"
import { useI18nContext } from "i18n/i18n-react"
import { DayRating } from "models/DayRating"
import { usePriceInfo } from "hooks/usePriceInfo"
import DailyInfo from "./DailyInfo"
import { useDateTime } from "hooks/RegionalDateTime"
import WithLoading from "./WithLoading"

export const PricesWrapper: React.FC<{ day: DayType }> = ({ day }) => {
    const { LL } = useI18nContext()
    const { now } = useDateTime()
    const { isLoading, dailyInfo, thirtyDayAverage } = usePriceInfo(day)

    const isToday = useMemo(() => {
        if (day === "today") {
            return true
        }
        if (day === "tomorrow") {
            return false
        }
        return day.hasSame(now(), "day")
    }, [day, now])

    const isTomorrow = useMemo(() => {
        if (day === "tomorrow") {
            return true
        }
        return false
    }, [day])

    const parseDateText = useCallback(
        (dayType: DayType) => {
            if (dayType === "today" || isToday) {
                return LL.TODAY()
            }
            if (dayType === "tomorrow") {
                return LL.TOMORROW()
            }
            return dayType.toFormat("dd/MM")
        },
        [LL, isToday],
    )

    const ratingText = useMemo(() => {
        const date = parseDateText(day)

        switch (dailyInfo?.dayRating) {
            case DayRating.BAD:
                return LL.CURRENT_RATING_BAD({
                    currentDate: date,
                })
            case DayRating.GOOD:
                return LL.CURRENT_RATING_GOOD({
                    currentDate: date,
                })
            default:
                return LL.CURRENT_RATING_NORMAL({
                    currentDate: date,
                })
        }
    }, [parseDateText, day, dailyInfo?.dayRating, LL])

    if (isTomorrow && !dailyInfo) {
        return (
            <WithLoading isLoading={isLoading}>
                <Container sx={{ p: 2 }}>
                    <Typography
                        variant="h2"
                        component="h2"
                        align="left"
                        gutterBottom>
                        {LL.TOMORROW_NO_DATA()}
                    </Typography>
                </Container>
            </WithLoading>
        )
    }
    return (
        <WithLoading isLoading={isLoading}>
            <Container sx={{ p: 2 }}>
                <Typography
                    variant="h2"
                    component="h2"
                    align="left"
                    gutterBottom>
                    {ratingText}
                </Typography>
            </Container>

            <Container sx={{ p: 2 }}>
                {dailyInfo && (
                    <DailyInfo
                        dailyInfo={dailyInfo}
                        thirtyDayAverage={thirtyDayAverage}
                    />
                )}
            </Container>

            <Container sx={{ p: 2, height: "400px" }}>
                {dailyInfo && (
                    <PriceChart
                        prices={dailyInfo.prices}
                        average={thirtyDayAverage}
                        chartId={`price-chart-${parseDateText(day)}`}
                        dateFormat="HH:mm"
                        showCurrentPrice={isToday}
                        cheapestPeriods={dailyInfo.cheapestPeriods}
                        expensivePeriods={dailyInfo.expensivePeriods}
                    />
                )}
            </Container>
        </WithLoading>
    )
}
