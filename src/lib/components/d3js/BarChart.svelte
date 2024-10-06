<script>
  // 
</script>


<svg {width} {height}>
  {#each popn as { country, population }, idx}
    <rect x={0} y={yScale(0.95 * idx)} width={xScale(population)} height={20} fill="steelblue" />
    <text class="popn-size" x={xScale(population)} y={yScale(0.95 * idx)} dy="1em" dx="0.5em">
      {country}
    </text>
  {/each}
</svg>

<style>
  /*  */
</style>