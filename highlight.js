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
			let REX=RE(MA.match,MA.types||"g");
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
				name:"Comment",
				match:"\\/\\*.*?\\*\\/",
				types:"gms",
			},
			{
				name:"Comment",
				match:"\\/{2}.*",
			},
			{
				name:"String",
				match:"\".*?\"",
			},
			{
				name:"String",
				match:"'.*?'",
			},
			{
				name:"Number",
				match:"(?<!\\w+)((0(x[A-Fa-f0-9]+|(b[0-1]+))|((?<!\\.)\\.[0-9]+(e[\\+\\-]?[0-9]+)?)|([0-9]+(\\.[0-9]+)?(e[\\+\\-]?[0-9]+)?)))(?!\\w+)",
			},
			{
				name:"Index",
				match:"\\.([A-Za-z_\\$][A-Za-z_0-0\\$]+)",
			},
			{
				name:"Keyword",
				match:"(?<!\\.)(\\b(var|const|let|function|while|do|for|in|of|async|await|return|yield|if|else|switch|case|default|break|continue|try|catch|finally|void|with|constructor|super|this|new)\\b)",
			},
			{
				name:"Global",
				match:"(?<!\\.)(\\b(document|window|setTimeout|setInterval|clearInterval|RegExp|Proxy|Object|String|Number|Boolean|Map|Set|Array|BigInt|parseInt|parseFloat|json)\\b)",
			},
			{
				name:"Boolean",
				match:"(\\b(true|false|null|undefined)\\b)",
			},
			{
				name:"Call",
				match:"(?<!\\.\\s*)\\w+(?=\\()",
			},
			{
				name:"Bracket",
				match:"(\\(|\\)|\\{|\\}|\\[|\\]|\\;)"
			},
			{
				name:"Operator",
				match:"(\\+|\\-|\\>|\\<|\\|\\&|\\~|\\*|\\/|\\^|\\!|\\:|\\?|\\.|\\,|\\%|\\=)",
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
