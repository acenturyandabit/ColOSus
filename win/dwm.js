///GENERIC

var idStor={};
function gen_uid(){
	do{
		var rid=Math.floor(Math.random()*1000);
	}while (idStor[rid]);
	idStor[rid]=true;
	return rid;
}

$(document).ready(()=>{
	$("body").on("mouseup",moveEnd);
	$("body").on("mousedown",defocus_all);
	$("body").on("mousemove",moveCont);



	//initially associate all predefined windows
	$("#desktop>.window").each((i,e)=>{
		e.children[0].addEventListener("mousedown",moveStart);
		e.children[0].children[0].addEventListener("mousedown",closeWnd);
		e.addEventListener("mousedown",focusWnd);
		/*
		// Create the taskbar icon - not done because we're hiding them soon anyways
		newIco=$("#proto>.wnd_barItem")[0].cloneNode(true);
		newIco.id="i_"+e.id;
		$("#winlist").append(newIco);
		newIco.addEventListener("click",wndIconClick);
		*/
	});

	//hide every initial window
	$("#desktop>.window").hide();

	///debugging
	init ("testing");
	//newUser();
});
/////MOVING WINDOWS AROUND
var movTarg;
var moving=false;

function moveStart(e){
	movTarg=e.currentTarget.parentElement;
	movTarg.dataset.delX=e.pageX-movTarg.offsetLeft;
	movTarg.dataset.delY=e.pageY-movTarg.offsetTop;
	moving=true;
	//movTarg.dataset.moving=true;
}

function moveCont(e){
	if (moving){
		movTarg.style.left=(e.pageX-movTarg.dataset.delX)+"px";
		movTarg.style.top=(e.pageY-movTarg.dataset.delY)+"px";
		var updateData={
			uuid: movTarg.id,
			pos: {y:movTarg.style.top, x:movTarg.style.left},
			width: movTarg.style.width,
			height: movTarg.style.height,
		}
		remoteUpdateWindow(updateData);
	}
}
function moveEnd(e){
	moving=false;
}
//////////WINDOW FOCUS
function defocus_all(){
	$(".window").each((i,e)=>{
		e.classList.remove("focused");
	});
	$(".barItem").each((i,e)=>{
		e.classList.remove("focused");
	});
}

function focusWnd(e){
	try{
		e.stopImmediatePropagation();
		e=e.currentTarget;
	}catch (err){
	}
	defocus_all();
	e.classList.add("focused");
	$("#i_"+e.id)[0].classList.add("focused");
	e.dataset.preW=e.style.width;
	e.dataset.preH=e.style.height;
}

function checkResize(e){
	if (e.currentTarget){
		e.stopImmediatePropagation();
		e=e.currentTarget;
	}
	if (e.style.height-e.dataset.preH!=0 || e.style.width-e.dataset.preW!=0){
		var updateData={
			id: e.id,
			top: e.style.top,
			left: e.style.left,
			width: e.style.width,
			height: e.style.height,
		}
		remoteUpdateWindow(updateData);
	}
}

//////// taskbar
function wndIconClick(e){
	focusWnd($("#"+e.currentTarget.id.substring(2))[0]);

}


////////



////Remotes
function remoteMakeWindow(data){
	//Window was made by an external entity. Fill in details as provided.
	var newWnd;
	// data is a JSON object

	newWnd=$("#proto>.window")[0].cloneNode(true);
	newWnd.id=data.uuid;
	$("#desktop").append(newWnd);
	newWnd.children[0].addEventListener("mousedown",moveStart);
	newWnd.children[0].children[1].addEventListener("mousedown",closeWnd);
	newWnd.addEventListener("mousedown",focusWnd);
	newWnd.append(document.createElement("iframe"));
	newWnd.children[1].src=data.src;
	newWnd.style.top=data.pos.x;
	newWnd.style.left=data.pos.y;
	newWnd.style.width=data.width;
	newWnd.style.height=data.height;


	// Create the taskbar icon
	newIco=$("#proto>.wnd_barItem")[0].cloneNode(true);
	newIco.id="i_"+newWnd.id;
	$("#winlist").append(newIco);
	newIco.addEventListener("click",wndIconClick);
}

function remoteWindowUpdated(data){
	wnd=$("#"+data.uuid)[0];
	wnd.style.top=data.pos.x;
	wnd.style.left=data.pos.y;
	wnd.style.width=data.width;
	wnd.style.height=data.height;
}

////creating windows
//byExt is true means this window was not made by the user


function remoteCloseWnd(id){
	//for an ordinary window:
	//detach window from DOM
	$("#"+id)[0].remove();
	opWnd.remove();
	//detach taskbar icon from DOM
	var tbIt=$("#i_"+id)[0];
	tbIt.remove();

}
function closeWnd(e){
	var opWnd=e.currentTarget.parentElement.parentElement;
	var wid=opWnd.id;
	//for an ordinary window:
	//detach window from DOM
	opWnd.remove();
	//detach taskbar icon from DOM
	var tbIt=$("#i_"+wid)[0];
	tbIt.remove();
	e.stopImmediatePropagation();
}

function makeWindow(appname){



	//Forward the request to the server
	remoteNewWindow(appname);
}
/*Old version:


	// Create the window div
	newWnd=$("#proto>.window")[0].cloneNode(true);
	newWnd.id=gen_uid();
	$("#desktop").append(newWnd);
	newWnd.children[0].addEventListener("mousedown",moveStart);
	newWnd.children[0].children[1].addEventListener("mousedown",closeWnd);
	newWnd.addEventListener("mousedown",focusWnd);



	//Handle special windows
	try{
		newWnd.append($("#"+appname)[0]);
		newWnd.children[0].children[0].innerText=$("#"+appname)[0].dataset.appname;
	}catch (e){

		newWnd.append(document.createElement("iframe"));
		newWnd.children[1].src=appname;
	}

	// Create the taskbar icon
	newIco=$("#proto>.wnd_barItem")[0].cloneNode(true);
	newIco.id="i_"+newWnd.id;
	$("#winlist").append(newIco);
	newIco.addEventListener("click",wndIconClick);
	//newIco.addEventListener("click",focusWindow);
	focusWnd(newWnd);
	$("#startMenu").hide();

	//report to remote
	var datapackage={};
	datapackage.appname=appname;
	datapackage.top=newWnd.style.top;
	datapackage.left=newWnd.style.left;
	datapackage.height=newWnd.style.height;
	datapackage.width=newWnd.style.width;
	datapackage.id=newWnd.id;
	remoteNewWindow(datapackage);
}
*/
////USER STUFFS MANANAGEMENT
function newUser(){//create an external user. not called when self is created.

	//create new user box
	newUBox=$("#proto>.uBox")[0].cloneNode(true);
	newUBox.id=gen_uid();
	$("#desktop").append(newUBox);


	newIco=$("#proto>.usr_barItem")[0].cloneNode(true);
	newIco.id="i_"+newUBox.id;
	$("#winlist").append(newIco);



}




// clicking the charm
function showStartMenu(){
	$("#startMenu").toggle();


}



//link it to a firebase backend, so you can collab edit a textbox


//move viewport.

//abstracted window content link?



/*
	//make dragging the view work.


Poll a file storage to get a list of files
Open up a text file.
A little taskbar for each window: save, run


User shenanigans:
remember user data position?

// detect which OS we're on and show the respective toolbar.

AIM:
- to be able to literally code this from a web browser, and code it collaboratively.
- Javascript/html/css as a first language. cos y not









*/
