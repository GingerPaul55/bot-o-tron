const OpeningBook = require('chess-tools').OpeningBooks;
const fs = require('fs');
const Chess = require('chess.js').Chess;

/**
 * Use a UciEngine to decide the best move, if any.
 */
class BookPlayer {

  constructor(path, type) {
    this.loadBook(path, type);
  }

  loadBook(path, type) {
    this.book = new OpeningBook[type]();
    this.book.load_book(fs.createReadStream(path));
  }

  getNextMove(event) {
    // @todo: add hard coded bot.
    if (event.movesArray().length < 1) {
      return {
        bestmove: "f2f4"
      };
    }
    let chess = new Chess();
    let moves = event.movesArray();
    if (moves.length > 10) {
      return;
    }
    for (let move of moves) {
      chess.move(move, {sloppy: true});
    }

    let bookMoves = this.book.find(chess.fen()) || [];
    for (let move of bookMoves) {
      // @todo, logic for weights
      return {
        bestmove: move.algebraic_move
      }
    }
  }

  getReply(chat) {
    return;
  }

}

module.exports = BookPlayer;
