        async function fetchTXTRecords() {
            const fullHostname = window.location.hostname;
            let rootDomain = "";

            // Extract the root domain based on multiple patterns
            if (fullHostname.includes('.dprofile.hns.to')) {
                rootDomain = fullHostname.split('.dprofile.hns.to')[0];
            } else if (fullHostname.includes('.dprofile.rsvr.xyz')) {
                rootDomain = fullHostname.split('.dprofile.rsvr.xyz')[0];
            } else if (fullHostname.includes('.dprofile.hnsgate.alohabrowser.com')) {
                rootDomain = fullHostname.split('.dprofile.hnsgate.alohabrowser.com')[0];
            } else if (fullHostname.endsWith('.dprofile')) {
                rootDomain = fullHostname.split('.dprofile')[0];
            } else {
                rootDomain = fullHostname; // Fallback for other cases
            }

            // Set the title to the root domain
            document.title = rootDomain;

            const url = `https://doh.hnsdns.com/dns-query?name=${rootDomain}&type=TXT`;
            // Alternative source: const url = `https://easyhandshake.com:8053/dns-query?name=xv&type=TXT`;
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
                    const txtRecords = data.Answer
                        .filter(record => record.type === 16)
                        .map(record => record.data.replace(/"/g, ''));

                    console.log("TXT Records Found:", txtRecords);
                    processTXTRecords(txtRecords);
                } else {
                    console.error("No TXT records found in DNS response.");
                    document.body.innerHTML = "<p>No TXT records found for this domain.</p>";
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                document.body.innerHTML = `<p>An error occurred while fetching TXT records: ${error.message}</p>`;
            }
        }

        function processTXTRecords(txtRecords) {
            const profileDiv = document.getElementById('profile');
            const linksDiv = document.getElementById('links');
            const currencyButtonsDiv = document.getElementById('currency-buttons');
            let bgSet = false;
            const currencies = { btc: null, hns: null, eth: null, xmr: null }; // Maintain order

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
                        linksDiv.innerHTML += `<a class="link" onclick="copyToClipboard('${value}')"><img src="img/tb.png" alt="Thunderbolt Icon"></a>`;
                        break;
                    case 'nostr':
                        linksDiv.innerHTML += `<a class="link" onclick="copyToClipboard('${value}')"><img src="img/nostr.png" alt="Nostr Icon"></a>`;
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
                    case 'link':
                        linksDiv.innerHTML += `<a class="link" href="http://${value}" target="_blank"><img src="img/link.png" alt="Link Icon"></a>`;
                        break;
                    case 'onion':
                        linksDiv.innerHTML += `<a class="link" href="http://${value}.onion" target="_blank"><img src="img/onion.png" alt="Onion Icon"></a>`;
                        break;
                    case 'ig':
                        const igURL = `https://www.instagram.com/${value}/`;
                        linksDiv.innerHTML += `<a class="link" href="${igURL}" target="_blank"><img src="img/ig.png" alt="Instagram Icon"></a>`;
                        break;
                    case 'fb':
                        const fbURL = `https://www.facebook.com/${value}`;
                        linksDiv.innerHTML += `<a class="link" href="${fbURL}" target="_blank"><img src="img/fb.png" alt="Facebook Icon"></a>`;
                        break;
                    case 'bsky':
                        const bskyURL = value.includes('.')
                            ? `https://bsky.app/profile/${value}`
                            : `https://bsky.app/profile/${value}.bsky.social`;
                        linksDiv.innerHTML += `<a class="link" href="${bskyURL}" target="_blank"><img src="img/bsky.png" alt="Bsky Icon"></a>`;
                        break;
                    case 'gh':
                        const ghURL = `https://github.com/${value}`;
                        linksDiv.innerHTML += `<a class="link" href="${ghURL}" target="_blank"><img src="img/gh.png" alt="GitHub Icon"></a>`;
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

            // Append currency buttons in the correct order
            Object.values(currencies).forEach(button => {
                if (button) {
                    currencyButtonsDiv.innerHTML += button;
                }
            });
        }

        function copyToClipboard(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    alert(`Copied to clipboard: ${text}`);
                }).catch(err => {
                    console.error('Failed to copy to clipboard: ', err);
                    fallbackCopyToClipboard(text);
                });
            } else {
                fallbackCopyToClipboard(text);
            }
        }

        function fallbackCopyToClipboard(text) {
            const tempInput = document.createElement('textarea');
            tempInput.value = text;
            tempInput.style.position = 'fixed';
            tempInput.style.opacity = 0;
            document.body.appendChild(tempInput);
            tempInput.focus();
            tempInput.select();

            try {
                document.execCommand('copy');
                alert(`Copied to clipboard: ${text}`);
            } catch (err) {
                console.error('Failed to copy: ', err);
                alert('Failed to copy. Please try again manually.');
            }

            document.body.removeChild(tempInput);
        }

        window.onload = fetchTXTRecords;
