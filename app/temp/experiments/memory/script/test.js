var t = document.querySelector("#card"),
    c = document.getElementById("game"),
    clone;
t.content.querySelector("img").src="http://lorempixel.com/200/200/animals/1";
console.log("ho");
clone = document.importNode(t.content, true);
console.log(clone, t.content);
clone.querySelector("img").addEventListener("click", function(ev){
  console.log("hau");
});
t = c.appendChild(clone);