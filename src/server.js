import http from 'http'
import  { Readable } from 'stream'
import { randomUUID } from 'crypto'


// função generator
function * run () {
  for(let index = 0; index < 99; index++) {
    const data = {
      id: randomUUID(),
      name:  `Thiago: ${index}`
    }

    yield data
  }
}

function handler(request,response) {
  const readable = new Readable({
    read() {
      for (const data of run()) {
        console.log(`sending `, data)
        this.push(JSON.stringify(data) + "\n")
      }
      this.push(null) //para informar que os dados acabaram
    }
  })
  readable
  .pipe(response)
}



http.createServer(handler)
.listen(3000)
.on('listening', () => console.log('server started in port 3000'))