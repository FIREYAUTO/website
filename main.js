const DefaultURL = "https://fireyauto.github.io/website/"
const HeaderLinks = {
	"Home":"index.html",
	"JavaScript Editor":"jseditor.html",
	"JavaScript Console Editor":"jsconsoleeditor.html",
	"XBS Editor":"xbseditor.html",
	"Epoxy Editor":"epoxyeditor.html",
	"SingleScript Editor":"singlescripteditor.html",
};

const HeaderNav = document.getElementById("header-nav");

for(let Name in HeaderLinks){
	let A = document.createElement("a");
	A.href=DefaultURL+HeaderLinks[Name];
	A.innerHTML=Name;
	HeaderNav.appendChild(A);
}
