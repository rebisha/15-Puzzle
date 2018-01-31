(function ()
{	
	var state = 1;
    var puzzle = document.getElementById('puzzle');

    document.getElementById('solve').addEventListener('click', solve);
    document.getElementById('scramble').addEventListener('click', scramble);
	
	solve();
	
	// Listens for click on puzzle cells
    puzzle.addEventListener('click', function (event)
    {
        if (state == 1)
        {
			// Enables sliding animation
			puzzle.className = 'animate';
			shiftingCell(event.target);
		}
    });

    // gets specific cell
    function getCell(row, column) {
        return document.getElementById('cell-' + row + '-' + column);
    }

    //Gets empty cell
    function getEmptyCell() {
        return puzzle.querySelector('.empty'); // looks for the 'empty' element and returns it.			
    }
	
	//Creates solved puzzle	 
    function solve()
    {
        if (state == 0)
        {
            return;
        }

        puzzle.innerHTML = '';

		var n = 1;
        for (var i = 0; i <= 3; i++) // rows
        {
            for (var j = 0; j <= 3; j++) // columns
            {
                var cell = document.createElement('div');//creates a new span element
                cell.id = 'cell-' + i + '-' + j; // div id = 'cell-...-...'
				cell.style.left = ((j * 50) + (1 * j) + 1) + 'px'; // sets the width of the cell to 50px and padding-left to 1px.
                cell.style.top = ((i * 50) + (1 * i) + 1) + 'px'; // sets the height of the cell to 50px and padding-top to 1px.
				
                if (n <= 15)
                {
                    cell.className = 'number'; // div class = 'number'.
                    cell.innerHTML = n++; //this line of code inputs the number in every cell.
                }
                else
                {
					cell.className = 'empty';
				}
				
                puzzle.appendChild(cell); // adds a numbered cell after puzzle div and then keeps adding on until the rows and columns are filled up.
			}
        }
        
    }

	//Scrambles puzzle
    function scramble() {
        state = 0;

        var previousCell;
        var i = 1;
        var interval = setInterval(function () {
            if (i <= 20) {
                var adjacentCell = getAdjacentCells(getEmptyCell());

                if (previousCell) {
                    for (var j = adjacentCell.length - 1; j >= 0; j--) {
                        if (adjacentCell[j].innerHTML == previousCell.innerHTML) {
                            adjacentCell.splice(j, 1);
                        }
                    }
                }

                // Gets random adjacent cell and memorizes it for the next iteration
                previousCell = adjacentCell[random(0, adjacentCell.length - 1)];
                shiftingCell(previousCell);
                i++;
            }
            else {
                clearInterval(interval);
                state = 1;
            }

        }, 2);
    }

    // Shifts number cell to the empty cell
    function shiftingCell(cell)
    {
        // Checks if selected cell has number
        if (cell.className != 'empty')
        {
            // Tries to get empty adjacent cell
            var emptyCell = getEmptyAdjacentCell(cell);

            if (emptyCell)
            {
                // Temporary data
                var temp = { style: cell.style.cssText, id: cell.id }; // temp is assigned the css style and cell id.

                // Exchanges id and style values
                cell.style.cssText = emptyCell.style.cssText;
                cell.id = emptyCell.id;
                emptyCell.style.cssText = temp.style;
                emptyCell.id = temp.id;

                if (state == 1)
                {
                    // Checks the order of numbers
                    checkNumberOrder();
                }
            }
        }
    }

    //Checks if the order of numbers is correct
    function checkNumberOrder()
    {
        // Checks if the empty cell is in correct position i.e. the last cell.
        if (getCell(3, 3).className != 'empty') 
        {
            return;
        }

        var n = 1;
        // Goes through all cells and checks numbers
        for (var i = 0; i <= 3; i++) {
            for (var j = 0; j <= 3; j++) {
                if (n <= 15 && getCell(i, j).innerHTML != n.toString()) {
                    // Order is not correct
                    return;
                }
                n++;
            }
        }
        
        alert("Congratulations, You solved the puzzle!!");
    }
	
	//Gets empty adjacent cell if it exists
    function getEmptyAdjacentCell(cell)
    {		
		// Gets all adjacent cells
		var adjacentCell = getAdjacentCells(cell);
		
		// Searches for empty cell
        for (var i = 0; i < adjacentCell.length; i++)
        {
            if (adjacentCell[i].className == 'empty')
            {
				return adjacentCell[i];
			}
		}		
		
		return false;		
	}

	//Gets all adjacent cells
    function getAdjacentCells(cell)
    {		
		var id = cell.id.split('-'); // id = cell-0-1. so after spliting, id becomes "cell","0","1" i.e. an array with 3 elements.
		
		// Gets cell position indexes
		var row = parseInt(id[1]); // as array starts from 0 row is in the array[1].
		var column = parseInt(id[2]); // and column is in the array[2].
		
		var adjacentCell = [];
		
		// Gets all possible adjacent cells
		if (row < 3){ adjacentCell.push(getCell(row + 1, column)); } // checks the adjacent bottom cell.		
		if (row > 0){ adjacentCell.push(getCell(row - 1, column)); } // checks the adjacent top cell.
        if (column < 3) { adjacentCell.push(getCell(row, column + 1)); } // checks the adjacent right cell.
        if (column > 0) { adjacentCell.push(getCell(row, column - 1)); } // checks the adjacent left cell.
		
		return adjacentCell;	// length is either 2, 3 or 4 depending on the position of the cell, and one of them will be empty.	
	}
   
    function random(from, to)
    {
		return Math.floor(Math.random() * (to - from + 1)) + from;
	}

}());
