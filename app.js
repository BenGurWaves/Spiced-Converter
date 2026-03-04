/* ============================================
   Spiced Converter by Calyvent — app.js
   Multi-engine browser-based file converter
   ============================================ */

(function () {
  'use strict';

  // ── Converter Definitions ──────────────────────────
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
      { id: 'jpg-to-pdf',   from: 'JPG',  to: 'PDF',  accept: '.jpg,.jpeg,image/jpeg',                engine: 'img2pdf', ext: 'pdf' },
      { id: 'png-to-pdf',   from: 'PNG',  to: 'PDF',  accept: '.png,image/png',                       engine: 'img2pdf', ext: 'pdf' },
      { id: 'png-to-ico',   from: 'PNG',  to: 'ICO',  accept: '.png,image/png',                       engine: 'ico',     ext: 'ico' },
      { id: 'tiff-to-jpg',  from: 'TIFF', to: 'JPG',  accept: '.tiff,.tif,image/tiff',                engine: 'canvas', outputMime: 'image/jpeg', ext: 'jpg' },
      { id: 'image-to-pdf', from: 'Image',to: 'PDF',  accept: 'image/*',                              engine: 'img2pdf', ext: 'pdf' },
      { id: 'pdf-to-jpg',   from: 'PDF',  to: 'JPG',  accept: '.pdf,application/pdf',                 engine: 'pdfjs', outputMime: 'image/jpeg', ext: 'jpg' },
      { id: 'pdf-to-png',   from: 'PDF',  to: 'PNG',  accept: '.pdf,application/pdf',                 engine: 'pdfjs', outputMime: 'image/png',  ext: 'png' },
    ],
    document: [
      { id: 'pdf-to-txt',   from: 'PDF',  to: 'TXT',  accept: '.pdf,application/pdf',                 engine: 'pdf-text', ext: 'txt' },
      { id: 'pdf-to-html',  from: 'PDF',  to: 'HTML', accept: '.pdf,application/pdf',                 engine: 'pdf-text', ext: 'html' },
      { id: 'pdf-to-word',  from: 'PDF',  to: 'DOCX', accept: '.pdf,application/pdf',                 engine: 'pdf-text', ext: 'docx' },
      { id: 'word-to-pdf',  from: 'DOCX', to: 'PDF',  accept: '.docx,.doc',                           engine: 'mammoth', ext: 'pdf' },
      { id: 'doc-to-pdf',   from: 'DOC',  to: 'PDF',  accept: '.doc',                                 engine: 'mammoth', ext: 'pdf' },
      { id: 'csv-to-xlsx',  from: 'CSV',  to: 'XLSX', accept: '.csv,text/csv',                        engine: 'sheetjs', ext: 'xlsx' },
      { id: 'json-to-csv',  from: 'JSON', to: 'CSV',  accept: '.json,application/json',               engine: 'json-csv', ext: 'csv' },
      { id: 'xlsx-to-pdf',  from: 'XLSX', to: 'PDF',  accept: '.xlsx,.xls',                           engine: 'xlsx-pdf', ext: 'pdf' },
      { id: 'html-to-pdf',  from: 'HTML', to: 'PDF',  accept: '.html,.htm,text/html',                 engine: 'html-pdf', ext: 'pdf' },
      { id: 'rtf-to-txt',   from: 'RTF',  to: 'TXT',  accept: '.rtf',                                 engine: 'rtf-txt',  ext: 'txt' },
      { id: 'epub-to-txt',  from: 'EPUB', to: 'TXT',  accept: '.epub',                                engine: 'epub-txt', ext: 'txt' },
      { id: 'pdf-to-xlsx',  from: 'PDF',  to: 'XLSX', accept: '.pdf,application/pdf',                 engine: 'pdf-xlsx', ext: 'xlsx' },
    ],
  };

  // ── State ──────────────────────────────────────────
  const state = {
    category: 'audio',
    converter: null,
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
    selectConverter(CONVERTERS.audio[0]);
  }

  // ── Events ─────────────────────────────────────────
  function bindEvents() {
    $$('.category-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        $$('.category-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        state.category = tab.dataset.category;
        renderConverterGrid(state.category);
        const first = CONVERTERS[state.category][0];
        if (first) selectConverter(first);
        else selectConverter(null);
      });
    });

    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('drag-over'); });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('drag-over');
      if (state.converter) addFiles(Array.from(e.dataTransfer.files));
    });
    dropZone.addEventListener('click', () => {
      if (state.converter) fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      addFiles(Array.from(e.target.files));
      fileInput.value = '';
    });

    $$('.bitrate-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.bitrate-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.bitrate = btn.dataset.bitrate;
      });
    });

    convertBtn.addEventListener('click', startConversion);

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
      card.className = 'converter-card';
      card.innerHTML = `
        <span class="card-from">${conv.from}</span>
        <span class="card-arrow">&rarr;</span>
        <span class="card-to">${conv.to}</span>
      `;
      card.addEventListener('click', () => selectConverter(conv));
      converterGrid.appendChild(card);
    });
  }

  function selectConverter(conv) {
    state.converter = conv;
    state.files = [];
    renderFileList();

    converterGrid.querySelectorAll('.converter-card').forEach((card) => card.classList.remove('active'));
    if (conv) {
      const cards = converterGrid.querySelectorAll('.converter-card');
      const converters = CONVERTERS[state.category];
      const idx = converters.indexOf(conv);
      if (idx >= 0 && cards[idx]) cards[idx].classList.add('active');
    }

    if (conv) {
      dropText.textContent = 'Drop your ' + conv.from + ' files here';
      dropHint.textContent = conv.from + ' files — drag & drop or click to browse';
      fileInput.accept = conv.accept;
      browseBtn.style.display = '';
    } else {
      dropText.textContent = 'Select a converter above';
      dropHint.textContent = 'Choose a conversion type to get started';
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

    const showBitrate = state.converter && state.converter.hasBitrate;
    bitrateSection.style.display = showBitrate ? 'block' : 'none';
  }

  // ── Conversion Orchestrator ────────────────────────
  async function startConversion() {
    if (!state.converter || state.files.length === 0) return;

    convertBtn.disabled = true;
    const conv = state.converter;

    try {
      showModal('Preparing…');

      // Pre-load required engines
      if (conv.engine === 'ffmpeg') {
        showModal('Loading conversion engine…');
        await loadFFmpeg();
      } else if (conv.engine === 'heic') {
        showModal('Loading HEIC decoder…');
        await loadHeic2Any();
      } else if (conv.engine === 'img2pdf' || conv.engine === 'html-pdf' || conv.engine === 'xlsx-pdf' || conv.engine === 'mammoth') {
        showModal('Loading PDF engine…');
        await loadJsPdf();
        if (conv.engine === 'mammoth') await loadMammoth();
        if (conv.engine === 'xlsx-pdf') await loadSheetJs();
      } else if (conv.engine === 'pdfjs' || conv.engine === 'pdf-text' || conv.engine === 'pdf-xlsx') {
        showModal('Loading PDF reader…');
        await loadPdfJs();
        if (conv.engine === 'pdf-text' && conv.ext === 'docx') await loadJSZip();
        if (conv.engine === 'pdf-xlsx') await loadSheetJs();
      } else if (conv.engine === 'sheetjs') {
        showModal('Loading spreadsheet engine…');
        await loadSheetJs();
      } else if (conv.engine === 'epub-txt') {
        await loadJSZip();
      }

      const results = [];
      const total = state.files.length;

      for (let i = 0; i < total; i++) {
        const file = state.files[i];
        const pct = Math.round((i / total) * 100);
        updateModal('Converting…', pct, `${file.name} (${i + 1}/${total})`);

        const result = await convertFile(file, conv, i);
        if (result) {
          if (Array.isArray(result)) results.push(...result);
          else results.push(result);
        }
        updateModal('Converting…', Math.round(((i + 1) / total) * 100), `${file.name} (${i + 1}/${total})`);
      }

      updateModal('Preparing download…', 100, '');
      await delay(300);

      if (results.length === 1) {
        downloadBlob(results[0].blob, results[0].name);
      } else if (results.length > 1) {
        await downloadAsZip(results);
      }

      state.conversionCount += results.length;
      localStorage.setItem('spiced_conversions', String(state.conversionCount));
      updateCounter();

      state.files = [];
      renderFileList();
      updateUI();

    } catch (err) {
      console.error('Conversion error:', err);
      let msg = 'Something went wrong. ';
      if (typeof SharedArrayBuffer === 'undefined' && conv.engine === 'ffmpeg') {
        msg = 'Your browser needs special headers (COEP/COOP) for audio/video conversion. Try a different browser or check the site headers.';
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

  // ── Conversion Router ──────────────────────────────
  async function convertFile(file, conv, index) {
    switch (conv.engine) {
      case 'ffmpeg':    return convertWithFFmpeg(file, conv, index);
      case 'canvas':    return convertWithCanvas(file, conv);
      case 'heic':      return convertWithHeic(file, conv);
      case 'img2pdf':   return convertImg2Pdf(file, conv);
      case 'pdfjs':     return convertPdfToImage(file, conv);
      case 'pdf-text':  return convertPdfToText(file, conv);
      case 'pdf-xlsx':  return convertPdfToXlsx(file, conv);
      case 'ico':       return convertPngToIco(file, conv);
      case 'mammoth':   return convertDocxToPdf(file, conv);
      case 'sheetjs':   return convertCsvToXlsx(file, conv);
      case 'json-csv':  return convertJsonToCsv(file, conv);
      case 'xlsx-pdf':  return convertXlsxToPdf(file, conv);
      case 'html-pdf':  return convertHtmlToPdf(file, conv);
      case 'rtf-txt':   return convertRtfToTxt(file, conv);
      case 'epub-txt':  return convertEpubToTxt(file, conv);
      default:
        throw new Error('Unsupported conversion type');
    }
  }

  // ── Engine: FFmpeg ─────────────────────────────────
  async function loadFFmpeg() {
    if (state.ffmpegLoaded) return;

    if (typeof FFmpegWASM === 'undefined') {
      await loadScript('https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js');
    }
    if (typeof FFmpegUtil === 'undefined') {
      await loadScript('https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/dist/umd/index.js');
    }

    const { FFmpeg: FFmpegClass } = FFmpegWASM;
    const { fetchFile } = FFmpegUtil;

    state.fetchFile = fetchFile;
    state.ffmpeg = new FFmpegClass();

    const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd';

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

    if (conv.isGif) {
      args.push('-vf', 'fps=10,scale=480:-1:flags=lanczos', '-t', '10', outputName);
      await ffmpeg.exec(args);
    } else if (conv.gifInput) {
      args.push('-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', outputName);
      await ffmpeg.exec(args);
    } else if (conv.videoCodec) {
      if (conv.compress) {
        args.push('-vcodec', 'libx264', '-crf', '28', '-preset', 'fast');
      } else {
        args.push('-vcodec', conv.videoCodec);
      }
      args.push('-acodec', conv.audioCodec, outputName);
      await ffmpeg.exec(args);
    } else {
      if (conv.hasBitrate) args.push('-b:a', `${state.bitrate}k`);
      args.push('-acodec', conv.codec);
      if (conv.noVideo) args.push('-vn');
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
          1.0
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Could not load image file'));
      };

      if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
        const reader = new FileReader();
        reader.onload = () => {
          const svgBlob = new Blob([reader.result], { type: 'image/svg+xml' });
          img.src = URL.createObjectURL(svgBlob);
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
      await loadScript('https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js');
    }
  }

  async function convertWithHeic(file, conv) {
    const resultBlob = await heic2any({ blob: file, toType: conv.outputMime, quality: 1.0 });
    const blob = Array.isArray(resultBlob) ? resultBlob[0] : resultBlob;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return { blob, name: `${baseName}.${conv.ext}` };
  }

  // ── Engine: Image to PDF (jsPDF) ───────────────────
  async function loadJsPdf() {
    if (typeof jspdf === 'undefined' && typeof jsPDF === 'undefined') {
      await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js');
    }
  }

  async function convertImg2Pdf(file, conv) {
    const JsPDF = (typeof jspdf !== 'undefined') ? jspdf.jsPDF : jsPDF;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const orientation = w > h ? 'l' : 'p';
        const doc = new JsPDF({ orientation, unit: 'px', format: [w, h] });

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 1.0);

        doc.addImage(dataUrl, 'JPEG', 0, 0, w, h);
        const pdfBlob = doc.output('blob');

        URL.revokeObjectURL(img.src);
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        resolve({ blob: pdfBlob, name: `${baseName}.pdf` });
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Could not load image'));
      };
      img.src = URL.createObjectURL(file);
    });
  }

  // ── Engine: PDF to Image (pdf.js) ──────────────────
  async function loadPdfJs() {
    if (typeof pdfjsLib === 'undefined') {
      await loadScript('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
    }
  }

  async function convertPdfToImage(file, conv) {
    const arrayBuf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuf }).promise;
    const results = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const scale = 2;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (conv.outputMime === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      await page.render({ canvasContext: ctx, viewport }).promise;

      const blob = await new Promise((res) => canvas.toBlob(res, conv.outputMime, 1.0));
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const suffix = pdf.numPages > 1 ? `_page${i}` : '';
      results.push({ blob, name: `${baseName}${suffix}.${conv.ext}` });
    }

    return results;
  }

  // ── Engine: PDF to Text/HTML/DOCX ──────────────────
  async function extractPdfText(file) {
    const arrayBuf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuf }).promise;
    const pages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item) => item.str).join(' ');
      pages.push(text);
    }

    return pages;
  }

  async function convertPdfToText(file, conv) {
    const pages = await extractPdfText(file);
    const baseName = file.name.replace(/\.[^/.]+$/, '');

    if (conv.ext === 'txt') {
      const text = pages.join('\n\n--- Page Break ---\n\n');
      const blob = new Blob([text], { type: 'text/plain' });
      return { blob, name: `${baseName}.txt` };
    }

    if (conv.ext === 'html') {
      const htmlContent = pages.map((p, i) =>
        `<div class="page"><h2>Page ${i + 1}</h2><p>${escapeHtml(p)}</p></div>`
      ).join('\n');
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHtml(baseName)}</title><style>body{font-family:sans-serif;max-width:800px;margin:2em auto;padding:0 1em}.page{margin-bottom:2em;padding-bottom:1em;border-bottom:1px solid #ccc}</style></head><body>${htmlContent}</body></html>`;
      const blob = new Blob([html], { type: 'text/html' });
      return { blob, name: `${baseName}.html` };
    }

    if (conv.ext === 'docx') {
      return createDocxFromText(pages, baseName);
    }

    throw new Error('Unsupported PDF output format');
  }

  async function createDocxFromText(pages, baseName) {
    if (typeof JSZip === 'undefined') await loadJSZip();
    const zip = new JSZip();

    const paragraphs = pages.map((pageText) =>
      pageText.split(/\n/).map((line) =>
        `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`
      ).join('')
    ).join('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');

    zip.file('[Content_Types].xml',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
      '</Types>');

    zip.file('_rels/.rels',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
      '</Relationships>');

    zip.file('word/_rels/document.xml.rels',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>');

    zip.file('word/document.xml',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      '<w:body>' + paragraphs + '</w:body></w:document>');

    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    return { blob, name: `${baseName}.docx` };
  }

  // ── Engine: PDF to XLSX ────────────────────────────
  async function convertPdfToXlsx(file, conv) {
    const pages = await extractPdfText(file);
    const wb = XLSX.utils.book_new();

    pages.forEach((pageText, i) => {
      const rows = pageText.split(/\n/).filter((r) => r.trim()).map((line) => line.split(/\t|  +/));
      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, `Page ${i + 1}`);
    });

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return { blob, name: `${baseName}.xlsx` };
  }

  // ── Engine: DOCX/DOC to PDF (Mammoth + jsPDF) ─────
  async function loadMammoth() {
    if (typeof mammoth === 'undefined') {
      await loadScript('https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js');
    }
  }

  async function convertDocxToPdf(file, conv) {
    const JsPDF = (typeof jspdf !== 'undefined') ? jspdf.jsPDF : jsPDF;
    const arrayBuf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuf });
    const text = result.value;

    const doc = new JsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 6;
    let y = margin;

    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }

    const pdfBlob = doc.output('blob');
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return { blob: pdfBlob, name: `${baseName}.pdf` };
  }

  // ── Engine: PNG to ICO ─────────────────────────────
  async function convertPngToIco(file, conv) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const sizes = [16, 32, 48];
        const images = [];

        for (const size of sizes) {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, size, size);
          const imageData = ctx.getImageData(0, 0, size, size);
          images.push({ size, data: imageData });
        }

        const icoBlob = createIcoBlob(images);
        URL.revokeObjectURL(img.src);
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        resolve({ blob: icoBlob, name: `${baseName}.ico` });
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Could not load image'));
      };
      img.src = URL.createObjectURL(file);
    });
  }

  function createIcoBlob(images) {
    const headerSize = 6;
    const dirEntrySize = 16;
    let offset = headerSize + dirEntrySize * images.length;
    const buffers = [];

    // ICO header
    const header = new ArrayBuffer(headerSize);
    const hv = new DataView(header);
    hv.setUint16(0, 0, true);     // reserved
    hv.setUint16(2, 1, true);     // ICO type
    hv.setUint16(4, images.length, true);
    buffers.push(header);

    const bmpDataBuffers = [];
    for (const img of images) {
      const bmpInfoSize = 40;
      const pixelDataSize = img.size * img.size * 4;
      const totalSize = bmpInfoSize + pixelDataSize;

      // Directory entry
      const entry = new ArrayBuffer(dirEntrySize);
      const ev = new DataView(entry);
      ev.setUint8(0, img.size < 256 ? img.size : 0);
      ev.setUint8(1, img.size < 256 ? img.size : 0);
      ev.setUint8(2, 0);
      ev.setUint8(3, 0);
      ev.setUint16(4, 1, true);
      ev.setUint16(6, 32, true);
      ev.setUint32(8, totalSize, true);
      ev.setUint32(12, offset, true);
      buffers.push(entry);

      // BMP data
      const bmpBuf = new ArrayBuffer(totalSize);
      const bv = new DataView(bmpBuf);
      bv.setUint32(0, bmpInfoSize, true);
      bv.setInt32(4, img.size, true);
      bv.setInt32(8, img.size * 2, true);
      bv.setUint16(12, 1, true);
      bv.setUint16(14, 32, true);
      bv.setUint32(16, 0, true);
      bv.setUint32(20, pixelDataSize, true);

      const pixels = new Uint8Array(bmpBuf, bmpInfoSize);
      const src = img.data.data;
      for (let y = img.size - 1; y >= 0; y--) {
        for (let x = 0; x < img.size; x++) {
          const si = (y * img.size + x) * 4;
          const di = ((img.size - 1 - y) * img.size + x) * 4;
          pixels[di] = src[si + 2];     // B
          pixels[di + 1] = src[si + 1]; // G
          pixels[di + 2] = src[si];     // R
          pixels[di + 3] = src[si + 3]; // A
        }
      }

      bmpDataBuffers.push(bmpBuf);
      offset += totalSize;
    }

    buffers.push(...bmpDataBuffers);
    const totalLen = buffers.reduce((sum, b) => sum + b.byteLength, 0);
    const result = new Uint8Array(totalLen);
    let pos = 0;
    for (const buf of buffers) {
      result.set(new Uint8Array(buf), pos);
      pos += buf.byteLength;
    }

    return new Blob([result], { type: 'image/x-icon' });
  }

  // ── Engine: CSV to XLSX (SheetJS) ──────────────────
  async function loadSheetJs() {
    if (typeof XLSX === 'undefined') {
      await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
    }
  }

  async function convertCsvToXlsx(file, conv) {
    const text = await file.text();
    const wb = XLSX.read(text, { type: 'string' });
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return { blob, name: `${baseName}.xlsx` };
  }

  // ── Engine: JSON to CSV ────────────────────────────
  async function convertJsonToCsv(file, conv) {
    const text = await file.text();
    const data = JSON.parse(text);

    let rows;
    if (Array.isArray(data)) {
      rows = data;
    } else if (typeof data === 'object') {
      rows = [data];
    } else {
      throw new Error('JSON must contain an array of objects or an object');
    }

    if (rows.length === 0) throw new Error('JSON array is empty');

    const headers = [...new Set(rows.flatMap((r) => Object.keys(r)))];
    const csvLines = [headers.map(csvEscape).join(',')];

    for (const row of rows) {
      csvLines.push(headers.map((h) => csvEscape(String(row[h] ?? ''))).join(','));
    }

    const csvText = csvLines.join('\n');
    const blob = new Blob([csvText], { type: 'text/csv' });
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return { blob, name: `${baseName}.csv` };
  }

  function csvEscape(val) {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  }

  // ── Engine: XLSX to PDF ────────────────────────────
  async function convertXlsxToPdf(file, conv) {
    const JsPDF = (typeof jspdf !== 'undefined') ? jspdf.jsPDF : jsPDF;
    const arrayBuf = await file.arrayBuffer();
    const wb = XLSX.read(arrayBuf, { type: 'array' });

    const doc = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'l' });
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    let firstSheet = true;

    for (const sheetName of wb.SheetNames) {
      if (!firstSheet) doc.addPage();
      firstSheet = false;

      const ws = wb.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (data.length === 0) continue;

      doc.setFontSize(12);
      doc.text(sheetName, margin, margin + 4);

      const colCount = Math.max(...data.map((r) => r.length));
      const colWidth = Math.min(40, (pageWidth - margin * 2) / colCount);
      let y = margin + 10;

      doc.setFontSize(8);
      for (const row of data) {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        for (let c = 0; c < colCount; c++) {
          const val = String(row[c] ?? '');
          const truncated = val.substring(0, Math.floor(colWidth / 2));
          doc.text(truncated, margin + c * colWidth, y);
        }
        y += 5;
      }
    }

    const pdfBlob = doc.output('blob');
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return { blob: pdfBlob, name: `${baseName}.pdf` };
  }

  // ── Engine: HTML to PDF ────────────────────────────
  async function convertHtmlToPdf(file, conv) {
    const JsPDF = (typeof jspdf !== 'undefined') ? jspdf.jsPDF : jsPDF;
    const htmlText = await file.text();

    // Parse HTML and extract text content
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlText, 'text/html');
    const textContent = htmlDoc.body.innerText || htmlDoc.body.textContent || '';

    const doc = new JsPDF({ unit: 'mm', format: 'a4' });
    const margin = 20;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const lineHeight = 6;
    let y = margin;

    const lines = doc.splitTextToSize(textContent, maxWidth);
    for (const line of lines) {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }

    const pdfBlob = doc.output('blob');
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return { blob: pdfBlob, name: `${baseName}.pdf` };
  }

  // ── Engine: RTF to TXT ─────────────────────────────
  async function convertRtfToTxt(file, conv) {
    const rtfText = await file.text();
    // Strip RTF control words and groups, keep plain text
    let text = rtfText
      .replace(/\{\\[^{}]*\}/g, '')     // Remove groups like {\fonttbl...}
      .replace(/\\[a-z]+\d*\s?/gi, '')  // Remove control words like \par, \b0
      .replace(/[{}]/g, '')              // Remove remaining braces
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return { blob, name: `${baseName}.txt` };
  }

  // ── Engine: EPUB to TXT ────────────────────────────
  async function convertEpubToTxt(file, conv) {
    const arrayBuf = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuf);

    const textParts = [];
    const parser = new DOMParser();

    for (const [path, zipEntry] of Object.entries(zip.files)) {
      if (path.endsWith('.html') || path.endsWith('.xhtml') || path.endsWith('.htm')) {
        const html = await zipEntry.async('string');
        const doc = parser.parseFromString(html, 'text/html');
        const text = doc.body.innerText || doc.body.textContent || '';
        if (text.trim()) textParts.push(text.trim());
      }
    }

    const fullText = textParts.join('\n\n--- ---\n\n');
    const blob = new Blob([fullText], { type: 'text/plain' });
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return { blob, name: `${baseName}.txt` };
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

  async function loadJSZip() {
    if (typeof JSZip === 'undefined') {
      await loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
    }
  }

  async function downloadAsZip(results) {
    await loadJSZip();
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

  // ── Counter ────────────────────────────────────────
  function updateCounter() {
    const baseCount = 12847;
    const baseDate = new Date('2025-01-01T00:00:00');
    const now = new Date();
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

  function escapeXml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) { resolve(); return; }
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
