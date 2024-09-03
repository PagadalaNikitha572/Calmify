// Array to store mood history
const moodHistory = [];

// Update User Name
function updateName() {
    const nameInput = document.getElementById('nameInput').value;
    const userName = document.getElementById('userName');
    if (nameInput) {
        userName.textContent = nameInput;
        logActivity('Name updated');
    }
}

// Update Mood Message and Quotes
function updateMoodMessage() {
    const moodRange = document.getElementById('moodRange').value;
    const moodMessage = document.getElementById('moodMessage');
    const wellnessQuote = document.getElementById('wellnessQuote');
    const boostMessage = document.getElementById('boostMessage');

    let moodText = '';
    let quoteText = '';
    let boostText = '';
    let recommendations = [];

    if (moodRange < 30) {
        moodText = "You're vibing low key today.";
        quoteText = "\"Not every day can be lit. But hey, it's okay to chill.\"";
        boostText = "💪 You got this, fam. Brighter days ahead!";
        recommendations = ['Watch a funny TikTok.', 'Text your BFF.', 'Get cozy with some Netflix.'];
    } else if (moodRange < 70) {
        moodText = "You're in the chill zone.";
        quoteText = "\"Balance is key. Keep the vibes steady.\"";
        boostText = "🌱 Stay grounded, but don't forget to glow.";
        recommendations = ['Try some mindfulness with Headspace.', 'Check out a cool new playlist.', 'Unwind with some light gaming.'];
    } else {
        moodText = "You're on 🔥 today!";
        quoteText = "\"Your vibe attracts your tribe. Keep shining!\"";
        boostText = "🌟 You're killing it! Spread those good vibes!";
        recommendations = ['Share your positivity on Insta.', 'Dance like nobody’s watching!', 'Plan something epic with friends.'];
    }

    moodMessage.textContent = moodText;
    wellnessQuote.textContent = quoteText;
    boostMessage.textContent = boostText;
    generateRecommendations(recommendations);

    const moodRecord = {
        date: new Date().toLocaleString(),
        mood: moodText
    };
    moodHistory.push(moodRecord);
    updateMoodHistory();
    logActivity('Mood updated');
}


// Generate Personalized Recommendations
function generateRecommendations(recommendations) {
    const recommendationList = document.getElementById('recommendationList');
    recommendationList.innerHTML = ''; // Clear existing recommendations

    recommendations.forEach(rec => {
        const listItem = document.createElement('li');
        listItem.textContent = rec;
        recommendationList.appendChild(listItem);
    });

    logActivity('Recommendations generated');
}

// Update Mood History Display
function updateMoodHistory() {
    const moodHistoryContainer = document.getElementById('moodHistory');
    moodHistoryContainer.innerHTML = ''; // Clear existing history

    moodHistory.forEach(record => {
        const moodItem = document.createElement('div');
        moodItem.className = 'mood-record';
        moodItem.innerHTML = `<strong>${record.date}</strong><br>${record.mood}`;
        moodHistoryContainer.appendChild(moodItem);
    });
}

// Fetch Stress Management Tips
function showStressTips() {
    const stressTips = [
        "Breathe Like a Pro 🧘‍♀️: When life gets too extra, just pause and breathe. Try the 4-7-8 technique: inhale for 4 seconds, hold for 7, and exhale for 8. Repeat until you feel zen.",
        "Unplug to Recharge 🔌: Social media is lit, but sometimes, you need to unplug to recharge. Take a break from your screens and go offline for a bit. Your mind will thank you!",
        "Get Moving, Get Grooving 🎶: Dance it out or go for a walk. Moving your body releases those feel-good endorphins. Plus, who doesn’t love a solo dance party?",
        "Snack on Something Healthy 🍎: Feeling stressed? Snack attack with some fruits, nuts, or dark chocolate. These goodies help stabilize your mood and keep you fueled.",
        "Create Your Chill Playlist 🎧: Make a playlist of your favorite chill vibes. Music can be the ultimate mood booster. Play it when you need to calm down or just vibe.",
        "Try a Mini Digital Detox 🛑📱: Disconnect from your phone for an hour a day. No notifications, no drama. Just you and the real world. You might find it surprisingly refreshing.",
        "Get Cozy and Rest Up 😴: Never underestimate the power of a good nap or a full night’s sleep. Put on your comfiest PJs and catch those Z's. Your future self will feel so much better.",
        "Mindfulness Moments 🌸: Take a minute to focus on the present. Whether it’s through meditation or just noticing the world around you, mindfulness can reduce stress big time.",
        "Talk It Out 🗣️: When in doubt, talk it out. Chat with a friend, family member, or even a counselor. Sometimes, just getting things off your chest is all you need.",
        "Set Boundaries 🚧: It’s okay to say no. Protect your energy by setting boundaries. You don’t have to do it all, and that’s perfectly fine."
    ];
    const randomTip = stressTips[Math.floor(Math.random() * stressTips.length)];
    document.getElementById('stressTips').textContent = randomTip;

    logActivity('Stress tips displayed');
}


