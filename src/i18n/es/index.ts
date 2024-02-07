import type { BaseTranslation } from "../i18n-types"

const es = {
    TITLE: "Precios de la electricidad",
    CURRENT_RATING_GOOD: "{currentDate:string} es un día BUENO",
    CURRENT_RATING_BAD: "{currentDate:string} es un día MALO",
    CURRENT_RATING_NORMAL: "{currentDate:string} es un día NORMAL",
    CURRENT_PRICE: "Precio actual - {currentTime:string}",
    MIN_PRICE: "Precio min - {minPrice:string}",
    MAX_PRICE: "Precio max - {maxPrice:string}",
    THIRTY_DAY_AVG: "Precio promedio de 30 días",
    TODAY: "Hoy",
    TOMORROW: "Mañana",
    TOMORROW_NO_DATA:
        "Los datos de mañana aún no están disponibles. Los precios suelen estar disponibles después de las 20:30",
    LAST_THIRTY_DAYS: "Últimos 30 días",
    PRICE: "Precio",
    MEDIAN: "Mediana",
} satisfies BaseTranslation

export default es
