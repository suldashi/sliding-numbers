<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import NumberSlidingGame from './components/NumberSlidingGame.vue'

</script>

<script>

const urlParams = new URLSearchParams(window.location.search);
const initialCols = urlParams.get("columns") ? parseInt(urlParams.get("columns")) : 6;
const initialRows = urlParams.get("rows") ? parseInt(urlParams.get("rows")) : 6;
const initialObstacles = urlParams.get("obstacles") ? parseInt(urlParams.get("obstacles")) : 0;

export default {
  data() {
    return {
      cols:initialCols,
      rows:initialRows,
      obstacles:initialObstacles
    }
  },
  methods: {
    increment(val) {
      if(this[val] <=10) {
        this[val] = this[val]+1;
      }
    },
    decrement(val) {
      if(this[val] > 0) {
        this[val] = this[val]-1;
      }
    },
    reload() {
      let currentUrl = window.location.href.split("?")[0];
      let fullUrl = `${currentUrl}?columns=${this.cols}&rows=${this.rows}&obstacles=${this.obstacles}`
      window.location = fullUrl;
    }
  }
}
</script>

<template>
  <div>
    <div class="controls-container">
      <div>
        <span class="control-text">Rows:</span>
        <button @click="() => decrement('rows')">-</button>
          {{rows}}
        <button @click="increment('rows')">+</button>
      </div>
      <div>
        <span class="control-text">Columns:</span>
        <button @click="decrement('cols')">-</button>
          {{cols}}
        <button @click="increment('cols')">+</button>
      </div>
      <div>
        <span class="control-text">Obstacles:</span>
        <button @click="decrement('obstacles')">-</button>
          {{obstacles}}
        <button @click="increment('obstacles')">+</button>
      </div>
      <div><button class="new-game-button" @click="reload"><a>New Game</a></button></div>
    </div>
    <NumberSlidingGame :cols="initialCols" :rows="initialRows" :obstacles="initialObstacles" />
  </div>
</template>

<style scoped>

button {
  background-color: lightgrey;
  font-size: 20px;
  margin: 5px;
  padding: 0;
  height:32px;
  width: 32px;
}
.control-text {
  display: inline-block;
  width: 90px;
  text-align: left;
}
.controls-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.new-game-button {
  width: auto;
  height: auto;
  padding: 10px 15px;
}
</style>
