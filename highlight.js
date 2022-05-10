const ColorText =(t,c)=>`<span style="color:${c};">${t}</span>`;
const RCT=c=>ColorText("$&",c);
const REP = (Text,Reg,Rep)=>Text.replace(Reg,Rep);
const RE = (Text,Extra)=>{
	let e = new RegExp(`(${Text})(?![^<]*>|[^<>]*</)`,Extra);
	if (Extra&&Extra.match("m"))e.multiline=true;
	return e;
};
const HighlightColors = {
	Comment:"#8f8f8f",
	String:"#93dbff",
	Boolean:"#51ff7f",
	Number:"#63bbfe",
	Index:"#7dc5ff",
	Keyword:"#ff3a66",
	Global:"#ffa645",
	Method:"#ffd56c",
	Call:"#ce97ff",
	Operator:"#ff6295",
	Brackets:"#cfcfcf",
};

function IterateMatches(Result,M){
	for(let	MA of M){
		let DidMatch=true;
		if(MA.hasOwnProperty("match")){
			let REX=RE(MA.match,MA.types);
			let R=Result;
			Result=REP(Result,REX,RCT(HighlightColors[MA.name]));
			DidMatch=R!=Result;
		}
		if(MA.hasOwnProperty("matches")&&DidMatch)
			Result=IterateMatches(Result,MA.matches);
	}
	return Result;
}

const HighlightTypes = {
	JavaScript:function(Code){
		let Matches = [
			{
				name:"String",
				match:"\".*?\"",
			},
			{
				name:"String",
				match:"'.*?'",
			},
		];
		return IterateMatches(Code,Matches);
	},
};
const HighlightCode = (Code,Language)=>{
	if(!Language)Language="JavaScript";
	return HighlightTypes[Language](Code);
};

const HighlightElements = document.querySelectorAll("[highlighted]");

HighlightElements.forEach(x=>{
	x.innerHTML = HighlightCode(x.innerText,x.getAttribute("highlight-language"));	
});
