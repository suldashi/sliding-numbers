<script setup>

defineProps({
  cols: Number,
  tileData: Object,
})

function colorMap(val) {
  let colorMapObj = {
    '-1': 'black',
    1:'#23DB5C',
    2:'#47DB5C',
    4:'#94DB5C',
    8:'#dcb683',
    16: '#d79f6d',
    32: '#d48a68',
    64: '#ce7148',
    128: '#e0d182',
    256: '#decd74',
    512: '#decb68',
    1024: '#ddc75c',
    2048: '#dbc452'
  };
  return colorMapObj[val] ? colorMapObj[val] : 'gold'
}
</script>

<template>
  <div
    :style="{
      width:(100/cols)+'%',
      transform:'translate('+tileData.col*100+'%, '+tileData.row*100+'%)'}"
    class="tile">
    <div
      :style="{background:colorMap(tileData.val)}"
      class="tile-inner" :class="tileData.val < 0 ? 'obstacle' : ''">
      {{tileData.val}}
    </div>
  </div>
</template>

<style scoped>

  .tile {
    padding: 2px;
    position: absolute;
    top: 0;
    left: 0;
    transition:transform 0.3s ease;
  }
  .tile-inner {
    border-radius: 5px;
    color: white;
    font-size: 24px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .obstacle {
    background: black;
    color: black;
    font-size: 0;
  }
</style>
