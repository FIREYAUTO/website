const WindowGlobals = "window self document name location customElements history locationbar menubar personalbar scrollbars statusbar toolbar status closed frames length top opener parent frameElement navigator origin external screen innerWidth innerHeight scrollX pageXOffset scrollY pageYOffset visualViewport screenX screenY outerWidth outerHeight devicePixelRatio clientInformation screenLeft screenTop defaultStatus defaultstatus styleMedia onsearch isSecureContext performance onappinstalled onbeforeinstallprompt crypto indexedDB webkitStorageInfo sessionStorage localStorage onbeforexrselect onabort onblur oncancel oncanplay oncanplaythrough onchange onclick onclose oncontextmenu oncuechange ondblclick ondrag ondragend ondragenter ondragleave ondragover ondragstart ondrop ondurationchange onemptied onended onerror onfocus onformdata oninput oninvalid onkeydown onkeypress onkeyup onload onloadeddata onloadedmetadata onloadstart onmousedown onmouseenter onmouseleave onmousemove onmouseout onmouseover onmouseup onmousewheel onpause onplay onplaying onprogress onratechange onreset onresize onscroll onsecuritypolicyviolation onseeked onseeking onselect onslotchange onstalled onsubmit onsuspend ontimeupdate ontoggle onvolumechange onwaiting onwebkitanimationend onwebkitanimationiteration onwebkitanimationstart onwebkittransitionend onwheel onauxclick ongotpointercapture onlostpointercapture onpointerdown onpointermove onpointerup onpointercancel onpointerover onpointerout onpointerenter onpointerleave onselectstart onselectionchange onanimationend onanimationiteration onanimationstart ontransitionrun ontransitionstart ontransitionend ontransitioncancel onafterprint onbeforeprint onbeforeunload onhashchange onlanguagechange onmessage onmessageerror onoffline ononline onpagehide onpageshow onpopstate onrejectionhandled onstorage onunhandledrejection onunload alert atob blur btoa cancelAnimationFrame cancelIdleCallback captureEvents clearInterval clearTimeout close confirm createImageBitmap fetch find focus getComputedStyle getSelection matchMedia moveBy moveTo open postMessage print prompt queueMicrotask releaseEvents reportError requestAnimationFrame requestIdleCallback resizeBy resizeTo scroll scrollBy scrollTo setInterval setTimeout stop webkitCancelAnimationFrame webkitRequestAnimationFrame originAgentCluster trustedTypes speechSynthesis onpointerrawupdate crossOriginIsolated scheduler openDatabase webkitRequestFileSystem webkitResolveLocalFileSystemURL chrome caches cookieStore ondevicemotion ondeviceorientation ondeviceorientationabsolute showDirectoryPicker showOpenFilePicker showSaveFilePicker TEMPORARY PERSISTENT addEventListener dispatchEvent removeEventListener Error SyntaxError RangeError Object String Number Boolean Array Map Set WeakMap WeakSet Infinity NaN isNaN isFinite parseFloat parseInt eval Math JSON".split(" ");

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
				match:`\\${"\`".toHTMLChar()}.*?\\${"\`".toHTMLChar()}`,
				types:"gms",
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
	XBS:function(Code){
		let Matches = [
			{
				name:"Comment",
				match:"\\#\\&gt;.*\\&lt;\\#",
				types:"gms",
			},
			{
				name:"Comment",
				match:"(?<!(\\&lt;|\\\".*?))\\#(?!(\\&gt;|.*?\\\")).*",
			},
			{
				name:"String",
				match:`\\${"\"".toHTMLChar()}.*?\\${"\"".toHTMLChar()}`,
			},
			{
				name:"String",
				match:`\\${"\`".toHTMLChar()}.*?\\${"\`".toHTMLChar()}`,
				types:"gms",
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
				name:"Call",
				match:"(?<=\\w+(\\&lt\\;const\\&gt\\;)*\\s*\\:\\s*)\\w+",
			},
			{
				name:"Index",
				match:"(?<=\\.)([A-Za-z_\\$][A-Za-z_0-9\\$]+)",
			},
			{
				name:"Boolean",
				match:"\\&lt\\;const\\&gt\\;",
			},
			{
				name:"Keyword",
				match:"(?<!\\.)(\\b(set|let|const|func|send|while|as|in|of|foreach|for|upvar|settype|locktype|del|unset|define|continue|stop|chunk|stackup|exit|class|extends|exclude|using|if|elif|else|new|with|destruct|isa|swap|switch|def|case|repeat|try|catch|finally|each|lockvar)\\b)",
			},
			{
				name:"Global",
				match:"(?<!\\.)(\\b(log|warn|info|error|window|document|console|inf|nan|object|tostring|toint|tofloat|type|load|time|delay|rawget|rawset|string|array|math|getlocalenv|env)\\b)",
			},
			{
				name:"Method",
				match:"(\\b(construct|super|self|__add|__sub|__div|__mul|__pow|__mod|__setindex|__index|__eq|__lt|__gt|__geq|__neq|__leq|__call|__tostring|__unm|__floordiv)\\b)",
			},
			{
				name:"Boolean",
				match:"(\\b(true|false|null)\\b)",
			},
			{
				name:"Call",
				match:"\\@\\w+(?=\\s*\\=)",
			},
			{
				name:"Method",
				match:"(?<=\\w+\\s*\\:{2})\\w+",
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
	Epoxy:function(Code){
		let Matches = [
			{
				name:"Comment",
				match:"\\-{2}\\[{2}.*?\\-{2}\\]{2}",
				types:"gms",
			},
			{
				name:"Comment",
				match:"\\-{2}.*",
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
				name:"Method",
				match:"(?<=\\>{2})([A-Za-z_\\$][A-Za-z_0-9\\$]+)(?=\\s*\\()"
			},
			{
				name:"Index",
				match:"(?<=\\.)([A-Za-z_\\$][A-Za-z_0-9\\$]+)",
			},
			{
				name:"Keyword",
				match:"(?<!\\.)(\\b(var|const|fn|while|loop|iter|do|cls|as|in|of|if|elseif|else|break|continue|return|then|dvar|del|switch|case|default)\\b)",
			},
			{
				name:"Global",
				match:"(?<!\\.)(\\b(log|warn|error|type|wait|time|getenv|async|tostring|toint|tofloat|assert|string|array|bit|thread|math|json|regex|debug)\\b)",
			},
			{
				name:"Boolean",
				match:"(\\b(true|false|null)\\b)",
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
