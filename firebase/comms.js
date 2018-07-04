//api
/*
	Client calls:

	function init(sessionId);
	[done]
	Initialises the current workspace. If a workspace with an id 'sessionID' exists in the server, this loads all existing windows.
	If there is no workspace with id 'sessionID', the server attempts to create a new workspace with id 'sessionID'.

	function remoteUpdateWindow(data);
	data{
		id,
		top,
		left,
		width,
		height
	}

	function remoteNewWindow(data);
	data{
		id,
		data, (iframe data)
		top,
		left,
		width,
		height
	}
	----
	Calls to client:

	function remoteWindowUpdated(data);


	function remoteMakeWindow(data);

	----
	Calls from server:
	window updated
	window created
	window get request response
	----
	Calls to server:
	initialise websock
	get actor code
	send update
	get all windows








*/


function makeActorID(){
	return Math.floor(Math.random()*1000);
}

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDrIrnW3iawiKKp-lkPQlVfQCRc3aLohkw",
    authDomain: "colosus-e2eca.firebaseapp.com",
    databaseURL: "https://colosus-e2eca.firebaseio.com",
    projectId: "colosus-e2eca",
    storageBucket: "colosus-e2eca.appspot.com",
    messagingSenderId: "182351007208"
};
firebase.initializeApp(config);

var actorID;
var sessionChunk;
function init(sessionID){
	sessionChunk = firebase.database().ref(sessionID);
	sessionChunk.once("value",(data)=>{
		if (data.val()){
			connectDone();
		}else{
			initWorkspace(sessionID);
		}
	});
}

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
	wndChunk.once("value",(datasnapshot)=>{
		datasnapshot.forEach(function (child){
			var datapackage=JSON.parse(child.val());
			datapackage.id=child.key;

			remoteMakeWindow(datapackage);
		});
	});
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
			case "closeWnd":
				remoteCloseWnd(updateContent.id);
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


function remoteCloseWindow(data){
	var updateContent={
		type: "closeWnd",
		id: id,
		actor: actorID
	};
	var strOut = JSON.stringify(updateContent);
	sessionChunk.child("updates").set(strOut);

	//also update the static window register
	sessionChunk.child("wnds").child(data.id).remove();
}
