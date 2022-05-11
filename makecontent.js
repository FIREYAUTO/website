const Apply = (a,b)=>{
		for(let k in b){
			let v=b[k];
			if(typeof v==="object")Apply(a[k],v);
			else a[k]=v;
		}
	}
		
	const Create = (t,p={},a)=>{
		let e=document.createElement(t);
		Apply(e,p);
		if(a)a.appendChild(e);
		return e;
	}
	
	const MatchText = t=>{
		t=t.replace(/\{{2}.*?\}{2}/g,function(x){
			return `<span class="small-code-block" highlighted highlight-language="${Language}">${x.match(/(?<=\{{2}).*(?=\}{2})/)}</span>`;
		});
		t=t.replace(/\{.*?\}/g,function(x){
			return `<span class="small-code-block">${x.match(/(?<=\{).*(?=\})/)}</span>`;
		});
		return t;	
	}
	
	for(let Name in ElementTable){
		let Elements = ElementTable[Name];
		Create("h1",{
			innerHTML:Name,
		},Content);
		if(Elements.Description){
			Create("p",{
				innerHTML:MatchText(Elements.Description),
			},Content);	
		}
		Create("hr",{},Content);
		for(let Element of Elements.Elements){
			if(Elements.Type=="Syntax"){
				Create("h2",{
					innerHTML:MatchText(`{${Element.Name}}`),
				},Content);
				const Holder = Create("div",{
					className:"quote-block",
				},Content);
				Create("p",{
					innerHTML:MatchText(Element.Description),
				},Holder);
				let pre = Create("pre",{
					className:"code-block",
					innerHTML:Element.Code,
				},Holder);
				pre.setAttribute("highlighted",true);
				pre.setAttribute("highlight-language",Language);
				if(Element.Example){
					Create("p",{innerHTML:"Example:"},Holder);
					let pre = Create("pre",{
						className:"code-block",
						innerHTML:Element.Example,
					},Holder);
					pre.setAttribute("highlighted",true);
					pre.setAttribute("highlight-language",Language);
				}
				Create("hr",{
					className:"small-hr"	
				},Content);
			}else if(Elements.Type=="Examples"){
				Create("p",{
					innerHTML:MatchText(Element.Description),
				},Content);
				let pre = Create("pre",{
					className:"code-block",
					innerHTML:Element.Code,
				},Content);
				pre.setAttribute("highlighted",true);
				pre.setAttribute("highlight-language",Language);
				Create("hr",{
					className:"small-hr"	
				},Content);
			}
		}
	}
CheckHighlightElements();
