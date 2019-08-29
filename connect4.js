var winMsg = null
class Connect4 {
    constructor(selector) {
        this.ROWS = 6;
        this.COLS = 7;
        this.player = 'red';
        // added player attribute to the class
        this.selector = selector;
        this.isGameOver = false;
        this.onPlayerMove = function () {

        };
        this.createGrid();
        this.setupEventListeners();
    }

    createGrid() {
        const $board = $(this.selector);
        // $ signs are used to specify, that it is a jQuery object
        $board.empty();
        this.isGameOver = false;
        this.player = 'red';
        for (let row = 0; row < this.ROWS; row++) {
            // for loop to create 6 rows for the grid
            const $row = $('<div>')
                // creating a new div using jQuery
                .addClass('row');
            for (let col = 0; col < this.COLS; col++) {
                //for loop to create 7 columns in the grid
                const $col = $('<div>')
                    .addClass('col empty')
                    // col empty to be able to style it afterwards
                    .attr('data-col', col)
                    .attr('data-row', row);
                $board.append($col);
            }
            $board.append($row);
        }
    }

    setupEventListeners() {
        const $board = $(this.selector);
        const that = this;
        // retain access to the this-attribute when switching from player to player

        function findLastEmptyCell(col) {
            const cells = $(`.col[data-col='${col}']`);
            for (let i = cells.length - 1; i >= 0; i--) {
                //loop over the cells backwards to check for the last empty cell
                const $cell = $(cells[i]);
                if ($cell.hasClass('empty')) {
                    return $cell;
                }
            }
            return null;
        }

        $board.on('mouseenter', 'col.empty', function () {
            // jQuery method: whenever we click on or hover over an "col.empty", this function is going to be invoked
            if (that.isGameOver) return;
            console.log('here', this);
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.addClass(`next-${that.player}`);

        });
        $board.on('mouseleave', '.col', function () {
            $('.col').removeClass(`next-${that.player}`);
            // same is above. just the other way round. removing the coin. 
        });

        $board.on('click', '.col.empty', function () {
            // whenever you click on an empty column the function is invoked
            if (that.isGameOver) return;
            // if game is over. you should not be able to click on anything inside the grid
            const col = $(this).data('col');
            const row = $(this).data('row');
            // to get the exact column and row of the click inside the grid
            const $lastEmptyCell = findLastEmptyCell(col);
            // reusing the method which finds the last empty cell in the column we clicked on
            $lastEmptyCell.removeClass(`empty next-${that.player}`);
            // the remove the empty-class and replace it with the palyer´s coin who clicked
            $lastEmptyCell.addClass(that.player);
            $lastEmptyCell.data('player', that.player);

            const winner = that.checkForWinner(
                $lastEmptyCell.data('row'),
                $lastEmptyCell.data('col')
            )
            if (winner) {
                that.isGameOver = true;
                $('.col.empty').removeClass('empty');
                winMsg = document.getElementById("winning-msg")
                winMsg.innerText = `Game Over! Player ${that.player} has won!`
                winMsg.style.display = "block";
                // if we have a winner, display a winning message
                // you could also do an alert 
                return;
            }

            that.player = (that.player === 'red') ? 'black' : 'red';
            // if the current player is red, after the next click it is going to be black and so on
            that.onPlayerMove();
            $(this).trigger('mouseenter');
        });
    }

    checkForWinner(row, col) {
        const that = this;

        function $getCell(i, j) {
            return $(`.col[data-row='${i}'][data-col='${j}']`);
        }

        function checkDirection(direction) {
            let total = 0;
            let i = row + direction.i;
            let j = col + direction.j;
            let $next = $getCell(i, j);
            while (i >= 0 &&
                i < that.ROWS &&
                j >= 0 &&
                j < that.COLS &&
                $next.data('player') === that.player
            ) {
                total++;
                i += direction.i;
                j += direction.j;
                $next = $getCell(i, j);
            }
            return total;
        }

        function checkWin(directionA, directionB) {
            const total = 1 +
                // checks if the one coin which was just placed, has othe coins of the same color either in the up or down direction next to it
                checkDirection(directionA) +
                checkDirection(directionB);
            if (total === 4) {
                return that.player;
                //return taht winning player
            } else {
                return null;
                // if no winner. continue playing
            }
        }

        function checkDiagonalBLtoTR() {
            return checkWin({
                i: 1,
                j: -1
            }, {
                i: 1,
                j: 1
            });
        }

        function checkDiagonalTLtoBR() {
            return checkWin({
                i: 1,
                j: 1
            }, {
                i: -1,
                j: -1
            });
        }

        function checkVerticals() {
            return checkWin({
                i: -1,
                j: 0
            }, {
                i: 1,
                j: 0
            });
        }

        function checkHorizontals() {
            return checkWin({
                i: 0,
                j: -1
            }, {
                i: 0,
                j: 1
            });
        }

        return checkVerticals() ||
            checkHorizontals() ||
            checkDiagonalBLtoTR() ||
            checkDiagonalTLtoBR()
    }

    restart() {
        winMsg.style.display = 'none';
        // to set display of the winning message on none after restarting
        this.createGrid();
        this.onPlayerMove();
    }

}