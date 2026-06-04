<script lang="ts">
  import IconUpload from './IconUpload.svelte';
  import type { LinkRecord } from '@lib/types';

  type Props = {
    record: LinkRecord;
    onupdate: (record: LinkRecord) => void;
    onremove: () => void;
  };

  let { record, onupdate, onremove }: Props = $props();

  function set<K extends keyof LinkRecord>(key: K, val: LinkRecord[K]) {
    onupdate({ ...record, [key]: val });
  }
</script>

<div class="record-row">
  <IconUpload value={record.icon} onchange={v => set('icon', v)} />

  <div class="record-fields">
    <input
      class="input"
      type="text"
      placeholder="表示名"
      value={record.name}
      oninput={e => set('name', (e.target as HTMLInputElement).value)}
    />
    <input
      class="input"
      type="url"
      placeholder="https://example.com"
      value={record.url}
      oninput={e => set('url', (e.target as HTMLInputElement).value)}
    />
  </div>

  <button type="button" class="btn-icon danger" onclick={onremove} aria-label="削除">
    <span class="material-symbols-outlined">delete</span>
  </button>
</div>

<style lang="scss">
  .record-row {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    border-radius: var(--radius);
    background: var(--surface-tint);
  }

  .record-fields {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    min-width: 0;
  }

  .btn-icon {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border: none;
    border-radius: var(--radius);
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    transition: color 0.15s, background 0.15s;

    &.danger:hover {
      color: var(--danger);
      background: rgba(217, 83, 79, 0.08);
    }

    .material-symbols-outlined {
      font-size: 20px;
    }
  }
</style>
