document.getElementById('birthdayForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const message = document.getElementById('message').value;
    const photo = document.getElementById('photo').files[0];

    // Generate a unique identifier for the card
    const cardId = Date.now().toString(36) + Math.random().toString(36).substring(2);

    // Store data in localStorage
    const reader = new FileReader();
    if (photo) {
        reader.readAsDataURL(photo);
    }

    reader.onloadend = function () {
        const photoData = reader.result || null;
        localStorage.setItem(cardId, JSON.stringify({ name, age, message, photo: photoData }));

        // Trigger envelope animation
        document.getElementById('envelope-animation').style.display = 'block';
        setTimeout(() => {
            // Display the link after envelope animation
            const baseUrl = window.location.href.replace('index.html', 'card.html');
            const cardUrl = `${baseUrl}?id=${cardId}`;
            document.getElementById('cardLink').value = cardUrl;
            document.getElementById('result').style.display = 'block';

            // WhatsApp link
            const whatsappLink = `https://wa.me/?text=${encodeURIComponent("Check out this birthday card: " + cardUrl)}`;
            document.getElementById('whatsappShare').href = whatsappLink;
        }, 1500);
    };
});

document.getElementById('copyLink').addEventListener('click', function () {
    const linkInput = document.getElementById('cardLink');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
    alert('Link copied to clipboard!');
});
