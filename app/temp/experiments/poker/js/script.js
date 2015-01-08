
(function(){
 "use strict";
 var Card = function( color, denomination ) {
  this.icon = getIcon(color);
  this.color = color;
  this.denomination = denomination;
  var element = domCreate("div", "card");
  this.element = element;
 },
 Deck = function( jokers ){
  var card, color,
   colors = [1,2,4,8],
   numberOfCards = 52,
   rnd;
  this.cards = [];
  this.element = domCreate("div", "deck", "The Deck", "deck");
  for( color in colors ){
   for (var i = (numberOfCards/colors.length)-1; i > 0; i--) {
    card = new Card(colors[color], +i+2);
    this.cards.push(card);
   }
  }
  for( card in this.cards ){
   this.element.appendChild( this.cards[card].element );
   rnd = Math.floor(Math.random()*5);
   this.cards[card].element.style.msTransform = "rotate(" + rnd + "deg)";
   this.cards[card].element.style.msTransformOrigin = "center";
   this.cards[card].element.style.left = 0 + "px";
  }
  return this;
 },
 Player = function( name ) {
  var actions,
   actionBetText,
   actionBetButton,
   actionFoldButton,
   that;
  that = this;
  this.canPlaceBet = function( amount ){
   var haveChips = this.chips >= amount,
    isAllowedBet = amount >= (minimumBet - this.bet);


   if ( haveChips && isAllowedBet ){
    return true;
   }
   console.log(this.name + " tried to bet " + amount + " and failed!");
   return false;
  };
  this.fold = function( ){
   console.log( this.name + " folded, added " + this.bet + " to the pot." );
   table.addPot(this.bet);
   this.active = false;
   this.setBet("Fold!");
   this.disableConsole();
   if( bestHand.player === that ){
    bestHand = {};
   }
   gameStarted = true;
   setNextPlayer();
  };
  this.placeBet = function( amount ){
   var isRaise,
    isBet,
    isBlind,
    isCall,
    isCheck;
   // amount; the incoming bet
   // minimumBet; the lowest bet allowed
   // this.bet; the players total bet for the round

   if( !amount){
    amount = minimumBet - this.bet;
   }
   if( this.canPlaceBet( amount )){
    this.bet += amount;
    this.addChips( -amount );
    isRaise = ( this.bet > minimumBet );
    isBet = ( isRaise && minimumBet === 0 );
    isBlind = ( !gameStarted && amount > 0);
    isCall = ( this.bet === minimumBet );
    isCheck = ( isCall && minimumBet === 0 );

    if ( isRaise ){
     // console.log("isRaise")
     minimumBet = this.bet;
     turnStartAt = playersTurn;
     this.setBet( "Raise:" + this.bet);
    }
    if ( isBet ){
     this.setBet("Bet:" + this.bet);
     // console.log("isBet")
    }
    if ( isCall ){
     this.setBet( "Call:" + this.bet );
     // console.log("isCall")
    }
    if ( isBlind ){
     this.setBet("Blind:" + this.bet);
     // console.log("isBlind")
    }
    if ( isCheck ){
     this.setBet( "Check!");
     // console.log("isCheck")
    }
    this.setConsoleColor("green");
    setNextPlayer();
    return true;
   }
   return false;
  };
  this.setConsoleColor = function ( color ){
   this.element.style.backgroundColor = color;
  };
  this.disableConsole = function( ){
   this.setConsoleColor("red");
   this.actionsElement.style.display = "none";
  };
  this.addChips = function ( chips ){
   this.chips += chips;
   this.element.childNodes[2].textContent = "(" + this.chips + ")";
  };
  this.setStatus = function ( status ){
   this.element.childNodes[3].textContent = status;
  };
  this.setBet = function ( status ){
   this.element.childNodes[4].textContent = status;
  };
  this.handleBetClick = function(){
   var bet;
   bet = +actionBetText.value;
   gameStarted = true;
   this.placeBet(bet);
   actionBetText.value = "";
  };
  this.active = true;
  this.bet = 0;
  this.call = false;
  this.chips = 1000;

  this.element = domCreate( "div", "player", "", name);
  this.actionsElement = domCreate( "div", "playerActions" );
  this.element.id = name;
  this.element.appendChild( domCreate( "div", "name", name ) );
  this.element.appendChild( domCreate( "div", "hand") );
  this.element.appendChild( domCreate( "div", "chips", "(" + this.chips + ")" ) );
  this.element.appendChild( domCreate( "div", "status") ) ;
  this.element.appendChild( domCreate( "div", "bet") ) ;
  actionBetText = domCreate( "input" );
  actionBetButton = domCreate( "input" );
  actionFoldButton = domCreate( "input" );
  this.actionsElement.appendChild( actionBetText );
  this.actionsElement.appendChild( actionBetButton );
  this.actionsElement.appendChild( actionFoldButton );
  this.element.appendChild( this.actionsElement );

  actionBetText.type = "text";
  actionBetButton.type = "button";
  actionBetButton.value = "Bet";
  actionFoldButton.type = "button";
  actionFoldButton.value = "Fold";

  actionBetButton.addEventListener( "click", this.handleBetClick.bind(that), false );
  actionFoldButton.addEventListener( "click", this.fold.bind(that), false);
  
  this.hand = [];
  this.name = name;
 },
 Table = function(){
  this.pot = 0;
  this.addPot = function ( chips ){
   this.pot += chips;
   this.element.childNodes[2].textContent = "Pot contains:" + this.pot + " chips";
  };
  this.setStatus = function ( status ){
   this.element.childNodes[3].textContent = status;
  };
  this.element = domCreate( "div", "table", "", "table" );
  this.element = document.body.appendChild(this.element);
  this.element.appendChild(deck.element);
  this.element.appendChild(domCreate( "div", "hand" ));
  this.element.appendChild(domCreate( "div", "chips" ));
  this.element.appendChild(domCreate( "div", "status" ));
  return this;
 },
 addPlayer = function( name ){
  var player = new Player(name);
  players.push(player);
  document.body.appendChild(player.element);
 },
 checkWinner = function(){
  var count = 0,
   winner,
   hand = [],
   bestHand = [],
   player;
  for (player in players){
   if(players[player].active){
    count += 1;
    winner = player;
   }
  }
  if (count === 1){
   collectBets();
   console.log(players[winner].name + " won the " + table.pot + " chip pot.");
   players[winner].disableConsole();
   players[winner].setConsoleColor("gold");
   players[winner].addChips(table.pot);
   gameStarted = false;
   dealer = getNextPlayer(dealer);
   return winner;
  } else {
   if( gamePhase === 4 ){

   }
  }

  return false;
 },
 collectBets = function(){
  var player,
   thisPlayer;
  for (player in players){
   thisPlayer = players[player];
   if ( thisPlayer.active ){
    console.log("Added " + thisPlayer.bet + " chips from " + thisPlayer.name + " to the pot.");
    table.addPot(thisPlayer.bet);
    thisPlayer.bet = 0;
    thisPlayer.setBet(0);
   }
  }
 },
 checkTurn = function( ){
  if ( gameStarted && playersTurn === turnStartAt  ){
   incrementGamePhase();

  }
 },
 incrementGamePhase = function (){
  collectBets();
  minimumBet = 0;
  getNextPlayer(dealer);
  console.log("Pot is at:" + table.pot);
  gamePhase += 1;
  if ( gamePhase === 4 ){

  }else if (gamePhase === 3 ){
   bestHand = dealComunityCards(1);
  }else if (gamePhase === 2 ){
   bestHand = dealComunityCards(1);
  }else if( gamePhase === 1 ){
   bestHand = dealComunityCards(3);
  }
  gameStarted = false;
 },
 getNextPlayer = function( currentPlayer ){
  var nextPlayer,
   playersLength;

  playersLength = players.length - 1;
  nextPlayer =  currentPlayer + 1 > playersLength ? 0 : currentPlayer + 1;

  if ( players[nextPlayer].active ){
   return nextPlayer;
  }
  return getNextPlayer( nextPlayer );
 },
 setNextPlayer = function( player ){
  var hasWon;
  if ( player ){
   playersTurn = getNextPlayer( player );
  } else {
   playersTurn = getNextPlayer( playersTurn );
  }
  hasWon = checkWinner();
  if ( hasWon ){
   return;
  }
  checkTurn();
  players[playersTurn].setConsoleColor("blue");
  return;
 },
 dealCard = function(){
  var card = deck.cards.splice(deck.cards.length-1, 1)[0],
   icon = domCreate("i", "ui-icon " + card.icon),
   top = domCreate("div", "top", getVal(card.denomination)),
   center = domCreate("div", "center"),
   low;
  top.insertBefore(icon, top.firstChild);
  low = top.cloneNode(true);
  low.className = "low";
  center.appendChild(icon.cloneNode(true));
  card.element.appendChild(top);
  card.element.appendChild(center);
  card.element.appendChild(low);
  return card;
 },
 dealCards = function( numberOfCards, to ){
  var card,
   element,
   deg;
  deg = -0.09;
  numberOfCards = numberOfCards || 1;

  for ( ; numberOfCards - 1 >= 0; numberOfCards-- ) {
   deg += 0.027;
   if ( to ) {
    card = dealCard();
    element = document.getElementById(to.element.id).childNodes[1];
    to.hand.push(card);
    card = element.appendChild(card.element);
    card.style.msTransform = "rotate(" + deg + "turn)";
    card.style.msTransformOrigin = "left bottom";
    card.style.webkitTransform = "rotate(" + deg + "turn)";
    card.style.webkitTransformOrigin = "left bottom";
    card.style.transform = "rotate(" + deg + "turn)";
    card.style.transformOrigin = "left bottom";
   }
  }
  return to.hand;
 },
 dealComunityCards = function ( numberOfCards ) {
  var i = 1,
   drawInterval,
   newCard,
   thisHand = {
       score:0,
       hand:[],
      },
   colors = ["pink", "yellow", "red", "orange", "green", "blue", "black", "purple", "teal"],
   player;
  drawInterval = setInterval(function(){
   if ( i > numberOfCards ){
    clearInterval(drawInterval);
    return;
   }
   newCard = dealCard();
   comunityCards.push(newCard);

   newCard.element.style.left = 50 + (150 * comunityCards.length -1) + "px";
   table.element.appendChild(newCard.element);

   for (player in players){
    if(players[player].active){
     thisHand = comunityCards;
     thisHand = thisHand.concat( players[player].hand );
     thisHand = evalCards( thisHand, colors[player] );
// console.log( players[player].name + " has a score of " + (+thisHand.score) );
     if( thisHand.score > bestHand.score ){
      bestHand.hand.forEach(function(cell, index, array){
       cell.element.style.boxShadow = "";
      });
      thisHand.hand.forEach(function(cell, index, array){
       cell.element.style.boxShadow = "inset 0 0 1em blue";
      });
      bestHand.player = players[player];
      bestHand = thisHand;
// console.log(players[player].name + " has the best hand with score:" + bestHand.score);
// console.log(bestHand.hand);
     }
    }
   }
   i = i + 1;
  }, 500);
  return bestHand;
 },
 evalCards = function( cards, color ){
  var bestHand =  {
       score:0,
       hand:[],
      },
   // stringHand = "",
   cardsLength = cards.length - 1;

  if ( Array.isArray( cards ) ){
   if ( cardsLength > 6 ){
    console.log("How did you get so many cards?!?!?!?");
    return false;
   }
   // First sort all cards by their rank.
   cards.sort(function( a, b ){
    return b.denomination - a.denomination;
   });

   var straight = 0, lastVal = 0, lastColor = 0, flush = 0;
   // Walk through the array and check if we have a straight or a flush.
   cards.forEach(function(cell, index, array){
    if ( cell.denomination === lastVal + 1 ){
     straight += 1;
     if ( straight === 5 ){
      bestHand.straight = true;
      bestHand.score = 90;
     }
    }
    if ( cell.color === lastColor ){
     flush += 1;
     if ( flush === 5 ){
      flush = true;
      bestHand.flush = flush;
      bestHand.score = 120;
     }
    }
    if ( straight && flush ){
     bestHand.score = 150;
    }

    lastVal = cell.denomination;
    lastColor = cell.color;
   });
   // sort by value, slice the top 5 cards and then calculate the score.
   cards.sort(function( a, b ){
    // console.log("A:" + a.denomination + " B:" + b.denomination);
    // if ( a.denomination === 1 ){a.denomination = 14;}
    a.value = 1;
    if ( a.denomination === b.denomination ){
     // value is 1, if the same rank appears again, add 2.
     // a pair = 3, trip = 5, quad = 7.
     a.value += 2;
     b.value += 2;
    }
    return b.value - a.value;
   });
   bestHand.hand = cards.slice(0,5);
   cards.forEach(function( cell, index, array){
    bestHand.score += +cell.denomination * +cell.value;
   });
   return bestHand;
  }
 },
 domCreate = function( elem, cl, text, id ){
  var elemList = ["div", "i", "span", "input"],
  retElem;
  if ( elemList.indexOf( elem ) > -1 ){
   retElem = document.createElement( elem );
    if ( cl ){
    retElem.className = cl;
   }
   if ( text ){
    retElem.textContent = text;
   }
   if ( id ){
    retElem.id = id;
   }
   return retElem;
  }
  return;
 },
 getVal = function( denomination, short ){
  if (short){
   return denomination === 14 ? "A" : (denomination === 11 ? "J" : (denomination === 12 ? "Q" : (denomination === 13 ? "K" : denomination)));
  }
  return denomination === 14 ? "Ace" : (denomination === 11 ? "Jack" : (denomination === 12 ? "Queen" : (denomination === 13 ? "King" : denomination)));
 },
 getIcon = function( color ){
  return color === 0 ? "ui-icon-gear" : (color === 1 ? "ui-icon-search" : (color === 2 ? "ui-icon-link" : (color === 3 ? "ui-icon-wrench" : color)));
 },
 startGame = function( ){
  var player,
   thisPlayer;
  players[dealer].setStatus("");
  dealer = getNextPlayer(dealer);
  players[dealer].setStatus("(Dealer)");

  playersTurn = getNextPlayer(dealer);
  players[playersTurn].setStatus("Small blind");
  players[playersTurn].placeBet(blind);

  players[playersTurn].setStatus("Big blind");
  players[playersTurn].placeBet(blind * 2);

  //Set a flag to check when all players had a turn.
  turnStartAt = playersTurn;

  deck.shuffle();
  for( player in players ){
   thisPlayer = players[player];
   evalCards(dealCards(2, thisPlayer));
  }
  
  players[playersTurn].setConsoleColor("blue");

 },
 blind = 1,
 bestHand = {
     score:0,
     hand:[],
    },
 comunityCards = [],
 deck = new Deck(),
 dealer = 0,
 gamePhase = 0,
 minimumBet = blind,
 players = [],
 playersTurn = 0,
 table = new Table(),
 turnStartAt = 0,
 gameStarted = false,
 init = function(){
  addPlayer("Tobis");
  addPlayer("Molle");
  addPlayer("Vera");
  addPlayer("Niklas");
  startGame();
 };
 Card.prototype.toString = function(){
  return getVal(this.denomination) + " of " + this.color;
 };
 Deck.prototype.toString = function(){
  var cardsInDeck = ["Gears:","Search:","Links:","Wrench:"],
   cards = this.cards,
   card;
  for (var i = cards.length - 1; i >= 0; i--) {
   card = cards[i];
   cardsInDeck[card.color] += getVal(card.denomination, true); break;
  }

  return "Cards still in the deck: " + cardsInDeck.join(",");
 };
 Deck.prototype.shuffle = function () {
  this.gatherCards();
  for(var j, x, i = this.cards.length; i; j = parseInt(Math.random() * i, 10), x = this.cards[--i], this.cards[i] = this.cards[j], this.cards[j] = x);
   return this.cards;
 };
 Deck.prototype.gatherCards = function(){
  var table,
  deckElement,
  player,
  card;
  table = document.getElementById("table");
  deckElement = document.getElementById("deck");
  for ( player in players){
   for ( card in players[player].hand){
    players[player].hand[card].element.style.left = 0 + "px";
    players[player].hand[card].element.style.msTransform = "rotate(" + Math.floor(Math.random()*5) + "deg)";
    players[player].hand[card].element.style.msTransformOrigin = "center";
    players[player].hand[card].element.style.webkitTransform = "rotate(" + Math.floor(Math.random()*5) + "deg)";
    players[player].hand[card].element.style.webkitTransformOrigin = "center";
    while (players[player].hand[card].element.firstChild) {
     players[player].hand[card].element.removeChild(players[player].hand[card].element.firstChild);
    }
    deckElement.appendChild(players[player].hand[card].element);
    this.cards.push(players[player].hand[card]);
   }
  }
  for (card in comunityCards ){
   comunityCards[card].element.style.left = 0 +"px";
   comunityCards[card].element.style.msTransform = "rotate(" + Math.floor(Math.random()*5) + "deg)";
   comunityCards[card].element.style.msTransformOrigin = "center";
   while (comunityCards[card].element.firstChild) {
    comunityCards[card].element.removeChild(comunityCards[card].element.firstChild);
   }
   deckElement.appendChild(comunityCards[card].element);
   this.cards.push(comunityCards[card]);
  }
 };
 Player.prototype.toString = function () {
  return this.name + (this.name.charAt(this.name.length-1) === "s" ? "'" : "'s") + " hand:" + this.hand.toString();
 };
 init();
})();