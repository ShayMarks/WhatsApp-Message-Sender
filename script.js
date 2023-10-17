document.addEventListener("DOMContentLoaded", function () {
    const prefixSelect = document.getElementById("prefix");
    const phoneNumberInput = document.getElementById("phoneNumber");
    const messageInput = document.getElementById("message");
    const sendButton = document.getElementById("sendButton");
    const errorMessage = document.getElementById("error-message");

    const prefixes = [
        { code: "1", country: "United States" },
        { code: "44", country: "United Kingdom" },
        { code: "33", country: "France" },
        { code: "49", country: "Germany" },
        { code: "81", country: "Japan" },
        { code: "91", country: "India" },
        { code: "55", country: "Brazil" },
        { code: "61", country: "Australia" },
        { code: "34", country: "Spain" },
        { code: "39", country: "Italy" },
        { code: "86", country: "China" },
        { code: "7", country: "Russia" },
        { code: "972", country: "Israel" },
        { code: "1", country: "Canada" },
        { code: "46", country: "Sweden" },
        { code: "82", country: "South Korea" },
        { code: "52", country: "Mexico" },
        { code: "31", country: "Netherlands" },
        { code: "41", country: "Switzerland" },
        { code: "63", country: "Philippines" },
        { code: "49", country: "Austria" },
        { code: "30", country: "Greece" },
        { code: "64", country: "New Zealand" },
        { code: "48", country: "Poland" },
        { code: "45", country: "Denmark" },
        { code: "65", country: "Singapore" },
        // More countries will be added in the future
    ];


    prefixes.sort((a, b) => a.country.localeCompare(b.country));

    prefixes.forEach((prefix) => {
        const option = document.createElement("option");
        option.value = prefix.code;
        option.text = `${prefix.country} (+${prefix.code})`;
        prefixSelect.appendChild(option);
    });

    const whatsappLink = document.getElementById("whatsappLink");
    const copyButton = document.getElementById("copyButton");

    prefixSelect.addEventListener("change", validateForm);
    phoneNumberInput.addEventListener("input", validateForm);
    messageInput.addEventListener("input", updateLink);

    function validateForm() {
        const prefix = prefixSelect.value;
        const phoneNumber = phoneNumberInput.value;

        if (prefix === "" || !isValidPhoneNumber(phoneNumber)) {
            sendButton.disabled = true;
            errorMessage.classList.remove("hidden");
        } else {
            sendButton.disabled = false;
            errorMessage.classList.add("hidden");
        }
    }

    function updateLink() {
        const prefix = prefixSelect.value;
        const phoneNumber = phoneNumberInput.value;
        const fullPhoneNumber = `+${prefix}${phoneNumber}`;
        const message = messageInput.value;
        const whatsappURL = `https://wa.me/${fullPhoneNumber}?text=${encodeURIComponent(message)}`;
        whatsappLink.textContent = whatsappURL;
        whatsappLink.href = whatsappURL; // Add this line to set the link as an href
        whatsappLink.classList.remove("hidden");
        copyButton.classList.remove("hidden");
    }

    function isValidPhoneNumber(phoneNumber) {
        return /^\d{7,}$/.test(phoneNumber);
    }

    sendButton.addEventListener("click", function () {
        if (messageInput.value.trim() === "") {
            errorMessage.classList.remove("hidden");
        } else {
            errorMessage.classList.add("hidden");
            const whatsappURL = whatsappLink.href; // Get the link from the href attribute
            window.location.href = whatsappURL; // Open the WhatsApp link
        }
    });

    // Initialize Clipboard.js
    const clipboard = new ClipboardJS("#copyButton", {
        text: function () {
            return whatsappLink.href; // Copy the link from the href attribute
        }
    });

    clipboard.on("success", function (e) {
        alert("Link copied!");
    });
});