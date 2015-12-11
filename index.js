// create board
var b = jsboard.board({attach:"game", size:"8x8", style:"checkerboard"});
b.cell("each").style({width:"60px", height:"60px"});

// setup pieces
var wknight = jsboard.piece({text:"WK", textIndent:"-9999px", background:"url('images/chess/white/knight.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });
var wbishop = jsboard.piece({text:"WB", textIndent:"-9999px", background:"url('images/chess/white/bishop.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });
var wrook   = jsboard.piece({text:"WR", textIndent:"-9999px", background:"url('images/chess/white/rook.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });
var wqueen  = jsboard.piece({text:"WQ", textIndent:"-9999px", background:"url('images/chess/white/queen.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });
var wking   = jsboard.piece({text:"WG", textIndent:"-9999px", background:"url('images/chess/white/king.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });
var wpawn   = jsboard.piece({text:"WP", textIndent:"-9999px", background:"url('images/chess/white/pawn.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });


var bkknight = jsboard.piece({text:"BK", textIndent:"-9999px", background:"url('images/chess/black/knight.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });
var bkbishop = jsboard.piece({text:"BB", textIndent:"-9999px", background:"url('images/chess/black/bishop.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });
var bkrook   = jsboard.piece({text:"BR", textIndent:"-9999px", background:"url('images/chess/black/rook.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });
var bkqueen  = jsboard.piece({text:"BQ", textIndent:"-9999px", background:"url('images/chess/black/queen.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });
var bkking   = jsboard.piece({text:"BG", textIndent:"-9999px", background:"url('images/chess/black/king.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });
var bkpawn   = jsboard.piece({text:"BP", textIndent:"-9999px", background:"url('images/chess/black/pawn.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });


// create pieces to place in DOM
var pieces = [
    wknight.clone(),
    wknight.clone(),
    wbishop.clone(),
    wbishop.clone(),
    wrook.clone(),
    wrook.clone(),
    wqueen.clone(),
    wking.clone()
]

var turn = 'white';
/*function canMove()
{
    if((turn=='white' && b.cell(this.parentNode).get().indexOf('W')) || (turn=='black' && b.cell(this.parentNode).get().indexOf('B'))) 
        showMoves(this); 
}*/
function createPieces()
{
    for (var i=0; i<8; i++) 
        pieces.push(wpawn.clone());
    pieces.push(bkknight.clone());
    pieces.push(bkknight.clone());
    pieces.push(bkbishop.clone());
    pieces.push(bkbishop.clone());
    pieces.push(bkrook.clone());
    pieces.push(bkrook.clone());
    pieces.push(bkqueen.clone());
    pieces.push(bkking.clone());
    for (var i=0; i<8; i++) 
        pieces.push(bkpawn.clone());
    for (var i=0; i<pieces.length; i++) 
        pieces[i].addEventListener("click", function() {
            if((turn=='white' && b.cell(this.parentNode).get().indexOf('W')>-1) || (turn=='black' && b.cell(this.parentNode).get().indexOf('B')>-1)) 
                showMoves(this);
        });
}
/*for (var i=0; i<8; i++) 
    blackPieces.push(bkpawn.clone());
*/
// place pieces on board

// variables for piece to move and its locs
var bindMoveLocs, bindMovePiece;

// give functionality to pieces

function changeTurn()
{
    turn = turn=='white' ? 'black' : 'white';
}


/*function loadBoard(var progress)
{
	



}*/	
// show new locations 
function showMoves(piece) {

    resetBoard();
        
    // parentNode is needed because the piece you are clicking 
    // on doesn't have access to cell functions, therefore you 
    // need to access the parent of the piece because pieces are 
    // always contained within in cells

    // piece clicked on will be either: WK, WB, WR, WQ, WG, WP
    var thisPiece = b.cell(piece.parentNode).get();
    var newLocs = [];
    var loc;
    loc = b.cell(piece.parentNode).where();

    // movement for knights
    if (thisPiece=="WK" || thisPiece=="BK") {
        newLocs.push(
            [loc[0]-1,loc[1]-2], [loc[0]-1,loc[1]+2],
            [loc[0]-2,loc[1]-1], [loc[0]-2,loc[1]+1],
            [loc[0]+1,loc[1]-2], [loc[0]+1,loc[1]+2],
            [loc[0]+2,loc[1]-1], [loc[0]+2,loc[1]+1]
        );
    }

    // movement for pawns
    if (thisPiece=="WP") {
        newLocs.push([loc[0]-1,loc[1]]);
        if (loc[0]==6 && b.cell(newLocs[0]).get()==null) newLocs.push([loc[0]-2,loc[1]]); 
        if (b.cell([loc[0]-1,loc[1]+1]).get()!=null) newLocs.push([loc[0]-1,loc[1]+1]);
        if (b.cell([loc[0]-1,loc[1]-1]).get()!=null) newLocs.push([loc[0]-1,loc[1]-1]);
    }
    if (thisPiece=="BP") {
        newLocs.push([loc[0]+1,loc[1]]);
        if (loc[0]==1 && b.cell(newLocs[0]).get()==null) newLocs.push([loc[0]+2,loc[1]]);
        if (b.cell([loc[0]+1,loc[1]+1]).get()!=null) newLocs.push([loc[0]+1,loc[1]+1]);
        if (b.cell([loc[0]+1,loc[1]-1]).get()!=null) newLocs.push([loc[0]+1,loc[1]-1]);     
    }

    // movement for bishops
    // queen also moves like a bishop
    if (thisPiece=="WB"||thisPiece=="WQ" || thisPiece=="BB" || thisPiece=="BQ") {
        var check = 7;
        var accept = thisPiece.indexOf('W')==0 ? 'B' : 'W';
        // up left diagonal
        var ULD = [loc[0]-1,loc[1]-1];
        while (check>0) {
            if (b.cell(ULD).get()==null || b.cell(ULD).get().indexOf(accept)==0) { newLocs.push(ULD); ULD = [ULD[0]-1,ULD[1]-1]; } 
            check--;  
        }
        check = 7;
        // up right diagonal
        var URD = [loc[0]-1,loc[1]+1];
        while (check>0) {
            if (b.cell(URD).get()==null || b.cell(URD).get().indexOf(accept)==0) { newLocs.push(URD); URD = [URD[0]-1,URD[1]+1]; } 
            check--;  
        }
        check = 7;
        // down left diagonal
        var DLD = [loc[0]+1,loc[1]-1];
        while (check>0) {
            if (b.cell(DLD).get()==null || b.cell(DLD).get().indexOf(accept)==0) { newLocs.push(DLD); DLD = [DLD[0]+1,DLD[1]-1]; } 
            check--;  
        }
        check = 7;
        // down right diagonal
        var DRD = [loc[0]+1,loc[1]+1];
        while (check>0) {
            if (b.cell(DRD).get()==null || b.cell(DRD).get().indexOf(accept)==0) { newLocs.push(DRD); DRD = [DRD[0]+1,DRD[1]+1]; } 
            check--;  
        }
    }


    // movement for rooks
    // queen also moves like a rook
    if (thisPiece=="WR"||thisPiece=="WQ" || thisPiece=="BR" || thisPiece=="BQ") {
        var check = 7;
        var accept = thisPiece.indexOf('W')==0 ? 'B' : 'W';
        var U = [loc[0]-1,loc[1]];
        while (check>0) {
            if (b.cell(U).get()==null || b.cell(U).get().indexOf(accept)==0) { newLocs.push(U); U = [U[0]-1,U[1]]; } 
            check--;  
        }
        check = 7;
        // up right diagonal
        var L = [loc[0],loc[1]-1];
        while (check>0) {
            if (b.cell(L).get()==null || b.cell(L).get().indexOf(accept)==0) { newLocs.push(L); L = [L[0],L[1]-1]; } 
            check--;  
        }
        check = 7;
        // down left diagonal
        var R = [loc[0],loc[1]+1];
        while (check>0) {
            if (b.cell(R).get()==null || b.cell(R).get().indexOf(accept)==0) { newLocs.push(R); R = [R[0],R[1]+1]; } 
            check--;  
        }
        check = 7;
        // down right diagonal
        var D = [loc[0]+1,loc[1]];
        while (check>0) {
            if (b.cell(D).get()==null || b.cell(D).get().indexOf(accept)==0) { newLocs.push(D); D = [D[0]+1,D[1]]; } 
            check--;  
        }
    }

    // movement for king
    if (thisPiece=="WG" || thisPiece=="BG") {
        newLocs.push(
            [loc[0]-1,loc[1]],   [loc[0]+1,loc[1]],
            [loc[0],loc[1]-1],   [loc[0],loc[1]+1],
            [loc[0]-1,loc[1]-1], [loc[0]-1,loc[1]+1],
            [loc[0]+1,loc[1]-1], [loc[0]+1,loc[1]+1]
        );
    }
    var accept = thisPiece.indexOf('W')==0 ? 'B' : 'W';
    // remove illegal moves by checking 
    // content of b.cell().get()

    (function removeIllegalMoves(arr) {
        var fixedLocs = [];
        for (var i=0; i<arr.length; i++) 
            if (b.cell(arr[i]).get()==null || (b.cell(arr[i]).get().indexOf(accept)==0 && (thisPiece.indexOf('P')==-1 || loc[1]!=arr[i][1])))
                fixedLocs.push(arr[i]); 
        newLocs = fixedLocs;
    })(newLocs); 

    // bind green spaces to movement of piece
    bindMoveLocs = newLocs.slice();
    bindMovePiece = piece; 
    bindMoveEvents(bindMoveLocs);

}

// bind move event to new piece locations
function bindMoveEvents(locs) {
    for (var i=0; i<locs.length; i++) {
        b.cell(locs[i]).DOM().classList.add("green");
        b.cell(locs[i]).on("click", movePiece);  
    }
}

// actually move the piece
function movePiece() {
    var userClick = b.cell(this).where();
    if (bindMoveLocs.indexOf(userClick)) {
        b.cell(userClick).place(bindMovePiece);
        resetBoard();
    }
	saveBoard();
    checkWin();
    changeTurn();
}


// remove previous green spaces and event listeners
function resetBoard() {
    for (var r=0; r<b.rows(); r++) {
        for (var c=0; c<b.cols(); c++) {
            b.cell([r,c]).DOM().classList.remove("green");
            b.cell([r,c]).removeOn("click", movePiece);
        }
    }
}
function processUser()
{
	var parameters = location.search.substring(1).split(/[&=]+/);
	if(parameters.length>1)
	{
		localStorage.setItem(parameters[0],parameters[1]);
		localStorage.setItem(parameters[2],parameters[3]);
		localStorage.setItem(parameters[4],parameters[5]);
        localStorage.setItem(parameters[6],parameters[7]);
	} else if(localStorage.getItem("name")!=null){
		parameters[0] = "name";
		parameters[2] = "email";
		parameters[4] = "progress";
        parameters[6] = "against";
		parameters[1] = localStorage.getItem(parameters[0]);
		parameters[3] = localStorage.getItem(parameters[2]);
		parameters[5] = localStorage.getItem(parameters[4]);
        parameters[7] = localStorage.getItem(parameters[6]);
	}
	return parameters;
}
function startBoard()
{
	var prog = new Array();
	b.cell([7,1]).place(pieces[0]); prog[0] = [7,1];
	b.cell([7,6]).place(pieces[1]); prog[1] = [7,6];
	b.cell([7,2]).place(pieces[2]); prog[2] = [7,2];
	b.cell([7,5]).place(pieces[3]); prog[3] = [7,5]; 
	b.cell([7,0]).place(pieces[4]); prog[4] = [7,0];
	b.cell([7,7]).place(pieces[5]); prog[5] = [7,7];
	b.cell([7,3]).place(pieces[6]); prog[6] = [7,3];
	b.cell([7,4]).place(pieces[7]); prog[7] = [7,4];
	for (var i=8; i<16; i++) 
	{
		b.cell([6,i-8]).place(pieces[i]);
		prog[i] = [6,i-8];
	}
    b.cell([0,6]).place(pieces[16]); prog[16] = [0,6];
    b.cell([0,1]).place(pieces[17]); prog[17] = [0,1];
    b.cell([0,5]).place(pieces[18]); prog[18] = [0,5];
    b.cell([0,2]).place(pieces[19]); prog[19] = [0,2]; 
    b.cell([0,7]).place(pieces[20]); prog[20] = [0,7];
    b.cell([0,0]).place(pieces[21]); prog[21] = [0,0];
    b.cell([0,3]).place(pieces[22]); prog[22] = [0,3];
    b.cell([0,4]).place(pieces[23]); prog[23] = [0,4];
    for (var i=24; i<32; i++) 
    {
        b.cell([1,i-24]).place(pieces[i]);
        prog[i] = [1,i-8];
    }
	localStorage.setItem("progress",JSON.stringify(prog));
	//b.cell([0,0]).place(blackPieces[0]);
}
function loadBoard()
{
	var progress = localStorage.progress;
	if(progress.length<10)
	{
		startBoard();
	} else {
		progress = JSON.parse(progress);
		for(var i=0;i<progress.length;i++)
		{
            if(progress[i]!=null)
			     b.cell(progress[i]).place(pieces[i]);
		}
	}
}
function saveBoard()
{
	var prog = new Array();
	for(var i=0;i<pieces.length;i++)
	{
		prog[i] = b.cell(pieces[i].parentNode).exists() ? b.cell(pieces[i].parentNode).where() : null; 
	}
	localStorage.setItem("progress",JSON.stringify(prog));
}
function checkWin()
{
    if(!b.cell(pieces[7].parentNode).exists()) {
        alert("Black Player wins!");
        finished();
    }
    if(!b.cell(pieces[23].parentNode).exists()) {
        alert("White Player wins!");
        finished();
    }
}
function finished()
{
    localStorage.clear();
    startBoard();
    saveBoard();
}

 