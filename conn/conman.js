
//firebase stuffs
var fbConnItem;
var fbConfig;

function loadFirebase(_dataItemName, config){
	_dataItemName=_dataItemName.replace(" ","_");
	fbConnItem=_dataItemName;
	fbConfig=config;
	var include=document.createElement("script");
	include.src="https://www.gstatic.com/firebasejs/5.2.0/firebase-app.js";
	include.async=false;
	document.head.append(include);
	include=document.createElement("script");
	include.src="https://www.gstatic.com/firebasejs/5.2.0/firebase-database.js";
	include.async=false;
	document.head.append(include);
	include=document.createElement("script");
	include.src="conn/comms-firebase.js";
	include.async=false;	
	document.head.append(include);
	//this is automatically done in firebase conn, just to make sure the script is loaded.
	//init(constring);
}


//websock stuffs
var wsAddress;
var wsSessionID;
function loadWebsocket(){
	var include=document.createElement("script");
	include.src="conn/comms-websock.js";
	include.async=false;
	document.head.append(include);
}

function tryconn(constring){
	if (constring.includes("fire-")){
		//Initialise the firebase API!
		var config = {
			apiKey: "AIzaSyDrIrnW3iawiKKp-lkPQlVfQCRc3aLohkw",
			authDomain: "colosus-e2eca.firebaseapp.com",
			databaseURL: "https://colosus-e2eca.firebaseio.com",
			projectId: "colosus-e2eca",
			storageBucket: "colosus-e2eca.appspot.com",
			messagingSenderId: "182351007208"
		};
		loadFirebase(constring,config);
	}else if (connstring.includes("ws-")){
		wsAddress="ws://localhost/ws";//will need to replace this with the default websock address
		wsSessionID=constring;
		loadWebsocket();
	}
	$('#splash').hide();
}

function advcon(type){
	switch(type){
		case 'firebase':
			var config=JSON.parse($("#firebaseConfig")[0].value);
			loadFirebase("ColOSus",config);
			
		break;
		case 'websocket':
			wsAddress=$("#websocketAddress")[0].value;
			wsSessionID="ColOSsus";
			loadWebsocket();
		break;
	}
	$('#splash').hide();
}