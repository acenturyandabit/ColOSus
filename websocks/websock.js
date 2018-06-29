$(document).ready(()=>{
	socket=new WebSocket("ws://localhost:8234");
	$("body").append("Websock connection started!");
	socket.onopen=()=>{
		socket.send("Here's some text that the server is urgently awaiting!"); 
	}
	
	socket.onmessage=function respond(e){
		$("body").append(e.data);
	}
	
});