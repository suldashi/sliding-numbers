<script setup>
import Tile from './Tile.vue';
import Engine, {getRandomInt} from '../engine';

defineProps({
  rows: Number,
  cols: Number,
  obstacles: Number
})
</script>

<script>
  const animationTime = 300;
  export default {
    data() {
      return {
        activeTiles: [],
        canMove: true,
        hasReachedVictoryCondition: false,
        decidedToContinuePlaying: false,
        isGameOver: false
      }
    },
    methods: {
      toggleCanMove() {
        this.canMove = !this.canMove;
      },
      keepPlaying() {
        this.decidedToContinuePlaying = true;
      },
      renderBoardFromState() {
        let newActiveTiles = [];
        for(let i=0;i<this.engine.gameState.length;i++) {
          for(let j=0;j<this.engine.gameState[i].length;j++) {
            if(this.engine.gameState[i][j] !== 0) {
              newActiveTiles.push({
                row: i,
                col: j,
                val: this.engine.gameState[i][j],
                id: getRandomInt(0,1000000000),
                isFresh: false
              })
            }
          }
        }
        this.activeTiles = newActiveTiles;
        if(this.engine.isGameOver) {
          this.isGameOver = true;
        }
      },
      animateTiles(lastChanges) {
        for(let change of lastChanges) {
          if(change.changeType === 'newTile') {
            let newId = getRandomInt(0,1000000000)
            this.activeTiles.push({
              row:change.newRow,
              col:change.newCol,
              val: change.newVal,
              id: newId,
              isFresh: true
            })
          }
          else if(change.changeType === 'move') {
            let targetTile = this.activeTiles.find(x => x.row === change.oldRow && x.col === change.oldCol);
            if(targetTile) {
              targetTile.row = change.newRow;
              targetTile.col = change.newCol;
              targetTile.val = change.newVal;
            }
          }
          window.activeTiles = this.activeTiles;
        }
      },
      slide(ev) {
        if(this.canMove) {
          let pressedArrow = false;
          this.toggleCanMove();
          setTimeout(this.toggleCanMove, animationTime);
          if(ev.key === "ArrowDown") {
            this.engine.slideDown();
            pressedArrow = true;
          }
          else if(ev.key === "ArrowUp") {
            this.engine.slideUp();
            pressedArrow = true;
          }
          else if(ev.key === "ArrowLeft") {
            this.engine.slideLeft();
            pressedArrow = true;
          }
          else if(ev.key === "ArrowRight") {
            this.engine.slideRight();
            pressedArrow = true;
          }
          if(pressedArrow) {
            if(this.engine.lastChanges.length > 0) {
              this.engine.generateRandomTile();
            }
            this.hasReachedVictoryCondition = this.engine.hasReachedVictoryCondition
            this.animateTiles(this.engine.lastChanges);
            setTimeout(this.renderBoardFromState,animationTime);
            ev.preventDefault();
          }
        }
        
      }
    },
    mounted() {
      this.engine = new Engine(this.rows, this.cols, this.obstacles);
      this.renderBoardFromState();
      document.addEventListener("keydown", this.slide);
    },
    beforeUnmount() {
      document.addEventListener("keydown", this.slide);
    }
  }
</script>

<template>
  <div class="tile-container" :style="{'aspect-ratio':cols/rows}">
      <Tile v-for="tile in activeTiles.filter(x => !x.isFresh)" :tileData="tile" :cols="cols" :key="tile.id" />
      <TransitionGroup name="tiles">
        <Tile v-for="tile in activeTiles.filter(x => x.isFresh)" :tileData="tile" :cols="cols" :key="tile.id" />
      </TransitionGroup>
      <div v-if="!decidedToContinuePlaying && hasReachedVictoryCondition" class="victory-overlay">
        <span>Congratulations!</span>
        <span>You have reached 2048.</span>
        <span>You may continue playing until you cannot move.</span>
        <button @click="keepPlaying">Close</button>
      </div>
      <div v-if="isGameOver" class="victory-overlay">
        <span>You have reached the end of the game.</span>
        <span>You cannot move.</span>
        <span>Try again?</span>
      </div>
  </div>
</template>

<style scoped>

.tiles-enter-from {
  opacity: 0;
}

.tiles-enter-active {
  transition: opacity 0.5s ease;
}

.tiles-enter-to {
  opacity: 1;
}
.tile-container {
  display: flex;
  flex-wrap: wrap;
  width: 500px;
  position: relative;
  border: 1px dashed black;
  position: relative;
}

.victory-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  font-size: 24px;
}
.victory-overlay span {
  margin-bottom: 16px;
}

.victory-overlay button {
  width: 150px;
  background-color: lightgray;
  margin: 0 auto;
}
</style>