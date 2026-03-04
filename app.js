/* ============================================
   Spiced Converter — app.js
   Browser-based media conversion using FFmpeg WASM
   ============================================ */

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────
  const state = {
    files: [],
    format: 'mp3',
    inputType: 'video',
    bitrate: '192',
    ffmpeg: null,
    ffmpegLoaded: false,
    conversionCount: parseInt(localStorage.getItem('spiced_conversions') || '0', 10),
  };

  // ── DOM References ─────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dropZone = $('#dropZone');
  const dropHint = $('#dropHint');
  const fileInput = $('#fileInput');
  const fileListWrapper = $('#fileListWrapper');
  const fileList = $('#fileList');
  const optionsWrapper = $('#optionsWrapper');
  const bitrateSection = $('#bitrateSection');
  const convertBtn = $('#convertBtn');
  const convertCount = $('#convertCount');
  const modalOverlay = $('#modalOverlay');
  const modalMessage = $('#modalMessage');
  const modalProgressBar = $('#modalProgressBar');
  const modalFile = $('#modalFile');
  const conversionCounter = $('#conversionCounter');

  // ── Format Configuration ───────────────────────────
  const formatConfig = {
    mp3:  { ext: 'mp3',  codec: 'libmp3lame', hasBitrate: true,  hint: 'MP4 • MOV • M4V • any video with audio' },
    wav:  { ext: 'wav',  codec: 'pcm_s16le',  hasBitrate: false, hint: 'MP4 • MOV • MKV • any video with audio' },
    aac:  { ext: 'aac',  codec: 'aac',        hasBitrate: true,  hint: 'MP4 • MOV • AVI • any video with audio' },
    ogg:  { ext: 'ogg',  codec: 'libvorbis',  hasBitrate: true,  hint: 'MP4 • MOV • WebM • any video with audio' },
    flac: { ext: 'flac', codec: 'flac',       hasBitrate: false, hint: 'WAV • OGG • MP3 • any audio file' },
  };

  // ── Initialize ─────────────────────────────────────
  function init() {
    updateCounter();
    bindEvents();
  }

  // ── Events ─────────────────────────────────────────
  function bindEvents() {
    // Drag & drop
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('click', () => fileInput.click());

    // File input
    fileInput.addEventListener('change', handleFileSelect);

    // Converter tabs
    $$('.converter-tab').forEach((tab) => {
      tab.addEventListener('click', () => switchConverter(tab));
    });

    // Bitrate buttons
    $$('.bitrate-btn').forEach((btn) => {
      btn.addEventListener('click', () => selectBitrate(btn));
    });

    // Convert button
    convertBtn.addEventListener('click', startConversion);

    // FAQ accordions
    $$('.faq-question').forEach((btn) => {
      btn.addEventListener('click', () => toggleFaq(btn));
    });
  }

  // ── Drag & Drop ────────────────────────────────────
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('drag-over');
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    addFiles(files);
    fileInput.value = '';
  }

  // ── File Management ────────────────────────────────
  function addFiles(newFiles) {
    newFiles.forEach((file) => {
      if (!state.files.find((f) => f.name === file.name && f.size === file.size)) {
        state.files.push(file);
      }
    });
    renderFileList();
    updateUI();
  }

  function removeFile(index) {
    state.files.splice(index, 1);
    renderFileList();
    updateUI();
  }

  function renderFileList() {
    fileList.innerHTML = '';
    state.files.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.style.animationDelay = `${index * 0.05}s`;
      item.innerHTML = `
        <div class="file-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
          </svg>
        </div>
        <div class="file-info">
          <div class="file-name">${escapeHtml(file.name)}</div>
          <div class="file-size">${formatSize(file.size)}</div>
        </div>
        <button class="file-remove" data-index="${index}" title="Remove file">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/>
          </svg>
        </button>
      `;
      fileList.appendChild(item);
    });

    // Bind remove buttons
    fileList.querySelectorAll('.file-remove').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFile(parseInt(btn.dataset.index, 10));
      });
    });
  }

  function updateUI() {
    const hasFiles = state.files.length > 0;
    fileListWrapper.hidden = !hasFiles;
    optionsWrapper.hidden = !hasFiles;

    if (hasFiles) {
      const count = state.files.length;
      convertCount.textContent = `${count} file${count > 1 ? 's' : ''}`;
    }

    // Show/hide bitrate section based on format
    const config = formatConfig[state.format];
    bitrateSection.style.display = config.hasBitrate ? 'block' : 'none';
  }

  // ── Converter Switching ────────────────────────────
  function switchConverter(tab) {
    $$('.converter-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    state.format = tab.dataset.format;
    state.inputType = tab.dataset.type;

    // Update drop hint
    const config = formatConfig[state.format];
    dropHint.textContent = config.hint;

    // Update accept attribute
    fileInput.accept = state.inputType === 'audio' ? 'audio/*' : 'video/*,audio/*';

    updateUI();
  }

  // ── Bitrate ────────────────────────────────────────
  function selectBitrate(btn) {
    $$('.bitrate-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.bitrate = btn.dataset.bitrate;
  }

  // ── FAQ ────────────────────────────────────────────
  function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    $$('.faq-item').forEach((i) => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  }

  // ── Conversion ─────────────────────────────────────
  async function startConversion() {
    if (state.files.length === 0) return;

    convertBtn.disabled = true;
    showModal('Loading the engine…');

    try {
      await loadFFmpeg();

      const results = [];
      const total = state.files.length;

      for (let i = 0; i < total; i++) {
        const file = state.files[i];
        const progress = Math.round(((i) / total) * 100);
        updateModal('Converting with care…', progress, `${file.name} (${i + 1}/${total})`);

        const result = await convertFile(file, i, total);
        results.push(result);

        const afterProgress = Math.round(((i + 1) / total) * 100);
        updateModal('Converting with care…', afterProgress, `${file.name} (${i + 1}/${total})`);
      }

      updateModal('Preparing your files…', 100, '');

      // Small delay for UX
      await delay(500);

      if (results.length === 1) {
        downloadBlob(results[0].blob, results[0].name);
      } else {
        await downloadAsZip(results);
      }

      // Update counter
      state.conversionCount += results.length;
      localStorage.setItem('spiced_conversions', String(state.conversionCount));
      updateCounter();

      // Reset
      state.files = [];
      renderFileList();
      updateUI();

    } catch (err) {
      console.error('Conversion error:', err);
      updateModal('Something went wrong. Please try again.', 0, '');
      await delay(2000);
    }

    hideModal();
    convertBtn.disabled = false;
  }

  async function loadFFmpeg() {
    if (state.ffmpegLoaded) return;

    // Dynamically load FFmpeg WASM from CDN
    if (typeof FFmpeg === 'undefined') {
      await loadScript('https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js');
    }
    if (typeof FFmpegUtil === 'undefined') {
      await loadScript('https://unpkg.com/@ffmpeg/util@0.12.1/dist/umd/util.js');
    }

    const { FFmpeg: FFmpegClass } = FFmpeg;
    const { fetchFile } = FFmpegUtil;

    state.fetchFile = fetchFile;
    state.ffmpeg = new FFmpegClass();

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

    await state.ffmpeg.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });

    state.ffmpegLoaded = true;
  }

  async function convertFile(file, index, total) {
    const ffmpeg = state.ffmpeg;
    const config = formatConfig[state.format];

    const inputName = `input_${index}`;
    const outputName = `output_${index}.${config.ext}`;

    // Write file to FFmpeg FS
    await ffmpeg.writeFile(inputName, await state.fetchFile(file));

    // Build FFmpeg args
    const args = ['-i', inputName];

    if (config.hasBitrate) {
      args.push('-b:a', `${state.bitrate}k`);
    }

    // Codec
    args.push('-acodec', config.codec);

    // No video
    args.push('-vn');

    // Output
    args.push(outputName);

    await ffmpeg.exec(args);

    // Read result
    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data.buffer], { type: `audio/${config.ext}` });

    // Clean up
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

    // Build output filename
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const outFileName = `${baseName}.${config.ext}`;

    return { blob, name: outFileName };
  }

  // ── Download Helpers ───────────────────────────────
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function downloadAsZip(results) {
    // Use JSZip from CDN
    if (typeof JSZip === 'undefined') {
      await loadScript('https://unpkg.com/jszip@3.10.1/dist/jszip.min.js');
    }

    const zip = new JSZip();
    results.forEach((r) => {
      zip.file(r.name, r.blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    downloadBlob(content, `spiced-converted.zip`);
  }

  // ── Modal ──────────────────────────────────────────
  function showModal(message) {
    modalMessage.textContent = message;
    modalProgressBar.style.width = '0%';
    modalFile.textContent = '';
    modalOverlay.hidden = false;
  }

  function updateModal(message, progress, file) {
    modalMessage.textContent = message;
    modalProgressBar.style.width = `${progress}%`;
    modalFile.textContent = file || '';
  }

  function hideModal() {
    modalOverlay.hidden = true;
  }

  // ── Counter ────────────────────────────────────────
  function updateCounter() {
    // Add a little warmth — simulate community count
    const base = 12847;
    const display = base + state.conversionCount;
    conversionCounter.textContent = display.toLocaleString();
  }

  // ── Utilities ──────────────────────────────────────
  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // ── Start ──────────────────────────────────────────
  init();
})();
