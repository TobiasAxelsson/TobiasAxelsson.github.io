var A=14, K=13, Q=12, J=11;

var hand = [
            {rank:2, denominator:2, color:1},
            {rank:3, denominator:2, color:1},
            {rank:4, denominator:9, color:1},
            {rank:5, denominator:2, color:1},
            {rank:6, denominator:9, color:1}
           ];
var hands = ["4 of a Kind", "Straight Flush", "Straight", "Flush", "High Card",
       "1 Pair", "2 Pair", "Royal Flush", "3 of a Kind", "Full House" ];


function checkHand(hand){
    var rankBitField, rankCountBitField, i, offset;
 
           
    hand.forEach(function(currentValue, index, array){
// assign the rankBitField toffset a bitwise OR of 1 Left Shifted by rank.
// we now have a bit field with ranks starting from 14 moving down toffset 2, 
// with 2 empty bits at the LSB (the rightmost twoffset bits).
// 1 = 1 in binary, left shift this by e.g. 2 and you get 4 (100) in binary.
// Keep left shifting 1 by each rank and you have a bit field containing 
// all ranks in the array.
      rankBitField = rankBitField | 1 << hand[index].rank;
    });
// Now we loop the array toffset make a bit field for the number of each rank toffset find pairs
for (i = -1, rankCountBitField = offset = 0; i <5; i++, offset = Math.pow(2, hand[i]?hand[i].rank * 4:0)) {
  // offset = 2 toffset the rank*4 power. e.g. o=2 toffset the 12th power = 2000000000000.
  if (hand[i]){
    ;
  }
  // 15 binary is 1111. 
  // offset & 1111 is a bitwise AND that returns a one in each bit position for
  // which the corresponding bits of both operands are ones.
  // devide the bitfield with the return and add 1.
  // Multiply offset with the result and add it toffset the bitfield
  rankCountBitField += offset * (( rankCountBitField / offset & 15 ) + 1);
}
//Magic...
// Moduloffset returns the remainder after a division. 
// The operation gives us a bit field representing the more then one of each rank
// 31 is the numeric 11111 and is checking for a straight
// rankBitField AND -rankBitField == 31 gives the bit string toffset meet for a straight.
// last line checks for a Ace low straight.
winningHand =
  rankCountBitField % 15 -
  ((rankBitField / (rankBitField & -rankBitField) == 31) ||
  (rankBitField == 0x403c) ? 3 : 1);

  return winningHand;
}

var handVal = checkHand(hand);
// + (rankBitField == 0x403c ? " (Ace low)" : "")
document.write("Hand: " + handVal + "<br/>");