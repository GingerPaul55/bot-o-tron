const Http = require('http');

/**
 * Use NetworkPlayer if you wanna seperate your bot work from the player via http.
 */
class NetworkPlayer {

  constructor(url) {
    this.url = new URL(this.url);
    this.keepAliveAgent = new Http.Agent({ keepAlive: true });
  }

  async getNextMove(event) {
    await new Promise(function(resolve, reject) {
        let data = '';
        const postData = JSON.stringify(event);
        const options = {
          agent = this.keepAliveAgent,
          hostname: this.url.hostname,
          port: this.url.port ?: 80,
          path: this.url.path ? '/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = Http.request(options, (res) => {
          if (res.statusCode !== 200) {
              return reject();
          }
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
              // @todo: Support more than one chunk.
              data = chunk.toString('utf8');
          });
          res.on('end', () => {
              return resolve(JSON.parse(data));
          });
        });

        req.on('error', (e) => {
            return reject(e);
        });

        // write data to request body
        req.write(postData);
        req.end();
    }
  }

  getReply(chat) {
    return;
  }

}

module.exports = NetworkPlayer;
