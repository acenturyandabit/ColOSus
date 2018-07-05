var socketHandles={};

function init (sessionID){
	socket=new WebSocket(wsAddress);
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
init(wsSessionID);
var actorID;
socketHandles["registerActor"]=(data)=>{
	actorID=recievedData.actorID;
	// var gawRq={
	// 	type: "getAllWnd",
	// 	actorID: actorID
	// }
	// socket.send(JSON.stringify(gawRq));
}

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

socketHandles["wupdate"]=(data)=>{
	remoteWindowUpdated(data);
}

function remoteUpdateWindow(data){
	var updateContent={
		ins: "wupdate",
		uid: actorID,
		data: data
	};
	socket.send(JSON.stringify(updateContent));
}

function viewportPan(panX, panY){
	return;
}