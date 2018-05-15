const UciEngine = require('node-uci').Engine;

/**
 * Use a UciEngine to decide the best move, if any.
 */
class UciPlayer {

  constructor(path) {
    this.bootEngine(path);
    this.ponderMoves = null;
    this.ponderer = null;
  }

  async bootEngine(path) {
      this.engine = new UciEngine(path);
      await this.engine.init();
      //await this.engine.setoption('MultiPV', '4');
      await this.engine.isready();
  }

  async getNextMove(event) {
    let moves = event.movesArray();
    let result;
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

    if (this.ponderMoves !== null && moves.join("-") === this.ponderMoves.join("-")) {
      console.log('ponder hit');
      await this.engine.ponderhit();
      result = await this.ponderer;
      this.ponderer = null;
    } else {
      if (this.ponderMoves !== null) {
      //  console.log('ponder fail', this.ponderMoves, moves);
        await this.engine.write('stop');
      }
      await this.engine.position('startpos', moves);
      result = await this.engine.go(options);
    }
    this.ponderMoves = null;

    if (result.ponder) {
      this.ponderMoves = moves;
      this.ponderMoves.push(result.bestmove);
      this.ponderMoves.push(result.ponder);
      this.ponder(moves, options);
    }

    result.info = null;
    return result;
  }

  async ponder(moves, options)
  {
      console.log('pondering ', moves);
      await this.engine.position('startpos', moves);
      options.ponder = true;
      this.ponderer = this.engine.go(options);
  }

  getReply(chat) {
    return;
  }

}

module.exports = UciPlayer;
