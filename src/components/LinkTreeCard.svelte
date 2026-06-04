<script lang="ts">
  import type { LinkRecord } from '@lib/types';

  type Props = { record: LinkRecord };
  let { record }: Props = $props();
</script>

<a class="link-card" href={record.url} target="_blank" rel="noopener noreferrer">
  {#if record.icon}
    <img class="link-icon" src={record.icon} alt="" width="32" height="32" />
  {:else}
    <span class="link-icon-placeholder material-symbols-outlined">link</span>
  {/if}
  <span class="link-name">{record.name || record.url}</span>
  <span class="link-arrow material-symbols-outlined">arrow_forward</span>
</a>

<style lang="scss">
  .link-card {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    text-decoration: none;
    color: var(--text);
    transition: background 0.15s, border-color 0.15s;
    background: var(--bg);

    &:hover {
      background: var(--surface-tint);
      border-color: var(--accent);
    }
  }

  .link-icon {
    width: 32px;
    height: 32px;
    border-radius: calc(var(--radius) * 0.5);
    image-rendering: pixelated;
    flex-shrink: 0;
  }

  .link-icon-placeholder {
    width: 32px;
    height: 32px;
    font-size: 22px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .link-name {
    flex: 1;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .link-arrow {
    font-size: 18px;
    color: var(--text-muted);
    flex-shrink: 0;
  }
</style>
