/* ===== VIDEO PLAYER WITH MULTI-VIDEO NAVIGATION ===== */

// ======== EDIT: ADD YOUR VIDEOS HERE ========
const videos = [
  {
    title: 'Project Demo',
    type: 'youtube', // 'youtube' or 'local'
    source: 'dQw4w9WgXcQ' // YouTube video ID or local file path
  },
  {
    title: 'Assembly Process',
    type: 'youtube',
    source: 'dQw4w9WgXcQ' // Replace with your video ID
  },
  {
    title: 'Final Testing',
    type: 'local',
    source: 'assets/demo.mp4' // Path to local video file
  }
];

// Current video index
let currentVideoIndex = 0;

// Display video
function displayVideo(index) {
  const container = document.getElementById('video-display');
  if (!container || videos.length === 0) return;
  
  const video = videos[index];
  let videoHTML = '';
  
  if (video.type === 'youtube') {
    // YouTube embed
    videoHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${video.source}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;
  } else if (video.type === 'local') {
    // Local video file
    videoHTML = `
      <video controls>
        <source src="${video.source}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
  }
  
  container.innerHTML = videoHTML;
  
  // Update display
  document.getElementById('video-num').textContent = index + 1;
  document.getElementById('video-count').textContent = videos.length;
  
  updateVideoButtons();
}

// Update button states
function updateVideoButtons() {
  const prevBtn = document.getElementById('prev-video');
  const nextBtn = document.getElementById('next-video');
  
  if (prevBtn) prevBtn.disabled = (currentVideoIndex <= 0);
  if (nextBtn) nextBtn.disabled = (currentVideoIndex >= videos.length - 1);
}

// Navigation functions
function showPrevVideo() {
  if (currentVideoIndex > 0) {
    currentVideoIndex--;
    displayVideo(currentVideoIndex);
  }
}

function showNextVideo() {
  if (currentVideoIndex < videos.length - 1) {
    currentVideoIndex++;
    displayVideo(currentVideoIndex);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('video-display');
  
  if (container && videos.length > 0) {
    // Display first video
    displayVideo(0);
    
    // Setup navigation
    const prevBtn = document.getElementById('prev-video');
    const nextBtn = document.getElementById('next-video');
    
    if (prevBtn) prevBtn.addEventListener('click', showPrevVideo);
    if (nextBtn) nextBtn.addEventListener('click', showNextVideo);
  }
});
