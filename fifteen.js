(function(){
    var state = 1;
    var puzzle = document.getElementById("puzzle");

    //displaying a solved version of the puzzle
    solve();

    //listen for the clicking of the puzzle tile
    puzzle.addEventListener("click", function(e){
        if(state == 1){
            //sliding animation
            puzzle.className = 'animate';
            //shifing our clicked cell
            shiftCell(e.target);
        }
    });

    //listen for the click of the solve and shuffle button
    document.getElementById("shuffle").addEventListener("click", shuffle);
    document.getElementById("solve").addEventListener("click", solve);

    //making the solve function 
    //solves the puzzle if the player gets stuck and displays the solved puzzle

    function solve(){
        //base-case
        if(state == 0){
            return;
        }

        puzzle.innerHTML = '';

        var n = 1;
        for(var i = 0; i <= 3; i++){
            for(var j = 0; j <= 3; j++){
                var cell = document.createElement('span');
                cell.id = 'cell-' + i + '-' + j;
                //moving the cells to the left a certain pixel
                cell.style.left = (j * 80 + 1 * j + 1) + 'px';
                //moving cells up
                cell.style.top = (j * 80 + 1 * j + 1) + 'px';

                if(n <= 15){
                    cell.classList.add('number');
                    cell.classList.add((i % 2 == 0 && j % 2 > 0 || i % 2 > 0 && j % 2 == 0) ? 'dark' : 'light');
                    cell.innerHTML = (n++).toString();
                }
                else{
                    cell.className = 'empty';
                }

                puzzle.appendChild(cell);

            }
        }
    }

    //shifting the cells to the empty space
    function shiftCell(cell){
        //checking if the cell has a number
        if(cell.className != 'empty'){
            //getting the empty cell next to the current cell
            var emptyCell = getEmptyAdjacentCell(cell);

            if(emptyCell){
                var temp = {style: cell.style.cssText, id: cell.id};

                //changing the id value
                cell.style.cssText = emptyCell.style.cssText;
                cell.id = emptyCell.id;
                emptyCell.style.cssText = temp.style;
                emptyCell.id = temp.id;

                if(state == 1){
                    //checking the order of the number
                    setTimeout(checkOrder, 150);
                }
            }
        }

    }

    //getting the sepcific cell by row and column
    function getCell(row, col){
        return document.getElementById('cell-' + row + '-' + col);
    }

    //getting the empty cell
    function getEmptyCell(){
        return puzzle.querySelector('.empty');
    }

    //getting the empty adjacent cell if there is one
    function getEmptyAdjacentCell(cell){
        //getting all adjacent cells
        var adjacent = getAjacentCells(cell);

        //looking for the empty cell
        for(var i = 0; i < adjacent.length; i++){
            //if we found the cell that is empty
            if(adjacent[i].className == 'empty'){
                //return that cell value
                return adjacent[i];
            }
        }
        //if we cant find the empty cell
        return false;

    }
    //getting all possible adjacent cells
    function getAjacentCells(cell){
        var id = cell.id.split('-');

        //getting the cell position's indexes
        var row = parseInt(id[1]);
        var col = parseInt(id[2]);

        var adjacent = [];

        //checking all possible cells adjacent to the current cell

        if(row < 3){
            adjacent.push(getCell(row + 1, col));
        }
        if(row > 0){
            adjacent.push(getCell(row - 1, col));
        }
        if(col < 3){
            adjacent.push(getCell(row, col + 1));
        }
        if(row > 0){
            adjacent.push(getCell(row, col - 1));
        }

        return adjacent;
    }

    //checking if the order of the numbers is correct
    //later needs to change to see if the image is made in the correct order

    function checkOrder(){
        //checking to see if the empty cell is in the right position

        if(getCell(3,3).className != 'empty'){
            return;
        }
        
        var n = 1;
        //going through all the cells to check to see if the numbers are in order

        for(var i = 0; i <= 3; i++){
            for(var j = 0; j<= 3; j++){
                if(n <= 15 && getCell(i,j).innerHTML != n.toString()){
                    return;
                }
                n++;
            }
        }
        if(confirm('Yeah, you did it. \nWant to play again')){
            shuffle();
        }
    }

    //shuffleing all the puzzle pieces
    function shuffle(){
        //base-case
        if(state == 0){
            return;
        }

        puzzle.removeAttribute('class');
        state = 0;

        var prevCell;
        var i = 1;
        var interval = setinterval(function(){
            if(i <= 100){
                var adjacent = getAjacentCells(getEmptyCell());
                if(prevCell){
                    for(var j = adjacent.length - 1; j > 0; j--){
                        if(adjacent[i].innerHTML == prevCell.innerHTML){
                            adjacent.splice(j, 1);
                        }
                    }
                }
                prevCell = adjacent[rand(0, adjacent.length - 1)];
                shiftCell(prevCell);
                i++;
            }
            else{
                clearInterval(interval);
                state = 1;
            }
        },5);
    }

    function rand(from, to){
        return Math.floor(Math.random() * (to - from  + 1)) + from;
    }

}());