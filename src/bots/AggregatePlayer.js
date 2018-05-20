/**
 * Use AggregatePlayer if you wanna use many bots in one go.
 */
class AggregatePlayer {

  constructor(players) {
    this.players = players;
  }

  async getNextMove(event) {
    for(let player of this.players) {
      if (player.condition && !player.player.condition(event)) {
          continue;
      }

      let result = await player.player.getNextMove(event);
      if (result && result.bestmove) {
        return result;
      }
    }
  }

  getReply(chat) {
    // Doesn't work here as which bot will be used for playing might not match
    // the bot used for talking. It'll be weird.
    return;
  }

}

module.exports = AggregatePlayer;
