const RobotUser = require("./RobotUser");
const PatzerPlayer = require("./bots/PatzerPlayer");
const SwarmKingPlayer = require("./bots/SwarmKingPlayer");
const UciPlayer = require("./bots/UciPlayer");
const BookPlayer = require("./bots/BookPlayer");
const AggregatePlayer = require("./bots/AggregatePlayer");


/**
 * Start a RobotUser (lichess account defined by API_TOKEN) that listens for challenges
 * and spawns games for unrated challenges. A player object must be supplied that can
 * produce the next move to play given the previous moves.
 *
 * Token can be created on BOT accounts at https://lichess.org/account/oauth/token/create
 * Put the token in the shell environment with
 *
 * export API_TOKEN=xxxxxxxxxxxxxx
 * yarn install
 * yarn start
 *
 */


async function startBot(token, player) {
  if (!token) {
      return;
  }

  const robot = new RobotUser(token, player);
  const username = (await robot.start()).data.username;

  return `<a href="https://lichess.org/@/${username}">${username}</a> on lichess.</h1><br/>`;
}

async function begin() {
  var links = "<h1>Challenge:</h1><br/>";

  //links += await startBot(process.env.API_TOKEN, ) || '';
  links += await startBot(
    process.env.API_TOKEN,
    new AggregatePlayer([
      {
          'player': new BookPlayer('/usr/app/books/gm2001.bin', 'Polyglot'),
          // Don't waste time when we're not in the opening.
          'condition': (event) => { return event.movesArray().length < 20; }
      },
      {
          'player': new NetworkPlayer(process.env.NETWORK_PLAYER_URL),
          // Networks can be slow and we have no time.
          'condition': (event) => { return (event.isTurn('white') ? event.wtime : event.btime) > 10000 }
      },
      {
          // Local Uci engine is quicker than networked.
          'player': new UciPlayer('/usr/app/bin/stockfish')
      },
      {
          // Do any old move.
          'player': new SwarmKingPlayer()
      }
    ])
  ) || '';


  // heroku wakeup server (not necessary otherwise)

  const express = require("express");
  const PORT = process.env.PORT || 80;

  express()
    .get("/", (req, res) => res.send(links))
    .listen(PORT, () => console.log(`Wake up server listening on ${PORT}`));
}

begin();
