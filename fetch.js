async function fetchTXTRecords() {
    const fullHostname = window.location.hostname;
    let rootDomain = "";

    if (fullHostname.includes('.dprofile.hns.to')) {
        rootDomain = fullHostname.split('.dprofile.hns.to')[0];
    } else if (fullHostname.includes('.dprofile.rsvr.xyz')) {
        rootDomain = fullHostname.split('.dprofile.rsvr.xyz')[0];
    } else if (fullHostname.includes('.dprofile.hnsgate.alohabrowser.com')) {
        rootDomain = fullHostname.split('.dprofile.hnsgate.alohabrowser.com')[0];
    } else if (fullHostname.endsWith('.dprofile')) {
        rootDomain = fullHostname.split('.dprofile')[0];
    } else {
        rootDomain = fullHostname;
    }

    document.title = rootDomain;

    // First, fetch and display the root domain's records
    const txtRecords = await fetchAndProcessTXTRecords(rootDomain);

    if (txtRecords) {
        // Process and display the fetched records
        processTXTRecords(txtRecords);

        // Now process any external records asynchronously
        txtRecords.forEach(record => {
            if (record.startsWith("ext:")) {
                const externalDomain = record.split("ext:")[1];
                fetchAndProcessTXTRecords(externalDomain).then(processTXTRecords);
            }
        });
    }
}

async function fetchAndProcessTXTRecords(domain) {
    const url = `https://easyhandshake.com:8053/dns-query?name=${domain}&type=TXT`;
        // alternative node: const url = `https://hnsns.net/dns-query?name=${domain}&type=TXT`;
    console.log("Fetch URL:", url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/dns-json' }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("DNS Response:", data);

        if (data.Answer && data.Answer.length > 0) {
            return data.Answer
                .filter(record => record.type === 16)
                .map(record => record.data.replace(/"/g, ''));
        } else {
            console.error("No TXT records found in DNS response.");
            document.body.innerHTML = "<p>No TXT records found for this domain.</p>";
            return null;
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        document.body.innerHTML = `<p>An error occurred while fetching TXT records: ${error.message}</p>`;
        return null;
    }
}


function processTXTRecords(txtRecords) {
    const profileDiv = document.getElementById('profile');
    const linksDiv = document.getElementById('links');
    const currencyButtonsDiv = document.getElementById('currency-buttons');
    let bgSet = false;
    const currencies = { btc: null, hns: null, eth: null, xmr: null };

    txtRecords.forEach(record => {
        const [key, value] = record.split(':');

        switch (key) {
            case 'pfp':
                profileDiv.innerHTML = `<img src="https://${value}" alt="Profile Picture">`;
                break;
            case 'bg':
                if (!bgSet) {
                    document.body.style.backgroundImage = `url(https://${value})`;
                    bgSet = true;
                }
                break;
            case 'bgcolor':
                if (!bgSet) {
                    document.body.style.backgroundColor = `#${value}`;
                    bgSet = true;
                }
                break;
            case 'tb':
            case 'nostr':
            case 'onion':
                linksDiv.innerHTML += `<a class="link" onclick="copyToClipboard('${value}')"><img src="img/${key}.png" alt="${key.toUpperCase()} Icon"></a>`;
                break;
            case 'x':
                linksDiv.innerHTML += `<a class="link" href="https://x.com/${value}" target="_blank"><img src="img/x.png" alt="X Icon"></a>`;
                break;
            case 'tg':
                linksDiv.innerHTML += `<a class="link" href="https://t.me/${value}" target="_blank"><img src="img/tg.png" alt="Telegram Icon"></a>`;
                break;
            case 'wa':
                linksDiv.innerHTML += `<a class="link" href="https://wa.me/${value}" target="_blank"><img src="img/wa.png" alt="WhatsApp Icon"></a>`;
                break;
            case 'sn':
                linksDiv.innerHTML += `<a class="link" href="https://signal.me/#p/${value}" target="_blank"><img src="img/sn.png" alt="Signal Icon"></a>`;
                break;
            case 'tel':
                linksDiv.innerHTML += `<a class="link" href="tel:${value}" target="_blank"><img src="img/tel.png" alt="Phone Icon"></a>`;
                break;
            case 'mail':
                linksDiv.innerHTML += `<a class="link" href="mailto:${value}" target="_blank"><img src="img/mail.png" alt="Mail Icon"></a>`;
                break;
            case 'gh':
                linksDiv.innerHTML += `<a class="link" href="https://github.com/${value}" target="_blank"><img src="img/gh.png" alt="GitHub Icon"></a>`;
                break;
            case 'link':
                linksDiv.innerHTML += `<a class="link" href="http://${value}" target="_blank"><img src="img/link.png" alt="Link Icon"></a>`;
                break;
            case 'ig':
                linksDiv.innerHTML += `<a class="link" href="https://www.instagram.com/${value}/" target="_blank"><img src="img/ig.png" alt="Instagram Icon"></a>`;
                break;
            case 'fb':
                linksDiv.innerHTML += `<a class="link" href="https://www.facebook.com/${value}" target="_blank"><img src="img/fb.png" alt="Facebook Icon"></a>`;
                break;
            case 'pk':
                linksDiv.innerHTML += `<a class="link" href="http://${value}./" target="_blank"><img src="img/pkdns.png" alt="pkdns Icon"></a>`;
                break;
            case 'bsky':
                const bskyURL = value.includes('.') ? `https://bsky.app/profile/${value}` : `https://bsky.app/profile/${value}.bsky.social`;
                linksDiv.innerHTML += `<a class="link" href="${bskyURL}" target="_blank"><img src="img/bsky.png" alt="Bluesky Icon"></a>`;
                break;
            case 'btc':
            case 'hns':
            case 'eth':
            case 'xmr':
                currencies[key] = `<button class="currency-button" onclick="copyToClipboard('${value}')"><img src="img/${key}.png" alt="${key.toUpperCase()} Icon"></button>`;
                break;
            default:
                console.warn(`Unhandled record type: ${key}`);
        }
    });

    Object.values(currencies).forEach(button => {
        if (button) {
            currencyButtonsDiv.innerHTML += button;
        }
    });
}


function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            alert(`Copied to clipboard: ${text}`);
        }).catch(err => {
            console.error('Clipboard API failed, using fallback: ', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        alert(`Copied to clipboard: ${text}`);
    } catch (err) {
        console.error('Fallback: Copy failed', err);
    }

    document.body.removeChild(textArea);
}

window.onload = fetchTXTRecords;
