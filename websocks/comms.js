var socketHandles={};

function init (sessionID){
	socket=new WebSocket("ws://localhost:10023/ws");
	socket.onopen=()=>{
		var initialRequest={
			type:"registerActor"
		}
		// socket.send(JSON.stringify(initialRequest));

		socket.onmessage=function respond(e){
			recievedData=JSON.parse(e.data);
			if (socketHandles[recievedData.ins]){
				socketHandles[recievedData.ins](recievedData);
			}
		}
	}
}

/*
	registerActor: Registers a new client (actor) and gets a unique client ID

	registerActor request:
	{
		type: "registerActor"
	}

	registerActor response:
	{
		type: "registerActor",
		actorID: integer
	}
	- actorID is a unique ID which identifies the current client.
*/

var actorID;
socketHandles["registerActor"]=(data)=>{
	actorID=recievedData.actorID;
	// var gawRq={
	// 	type: "getAllWnd",
	// 	actorID: actorID
	// }
	// socket.send(JSON.stringify(gawRq));
}

/*
	getAllWnd: Gets all the windows in the workspace, for e.g. when a client enters an existing workspace or connection is lost.

	getAllWnd request:
	{
		type: "getAllWnd"
		actorID: integer
	}

	getAllWnd response:
	{
		type: "getAllWnd",
		actorID: integer,
		windows:{
			window-id-1:{
				top: integer,
				left: integer,
				width: integer,
				height: integer,
				src: integer // source for the iframe
			},
			window-id-2:{
				top: integer,
				left: integer,
				width: integer,
				height: integer,
				src: string // etc
			}
		}
	}

*/


// socketHandles["getAllWnd"]=(data)=>{
// 	for (var i of data.windows){
// 		var datapackage=data.windows[i];
// 		datapackage.id=i;
// 		remoteMakeWindow(datapackage);
// 	}
// }

/*
	newWnd: Client calls this to get a new window; and a response is sent to all clients to indicate a new window should be opened.

	newWnd request:
	{
		type: "newWnd"
		actorID: integer
		appName: string
	}

	newWnd response:
	{
		type: "newWnd",
		actorID: integer,
		id: string,
		src: string,
		top: integer,
		left: integer,
		width: integer,
		height: integer,
	}

*/

socketHandles["wopen"]=(data)=>{
	console.log(data)
	remoteMakeWindow(data);
}

//client should only request to launch an application
function remoteNewWindow(appid){
	var updateContent={
		ins: "launch",
		data: {appid :appid}
	};
	// updateContent=Object.assign(data,updateContent);
	socket.send(JSON.stringify(updateContent));
}

/*
	updateWnd: Client calls this when moving a window.

	updateWnd request:
	{
		type: "updateWnd"
		actorID: integer
		id: string,
		top: integer,
		left: integer,
		width: integer,
		height: integer,
	}

	updateWnd response:
	{
		type: "updateWnd"
		actorID: integer
		id: string,
		top: integer,
		left: integer,
		width: integer,
		height: integer,
	}

*/

socketHandles["wupdate"]=(data)=>{
	remoteWindowUpdated(data);
}

function remoteUpdateWindow(args){
	var updateContent={
		ins: "wupdate",
		date: args
	};
	// updateContent=Object.assign(data,updateContent);
	socket.send(JSON.stringify(updateContent));


}

/*
	closeWnd: Client calls this when closing a window.

	closeWnd request:
	{
		type: "closeWnd"
		actorID: integer
		id: string,
	}

	closeWnd response:
	{
		type: "closeWnd"
		actorID: integer
		id: string,
	}

*/
