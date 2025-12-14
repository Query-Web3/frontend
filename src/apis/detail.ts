/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export async function Yields(ps: any) {
  const params = `
    query{
      yields(
        date: "${ps.date}",
        chain: "${ps.chain}", 
        asset: "${ps.asset}",
        token: "${ps.token}",
        return: "${ps.return}",
        page: ${ps.page} ,
        size: ${ps.size}
      ){ total, data }
    }
  `

  const response = await axios.post('/gql', {
    query: params
  })
  const data = response.data.data.yields.data
  const list = JSON.parse(data)
  for (let i = 0; i < list.length; i++) {
    list[i].symbol = JSON.parse(list[i].symbol)
  }
  return { list: list, total: response.data.data.yields.total, page: ps.page, size: ps.size }
}
