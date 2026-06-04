<script lang="ts">
  import IconUpload from '../components/IconUpload.svelte';
  import RecordEditor from '../components/RecordEditor.svelte';
  import QRDisplay from '../components/QRDisplay.svelte';
  import { compress } from '@lib/compress';
  import { createShortUrl } from '@lib/api';
  import type { LinkTree, LinkRecord } from '@lib/types';

  let tree = $state<LinkTree>({ title: '', icon: undefined, records: [] });
  let shortHash = $state<string | null>(null);
  let loading = $state(false);
  let error = $state<string | null>(null);

  const shortUrl = $derived(
    shortHash ? `${location.origin}/s/${shortHash}` : null
  );

  function addRecord() {
    tree.records = [...tree.records, { url: '', name: '', icon: undefined }];
  }

  function updateRecord(i: number, rec: LinkRecord) {
    tree.records = tree.records.map((r, idx) => (idx === i ? rec : r));
  }

  function removeRecord(i: number) {
    tree.records = tree.records.filter((_, idx) => idx !== i);
  }

  async function generate() {
    if (!tree.title.trim()) { error = 'タイトルを入力してください'; return; }
    if (tree.records.length === 0) { error = 'リンクを1件以上追加してください'; return; }
    const invalid = tree.records.find(r => !r.url.trim() || !r.name.trim());
    if (invalid) { error = '全てのリンクにURLと名前を入力してください'; return; }

    error = null;
    loading = true;
    try {
      const compressed = compress(tree);
      shortHash = await createShortUrl(compressed);
    } catch (e) {
      error = '生成に失敗しました。しばらくしてから再試行してください。';
    } finally {
      loading = false;
    }
  }
</script>

<div class="container editor-page">
  <header class="page-header">
    <h1 class="page-title">QR Link Tree</h1>
    <p class="page-subtitle">全データをQRに集約。サーバーは短縮URLのマッピングのみ保持します。</p>
  </header>

  <section class="section">
    <h2 class="section-title">ページ情報</h2>
    <div class="page-info-row">
      <IconUpload value={tree.icon} onchange={v => (tree.icon = v)} />
      <input
        class="input"
        type="text"
        placeholder="ページタイトル"
        bind:value={tree.title}
      />
    </div>
  </section>

  <section class="section">
    <h2 class="section-title">リンク一覧</h2>
    <div class="record-list">
      {#each tree.records as record, i}
        <RecordEditor
          {record}
          onupdate={rec => updateRecord(i, rec)}
          onremove={() => removeRecord(i)}
        />
      {/each}
    </div>
    <button type="button" class="btn btn-ghost add-btn" onclick={addRecord}>
      <span class="material-symbols-outlined">add</span>
      リンクを追加
    </button>
  </section>

  {#if error}
    <p class="error-msg">{error}</p>
  {/if}

  <button
    type="button"
    class="btn btn-primary generate-btn"
    onclick={generate}
    disabled={loading}
  >
    {#if loading}
      <span class="material-symbols-outlined spin">autorenew</span>
      生成中…
    {:else}
      <span class="material-symbols-outlined">qr_code_2</span>
      QRコードを生成
    {/if}
  </button>

  {#if shortUrl}
    <section class="section result-section">
      <h2 class="section-title">生成完了</h2>
      <QRDisplay url={shortUrl} />
      <a class="btn btn-ghost preview-link" href={`/s/${shortHash}`} target="_blank">
        <span class="material-symbols-outlined">open_in_new</span>
        プレビューを開く
      </a>
    </section>
  {/if}
</div>

<style lang="scss">
  .editor-page {
    padding: var(--space-xl) var(--space-md);
    max-width: 600px;
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
  }

  .page-header {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .page-title {
    font-size: 1.75rem;
    font-weight: 700;
  }

  .page-subtitle {
    color: var(--text-sub);
    font-size: 0.9rem;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .section-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-sub);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.8rem;
  }

  .page-info-row {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .record-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .add-btn {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    .material-symbols-outlined { font-size: 18px; }
  }

  .generate-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    .material-symbols-outlined { font-size: 20px; }
  }

  .result-section {
    align-items: center;
  }

  .preview-link {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    .material-symbols-outlined { font-size: 16px; }
  }

  .error-msg {
    color: var(--danger);
    font-size: 0.9rem;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 1s linear infinite; }
</style>
