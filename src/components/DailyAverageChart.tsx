import React, { useEffect, useMemo, useRef } from "react"
import { Chart, ChartData, ChartOptions } from "chart.js/auto"
import Annotation from "chartjs-plugin-annotation"
import { useTheme } from "@mui/material/styles"
import { useI18nContext } from "i18n/i18n-react"
import { useDateTime } from "hooks/RegionalDateTime"
import { usePriceInfo } from "hooks/usePriceInfo"
import WithLoading from "./WithLoading"
import { Container, Typography } from "@mui/material"

Chart.register(Annotation)

export const ID_PREFIX = "average-chart-"

const hexToRGBA = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export interface DailyAverageChartProps {
    chartId: string
    dateFormat: string
}

const DailyAverageChart: React.FC<DailyAverageChartProps> = ({
    chartId,
    dateFormat,
}) => {
    const { LL } = useI18nContext()
    const { isLoading, dailyAverages, thirtyDayAverage } = usePriceInfo("today")
    const { fromISO } = useDateTime()
    const theme = useTheme()
    const chartRef = useRef<Chart | null>(null)

    const chartOptions = useMemo(() => {
        const chartOptions: ChartOptions = {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            if (
                                !context.dataset.label ||
                                context.dataset.label === "Hide"
                            )
                                return ""

                            return `${context.dataset.label}: ${context.formattedValue}`
                        },
                    },
                },
                legend: {
                    position: "bottom",
                    labels: {
                        filter: item => {
                            return item.text !== "Hide" // Hide the label for 'Dataset 2'
                        },
                        color:
                            theme.palette.mode === "dark"
                                ? theme.palette.grey[300]
                                : theme.palette.grey[800],
                    },
                },
            },
            interaction: {
                intersect: false,
                mode: "index",
            },
            elements: {
                line: {
                    tension: 0.2, // disables bezier curves
                    // stepped: true, // use steppedLine to create a stepped line chart
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false, // Set this to false to remove vertical grid lines
                        // color: theme.palette.divider,
                    },
                    ticks: {
                        color:
                            theme.palette.mode === "dark"
                                ? theme.palette.grey[300]
                                : theme.palette.grey[800],
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: theme.palette.divider,
                    },
                    ticks: {
                        color:
                            theme.palette.mode === "dark"
                                ? theme.palette.grey[300]
                                : theme.palette.grey[800],
                    },
                },
            },
        }
        return chartOptions
    }, [theme])

    const averageDataset = useMemo(
        () => Array<number>(dailyAverages.length).fill(thirtyDayAverage),
        [dailyAverages, thirtyDayAverage],
    )

    const chartData: ChartData<"line", (number | null)[]> = useMemo(() => {
        const datasets = []

        datasets.push(
            {
                label: LL.MEDIAN(),
                data: dailyAverages.map(item => item.average),
                borderColor: theme.palette.info.main,
                backgroundColor: hexToRGBA(theme.palette.info.main, 0.4),
                pointRadius: 0,
            },
            {
                label: LL.THIRTY_DAY_AVG(),
                data: averageDataset,
                borderColor: theme.palette.secondary.main,
                backgroundColor: hexToRGBA(theme.palette.secondary.main, 0.2),
                pointRadius: 0,
            },
        )

        return {
            labels: dailyAverages.map(item =>
                fromISO(item.date).toFormat(dateFormat),
            ),
            datasets: datasets,
        }
    }, [
        LL,
        dailyAverages,
        theme.palette.info.main,
        theme.palette.secondary.main,
        averageDataset,
        fromISO,
        dateFormat,
    ])

    useEffect(() => {
        const chartCanvas = document.getElementById(
            ID_PREFIX + chartId,
        ) as HTMLCanvasElement

        if (chartCanvas) {
            if (chartRef.current) {
                chartRef.current.destroy()
            }

            chartRef.current = new Chart(chartCanvas, {
                type: "line",
                data: chartData,
                options: chartOptions,
            })
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy()
            }
        }
    }, [chartData, chartOptions, chartId])

    return (
        <WithLoading isLoading={isLoading}>
            <Container sx={{ p: 2 }}>
                <Typography
                    variant="h2"
                    component="h2"
                    align="left"
                    gutterBottom>
                    {LL.LAST_THIRTY_DAYS()}
                </Typography>
            </Container>
            <Container sx={{ p: 2, height: "400px" }}>
                <canvas id={ID_PREFIX + chartId} />
            </Container>
        </WithLoading>
    )
}

export default DailyAverageChart
