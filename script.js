document.addEventListener("DOMContentLoaded", function () {
  const prefixSelect = document.getElementById("prefix");
  const phoneNumberInput = document.getElementById("phoneNumber");
  const messageInput = document.getElementById("message");
  const sendButton = document.getElementById("sendButton");
  const errorMessage = document.getElementById("error-message");
  const charCount = document.getElementById("char-count");
  const copyButton = document.getElementById("copyButton");
  const qrCodeCanvas = document.getElementById("qr-code");
  const downloadQRButton = document.getElementById("downloadQRButton");

  const prefixes = [
    { code: "1", country: "United States" },
    { code: "1", country: "Canada" },
    { code: "7", country: "Russia" },
    { code: "30", country: "Greece" },
    { code: "31", country: "Netherlands" },
    { code: "33", country: "France" },
    { code: "34", country: "Spain" },
    { code: "39", country: "Italy" },
    { code: "44", country: "United Kingdom" },
    { code: "45", country: "Denmark" },
    { code: "46", country: "Sweden" },
    { code: "48", country: "Poland" },
    { code: "49", country: "Germany" },
    { code: "52", country: "Mexico" },
    { code: "55", country: "Brazil" },
    { code: "61", country: "Australia" },
    { code: "63", country: "Philippines" },
    { code: "64", country: "New Zealand" },
    { code: "65", country: "Singapore" },
    { code: "81", country: "Japan" },
    { code: "82", country: "South Korea" },
    { code: "86", country: "China" },
    { code: "91", country: "India" },
    { code: "972", country: "Israel" },
    // More countries can be added in the future
  ];

  prefixes.sort((a, b) => a.country.localeCompare(b.country));

  prefixes.forEach((prefix) => {
    const option = document.createElement("option");
    option.value = prefix.code;
    option.text = `${prefix.country} (+${prefix.code})`;
    prefixSelect.appendChild(option);
  });

  let whatsappURL = "";

  function updateLink() {
    const prefix = prefixSelect.value;
    const phoneNumber = phoneNumberInput.value;
    const message = messageInput.value;

    if (prefix && isValidPhoneNumber(phoneNumber)) {
      const fullPhoneNumber = `+${prefix}${phoneNumber}`;
      whatsappURL = `https://wa.me/${fullPhoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      copyButton.classList.remove("hidden");
      qrCodeCanvas.classList.remove("hidden");
      downloadQRButton.classList.remove("hidden");
      generateQRCode(whatsappURL);
    } else {
      whatsappURL = "";
      copyButton.classList.add("hidden");
      qrCodeCanvas.classList.add("hidden");
      downloadQRButton.classList.add("hidden");
    }
  }

  function validateForm() {
    const prefix = prefixSelect.value;
    const phoneNumber = phoneNumberInput.value;

    if (prefix === "" || !isValidPhoneNumber(phoneNumber)) {
      sendButton.disabled = true;
      errorMessage.textContent = "Please enter a valid phone number.";
      errorMessage.classList.remove("hidden");
    } else if (messageInput.value.trim() === "") {
      sendButton.disabled = true;
      errorMessage.textContent = "Please enter a message.";
      errorMessage.classList.remove("hidden");
    } else {
      sendButton.disabled = false;
      errorMessage.classList.add("hidden");
    }
  }

  function isValidPhoneNumber(phoneNumber) {
    return /^\d{7,15}$/.test(phoneNumber);
  }

  function updateCharCount() {
    const maxChars = 2000; // WhatsApp message character limit
    const currentLength = messageInput.value.length;
    charCount.textContent = `${currentLength}/${maxChars} characters`;

    if (currentLength > maxChars) {
      messageInput.value = messageInput.value.substring(0, maxChars);
      charCount.textContent = `${maxChars}/${maxChars} characters`;
    }
  }

  function generateQRCode(url) {
    const qr = new QRious({
      element: qrCodeCanvas,
      value: url,
      size: 200,
    });
  }

  prefixSelect.addEventListener("change", function () {
    validateForm();
    updateLink();
  });

  phoneNumberInput.addEventListener("input", function () {
    // Remove any non-digit characters
    phoneNumberInput.value = phoneNumberInput.value.replace(/\D/g, "");
    validateForm();
    updateLink();
  });

  messageInput.addEventListener("input", function () {
    validateForm();
    updateLink();
    updateCharCount();
  });

  sendButton.addEventListener("click", function () {
    window.open(whatsappURL, "_blank");
  });

  // Initialize Clipboard.js
  const clipboard = new ClipboardJS("#copyButton", {
    text: function () {
      return whatsappURL;
    },
  });

  clipboard.on("success", function () {
    alert("Link copied!");
  });

  downloadQRButton.addEventListener("click", function () {
    const link = document.createElement("a");
    link.href = qrCodeCanvas.toDataURL();
    link.download = "qr-code.png";
    link.click();
  });

  // Initial setup
  validateForm();
  updateCharCount();
});
