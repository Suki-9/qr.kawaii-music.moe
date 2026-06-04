<script lang="ts">
  import { resizeToDataUrl } from '@lib/icon';

  type Props = {
    value?: string;
    onchange: (dataUrl: string | undefined) => void;
  };

  let { value, onchange }: Props = $props();

  let inputEl: HTMLInputElement;

  async function handleFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeToDataUrl(file);
      onchange(dataUrl);
    } catch {
      // ignore bad files
    }
    inputEl.value = '';
  }

  function remove() {
    onchange(undefined);
  }
</script>

<div class="icon-upload">
  {#if value}
    <button type="button" class="icon-preview" onclick={remove} title="クリックして削除">
      <img src={value} alt="icon" width="32" height="32" />
      <span class="remove-overlay"><span class="material-symbols-outlined">close</span></span>
    </button>
  {:else}
    <button type="button" class="icon-placeholder" onclick={() => inputEl.click()}>
      <span class="material-symbols-outlined">add_photo_alternate</span>
    </button>
  {/if}
  <input bind:this={inputEl} type="file" accept="image/*" onchange={handleFile} hidden />
</div>

<style lang="scss">
  .icon-upload {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
  }

  .icon-preview,
  .icon-placeholder {
    width: 40px;
    height: 40px;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--surface-tint);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0;
    overflow: hidden;
  }

  .icon-preview img {
    width: 32px;
    height: 32px;
    image-rendering: pixelated;
  }

  .remove-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.15s;
    color: #fff;

    .material-symbols-outlined {
      font-size: 18px;
    }
  }

  .icon-preview:hover .remove-overlay {
    opacity: 1;
  }

  .icon-placeholder .material-symbols-outlined {
    font-size: 20px;
    color: var(--text-muted);
  }
</style>
