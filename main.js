import Chart, { MapChart } from './utils/Chart.js'
import { getMarketInfo } from './services/Market.js'

export default (subject) => {
    getMarketInfo('./data/market.json', subject).then(data => {
        document.querySelectorAll('.chart').forEach(el => {
            const { key } = el.dataset
            new Chart(el).draw(data[key])
        })
        document.querySelectorAll('.map').forEach(el => {
            const { key } = el.dataset
            new MapChart(el).draw(data[key], subject)
        })
    })
    document.querySelector('.subject > select').onchange = () => {
        location.href = `./${subject == 'XR' ? 'index' : 'XR'}.html`
    }
}