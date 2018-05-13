const UciEngine = require('node-uci').Engine;


/**
 * Use a UciEngine to decide the best move, if any.
 */
class UciPlayer {

  constructor(path) {
    this.bootEngine(path);
  }

  async bootEngine(path) {
      this.engine = new UciEngine(path);
      await this.engine.init();
      //await this.engine.setoption('MultiPV', '4');
      await this.engine.isready();
  }

  async getNextMove(event) {
    await this.engine.position('startpos', event.movesArray());
    var options = {};
    if (event.wtime) {
      options.wtime = event.wtime;
    }
    if (event.btime) {
      options.wtime = event.wtime;
    }
    if (event.winc) {
      options.wtime = event.wtime;
    }
    if (event.binc) {
      options.wtime = event.wtime;
    }
    return await this.engine.go(options);
  }

  getReply(chat) {
    return;
  }

}

module.exports = UciPlayer;
