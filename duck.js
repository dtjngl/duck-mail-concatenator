document.addEventListener("DOMContentLoaded", async function () {
    const inputField = document.getElementById("inputField");
    const clipboardField = document.getElementById("clipboardField");
    const outputField = document.getElementById("outputField");
    const button = document.getElementById("generateButton");
    const copyButton = document.getElementById("copyButton");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Initialize clipboard field with @duck.com
    clipboardField.value = "@duck.com";

    try {
        const clipboardText = await navigator.clipboard.readText();
        if (emailRegex.test(clipboardText)) {
            clipboardField.value = extractUsername(clipboardText) + "@duck.com";
        }
    } catch (err) {
        console.error("Failed to read clipboard:", err);
    }

    // Ensure user input in clipboardField always appends to @duck.com
    clipboardField.addEventListener("input", function () {
        let value = clipboardField.value.split("@")[0].trim(); // Remove any existing @ and domain
        clipboardField.value = value ? value + "@duck.com" : "@duck.com"; // Prevent empty string before @duck.com
    });

    button.addEventListener("click", function () {
        const inputText = inputField.value.trim();
        const clipboardText = clipboardField.value.trim();

        // Check if input email is valid
        if (!emailRegex.test(inputText)) {
            alert("Enter a valid email address in the first field!");
            return;
        }

        // Ensure clipboard field contains something before "@duck.com"
        if (!clipboardText || clipboardText === "@duck.com") {
            alert("Clipboard field must have a username before '@duck.com'!");
            return;
        }

        const transformedText = transformEmails(inputText, clipboardText);
        outputField.textContent = transformedText;
    });

    copyButton.addEventListener("click", async function () {
        try {
            await navigator.clipboard.writeText(outputField.textContent);
        } catch (err) {
            alert("Failed to copy: " + err);
        }
    });
});

// Extracts username from an email
function extractUsername(email) {
    return email.split("@")[0];
}

// Transforms email format
function transformEmails(inputEmail, clipboardEmail) {
    const inputParts = inputEmail.split("@");
    const clipboardUsername = clipboardEmail.split("@")[0]; // Only take username part

    if (inputParts.length !== 2 || !clipboardUsername) {
        return "Invalid email format";
    }

    return `${inputParts[0]}_at_${inputParts[1]}_${clipboardUsername}@duck.com`;
}