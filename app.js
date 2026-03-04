/* ============================================
   Spiced Converter by Calyvent — app.js
   Multi-engine browser-based file converter
   ============================================ */

(function () {
  'use strict';

  // ── Converter Definitions ──────────────────────────
  // engine: 'ffmpeg' | 'canvas' | 'heic' | 'coming-soon'
  const CONVERTERS = {
    audio: [
      { id: 'mp4-to-mp3',   from: 'MP4',  to: 'MP3',  accept: '.mp4,video/mp4',                       engine: 'ffmpeg', codec: 'libmp3lame', ext: 'mp3', hasBitrate: true,  noVideo: true },
      { id: 'mp4-to-wav',   from: 'MP4',  to: 'WAV',  accept: '.mp4,video/mp4',                       engine: 'ffmpeg', codec: 'pcm_s16le',  ext: 'wav', hasBitrate: false, noVideo: true },
      { id: 'm4a-to-mp3',   from: 'M4A',  to: 'MP3',  accept: '.m4a,audio/x-m4a,audio/mp4',           engine: 'ffmpeg', codec: 'libmp3lame', ext: 'mp3', hasBitrate: true,  noVideo: false },
      { id: 'mp3-to-m4a',   from: 'MP3',  to: 'M4A',  accept: '.mp3,audio/mpeg',                      engine: 'ffmpeg', codec: 'aac',        ext: 'm4a', hasBitrate: true,  noVideo: false },
      { id: 'wav-to-mp3',   from: 'WAV',  to: 'MP3',  accept: '.wav,audio/wav,audio/x-wav',            engine: 'ffmpeg', codec: 'libmp3lame', ext: 'mp3', hasBitrate: true,  noVideo: false },
      { id: 'mp3-to-wav',   from: 'MP3',  to: 'WAV',  accept: '.mp3,audio/mpeg',                      engine: 'ffmpeg', codec: 'pcm_s16le',  ext: 'wav', hasBitrate: false, noVideo: false },
      { id: 'aac-to-mp3',   from: 'AAC',  to: 'MP3',  accept: '.aac,audio/aac',                       engine: 'ffmpeg', codec: 'libmp3lame', ext: 'mp3', hasBitrate: true,  noVideo: false },
      { id: 'm4a-to-wav',   from: 'M4A',  to: 'WAV',  accept: '.m4a,audio/x-m4a,audio/mp4',           engine: 'ffmpeg', codec: 'pcm_s16le',  ext: 'wav', hasBitrate: false, noVideo: false },
      { id: 'ogg-to-mp3',   from: 'OGG',  to: 'MP3',  accept: '.ogg,audio/ogg',                       engine: 'ffmpeg', codec: 'libmp3lame', ext: 'mp3', hasBitrate: true,  noVideo: false },
      { id: 'flac-to-mp3',  from: 'FLAC', to: 'MP3',  accept: '.flac,audio/flac',                     engine: 'ffmpeg', codec: 'libmp3lame', ext: 'mp3', hasBitrate: true,  noVideo: false },
      { id: 'mp3-to-ogg',   from: 'MP3',  to: 'OGG',  accept: '.mp3,audio/mpeg',                      engine: 'ffmpeg', codec: 'libvorbis',  ext: 'ogg', hasBitrate: true,  noVideo: false },
      { id: 'wma-to-mp3',   from: 'WMA',  to: 'MP3',  accept: '.wma,audio/x-ms-wma',                  engine: 'ffmpeg', codec: 'libmp3lame', ext: 'mp3', hasBitrate: true,  noVideo: false },
      { id: 'aiff-to-mp3',  from: 'AIFF', to: 'MP3',  accept: '.aiff,.aif,audio/aiff',                engine: 'ffmpeg', codec: 'libmp3lame', ext: 'mp3', hasBitrate: true,  noVideo: false },
      { id: 'video-to-audio',from:'Video',to: 'MP3',  accept: 'video/*',                              engine: 'ffmpeg', codec: 'libmp3lame', ext: 'mp3', hasBitrate: true,  noVideo: true },
    ],
    video: [
      { id: 'mp4-to-avi',   from: 'MP4',  to: 'AVI',  accept: '.mp4,video/mp4',                       engine: 'ffmpeg', codec: 'mpeg4',  ext: 'avi',  hasBitrate: false, noVideo: false, videoCodec: 'mpeg4', audioCodec: 'libmp3lame' },
      { id: 'avi-to-mp4',   from: 'AVI',  to: 'MP4',  accept: '.avi,video/x-msvideo',                 engine: 'ffmpeg', codec: 'aac',    ext: 'mp4',  hasBitrate: false, noVideo: false, videoCodec: 'libx264', audioCodec: 'aac' },
      { id: 'mov-to-mp4',   from: 'MOV',  to: 'MP4',  accept: '.mov,video/quicktime',                  engine: 'ffmpeg', codec: 'aac',    ext: 'mp4',  hasBitrate: false, noVideo: false, videoCodec: 'libx264', audioCodec: 'aac' },
      { id: 'mkv-to-mp4',   from: 'MKV',  to: 'MP4',  accept: '.mkv,video/x-matroska',                 engine: 'ffmpeg', codec: 'aac',    ext: 'mp4',  hasBitrate: false, noVideo: false, videoCodec: 'libx264', audioCodec: 'aac' },
      { id: 'mp4-to-mov',   from: 'MP4',  to: 'MOV',  accept: '.mp4,video/mp4',                       engine: 'ffmpeg', codec: 'aac',    ext: 'mov',  hasBitrate: false, noVideo: false, videoCodec: 'copy', audioCodec: 'copy' },
      { id: 'webm-to-mp4',  from: 'WebM', to: 'MP4',  accept: '.webm,video/webm',                     engine: 'ffmpeg', codec: 'aac',    ext: 'mp4',  hasBitrate: false, noVideo: false, videoCodec: 'libx264', audioCodec: 'aac' },
      { id: 'wmv-to-mp4',   from: 'WMV',  to: 'MP4',  accept: '.wmv,video/x-ms-wmv',                  engine: 'ffmpeg', codec: 'aac',    ext: 'mp4',  hasBitrate: false, noVideo: false, videoCodec: 'libx264', audioCodec: 'aac' },
      { id: 'flv-to-mp4',   from: 'FLV',  to: 'MP4',  accept: '.flv,video/x-flv',                     engine: 'ffmpeg', codec: 'aac',    ext: 'mp4',  hasBitrate: false, noVideo: false, videoCodec: 'libx264', audioCodec: 'aac' },
      { id: 'mp4-to-gif',   from: 'MP4',  to: 'GIF',  accept: '.mp4,video/mp4',                       engine: 'ffmpeg', codec: null,     ext: 'gif',  hasBitrate: false, noVideo: false, isGif: true },
      { id: 'compress-mp4', from: 'MP4',  to: 'MP4',  accept: '.mp4,video/mp4',                       engine: 'ffmpeg', codec: 'aac',    ext: 'mp4',  hasBitrate: false, noVideo: false, videoCodec: 'libx264', audioCodec: 'aac', compress: true },
    ],
    image: [
      { id: 'jpg-to-png',   from: 'JPG',  to: 'PNG',  accept: '.jpg,.jpeg,image/jpeg',                engine: 'canvas', outputMime: 'image/png',  ext: 'png' },
      { id: 'png-to-jpg',   from: 'PNG',  to: 'JPG',  accept: '.png,image/png',                       engine: 'canvas', outputMime: 'image/jpeg', ext: 'jpg' },
      { id: 'webp-to-jpg',  from: 'WebP', to: 'JPG',  accept: '.webp,image/webp',                     engine: 'canvas', outputMime: 'image/jpeg', ext: 'jpg' },
      { id: 'webp-to-png',  from: 'WebP', to: 'PNG',  accept: '.webp,image/webp',                     engine: 'canvas', outputMime: 'image/png',  ext: 'png' },
      { id: 'bmp-to-jpg',   from: 'BMP',  to: 'JPG',  accept: '.bmp,image/bmp',                       engine: 'canvas', outputMime: 'image/jpeg', ext: 'jpg' },
      { id: 'gif-to-jpg',   from: 'GIF',  to: 'JPG',  accept: '.gif,image/gif',                       engine: 'canvas', outputMime: 'image/jpeg', ext: 'jpg' },
      { id: 'svg-to-png',   from: 'SVG',  to: 'PNG',  accept: '.svg,image/svg+xml',                   engine: 'canvas', outputMime: 'image/png',  ext: 'png' },
      { id: 'heic-to-jpg',  from: 'HEIC', to: 'JPG',  accept: '.heic,.heif,image/heic,image/heif',    engine: 'heic',   outputMime: 'image/jpeg', ext: 'jpg' },
      { id: 'gif-to-mp4',   from: 'GIF',  to: 'MP4',  accept: '.gif,image/gif',                       engine: 'ffmpeg', codec: 'aac', ext: 'mp4', hasBitrate: false, noVideo: false, videoCodec: 'libx264', audioCodec: 'aac', gifInput: true },
      // Coming soon
      { id: 'jpg-to-pdf',   from: 'JPG',  to: 'PDF',  accept: '.jpg,.jpeg',  engine: 'coming-soon' },
      { id: 'pdf-to-jpg',   from: 'PDF',  to: 'JPG',  accept: '.pdf',        engine: 'coming-soon' },
      { id: 'png-to-ico',   from: 'PNG',  to: 'ICO',  accept: '.png',        engine: 'coming-soon' },
      { id: 'tiff-to-jpg',  from: 'TIFF', to: 'JPG',  accept: '.tiff,.tif',  engine: 'coming-soon' },
      { id: 'image-to-pdf', from: 'Image',to: 'PDF',  accept: 'image/*',     engine: 'coming-soon' },
      { id: 'pdf-to-images',from: 'PDF',  to: 'Images',accept: '.pdf',       engine: 'coming-soon' },
    ],
    document: [
      { id: 'pdf-to-word',  from: 'PDF',   to: 'DOCX',  accept: '.pdf',   engine: 'coming-soon' },
      { id: 'word-to-pdf',  from: 'DOCX',  to: 'PDF',   accept: '.docx,.doc', engine: 'coming-soon' },
      { id: 'pdf-to-excel', from: 'PDF',   to: 'XLSX',  accept: '.pdf',   engine: 'coming-soon' },
      { id: 'excel-to-pdf', from: 'XLSX',  to: 'PDF',   accept: '.xlsx,.xls', engine: 'coming-soon' },
      { id: 'pdf-to-pptx',  from: 'PDF',   to: 'PPTX',  accept: '.pdf',   engine: 'coming-soon' },
      { id: 'pptx-to-pdf',  from: 'PPTX',  to: 'PDF',   accept: '.pptx,.ppt', engine: 'coming-soon' },
      { id: 'pdf-to-txt',   from: 'PDF',   to: 'TXT',   accept: '.pdf',   engine: 'coming-soon' },
      { id: 'rtf-to-docx',  from: 'RTF',   to: 'DOCX',  accept: '.rtf',   engine: 'coming-soon' },
      { id: 'doc-to-pdf',   from: 'DOC',   to: 'PDF',   accept: '.doc',   engine: 'coming-soon' },
      { id: 'pdf-to-html',  from: 'PDF',   to: 'HTML',  accept: '.pdf',   engine: 'coming-soon' },
      { id: 'epub-to-pdf',  from: 'EPUB',  to: 'PDF',   accept: '.epub',  engine: 'coming-soon' },
      { id: 'pdf-to-epub',  from: 'PDF',   to: 'EPUB',  accept: '.pdf',   engine: 'coming-soon' },
      { id: 'csv-to-xlsx',  from: 'CSV',   to: 'XLSX',  accept: '.csv',   engine: 'coming-soon' },
      { id: 'json-to-csv',  from: 'JSON',  to: 'CSV',   accept: '.json',  engine: 'coming-soon' },
      { id: 'html-to-pdf',  from: 'HTML',  to: 'PDF',   accept: '.html,.htm', engine: 'coming-soon' },
      { id: 'ppt-to-jpg',   from: 'PPT',   to: 'JPG',   accept: '.ppt,.pptx', engine: 'coming-soon' },
      { id: 'rar-to-zip',   from: 'RAR',   to: 'ZIP',   accept: '.rar',   engine: 'coming-soon' },
      { id: 'epub-to-mobi', from: 'EPUB',  to: 'MOBI',  accept: '.epub',  engine: 'coming-soon' },
    ],
  };

  // ── State ──────────────────────────────────────────
  const state = {
    category: 'audio',
    converter: null,       // currently selected converter object
    files: [],
    bitrate: '192',
    ffmpeg: null,
    ffmpegLoaded: false,
    conversionCount: parseInt(localStorage.getItem('spiced_conversions') || '0', 10),
  };

  // ── DOM References ─────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const heroTitle       = $('#heroTitle');
  const converterGrid   = $('#converterGrid');
  const dropZone        = $('#dropZone');
  const dropText        = $('#dropText');
  const dropHint        = $('#dropHint');
  const browseBtn       = $('#browseBtn');
  const fileInput       = $('#fileInput');
  const fileListWrapper = $('#fileListWrapper');
  const fileList        = $('#fileList');
  const optionsWrapper  = $('#optionsWrapper');
  const bitrateSection  = $('#bitrateSection');
  const convertBtn      = $('#convertBtn');
  const convertCount    = $('#convertCount');
  const modalOverlay    = $('#modalOverlay');
  const modalMessage    = $('#modalMessage');
  const modalProgressBar= $('#modalProgressBar');
  const modalFile       = $('#modalFile');
  const conversionCounter = $('#conversionCounter');

  // ── Initialize ─────────────────────────────────────
  function init() {
    renderConverterGrid('audio');
    updateCounter();
    bindEvents();
    // Select the first converter by default
    selectConverter(CONVERTERS.audio[0]);
  }

  // ── Events ─────────────────────────────────────────
  function bindEvents() {
    // Category tabs
    $$('.category-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        $$('.category-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        state.category = tab.dataset.category;
        renderConverterGrid(state.category);
        // Select first non-coming-soon converter
        const first = CONVERTERS[state.category].find((c) => c.engine !== 'coming-soon');
        if (first) selectConverter(first);
        else selectConverter(null);
      });
    });

    // Drag & drop
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('drag-over'); });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('drag-over');
      if (state.converter && state.converter.engine !== 'coming-soon') {
        addFiles(Array.from(e.dataTransfer.files));
      }
    });
    dropZone.addEventListener('click', () => {
      if (state.converter && state.converter.engine !== 'coming-soon') fileInput.click();
    });

    // File input
    fileInput.addEventListener('change', (e) => {
      addFiles(Array.from(e.target.files));
      fileInput.value = '';
    });

    // Bitrate buttons
    $$('.bitrate-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.bitrate-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.bitrate = btn.dataset.bitrate;
      });
    });

    // Convert button
    convertBtn.addEventListener('click', startConversion);

    // FAQ accordions
    $$('.faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        $$('.faq-item').forEach((i) => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });
  }

  // ── Converter Grid ─────────────────────────────────
  function renderConverterGrid(category) {
    const converters = CONVERTERS[category] || [];
    converterGrid.innerHTML = '';

    converters.forEach((conv) => {
      const card = document.createElement('button');
      const isComingSoon = conv.engine === 'coming-soon';
      card.className = 'converter-card' + (isComingSoon ? ' coming-soon' : '');
      card.innerHTML = `
        <span class="card-from">${conv.from}</span>
        <span class="card-arrow">&rarr;</span>
        <span class="card-to">${conv.to}</span>
        ${isComingSoon ? '<span class="card-badge">Soon</span>' : ''}
      `;

      if (!isComingSoon) {
        card.addEventListener('click', () => selectConverter(conv));
      }

      converterGrid.appendChild(card);
    });
  }

  function selectConverter(conv) {
    state.converter = conv;
    state.files = [];
    renderFileList();

    // Update card active state
    converterGrid.querySelectorAll('.converter-card').forEach((card) => card.classList.remove('active'));
    if (conv) {
      const cards = converterGrid.querySelectorAll('.converter-card:not(.coming-soon)');
      const converters = CONVERTERS[state.category].filter((c) => c.engine !== 'coming-soon');
      const idx = converters.indexOf(conv);
      if (idx >= 0 && cards[idx]) cards[idx].classList.add('active');
    }

    // Update drop zone
    if (conv && conv.engine !== 'coming-soon') {
      dropText.textContent = 'Drop your ' + conv.from + ' files here';
      dropHint.textContent = conv.from + ' files — drag & drop or click to browse';
      fileInput.accept = conv.accept;
      browseBtn.style.display = '';
    } else {
      dropText.textContent = 'Select a converter above';
      dropHint.textContent = conv ? 'This converter is coming soon' : 'Choose a conversion type to get started';
      browseBtn.style.display = 'none';
    }

    updateUI();
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

    // Show/hide bitrate section
    const showBitrate = state.converter && state.converter.hasBitrate;
    bitrateSection.style.display = showBitrate ? 'block' : 'none';
  }

  // ── Conversion Orchestrator ────────────────────────
  async function startConversion() {
    if (!state.converter || state.files.length === 0) return;

    convertBtn.disabled = true;
    const conv = state.converter;

    try {
      if (conv.engine === 'ffmpeg') {
        showModal('Loading the engine…');
        await loadFFmpeg();
      } else if (conv.engine === 'heic') {
        showModal('Loading HEIC decoder…');
        await loadHeic2Any();
      } else {
        showModal('Preparing…');
      }

      const results = [];
      const total = state.files.length;

      for (let i = 0; i < total; i++) {
        const file = state.files[i];
        const pct = Math.round((i / total) * 100);
        updateModal('Converting with care…', pct, `${file.name} (${i + 1}/${total})`);

        let result;
        if (conv.engine === 'ffmpeg') {
          result = await convertWithFFmpeg(file, conv, i);
        } else if (conv.engine === 'canvas') {
          result = await convertWithCanvas(file, conv);
        } else if (conv.engine === 'heic') {
          result = await convertWithHeic(file, conv);
        }

        if (result) results.push(result);
        updateModal('Converting with care…', Math.round(((i + 1) / total) * 100), `${file.name} (${i + 1}/${total})`);
      }

      updateModal('Preparing your files…', 100, '');
      await delay(400);

      if (results.length === 1) {
        downloadBlob(results[0].blob, results[0].name);
      } else if (results.length > 1) {
        await downloadAsZip(results);
      }

      // Update counter
      state.conversionCount += results.length;
      localStorage.setItem('spiced_conversions', String(state.conversionCount));
      updateCounter();

      // Reset files
      state.files = [];
      renderFileList();
      updateUI();

    } catch (err) {
      console.error('Conversion error:', err);
      let msg = 'Something went wrong. ';
      if (typeof SharedArrayBuffer === 'undefined' && conv.engine === 'ffmpeg') {
        msg = 'Your browser needs special headers for this conversion. Please make sure the site is served with proper COEP/COOP headers, or try a different browser.';
      } else if (err.message) {
        msg += err.message;
      } else {
        msg += 'Please try again or try a different file.';
      }
      updateModal(msg, 0, '');
      await delay(3500);
    }

    hideModal();
    convertBtn.disabled = false;
  }

  // ── Engine: FFmpeg ─────────────────────────────────
  async function loadFFmpeg() {
    if (state.ffmpegLoaded) return;

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

  async function convertWithFFmpeg(file, conv, index) {
    const ffmpeg = state.ffmpeg;
    const inputExt = file.name.split('.').pop() || 'bin';
    const inputName = `input_${index}.${inputExt}`;
    const outputName = `output_${index}.${conv.ext}`;

    await ffmpeg.writeFile(inputName, await state.fetchFile(file));

    const args = ['-i', inputName];

    // GIF output (from video)
    if (conv.isGif) {
      args.push('-vf', 'fps=10,scale=480:-1:flags=lanczos', '-t', '10', outputName);
      await ffmpeg.exec(args);
    }
    // GIF input (to video)
    else if (conv.gifInput) {
      args.push('-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', outputName);
      await ffmpeg.exec(args);
    }
    // Video-to-video conversion
    else if (conv.videoCodec) {
      if (conv.compress) {
        args.push('-vcodec', 'libx264', '-crf', '28', '-preset', 'fast');
      } else {
        args.push('-vcodec', conv.videoCodec);
      }
      args.push('-acodec', conv.audioCodec);
      args.push(outputName);
      await ffmpeg.exec(args);
    }
    // Audio extraction / audio-to-audio
    else {
      if (conv.hasBitrate) {
        args.push('-b:a', `${state.bitrate}k`);
      }
      args.push('-acodec', conv.codec);
      if (conv.noVideo) {
        args.push('-vn');
      }
      args.push(outputName);
      await ffmpeg.exec(args);
    }

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data.buffer], { type: guessMime(conv.ext) });

    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return { blob, name: `${baseName}.${conv.ext}` };
  }

  // ── Engine: Canvas (Image Conversion) ──────────────
  async function convertWithCanvas(file, conv) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');

        // White background for JPEG (no transparency)
        if (conv.outputMime === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error('Canvas conversion failed')); return; }
            URL.revokeObjectURL(img.src);
            const baseName = file.name.replace(/\.[^/.]+$/, '');
            resolve({ blob, name: `${baseName}.${conv.ext}` });
          },
          conv.outputMime,
          0.92
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Could not load image file'));
      };

      // For SVG, read as text and create a data URL to ensure proper rendering
      if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
        const reader = new FileReader();
        reader.onload = () => {
          const svgText = reader.result;
          const blob = new Blob([svgText], { type: 'image/svg+xml' });
          img.src = URL.createObjectURL(blob);
        };
        reader.readAsText(file);
      } else {
        img.src = URL.createObjectURL(file);
      }
    });
  }

  // ── Engine: HEIC ───────────────────────────────────
  async function loadHeic2Any() {
    if (typeof heic2any === 'undefined') {
      await loadScript('https://unpkg.com/heic2any@0.0.4/dist/heic2any.min.js');
    }
  }

  async function convertWithHeic(file, conv) {
    const resultBlob = await heic2any({
      blob: file,
      toType: conv.outputMime,
      quality: 0.92,
    });

    // heic2any may return a single blob or array
    const blob = Array.isArray(resultBlob) ? resultBlob[0] : resultBlob;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return { blob, name: `${baseName}.${conv.ext}` };
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
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function downloadAsZip(results) {
    if (typeof JSZip === 'undefined') {
      await loadScript('https://unpkg.com/jszip@3.10.1/dist/jszip.min.js');
    }
    const zip = new JSZip();
    results.forEach((r) => zip.file(r.name, r.blob));
    const content = await zip.generateAsync({ type: 'blob' });
    downloadBlob(content, 'spiced-converted.zip');
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

  // ── Counter (grows daily by ~147) ──────────────────
  function updateCounter() {
    const baseCount = 12847;
    const baseDate = new Date('2025-01-01T00:00:00');
    const now = new Date();
    // Fractional days since launch — counter grows smoothly
    const daysSince = (now - baseDate) / 86400000;
    const dailyRate = 147;
    const communityCount = Math.floor(daysSince * dailyRate);
    const display = baseCount + communityCount + state.conversionCount;
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

  function guessMime(ext) {
    const map = {
      mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4', aac: 'audio/aac',
      ogg: 'audio/ogg', flac: 'audio/flac', mp4: 'video/mp4', avi: 'video/x-msvideo',
      mov: 'video/quicktime', gif: 'image/gif', png: 'image/png', jpg: 'image/jpeg',
    };
    return map[ext] || 'application/octet-stream';
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.crossOrigin = 'anonymous';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load: ' + src));
      document.head.appendChild(script);
    });
  }

  // ── Start ──────────────────────────────────────────
  init();
})();
