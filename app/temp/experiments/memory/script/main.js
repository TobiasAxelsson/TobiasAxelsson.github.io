(function(){
"use strict";

document.getElementsByTagName('input')[0].addEventListener("click", start);
function start (){
	var n = 0,
		score = 0,
		scoreEvent = new Event("addScore"),
		startElem,
		gameBoard = document.getElementById('game'),
		d = document.createElement("div"),
		scoreElement = document.createElement("span"),
		selectedCards = [],
		cardList;
// 		does events bubble sidways or only up?
// 		should prolly have this on the scoreboard but this works...
	document.addEventListener("addScore", addScore);
	d.innerHTML="Score: ";
	scoreElement.innerHTML=score;
	d.appendChild(scoreElement);
	gameBoard.appendChild(d);

	function advance (nOfPairs){
		var cardList = [],
			game = document.getElementById("game");
		[].forEach.call(game.querySelectorAll("figure"), function (v){
			game.removeChild(v);
		});
		cardList.length = 0;
		for (var i = 0; i < nOfPairs; i++){
			n++;
			cardList.push({found:false, group:n,element:document.importNode(newCard(n), true)});
			cardList.push({found:false, group:n,element:document.importNode(newCard(n), true)});
		}
		cardList.sort(function(currVal, nextVal){
			return Math.random() - 0.5;
		});
		cardList.forEach(function(v, i, a){
			var lm = v.element.querySelector("figure");
			lm.querySelector("img").className = "hidden";
			lm.addEventListener("click", function(ev){
				lm.querySelector("img").className = "visible";
				setTimeout(function(){select(v)}, 600);
			});
			v.element = gameBoard.appendChild(lm);
		});
		return cardList;
	}
	function newCard (n){
		var template = document.querySelector('#card');
		template.content.querySelector("img").src =
			"http://lorempixel.com/200/200/animals/" + n;
		return template.content;
	}
	function compareCards(v){
		return(v.group === this.group);
	}
	function select(selectedCard){
		console.log(selectedCard)
		selectedCards.push(selectedCard);
		if (selectedCards.length > 1 ){
			if (selectedCards.every(compareCards, selectedCard)){
// 				pairs
				document.dispatchEvent(scoreEvent);
				selectedCards.forEach(function(v){
					console.log(v);
					v.found = true;
				})
			} else {
// 				mismatch
				selectedCards.forEach(function(v,i,a){
					var element = v.element.querySelector("img");
					element.className="hidden";
				});
			}
			selectedCards.length = 0;
			if (cardList.every(function(v){
				return v.found === true;
			})){
				console.log("starting over");
				advance(3);
			};
		}
	}
	function addScore(){
		score++;
		scoreElement.innerHTML=score;
	}
//Init
	startElem = document.getElementById("start");
	startElem.style.display = "none";
	cardList = advance(3);
}
}());
