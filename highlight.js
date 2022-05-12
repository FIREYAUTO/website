const WindowGlobals = "window self document name location customElements history locationbar menubar personalbar scrollbars statusbar toolbar status closed frames length top opener parent frameElement navigator origin external screen innerWidth innerHeight scrollX pageXOffset scrollY pageYOffset visualViewport screenX screenY outerWidth outerHeight devicePixelRatio clientInformation screenLeft screenTop defaultStatus defaultstatus styleMedia onsearch isSecureContext performance onappinstalled onbeforeinstallprompt crypto indexedDB webkitStorageInfo sessionStorage localStorage onbeforexrselect onabort onblur oncancel oncanplay oncanplaythrough onchange onclick onclose oncontextmenu oncuechange ondblclick ondrag ondragend ondragenter ondragleave ondragover ondragstart ondrop ondurationchange onemptied onended onerror onfocus onformdata oninput oninvalid onkeydown onkeypress onkeyup onload onloadeddata onloadedmetadata onloadstart onmousedown onmouseenter onmouseleave onmousemove onmouseout onmouseover onmouseup onmousewheel onpause onplay onplaying onprogress onratechange onreset onresize onscroll onsecuritypolicyviolation onseeked onseeking onselect onslotchange onstalled onsubmit onsuspend ontimeupdate ontoggle onvolumechange onwaiting onwebkitanimationend onwebkitanimationiteration onwebkitanimationstart onwebkittransitionend onwheel onauxclick ongotpointercapture onlostpointercapture onpointerdown onpointermove onpointerup onpointercancel onpointerover onpointerout onpointerenter onpointerleave onselectstart onselectionchange onanimationend onanimationiteration onanimationstart ontransitionrun ontransitionstart ontransitionend ontransitioncancel onafterprint onbeforeprint onbeforeunload onhashchange onlanguagechange onmessage onmessageerror onoffline ononline onpagehide onpageshow onpopstate onrejectionhandled onstorage onunhandledrejection onunload alert atob blur btoa cancelAnimationFrame cancelIdleCallback captureEvents clearInterval clearTimeout close confirm createImageBitmap fetch find focus getComputedStyle getSelection matchMedia moveBy moveTo open postMessage print prompt queueMicrotask releaseEvents reportError requestAnimationFrame requestIdleCallback resizeBy resizeTo scroll scrollBy scrollTo setInterval setTimeout stop webkitCancelAnimationFrame webkitRequestAnimationFrame originAgentCluster trustedTypes speechSynthesis onpointerrawupdate crossOriginIsolated scheduler openDatabase webkitRequestFileSystem webkitResolveLocalFileSystemURL chrome caches cookieStore ondevicemotion ondeviceorientation ondeviceorientationabsolute showDirectoryPicker showOpenFilePicker showSaveFilePicker TEMPORARY PERSISTENT addEventListener dispatchEvent removeEventListener Error SyntaxError RangeError".split(" ");

String.prototype.escapeHTML = function(){
	let v = this.replace(/\&/g,"&amp;");
    v = v.replace(/\</g,"&lt;");
    v = v.replace(/\"/g,"&quot;");
    v = v.replace(/\>/g,"&gt;");
    v = v.replace(/\'/g,"&apos;");
    return v;
}

String.prototype.isHTMLChar = function(Char){
	return (this=="&lt;"&&Char=="<")||(this=="&gt;"&&Char==">")||(this=="&quot;"&&Char=="\"")||(this=="&amp;"&&Char=="&")||(this=="&apos;"&&Char=="'")
}

String.prototype.toHTMLChar = function(){
	return {"\"":"&quot;","'":"&apos;","<":"&lt;",">":"&gt;","&":"&amp;"}[this];
}

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
			if(!MA.hasOwnProperty("matches")){
				Result=REP(Result,REX,RCT(HighlightColors[MA.name]));
				DidMatch=R!=Result;
			}else if(Result.match(REX)){
				let RES=IterateMatches(Result,MA.matches);
				DidMatch=R!=RES;
				if(!DidMatch)Result=REP(Result,REX,RCT(HighlightColors[MA.name]));
				else {
					Result=RES;
					continue;
				}
			}
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
				match:`\\${"\"".toHTMLChar()}.*?\\${"\"".toHTMLChar()}`,
			},
			{
				name:"String",
				match:`\\${"'".toHTMLChar()}.*?\\${"'".toHTMLChar()}`,
			},
			{
				name:"Number",
				match:"(?<!\\w+)((0(x[A-Fa-f0-9]+|(b[0-1]+))|((?<!\\.)\\.[0-9]+(e[\\+\\-]?[0-9]+)?)|([0-9]+(\\.[0-9]+)?(e[\\+\\-]?[0-9]+)?)))(?!\\w+)",
			},
			{
				name:"Method",
				match:"(?<=\\.)([A-Za-z_\\$][A-Za-z_0-9\\$]+)(?=\\s*\\()"
			},
			{
				name:"Index",
				match:"(?<=\\.)([A-Za-z_\\$][A-Za-z_0-9\\$]+)",
			},
			{
				name:"Keyword",
				match:"(?<!\\.)(\\b(var|const|let|function|while|do|for|in|of|async|await|return|yield|if|else|switch|case|default|break|continue|try|catch|finally|void|with|constructor|super|this|new|class|extends|throw)\\b)",
			},
			{
				name:"Keyword",
				match:"(\\b(get|set)\\b)(?=\\s*([A-Za-z_\\$][A-Za-z_0-0\\$]+)\\s*\\()",
			},
			{
				name:"Global",
				match:`(?<!\\.)(\\b(${WindowGlobals.join("|")})\\b)`,
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
				name:"Operator",
				match:"(\\+|\\-|\\&(gt|lt|amp|apos|quot)\\;|\\||\\~|\\*|\\/|\\^|\\!|\\:|\\?|\\.|\\,|\\%|\\=)",
			},
			{
				name:"Bracket",
				match:"(\\(|\\)|\\{|\\}|\\[|\\]|\\;)"
			},
		];
		return IterateMatches(Code,Matches);
	},
};
const HighlightCode = (Code,Language)=>{
	if(!Language)Language="JavaScript";
	return HighlightTypes[Language](Code);
};

const CheckHighlightElements = ()=>{
	const HighlightElements = document.querySelectorAll("[highlighted]");
	HighlightElements.forEach(x=>{
		let lang=x.getAttribute("highlight-language");
		x.innerHTML = HighlightCode(x.innerText.escapeHTML(),lang);
		x.removeAttribute("highlighted");
		if(lang)x.removeAttribute("highlight-language");
	});	
};

CheckHighlightElements();
