$(document).ready(function(){
// accepts an id pointer and flips the specified cell
// to the opposite pole
// with fancy jquery animations

function flipcell(x, speed) {
    if(!speed) {
        speed = 150;
    }
    if ($(x).attr("class") === "live cell") {
        $(x).animate({
            backgroundColor:"white"
        }, speed);
        $(x).attr("class", "dead cell");
    } else {
        $(x).animate({
            backgroundColor:"black"
        }, speed);
        $(x).attr("class", "live cell");
    }
    
}

var cLife = {
    GRIDHEIGHT: 65,
    GRIDWIDTH: 40,
    thecells: [],
    newcells: [],
    DELAY: 0,

    // wrap functions make it so we can return values on opposite edge of grid
    // as neighbors
    wraph: function(x) {
        if (x >= this.GRIDHEIGHT) {
            return (x - this.GRIDHEIGHT);
        }
        if (x < 0) {
            return (x + this.GRIDHEIGHT);
        }
        return x;
    },

    wrapw: function(x) {
        if (x >= this.GRIDWIDTH) {
            return (x - this.GRIDWIDTH);
        }
        if (x < 0) {
            return (x + this.GRIDWIDTH);
        }
        return x;
    },

    buildit: function() {
        var i, j;
        for (i = 0; i < this.GRIDWIDTH; i++) {
            this.thecells[i] = [];
            this.newcells[i] = [];
            for (j = 0; j < this.GRIDHEIGHT; j++) {
                this.thecells[i][j] = 0;
                this.newcells[i][j] = 0;
            }
        }
    },
    
    clearit: function() {
        var i, j;
        for (i = 0; i < this.GRIDWIDTH; i++) {
            this.thecells[i] = [];
            for (j = 0; j < this.GRIDHEIGHT; j++) {
                this.thecells[i][j] = 0;
            }
        }
    },       
    
    // most unimaginative method name ever award goes to...
    copynewtoold: function() {
        var i, j;
        for (i = 0; i < this.GRIDWIDTH; i++) {
            for (j = 0; j < this.GRIDHEIGHT; j++) {
                this.thecells[i][j] = this.newcells[i][j];
            }
        }
    },

    drawit: function(whatgrid) {
        var i, j;
        $(whatgrid).empty();

        // iterate through every cell in the grid
        // if its alive draw it blue and if its dead
        // draw it white
        // count identifies each unique cell with an ID we can
        // reference it later by using the click function and for other purposes
        for (i = 0; i < this.GRIDWIDTH; i++) {
            $(whatgrid).append('<div style="display:table-row">');
            for (j = 0; j < this.GRIDHEIGHT; j++) {
                if (this.thecells[i][j] === 0) {
                    $(whatgrid).append('<div class="dead cell" data-i="' + i + '" data-j="' + j + '" />');
                } else {
                    $(whatgrid).append('<div class="live cell" data-i="' + i + '" data-j="' + j + '" />');
                }
            }
            $(whatgrid).append('</div>');
        }
    },

    // this function calcs the number of live neighbors
    // that the cell with the given coords has, checks conway's rules
    // and determines whether it will be live or dead next generation
    nextgenval: function(i, j) {
        i = parseInt(i, 10);
        j = parseInt(j, 10);
        var nliveneighbors =
            this.thecells[this.wrapw(i - 1)][this.wraph(j - 1)] + 
            this.thecells[this.wrapw(i)][this.wraph(j - 1)] + 
            this.thecells[this.wrapw(i + 1)][this.wraph(j - 1)] + 
            this.thecells[this.wrapw(i - 1)][this.wraph(j)] + 
            this.thecells[this.wrapw(i + 1)][this.wraph(j)] + 
            this.thecells[this.wrapw(i - 1)][this.wraph(j + 1)] + 
            this.thecells[this.wrapw(i)][this.wraph(j + 1)] + 
            this.thecells[this.wrapw(i + 1)][this.wraph(j + 1)]; 
            
        if (this.thecells[i][j]) {
            if (nliveneighbors < 2) {
                return 0;
            }
            if (nliveneighbors > 3) {
                return 0;
            }
            return 1;
        } else {
            if (nliveneighbors == 3) {
                return 1;
            }
            return 0;
        }

        // just in case i messed something up in my logic...
        return 0;
    },
    
    updateInternalGrid: function () {
            // update the values in cLife's array to correspond with user input
            $('.cell').each(function() {
                var xcoord = parseInt(this.getAttribute('data-i'), 10);
                var ycoord = parseInt(this.getAttribute('data-j'), 10);
                if ($(this).attr('class') === 'live cell') {
                    // this cell is alive so set the corresponding cell in the grid to alive
                    cLife.thecells[xcoord][ycoord] = 1;
                } else {
                    // or vice versa
                    cLife.thecells[xcoord][ycoord] = 0;
                }
            });
    }
};

function drawGrid() {
      cLife.updateInternalGrid();
      
      // draw it
      $('.cell').each(function() {
            var xcoord = parseInt(this.getAttribute('data-i'), 10);
            var ycoord = parseInt(this.getAttribute('data-j'), 10);
            if (cLife.newcells[xcoord][ycoord] && !($(this).attr("class") === "live cell")) {     
                    flipcell(this, 300);
            } else if (!cLife.newcells[xcoord][ycoord] && !($(this).attr("class") === "dead cell")) {
                    flipcell(this, 300);
            }
      });
}

// DieHard is a Methuselah shape
// that exhibits interesting patterns
function makeDieHard() {
    $.each([{i: 8, j: 11},
            {i: 8, j: 11},
            {i: 8, j: 11},
            {i: 8, j: 11},
            {i: 8, j: 11},
            {i: 8, j: 11},
            {i: 8, j: 11}], function () {
                  cLife.thecells[this.i][this.j] = 1;
            });
    drawGrid();
}
                        
function steponegen() {
            cLife.updateInternalGrid();

            // calculate values for next generation
            $('.cell').each(function() {
                var xcoord = parseInt(this.getAttribute('data-i'), 10);
                var ycoord = parseInt(this.getAttribute('data-j'), 10);
                var mynextgenval = cLife.nextgenval(xcoord, ycoord);
                cLife.newcells[xcoord][ycoord] = mynextgenval;
            });
            
            drawGrid();
    
            //update cells to be current
            cLife.copynewtoold();
}

$(document).ready(function() {
        cLife.buildit();
        cLife.drawit('#thegrid');
        makeDieHard();    
    
        $("#empty").on('click', function() {
            cLife.clearit();
            $('.cell').each(function () {
                if($(this).attr("class") === "live cell") {
                    flipcell(this);
                }
            });
        });
        
        $('.cell').on('click', function() {
            flipcell(this);
        });

        $('#gobutton').on('click', function() {
            var n = $("#ngen").val();
            var i;
            $("#ngen").val('');

            for(i=0; i < n; i++) {
                setTimeout(function () {steponegen();}, cLife.DELAY);
                // the processing of the cells runs a lot faster than the
                // animation, so we delay the drawing of each generation
                // by a little bit more each time
                // definitely trying to figure out what the ideal function is
                // for this guy as a factor of n because it should drag more
                // on animations with more iterations- but not too much.
                // 300 seems to be about ideal for 50gen
                cLife.DELAY += 250;
            }
            cLife.DELAY = 0;
        });
});
});