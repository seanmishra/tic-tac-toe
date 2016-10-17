$(function() {

    var symbol = 'X',
        ai_symbol = 'O',
        play = false,
        gameArray = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ],
        won = parseInt(sessionStorage.getItem('won') === null ? 0 : sessionStorage.getItem('won')),
        lost = parseInt(sessionStorage.getItem('lost') === null ? 0 : sessionStorage.getItem('lost')),
        draw = parseInt(sessionStorage.getItem('draw') === null ? 0 : sessionStorage.getItem('draw'));

    //Setting values from Session Storage
    $('.won').text(won);
    $('.lost').text(lost);
    $('.draw').text(draw);

    $("#dialog-confirm").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Yeah, 'X' is cool": function() {
                $(this).dialog("close");
                play = true;
                $('.turn').text('Your turn!');
            },
            "Nope, I want 'O'": function() {
                symbol = 'O';
                ai_symbol = 'X';
                $(this).dialog("close");
                $('.turn').text('AI is thinking...');
                setTimeout(function() {
                    ai_play();
                }, 2000);
            }
        }
    });

    $('table').on('click', 'td', function() {
        if (play && $(this).text() === "") {
            $(this).text(symbol);
            mapArray(gameArray);
            if (chkWin(gameArray)) {
                console.log("You win!");
                endGame(1);
            } else
            if (chkDraw(gameArray)) {
                console.log("Match Draw!");
                endGame(2);
            } else {
                play = false;
                $('.turn').text('AI is thinking...');
                setTimeout(function() {
                    ai_play();
                }, 2000);
            }
        }
    });

    function ai_play() {
        //Protocol: Random
        console.log("AI is playing with protocol: Random");
        var x = getRandomIntInclusive(0, 2);
        var y = getRandomIntInclusive(0, 2);
        console.log('first pick: ' + x + ',' + y);
        while (gameArray[x][y] !== "") {
            x = getRandomIntInclusive(0, 2);
            y = getRandomIntInclusive(0, 2);
            console.log('next pick: ' + x + ',' + y);
        }
        console.log('playing pick: ' + x + ',' + y);
        gameArray[x][y] = ai_symbol;
        reverseMapArray(gameArray);
        if (chkWin(gameArray)) {
            console.log("You lose!");
            endGame(0);
        } else
        if (chkDraw(gameArray)) {
            console.log("Match Draw!");
            endGame(2);
        } else {
            $('.turn').text('Your turn!');
            play = true;
        }
    }

    //Maps the values from the game table into the gameArray
    function mapArray(x) {
        for (var i = 1; i <= 3; i++) {
            for (var j = 1; j <= 3; j++) {
                x[i - 1][j - 1] = $('table tr:nth-child(' + i + ') td:nth-child(' + j + ')').text();
            }
        }
    }

    //Maps the gameArray onto the game table
    function reverseMapArray(x) {
        for (var i = 1; i <= 3; i++) {
            for (var j = 1; j <= 3; j++) {
                $('table tr:nth-child(' + i + ') td:nth-child(' + j + ')').text(x[i - 1][j - 1]);
            }
        }
    }

    function chkWin(x) {
        if (
            ((x[0][0] !== "" && x[0][1] !== "" && x[0][2] !== "") &&
                (x[0][0] === x[0][1] && x[0][1] === x[0][2])) ||

            ((x[1][0] !== "" && x[1][1] !== "" && x[1][2] !== "") &&
                (x[1][0] === x[1][1] && x[1][1] === x[1][2])) ||

            ((x[2][0] !== "" && x[2][1] !== "" && x[2][2] !== "") &&
                (x[2][0] === x[2][1] && x[2][1] === x[2][2])) ||

            ((x[0][0] !== "" && x[1][0] !== "" && x[2][0] !== "") &&
                (x[0][0] === x[1][0] && x[1][0] === x[2][0])) ||

            ((x[0][1] !== "" && x[1][1] !== "" && x[2][1] !== "") &&
                (x[0][1] === x[1][1] && x[1][1] === x[2][1])) ||

            ((x[0][2] !== "" && x[1][2] !== "" && x[2][2] !== "") &&
                (x[0][2] === x[1][2] && x[1][2] === x[2][2])) ||

            ((x[0][0] !== "" && x[1][1] !== "" && x[2][2] !== "") &&
                (x[0][0] === x[1][1] && x[1][1] === x[2][2])) ||

            ((x[0][2] !== "" && x[1][1] !== "" && x[2][0] !== "") &&
                (x[0][2] === x[1][1] && x[1][1] === x[2][0]))
        ) return true;
        else return false;
    }

    function chkDraw(x) {
        if (
            x[0][0] !== "" && x[0][1] !== "" && x[0][2] !== "" &&
            x[1][0] !== "" && x[1][1] !== "" && x[1][2] !== "" &&
            x[2][0] !== "" && x[2][1] !== "" && x[2][2] !== ""
        ) return true;
        else return false;
    }

    function getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function endGame(x) {
        switch (x) {
            case 0:
                lost += 1;
                $('.lost').text(lost);
                $('.turn').addClass('text-danger').text("YOU LOSE!");
                sessionStorage.setItem('lost', lost);
                break;
            case 1:
                won += 1;
                $('.won').text(won);
                $('.turn').addClass('text-success').text("YOU WIN!");
                sessionStorage.setItem('won', won);
                break;
            default:
                draw += 1;
                $('.draw').text(draw);
                $('.turn').addClass('text-info').text("MATCH DRAW!");
                sessionStorage.setItem('draw', draw);
                break;
        }
        setTimeout(function() {
            $('.turn').removeClass('text-danger text-success text-info')
            reinit();
        }, 2000);
    }

    function reinit() {
        console.log("New Game");
        gameArray = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        reverseMapArray(gameArray);
        if (symbol === 'X') {
            play = true;
            $('.turn').text('Your turn!');
        } else {
            play = false;
            $('.turn').text('AI is thinking...');
            setTimeout(function() {
                ai_play();
            }, 2000);
        }
    }

});
