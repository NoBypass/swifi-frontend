<script lang="ts">
  import { Input } from "@components/ui/input";
  import * as Icon from "@components/ui/icon";
</script>

<Input class="h-8">
  {#snippet left()}
    <Icon.Search class="size-5 stroke-2" />
  {/snippet}
  {#snippet right()}
    <p>K</p> <!-- TODO fancy CMD + K -->
  {/snippet}
</Input>