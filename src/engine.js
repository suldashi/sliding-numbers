export default class NumbersEngine {
    constructor(rows = 6, cols = 6, obstacles = 0) {
        this.rows = rows;
        this.cols = cols;
        this.obstacles = obstacles;
        this.lastChanges = [];
        this.gameState = [];
        for(var i=0;i<this.rows;i++) {
            this.gameState.push([]);
            for(var j=0;j<this.cols;j++) {
                this.gameState[i].push(0);
            }
        }
        this.generateRandomTile(2);
        for(let i=0;i<this.obstacles;i++) {
            this.generateRandomTile(-1);
        }
    }

    get hasReachedVictoryCondition() {
        for(var i=0;i<this.rows;i++) {
            for(var j=0;j<this.cols;j++) {
                if(this.gameState[i][j] >= 2048) {
                    return true;
                }
            }
        }
        return false;
    }

    get isGameOver() {
        for(var i=0;i<this.rows;i++) {
            for(var j=0;j<this.cols;j++) {
                if(this.gameState[i][j] > 0) {
                    if(i < this.rows - 1 && (this.gameState[i+1][j] === this.gameState[i][j] || this.gameState[i+1][j] === 0)) {
                        return false;
                    }
                    if(i > 0 && (this.gameState[i-1][j] === this.gameState[i][j] || this.gameState[i-1][j] === 0)) {
                        return false;
                    }
                    if(j < this.cols - 1 && (this.gameState[i][j+1] === this.gameState[i][j] || this.gameState[i][j+1] === 0)) {
                        return false;
                    }
                    if(j > 0 && (this.gameState[i][j-1] === this.gameState[i][j] || this.gameState[i][j-1] === 0)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    generateRandomTile(value = 1) {
        let freeSlots = [];
        for(var i=0;i<this.rows;i++) {
            for(var j=0;j<this.cols;j++) {
                if(this.gameState[i][j] === 0) {
                    freeSlots.push([i,j]);
                }
            }
        }
        if(freeSlots.length === 0) {
            return false;
        }
        let selectedSlot = freeSlots[getRandomInt(0,freeSlots.length)];
        this.gameState[selectedSlot[0]][selectedSlot[1]] = value;
        this.pushToChangeList(selectedSlot[0],selectedSlot[1],selectedSlot[0],selectedSlot[1],value,"newTile");
        return true;
    }

    slideRight(boardToSlide = this.gameState) {        
        this.lastChanges = [];
        let rows = boardToSlide.length;
        let cols = boardToSlide[0].length;
        for(var i=0;i<rows;i++) {
            for(var j=cols-1;j>=0;j--) {
                if(boardToSlide[i][j] > 0) {
                    for(var k=j+1;k<cols;k++) {
                        // if it reaches the edge
                        if(boardToSlide[i][k] === 0 && k === cols - 1) {
                            boardToSlide[i][k] = boardToSlide[i][j];
                            boardToSlide[i][j] = 0;
                            this.pushToChangeList(i,j,i,k,boardToSlide[i][k],"move");
                        }
                        // if it reaches another tile
                        else if(boardToSlide[i][k] !== 0) {
                            //if it merges
                            if(boardToSlide[i][k] === boardToSlide[i][j]) {
                                boardToSlide[i][k] *= 2;
                                boardToSlide[i][j] = 0;
                                this.pushToChangeList(i,j,i,k,boardToSlide[i][k],"move");   
                            }
                            // if it stops before the tile in front
                            else if(boardToSlide[i][k-1] === 0) {
                                boardToSlide[i][k-1] = boardToSlide[i][j];
                                boardToSlide[i][j] = 0;
                                this.pushToChangeList(i,j,i,k-1,boardToSlide[i][k-1],"move");
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    slideLeft(boardToSlide = this.gameState) {
        this.lastChanges = [];
        let rows = boardToSlide.length;
        let cols = boardToSlide[0].length;
        for(var i=0;i<rows;i++) {
            for(var j=1;j<cols;j++) {
                if(boardToSlide[i][j] > 0) {
                    for(var k=-1;j+k>=0;k--) {
                        // if it reaches the edge
                        if(boardToSlide[i][j+k] === 0 && j+k === 0) {
                            boardToSlide[i][j+k] = boardToSlide[i][j];
                            boardToSlide[i][j] = 0;
                            this.pushToChangeList(i,j,i,j+k,boardToSlide[i][j+k],"move");
                        }
                        // if it reaches another tile
                        else if(boardToSlide[i][j+k] !== 0) {
                            if(boardToSlide[i][j+k] === boardToSlide[i][j]) {
                                boardToSlide[i][j+k] *= 2;
                                boardToSlide[i][j] = 0;
                                this.pushToChangeList(i,j,i,j+k,boardToSlide[i][j+k],"move");
                                
                            }
                            else if(boardToSlide[i][j+k+1] === 0) {
                                boardToSlide[i][j+k+1] = boardToSlide[i][j];
                                boardToSlide[i][j] = 0;
                                this.pushToChangeList(i,j,i,j+k+1,boardToSlide[i][j+k+1],"move");
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    transpose(inputToTranspose) {
        let cols = inputToTranspose.length;
        let rows = inputToTranspose[0].length;
        let transposed = [...Array(rows)].map(x => Array(cols));
        for(let i=0;i<rows;i++) {
            for(let j=0;j<cols;j++) {
                transposed[i][j] = inputToTranspose[j][i];
            }
        }
        return transposed;
    }

    slideDown() {
        let transposed = this.transpose(this.gameState);
        this.slideRight(transposed);
        let corrected = this.transpose(transposed);
        //list of changes also has to be transposed
        this.lastChanges = this.lastChanges.map(x => {
            return {
                oldCol: x.oldRow,
                oldRow: x.oldCol,
                newRow: x.newCol,
                newCol: x.newRow,
                newVal: x.newVal,
                changeType: x.changeType
            }
        })
        this.gameState = corrected;
    }

    slideUp() {
        let transposed = this.transpose(this.gameState);
        this.slideLeft(transposed);
        let corrected = this.transpose(transposed);
        //list of changes also has to be transposed
        this.lastChanges = this.lastChanges.map(x => {
            return {
                oldCol: x.oldRow,
                oldRow: x.oldCol,
                newRow: x.newCol,
                newCol: x.newRow,
                newVal: x.newVal,
                changeType: x.changeType
            }
        })
        this.gameState = corrected;
    }

    pushToChangeList(oldRow, oldCol, newRow, newCol, newVal, changeType) {
        this.lastChanges.push({
            oldRow,
            oldCol,
            newRow,
            newCol,
            newVal,
            changeType
        });
    }

    print() {
        console.log(this.gameState.reduce((p1, c1) => {
            return p1 + c1.reduce((p2,c2) => {
                return p2 + c2.toString().padStart(5," ");
            },'') + "\n"
        }, ''));
    }
}

// Generates a random integer between min(inclusive) and max(exclusive)
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}