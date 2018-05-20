const Http = require('http');

/**
 * Use NetworkPlayer if you wanna seperate your bot work from the player via http.
 */
class NetworkPlayer {

  constructor(url) {
    this.url = new URL(url);
    this.keepAliveAgent = new Http.Agent({ keepAlive: true });
  }

  getNextMove(event) {
    return new Promise((resolve, reject) => {
        let data = '';
        const options = {
          agent: this.keepAliveAgent,
          hostname: this.url.hostname,
          port: this.url.port ? this.url.port : 80,
          path: this.url.pathname ? this.url.pathname : '/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = Http.request(options, (res) => {
          if (res.statusCode !== 200) {
              return reject("status code was "+res.statusCode);
          }
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
              // @todo: Support more than one chunk.
              data = chunk.toString('utf8');
              console.log("data1", data);
          });
          res.on('end', () => {
              console.log("data2", data);
              console.log("data3", JSON.parse(data));
              return resolve(JSON.parse(data));
          });
        });

        req.on('error', (e) => {
            return reject(e);
        });

        // write data to request body
        req.write(postData);
        req.end();
    });
  }

  getReply(chat) {
    return;
  }

}

module.exports = NetworkPlayer;
