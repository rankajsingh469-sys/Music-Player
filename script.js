const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const musicContainer = document.querySelector(".music-container");
const audioPlayer = document.querySelector("#audioPlayer");
const playButton = document.querySelector("#playButton");
const timeline = document.querySelector("#timeline");
const nextBtn = document.querySelector("#nextBtn");
const startTime = document.querySelector("#startTime");
const playerDetails = document.querySelector("#player-details");
const backBtn = document.querySelector("#backBtn");


// =========================
// STATE
// =========================
let songs = [];
let currentIndex = 0;


// =========================
// GET DATA
// =========================
async function getData() {
    const term = searchInput.value.trim();

    if (!term) {
        console.log("Please enter a search term");
        return;
    }

    const URL = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=15`;

    const response = await fetch(URL);
    const data = await response.json();

    // Store only actual songs
    songs = data.results.filter(song => song.kind === "song");

    // Start from the first song
    currentIndex = 0;

    console.log(songs);

    displayMusic();
}


// =========================
// SEARCH BUTTON
// =========================
searchBtn.addEventListener("click", function (e) {
    e.preventDefault();
    getData();
});


// =========================
// DISPLAY MUSIC CARDS
// =========================
function displayMusic() {
    musicContainer.innerHTML = "";

    songs.forEach((song, index) => {
        const musicCard = document.createElement("div");

        musicCard.className =
            "flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-gray-100 group border border-transparent";

        musicCard.dataset.track = song.trackId;

        musicCard.innerHTML = `
            <div class="flex items-center gap-3">
                <img 
                    src="${song.artworkUrl100}" 
                    alt="${song.trackName}"
                    class="w-12 h-12 rounded-lg object-cover"
                >

                <div>
                    <h3 class="font-semibold">
                        ${song.trackName}
                    </h3>

                    <p class="text-sm text-gray-500">
                        ${song.artistName}
                    </p>
                </div>
            </div>
        `;

        // When a song card is clicked
        musicCard.addEventListener("click", function () {
            // Remove selected style from previous card
            const previousCard =
                musicContainer.querySelector('[data-selected="true"]');

            if (previousCard) {
                previousCard.dataset.selected = "false";

                previousCard.classList.remove(
                    "bg-purple-100",
                    "border-purple-300"
                );
            }

            // IMPORTANT:
            // Set currentIndex to the song that was clicked
            currentIndex = index;

            // Select current card
            musicCard.dataset.selected = "true";

            musicCard.classList.add(
                "bg-purple-100",
                "border-purple-300"
            );

            // Show and play selected song
            playSong(currentIndex);
        });

        musicContainer.appendChild(musicCard);
    });
}


// =========================
// PLAY SONG
// =========================
function playSong(index) {
    if (!songs.length) return;

    currentIndex = index;

    showMusic(songs[currentIndex]);

    audioPlayer.play();

    updatePlayButton();
}


// =========================
// SHOW CURRENT SONG
// =========================
function showMusic(song) {
     playerDetails.innerHTML = "";
    playerDetails.innerHTML = `
                   <div class="flex items-center gap-3">
            <img
                src="${song.artworkUrl100}"
                class="w-12 h-12 rounded-full object-cover"
            >

            <div>
                <h2 class="font-semibold text-base leading-tight">
                    ${song.trackName}
                </h2>

                <p class="text-xs text-white/70 mt-0.5">
                    ${song.artistName}
                </p>
            </div>
        </div>`
    audioPlayer.src = song.previewUrl;

    
}


// =========================
// UPDATE PLAY / PAUSE BUTTON
// =========================
function updatePlayButton() {
    if (audioPlayer.paused) {
        playButton.innerHTML = `
            <!-- play icon -->
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                class="w-6 h-6"
            >
                <path d="M8 5v14l11-7z"/>
            </svg>
        `;
    } else {
        playButton.innerHTML = `
            <!-- pause icon -->
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                class="w-6 h-6"
            >
                <path d="M6 5h4v14H6zM14 5h4v14h-4z"/>
            </svg>
        `;
    }
}


// =========================
// PLAY / PAUSE BUTTON
// =========================
playButton.addEventListener("click", function () {
    if (!audioPlayer.src) return;

    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }

    updatePlayButton();
});


// =========================
// NEXT BUTTON
// =========================
nextBtn.addEventListener("click", function () {
    if (!songs.length) return;

    currentIndex = (currentIndex + 1) % songs.length;

    playSong(currentIndex);
});
backBtn.addEventListener("click", function () {
    if (currentIndex == 0 ) return;

    currentIndex = (currentIndex - 1) % songs.length;

    playSong(currentIndex);
});


// =========================
// WHEN SONG ENDS
// =========================
audioPlayer.addEventListener("ended", function () {
    if (!songs.length) return;

    currentIndex = (currentIndex + 1) % songs.length;

    playSong(currentIndex);
});


// =========================
// AUDIO TIME UPDATE
// =========================
audioPlayer.addEventListener("timeupdate", function () {
    if (!audioPlayer.duration) return;

    const progress =
        (audioPlayer.currentTime / audioPlayer.duration) * 100;

    const seconds = Math.floor(audioPlayer.currentTime);

    startTime.textContent =
        `0:${String(seconds).padStart(2, "0")}`;

    timeline.value = progress;
});


// =========================
// TIMELINE SEEK
// =========================
timeline.addEventListener("input", function () {
    if (!audioPlayer.duration) return;

    audioPlayer.currentTime =
        (timeline.value / 100) * audioPlayer.duration;
});