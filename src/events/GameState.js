/**
 * An object to represent a Game State.
 */
class GameState {
  constructor(moves, wtime, btime, winc, binc) {
    this.moves = moves;
    this.wtime = wtime;
    this.btime = btime;
    this.winc = winc;
    this.binc = binc;
  }

  movesArray() {
    return this.moves === '' ? [] : this.moves.split(' ');
  }

  isTurn(colour) {
    var parity = this.movesArray().length % 2;
    return (colour === "white") ? (parity === 0) : (parity === 1);
  }
}

module.exports = GameState;
