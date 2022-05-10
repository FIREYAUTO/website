const WebListener = (()=>{
	const AllowedOrigins = [
		"fireyauto.github.io",
		"js.do",
	];
	
	function checkIncomingOrigin(Origin){
		if(Origin.startsWith("http://"))return false;
		Origin=Origin.replace(/^https\:\/\//,"").replace(/^w{3}\./,"").match(/^[^\/]+/);
		return AllowedOrigins.includes(Origin);
	}
	
	const Receive=[],Sent=[];
	
	const Listener = {
		on(Name,Callback){
			let To=Name==="sent"?Sent:Name==="receive"?Receive:[];
			!To.includes(Callback)&&(To.push(Callback));
			return Callback;
		},
		send(Data,Origin){
			window.postMessage(Data,Origin);
			for(let C of Sent)C({data:Data,origin:Origin});
		},
	}
	
	window.addEventListener("message",Event=>{
		if(!checkIncomingOrigin(Event.origin))return;
		for(let C of Receive)C(Event);
	});

	return Listener;
})();
