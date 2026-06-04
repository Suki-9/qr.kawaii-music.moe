<script lang="ts">
  import Editor from './pages/Editor.svelte';
  import View from './pages/View.svelte';

  declare global {
    interface Window { __QR_DATA__?: string; }
  }

  // /s/[hash] → Pages Function injects window.__QR_DATA__ and serves index.html
  const isView = typeof window.__QR_DATA__ !== 'undefined';
</script>

{#if isView}
  <View />
{:else}
  <Editor />
{/if}
