import Chart, { MapChart } from './utils/Chart.js'
import { getMarketInfo } from './services/Market.js'

export default (subject) => {
    getMarketInfo('./data/market.json', subject).then(data => {
        document.querySelectorAll('[id^="chart-"]').forEach(el => {
            const { key } = el.dataset
            new Chart(el).draw(data[key])
        })
        document.querySelectorAll('[id^="map-"]').forEach(el => {
            const { key } = el.dataset
            new MapChart(el).draw(data[key], subject)
        })
    })
}