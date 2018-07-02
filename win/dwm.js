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
	
	if (e.currentTarget){
		e.stopImmediatePropagation();
		e=e.currentTarget;
	}
	defocus_all();
	e.classList.add("focused");
	$("#i_"+e.id)[0].classList.add("focused");
	
}

//////// taskbar
function wndIconClick(e){
	focusWnd($("#"+e.currentTarget.id.substring(2))[0]);
	
}


////////

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


function makeWindow(){
	// Create the window div
	newWnd=$("#proto>.window")[0].cloneNode(true);
	newWnd.id=gen_uid();
	$("#desktop").append(newWnd);
	newWnd.children[0].addEventListener("mousedown",moveStart);
	newWnd.children[0].children[0].addEventListener("mousedown",closeWnd);
	newWnd.addEventListener("mousedown",focusWnd);
	
	
	//load in the iframe
	newWnd.children[1].src=$("#wndSourceText")[0].value;
	
	// Create the taskbar icon
	newIco=$("#proto>.wnd_barItem")[0].cloneNode(true);
	newIco.id="i_"+newWnd.id;
	$("#winlist").append(newIco);
	newIco.addEventListener("click",wndIconClick);
	//newIco.addEventListener("click",focusWindow);
	
	
	focusWnd(newWnd);
	
	$("#startMenu").hide();
}

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
