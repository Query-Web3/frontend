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
        return: ""
      )
    }
  `

  const response = await axios.post('http://' + api + '/gql', {
    query: params
  })
  const data = response.data.data.yields
  return JSON.parse(data)
}
