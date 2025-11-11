import axios from "axios";
import { ss58toHex } from "@/utils/chain";

const api = "192.168.110.205:8082"

export async function Yields(ps: any) {
  let params = `
    query{
      yields(
        date: 0,
        chain: 1, 
        asset:"",
        token: "",
        return: "",
        page: ${ps.page} ,
        size: ${ps.size}
      ){ total, data }
    }
  `

  const response = await axios.post('http://' + api + '/gql', {
    query: params
  })
  const data = response.data.data.yields.data
  let list = JSON.parse(data)
  for (let i = 0; i < list.length; i++) {
    list[i].symbol = JSON.parse(list[i].symbol)
  }
  return { list: list, total: response.data.data.yields.total, page: ps.page, size: ps.size }
}
