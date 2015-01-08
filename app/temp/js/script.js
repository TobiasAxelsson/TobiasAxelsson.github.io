"use strict";
var xhr = new XMLHttpRequest(),
	url = "https://public-api.wordpress.com/rest/v1/sites/fend14tobis.wordpress.com/posts/";

function parsePosts(posts){
	"use strict";
	var main = document.getElementsByTagName('main')[0];
	for (var i = 0; i < posts.length; i++) {
		main.appendChild(createArticle(posts[i]));
	}
}
function createArticle(post){
	"use strict";
	var article = document.createElement("article"),
		title = document.createElement("h2"),
		section = document.createElement("section"),
		readMoreLink = document.createElement("a"),
		metaP = document.createElement("p"),
		small = document.createElement("small"),
		span = document.createElement("span"),
		datetime = document.createElement("datetime"),
		publishedDate,
		publishedSpan,
		modifiedDate,
		modifiedSpan,
		author,
		temp;

	title.innerHTML = post.title;

	publishedDate = datetime.cloneNode(false);
	publishedDate.setAttribute("datetime", post.date);
	temp = new Date(post.date);
	publishedDate.innerHTML = temp.toLocaleDateString("sv-SE");

	publishedSpan = span.cloneNode(false);
	publishedSpan.innerHTML = "Published: ";
	publishedSpan.appendChild(publishedDate);
	publishedSpan.className = "published";

	modifiedDate = datetime.cloneNode(false);
	modifiedDate.setAttribute("datetime", post.modified);
	temp = new Date(post.modified);
	modifiedDate.innerHTML = temp.toLocaleDateString("sv-SE");

	modifiedSpan = span.cloneNode(false);
	modifiedSpan.innerHTML = "Modified: ";
	modifiedSpan.appendChild(modifiedDate);
	modifiedSpan.className = "modified";

	author = span.cloneNode(false);
	author.innerHTML = "Written by: " + post.author.name;
	author.className = "author";

	small.appendChild(publishedSpan);
	small.appendChild(modifiedSpan);
	small.appendChild(author);

	metaP.appendChild(small);

	section.innerHTML = post.excerpt;

	readMoreLink.setAttribute("href", post.URL);
	readMoreLink.className = "more_link";
	readMoreLink.innerHTML = "Read more...";

	article.appendChild(title);
	article.appendChild(metaP);
	article.appendChild(section);
	article.appendChild(readMoreLink);
	return article;
}
//Yepp below is a ripoff from http://www.w3schools.com/json/json_http.asp
//I guess its just checking for a change of state in the xhr object and 
//checks if for the "OK" parameters to continue the process of parsing the 
//response
xhr.onreadystatechange = function(){
	"use strict";
	if (xhr.readyState === 4 && xhr.status === 200){
		var response = JSON.parse(xhr.responseText);
		parsePosts(response.posts);
	}
};
xhr.open("GET", url, true);
xhr.send();
