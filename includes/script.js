	$(document).ready(function () {			   
		//add new chat client
		$('#onclickAdd').click(function (e) {
			e.preventDefault();
			//chat client variables		
			var currentIframe = {
				id: Math.floor((Math.random() * 10000) + 1),
				iframeSrc: "iframe.html",
				iframeName: prompt("Enter your Nickname to join", "")
			};
			//validation - user entered a nickname
			if (!currentIframe.iframeName) return;
			//add the chat to screen
			else addIframe(currentIframe);
		});
	});	 

		
    //add new iframe to DOM
    function addIframe(currentIframe) {
	var iframeTemplate = $('#iframe-template').html();
	var iframes = $('#allChats');
        iframes.append(Mustache.render(iframeTemplate, currentIframe));
		var iframeWin = document.getElementById(currentIframe.id).contentWindow;
		post(iframeWin, currentIframe.iframeSrc, currentIframe.iframeName, "userType");
    };
	
	
	//post Message
	function post(iframeWin, src, data, type){
		var allIframes = $("iframe").get().length;
		if (type=="userType")
		{		
			iframeWin.onload = function() {
			newUser(data +" has Joined!");
			};
		}		
		else 
			iframeWin.postMessage(data, window.location.href+src);//post msg to all iframes		
	}
	
	//new chat created
	function newUser(data) {
		parent.postMessage(data, "*");	
	}
	
	//new Chat Message
	function sendMsgToParent() {
		var currentSenderName = $('#nickname').html();
		var theMessage = $('#msg').val();
		//if msg is empty
		if (!theMessage) return
		parent.postMessage("[" + currentSenderName+"]: "+ theMessage, "*");	
	}
	
	//parent is listening
	function parentListenner(event){
		var newMsg = event.data;
		var newMsgTemplate = newMsg;
		var allIframes = $("iframe").get();
		for (var i=0; i<allIframes.length; i++)
		{
			var curIframe = allIframes[i];
			var curSrc = curIframe.src;
			post(curIframe.contentWindow, curSrc, newMsgTemplate, "msgType");
		}
	}
	
	if (window.addEventListener) window.addEventListener("message", parentListenner, false);
	else attachEvent("onmessage", parentListenner)
		