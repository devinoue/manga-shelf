import { cacheAdapterEnhancer } from 'axios-extensions'
import axios from 'axios'

export default function () {
  axios.defaults.adapter = cacheAdapterEnhancer(axios.defaults.adapter)
}
