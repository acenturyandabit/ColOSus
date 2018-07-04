var socketHandles={};

function init (sessionID){
	socket=new WebSocket("ws://localhost:8234?SID="+sessionID);
	socket.onopen=()=>{
		var initialRequest={
			type:"registerActor"
		}
		socket.send(JSON.stringify(initialRequest)); 
		
		socket.onmessage=function respond(e){
			recievedData=JSON.parse(e.data);
			if (socketHandles[recievedData.type]){
				socketHandles[recievedData.type](recievedData);
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
	var gawRq={
		type: "getAllWnd",
		actorID: actorID
	}
	socket.send(JSON.stringify(gawRq)); 
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


socketHandles["getAllWnd"]=(data)=>{
	for (var i of data.windows){
		var datapackage=data.windows[i];
		datapackage.id=i;
		remoteMakeWindow(datapackage);
	}
}

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

function initWorkspace(sessionID){
	var workspaceObject={};
	workspaceObject[sessionID]={
		wnds:{},
		updates:"",
		actorIDs:makeActorID()
	}
	firebase.database().ref().update(workspaceObject);
	sessionChunk=firebase.database().ref(sessionID);
	//start listening for updates
	updates=sessionChunk.child("updates");
	updates.on("value",(datasnapshot)=>{
		var updateContent=JSON.parse(datasnapshot.val());
		if (updateContent.actor==actorID)return;
		//dont handle own updates
		switch (updateContent.type){
			case "newWnd":
				remoteMakeWindow(updateContent.data);
				break;
			case "updateWnd":
				remoteWindowUpdated(updateContent.data);
				break;
		}
		
		
		
	});
	
}

function connectDone(){
	//Connect to an existing workspace
	
	//Generate a unique actor ID
	sessionChunk.child("actorIDs").once("value",(data)=>{
		var allActors=data.val().toString();
		var actorList=allActors.split("|");
		do{
			actorID=makeActorID();
		}while (actorList.includes(actorID));
		allActors=allActors+"|"+actorID;
		sessionChunk.child("actorIDs").set(allActors);
	});
	
	//Open all existing windows
	wndChunk=sessionChunk.child("wnds");
	//start listening for updates
	updates=sessionChunk.child("updates");
	updates.on("value",(datasnapshot)=>{
		var updateContent=JSON.parse(datasnapshot.val());
		if (updateContent.actor==actorID)return;
		//dont handle own updates
		switch (updateContent.type){
			case "newWnd":
				remoteMakeWindow(updateContent.data);
				break;
			case "updateWnd":
				remoteWindowUpdated(updateContent.data);
				break;
		}
		
		
		
	});

}

function remoteNewWindow(data){
	var updateContent={
		type: "newWnd",
		data: data,
		actor: actorID
	};
	var strOut = JSON.stringify(updateContent);
	sessionChunk.child("updates").set(strOut);
	//also update the static window register
	var staticContent={};
	var newkey=data.id;
	delete data.id;
	staticContent[newkey]=JSON.stringify(data);
	sessionChunk.child("wnds").update(staticContent);
}

function remoteUpdateWindow(data){
	var updateContent={
		type: "updateWnd",
		data: data,
		actor: actorID
	};
	var strOut = JSON.stringify(updateContent);
	sessionChunk.child("updates").set(strOut);
	
	//also update the static window register
	var staticContent={};
	var newkey=data.id;
	delete data.id;
	staticContent[newkey]=JSON.stringify(data);
	sessionChunk.child("wnds").update(staticContent);
}
