// Extract the unique card ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const cardId = urlParams.get('id');

// Fetch the birthday data from localStorage
const cardData = JSON.parse(localStorage.getItem(cardId));

// Display the initial greeting with the birthday person's name and age
if (cardData) {
    document.getElementById('cardName').textContent = cardData.name;
    document.getElementById('cardAge').textContent = cardData.age;
    document.getElementById('cardMessage').textContent = cardData.message;
}

// Click event for "Next" button
document.getElementById('nextButton').addEventListener('click', function () {
    document.getElementById('greeting').classList.add('hidden');
    document.getElementById('cakeSection').classList.remove('hidden');
    startCandleBlowing();
});

// Create candles dynamically
function createCandles(count) {
    const candlesContainer = document.getElementById('candlesContainer');
    for (let i = 0; i < count; i++) {
        const candle = document.createElement('div');
        candle.classList.add('candle');
        candlesContainer.appendChild(candle);
    }
}

// Initialize candle blowing logic
function startCandleBlowing() {
    createCandles(10);

    // Request access to the microphone to blow candles
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);

            analyser.fftSize = 512;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            let candlesBlown = 0;

            function checkBlow() {
                analyser.getByteTimeDomainData(dataArray);
                const maxVolume = Math.max(...dataArray);

                // Check if the volume exceeds the threshold (simulating blowing out candles)
                if (maxVolume > 150 && candlesBlown < 10) {
                    const candle = document.getElementById('candlesContainer').children[candlesBlown];
                    candle.classList.add('blow-out');
                    candlesBlown++;
                }

                // Show final message when all candles are blown out
                if (candlesBlown >= 10) {
                    setTimeout(() => {
                        document.getElementById('cakeSection').classList.add('hidden');
                        document.getElementById('finalMessage').classList.remove('hidden');
                    }, 500);
                } else {
                    requestAnimationFrame(checkBlow);
                }
            }

            checkBlow();
        })
        .catch(function (err) {
            console.error('Microphone access denied or error occurred: ', err);
        });
}
