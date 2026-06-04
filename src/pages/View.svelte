<script lang="ts">
  import LinkTreeCard from '../components/LinkTreeCard.svelte';
  import { decompress } from '@lib/compress';
  import type { LinkTree } from '@lib/types';

  declare global {
    interface Window { __QR_DATA__?: string; }
  }

  function load(): LinkTree | null {
    const raw = window.__QR_DATA__;
    if (!raw) return null;
    try { return decompress(raw); } catch { return null; }
  }

  const tree = load();
</script>

{#if tree}
  <div class="container view-page">
    <header class="tree-header">
      {#if tree.icon}
        <img class="tree-icon" src={tree.icon} alt="" width="64" height="64" />
      {/if}
      <h1 class="tree-title">{tree.title}</h1>
    </header>

    <ul class="link-list">
      {#each tree.records as record}
        <li>
          <LinkTreeCard {record} />
        </li>
      {/each}
    </ul>

    <footer class="view-footer">
      <a href="/" class="create-link">
        <span class="material-symbols-outlined">qr_code_2</span>
        あなたのLink Treeを作成
      </a>
    </footer>
  </div>
{:else}
  <div class="container not-found">
    <span class="material-symbols-outlined">error</span>
    <p>リンクが見つかりません</p>
    <a href="/" class="btn btn-ghost">トップへ戻る</a>
  </div>
{/if}

<style lang="scss">
  .view-page {
    padding: var(--space-xl) var(--space-md);
    max-width: 560px;
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
  }

  .tree-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    text-align: center;
  }

  .tree-icon {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-lg);
    image-rendering: pixelated;
  }

  .tree-title {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .link-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .view-footer {
    display: flex;
    justify-content: center;
    padding-top: var(--space-lg);
    border-top: 1px solid var(--border);
  }

  .create-link {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: 0.85rem;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.15s;

    &:hover { color: var(--accent); }

    .material-symbols-outlined { font-size: 16px; }
  }

  .not-found {
    padding: var(--space-xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    color: var(--text-muted);

    .material-symbols-outlined {
      font-size: 48px;
    }
  }
</style>
