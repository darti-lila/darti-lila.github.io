/* ===== PDF VIEWER ===== */

const PDF_URL = 'SEAORB - Your eye under the sea.pdf';

// PDF.js setup
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
const scale = 1.5;
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

// Only initialize if canvas exists
if (canvas && ctx) {
  // Load PDF
  pdfjsLib.getDocument(PDF_URL).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('page-count').textContent = pdfDoc.numPages;
    
    // Initial render
    renderPage(pageNum);
  }).catch(function(error) {
    console.error('Error loading PDF:', error);
    document.querySelector('.pdf-viewer-container').innerHTML = 
      '<p style="text-align:center;color:var(--copper-lit);padding:2rem;">PDF not found. Please check the path in pdf-viewer.js</p>';
  });

  // Render page
  function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(function(page) {
      const viewport = page.getViewport({scale: scale});
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      
      const renderTask = page.render(renderContext);
      renderTask.promise.then(function() {
        pageRendering = false;
        if (pageNumPending !== null) {
          renderPage(pageNumPending);
          pageNumPending = null;
        }
      });
    });

    document.getElementById('page-num').textContent = num;
    updateButtons();
  }

  // Queue page render
  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  // Previous page
  function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
  }

  // Next page
  function onNextPage() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
  }

  // Update button states
  function updateButtons() {
    document.getElementById('prev-page').disabled = (pageNum <= 1);
    document.getElementById('next-page').disabled = (pageNum >= pdfDoc.numPages);
  }

  // Event listeners
  document.getElementById('prev-page').addEventListener('click', onPrevPage);
  document.getElementById('next-page').addEventListener('click', onNextPage);
}
