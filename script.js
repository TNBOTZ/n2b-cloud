const BOT_TOKEN = '8703476678:AAGosSnHf5Tg6voJtgvjcmjdCP_vhB284OY';
const CHAT_ID = '-1003882073026';

// Load history from browser storage when page loads
let videoHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];

// Simple Tab navigation
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if(tabId === 'historyTab') renderHistory(videoHistory);
}

async function uploadVideo() {
    const file = document.getElementById('videoInput').files[0];
    const formData = new FormData();
    formData.append('video', file);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    if (data.success) {
        const uniqueLink = `${window.location.origin}/watch/${data.file_id}`;
        addToHistory(data.file_name, uniqueLink);
        alert("Upload Complete! Your link: " + uniqueLink);
    }
}


    uploadBtn.disabled = true;
    statusMessage.textContent = "Step 1: Uploading to Telegram...";

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('video', file);

    try {
        // 1. Upload the video
        let response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
            method: 'POST', body: formData
        });
        let result = await response.json();

        if (!result.ok) throw new Error("Upload failed");

        const fileId = result.result.video.file_id;
        statusMessage.textContent = "Step 2: Generating unique link...";

        // 2. Ask Telegram for the file path to stream it
        let pathResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
        let pathResult = await pathResponse.json();

        if (!pathResult.ok) throw new Error("Could not generate link");

        const filePath = pathResult.result.file_path;
        
        // 3. Construct the streamable URL (WARNING: This exposes your token!)
        const streamUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

        // 4. Save to history
        const videoData = {
            name: file.name,
            url: streamUrl,
            date: new Date().toLocaleDateString()
        };
        
        videoHistory.push(videoData);
        localStorage.setItem('videoHistory', JSON.stringify(videoHistory));

        statusMessage.textContent = "✅ Upload and Link generated!";
        statusMessage.style.color = "green";
        
        // Go to history tab
        setTimeout(() => showTab('historyTab'), 1500);

    } catch (error) {
        statusMessage.textContent = "❌ Error occurred.";
        console.error(error);
    } finally {
        uploadBtn.disabled = false;
        fileInput.value = '';
    }
}

// Render the history list
function renderHistory(videos) {
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    
    videos.forEach(vid => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${vid.name}</strong><br><small>${vid.date}</small></span>
            <button class="play-btn" onclick="playVideo('${vid.url}')">Play</button>
        `;
        list.appendChild(li);
    });
}

// Search functionality
function searchVideos() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = videoHistory.filter(vid => vid.name.toLowerCase().includes(query));
    renderHistory(filtered);
}

// Play the video in the player tab
function playVideo(url) {
    showTab('playerTab');
    const player = document.getElementById('videoPlayer');
    const linkText = document.getElementById('shareableLink');
    
    player.src = url;
    player.play();
    
    linkText.innerHTML = `<strong>Direct Link:</strong> <a href="${url}" target="_blank">Click here</a> <br><br><em>Warning: Do not share this link publicly, it contains your bot token!</em>`;
}
