const selectMetadata=q=>document.head.querySelector(`meta[${q}]`);
const getMetadata=q=>{
	let m=selectMetadata(q);
	if(m)return m.getAttribute(q);
	return null;
}

window.onload = function(){
	const siteTitle=document.head.querySelector("title"),
	      pageName=getMetadata("page-name");
	if(siteTitle&&pageName)siteTitle.innerHTML=`${pageName} - ${siteTitle.innerHTML}`;
}

window.onbeforeunload = window.onbeforereload = function(){
	return "";
}
