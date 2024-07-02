function shortenURL(url, numChars = 6) {
    const urlParts = url.match(/(https?:\/\/[^\/]+)(\/?.*)/);
    if (!urlParts) return url;

    const protocolAndDomain = urlParts[1];
    const baseUrl = urlParts[2];

    const urlShortener = baseUrl.substring(0, numChars);
    return protocolAndDomain + urlShortener + (rest.length > numChars ? '' : '');
}

function saveToLocalStorage(urls) {
    localStorage.setItem('shortenedUrls', JSON.stringify(urls));
}

function loadFromLocalStorage() {
    const storedUrls = localStorage.getItem('shortenedUrls');
    return storedUrls ? JSON.parse(storedUrls) : [];
}

function renderUrls(urls) {
    const shortenedContainer = document.getElementById("shortened");
    shortenedContainer.innerHTML = '';

    urls.forEach(urlObj => {
        const linkContainer = document.createElement("div");
        linkContainer.className = "shorten-link";
        const linkText = document.createElement("p");
        linkText.className = "link-text";
        const link = document.createElement("a");
        link.href = urlObj.original;
        link.textContent = urlObj.shortened;
        link.target = "_blank";
        linkText.appendChild(link);

        const iconContainer = document.createElement("div");
        iconContainer.className = "icon";
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
        deleteButton.addEventListener("click", function() {
            urls = urls.filter(item => item.original !== urlObj.original);
            saveToLocalStorage(urls);
            renderUrls(urls);
        });
        iconContainer.appendChild(deleteButton);

        linkContainer.appendChild(linkText);
        linkContainer.appendChild(iconContainer);
        shortenedContainer.appendChild(linkContainer);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const shortenButton = document.getElementById("shorten");
    const originalLinkInput = document.getElementById("original-link");
    let urls = loadFromLocalStorage();

    renderUrls(urls);

    shortenButton.addEventListener("click", function() {
        const originalURL = originalLinkInput.value;
        const shortenedURL = shortenURL(originalURL, 6);

        const urlObj = { original: originalURL, shortened: shortenedURL };
        urls.push(urlObj);
        saveToLocalStorage(urls);
        renderUrls(urls);

        originalLinkInput.value = "";
    });
});