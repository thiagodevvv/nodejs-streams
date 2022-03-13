import axios from 'axios'
import { Transform, Writable } from 'stream'

const url = "http://localhost:3000"



async function consume() {
    const response =  await axios({
        url,
        method: 'get',
        responseType: 'stream'
    })
    return response.data
}



const stream = await consume()
stream
  .pipe(
    //cara responsável pelo processamento, filtrar dados, ou converter valores
    new Transform({
      transform(chunck, enc, cb) {
        const item = JSON.parse(chunck)
        let name = item.name
        const number = /\d+/.exec(item.name)[0]
        if(number % 2 === 0)
          name = name.concat(`is par`)
        else
          name = name.concat('is impar')
        item.name = name
        cb(null, JSON.stringify(item))
      }
    })
  )
  .pipe(
    new Writable({
      write (chunck, enc, cb) {
        console.log('chegou', JSON.parse(chunck))
        cb()
      }
    })
  )