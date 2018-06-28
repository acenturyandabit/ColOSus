$(document).ready(()=>{
	$("body").on("mouseup",moveEnd);
	$("body").on("mousemove",moveCont);
	// detect which OS we're on and show the respective toolbar.
	
	
	
});

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




function makeWindow(){
	// Create the window div
	newWnd=$("#proto>.window")[0].cloneNode(true);
	$("#desktop").append(newWnd);
	
	// Create the taskbar icon
	
	
	// Add handlers 
	newWnd.children[0].addEventListener("mousedown",moveStart);
	
	
}



// clicking the charm
function showStartMenu(){
	$("#startMenu").toggle();
	
	
}