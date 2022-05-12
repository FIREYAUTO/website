const DefaultURL = "https://fireyauto.github.io/website/"
const HeaderLinks = {
	"Home":"index.html",
	"JavaScript Editor":"jseditor.html",
};

const HeaderNav = document.getElementById("header-nav");

for(let Name in HeaderLinks){
	let A = document.createElement("a");
	A.href=DefaultURL+HeaderLinks[Name];
	A.innerHTML=Name;
	HeaderNav.appendChild(A);
}