function logActivity(activity) {
    console.log(`User activity logged: ${activity}`);
}


function init() {
    updateMoodMessage(); 
    setupCamera(); 

    logActivity('App initialized');
}

function setupCamera() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const moodImage = document.getElementById('moodImage');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                console.error("Error accessing the camera: ", err);
            });
    } else {
        console.error("getUserMedia not supported on this browser.");
    }
}

function captureImage() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const moodImage = document.getElementById('moodImage');
    const sentimentAnalysis = document.getElementById('sentimentAnalysis');

    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    moodImage.src = canvas.toDataURL('image/png');
    analyzeSentiment(canvas.toDataURL('image/png'));
}



function analyzeSentiment(imageData) {
    const API_KEY = 'AIzaSyDiGWlEme28_6gmhQd0tliC1EblnzIHrg8'; 
    const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
    
    const requestPayload = {
        requests: [
            {
                image: {
                    content: imageData.split(',')[1] 
                },
                features: [
                    {
                        type: 'FACE_DETECTION',
                        maxResults: 1
                    }
                ]
            }
        ]
    };

    fetch(VISION_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.responses[0].faceAnnotations && data.responses[0].faceAnnotations.length > 0) {
            const emotions = data.responses[0].faceAnnotations[0].joyLikelihood;
            sentimentAnalysis.textContent = `Emotion Detected: ${emotions}`;
        } else {
            sentimentAnalysis.textContent = 'No face detected or unable to analyze emotions.';
        }
    })
    .catch(error => {
        console.error('Error analyzing sentiment:', error);
        sentimentAnalysis.textContent = 'Unable to analyze sentiment at the moment.';
    });
}
let breathingInterval;
let startTime;

// Function to start the breathing exercise
function startBreathingExercise() {
    const visualizer = document.getElementById('breathingVisualizer');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    startButton.disabled = true;
    stopButton.disabled = false;

    visualizer.textContent = "Inhale...";
    startTime = new Date().getTime();

    breathingInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime < 4000) {
            visualizer.textContent = "Inhale...";
        } else if (elapsedTime < 7000) {
            visualizer.textContent = "Hold...";
        } else if (elapsedTime < 11000) {
            visualizer.textContent = "Exhale...";
        } else if (elapsedTime < 15000) {
            visualizer.textContent = "Hold...";
        } else {
            startTime = new Date().getTime(); // Reset the timer for repeat
            visualizer.textContent = "Inhale...";
        }

        updateBreathingTimer(elapsedTime);
    }, 1000); // Update every second

    logActivity('Breathing exercise started');
}

// Function to stop the breathing exercise
function stopBreathingExercise() {
    clearInterval(breathingInterval);
    const visualizer = document.getElementById('breathingVisualizer');
    visualizer.textContent = "Breathing exercise ended.";

    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    startButton.disabled = false;
    stopButton.disabled = true;

    document.getElementById('breathingTimer').textContent = "00:00"; // Reset timer display

    logActivity('Breathing exercise ended');
}

// Function to update the breathing timer
function updateBreathingTimer(elapsedTime) {
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    document.getElementById('breathingTimer').textContent = `${formattedMinutes}:${formattedSeconds}`;
}
function contactCounsellor() {
    const counsellorUrl = "https://www.amahahealth.com/therapy-psychiatry/?utm_term=mental+health+therapist&utm_campaign=tele_therapy_bofl_book_phrase_23aug24&utm_source=google&utm_medium=cpc&utm_content=ad_group_phrase&campaignid=21615172497&adgroupid=166334307053&adid=710751655347&gad_source=1&gclid=CjwKCAjwxNW2BhAkEiwA24Cm9AjId_iw-bI3dGr3rQ704eTIkgDaBCiBkakf3CSrDX_xemCTPokW9RoCfl4QAvD_BwE"; 
    window.open(counsellorUrl, '_blank'); 
}
function saveJournalEntry() {
    const entry = document.getElementById('journalEntry').value;
    if (entry) {
        const journalRecord = {
            date: new Date().toLocaleString(),
            entry: entry
        };
        console.log("Journal entry saved:", journalRecord); 
        document.getElementById('journalEntry').value = ''; 
        logActivity('Journal entry saved');
    } else {
        alert("Please write something before saving.");
    }
}
function generatePlaylist() {
    const moodRange = document.getElementById('moodRange').value;
    let playlistUrl = '';

    if (moodRange < 30) {
        playlistUrl = 'https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0'; // Chill playlist
    } else if (moodRange < 70) {
        playlistUrl = 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'; // Pop playlist
    } else {
        playlistUrl = 'https://open.spotify.com/playlist/37i9dQZF1DX1lVhptIYRda'; // Upbeat playlist
    }

    document.getElementById('playlistContainer').innerHTML = `<a href="${playlistUrl}" target="_blank">Listen to this playlist</a>`;
    logActivity('Playlist generated');
}

// Run initialization on page load
window.onload = init;
