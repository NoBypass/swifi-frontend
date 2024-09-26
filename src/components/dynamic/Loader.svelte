<script lang="ts">
  export let borderB = 'border-b-indigo-500';
</script>

<div class="relative flex w-6 h-6">
  <i class="absolute w-full h-full rounded-full animate-loader-ease-spin border-solid border-t-transparent border-l-transparent border-r-transparent border-3 {borderB}"></i>
  <i class="absolute w-full h-full rounded-full opacity-25 animate-loader-linear-spin border-t-transparent border-l-transparent border-r-transparent border-3 {borderB}"></i>
</div>