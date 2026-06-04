<script lang="ts">
  import { onMount } from 'svelte';
  import QRCode from 'qrcode';

  type Props = { url: string };
  let { url }: Props = $props();

  let canvas: HTMLCanvasElement;
  let copied = $state(false);

  $effect(() => {
    if (canvas && url) {
      QRCode.toCanvas(canvas, url, {
        width: 240,
        margin: 2,
        color: { dark: '#1a1a1a', light: '#ffffff' },
      });
    }
  });

  async function copy() {
    await navigator.clipboard.writeText(url);
    copied = true;
    setTimeout(() => (copied = false), 1500);
  }
</script>

<div class="qr-display">
  <canvas bind:this={canvas}></canvas>

  <div class="url-row">
    <span class="url-text">{url}</span>
    <button type="button" class="btn-icon" onclick={copy} aria-label="コピー">
      <span class="material-symbols-outlined">{copied ? 'check' : 'content_copy'}</span>
    </button>
  </div>
</div>

<style lang="scss">
  .qr-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
  }

  canvas {
    border-radius: var(--radius);
    border: 1px solid var(--border);
  }

  .url-row {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    max-width: 100%;
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--surface-tint);
  }

  .url-text {
    flex: 1;
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-sub);
    font-family: monospace;
  }

  .btn-icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border: none;
    border-radius: var(--radius);
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    transition: color 0.15s;

    &:hover { color: var(--accent); }

    .material-symbols-outlined { font-size: 18px; }
  }
</style>
