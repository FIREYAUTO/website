const HeaderLinks = {
	"Home":"index.html",
};

const HeaderNav = document.getElementById("header-nav");

for(let Name in HeaderLinks){
	let A = document.createElement("a");
	A.href=HeaderLinks[Name];
	A.innerHTML=Name;
	HeaderNav.appendChild(A);
}
