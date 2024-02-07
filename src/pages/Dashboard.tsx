import React, { useCallback, useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { Container } from "@mui/material"
import { useI18nContext } from "i18n/i18n-react"
import { useDateTime } from "hooks/RegionalDateTime"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"
import { DateTime } from "luxon"
import DailyAverageChart from "components/DailyAverageChart"
import { PricesWrapper } from "components/PricesWrapper"

const DashboardContent: React.FC = () => {
    const { LL } = useI18nContext()
    const { now } = useDateTime()
    const [currentDate, setCurrentDate] = useState<DateTime | "today">("today")

    const handleDateChange = useCallback(
        (date: DateTime | null) => {
            if (date) {
                setCurrentDate(date)
            }
        },
        [setCurrentDate],
    )

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                height: "100vh",
                overflow: "auto",
            }}>
            <Paper
                sx={{
                    p: 1,
                    display: "flex",
                    flexDirection: "column",
                }}>
                <Container sx={{ p: 2 }}>
                    <Typography
                        variant="h1"
                        component="h1"
                        align="left"
                        gutterBottom>
                        {LL.TITLE()}
                    </Typography>
                </Container>

                <Container sx={{ p: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <DatePicker
                            value={
                                currentDate === "today" ? now() : currentDate
                            }
                            onChange={handleDateChange}
                            maxDate={now()}
                            format="dd/MM/yyyy"
                        />
                    </LocalizationProvider>
                </Container>

                <PricesWrapper day={currentDate} />

                <PricesWrapper day="tomorrow" />

                <DailyAverageChart
                    chartId="DailyAverages"
                    dateFormat="MMM dd"
                />
            </Paper>
        </Box>
    )
}

export default function Dashboard() {
    return <DashboardContent />
}
