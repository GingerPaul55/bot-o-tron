const LichessApi = require("./LichessApi");
const Game = require("./Game");

/**
 * RobotUser listens for challenges and spawns Games on accepting.
 *
 */
class RobotUser {

  /**
   * Initialise with interface to lichess and a player.
   */
  constructor(token, player) {
    this.api = new LichessApi(token);
    this.player = player;
  }

  async start() {
    this.account = await this.api.accountInfo();
    console.log("Playing as " + this.account.data.username);
    if (this.account.data.title != 'BOT') {
      console.log('Upgrading account to BOT');
      this.api.upgrade();
    }
    this.api.streamEvents((event) => this.eventHandler(event));
    return this.account;
  }

  eventHandler(event) {
    switch (event.type) {
      case "challenge":
        this.handleChallenge(event.challenge);
        break;
      case "gameStart":
        this.handleGameStart(event.game.id);
        break;
      default:
        console.log("Unhandled event : " + JSON.stringify(event));
    }
  }

  handleGameStart(id) {
    const game = new Game(this.api, this.account.data.username, this.player);
    game.start(id);
  }

  async handleChallenge(challenge) {
    if (!challenge.rated && false) {
      console.log("Declining non-rated challenge from " + challenge.challenger.id);
      this.api.declineChallenge(challenge.id);
      return;
    }

    if (challenge.variant.key !== 'standard') {
      console.log("Declining non-standard challenge from " + challenge.challenger.id);
      this.api.declineChallenge(challenge.id);
      return;
    }

    if (challenge.challenger.title && challenge.challenger.title !== 'BOT') {
      console.log("Accepting title challenge from " + challenge.challenger.id);
      var accept = await this.api.acceptChallenge(challenge.id);
      console.log("Status " + accept.statusText);
    }

    if (['bullet', 'ultraBullet', 'rapid', 'blitz'].indexOf(challenge.speed) == -1) {
      console.log("Declining non-quick challenge from " + challenge.challenger.id);
      this.api.declineChallenge(challenge.id);
      return;
    }

    console.log("Accepting unrated challenge from " + challenge.challenger.id);
    var accept = await this.api.acceptChallenge(challenge.id);
    console.log("Status " + accept.statusText);
  }

}

module.exports = RobotUser;
