# .dprofile
Fetches TXT records and displays them in a Linktree-style interface.

# TXT Record Prefix Documentation

This repository provides comprehensive documentation for TXT record prefixes used with Handshake (HNS) TLDs. These prefixes facilitate standardized data interpretation, enabling clients to easily recognize and interact with on-chain and off-chain records.

## Introduction

Handshake TLDs empower individuals and organizations with **total ownership** and **sovereign identity** by providing immutable, censorship-resistant on-chain records. This ensures that your data is securely published without the risk of alteration or suppression by centralized entities.

TXT record prefixes standardize how information is structured and interpreted, making it easier for services and applications to extract the intended data seamlessly.

---

## Setup Instructions

1. Navigate to your domain manager (e.g., [Namebase](https://namebase.io)).
2. Add a new TXT record with the following configuration:
   - **Type**: TXT  
   - **Name**: `@`  
   - **Value/Data**: `<prefix>:<value>` (e.g., `link:example.com`)  
   - **TTL**: 60 minutes  

3. After configuration, visit:  http://hackbase.dprofile  or http://hackbase.dprofile.hns.to (Replace "hackbase" with your actual TLD or desired domain name.) 


---

## List of Prefixes

| **Prefix**                   | **Purpose**                      | **Example**                |
|------------------------------|----------------------------------|----------------------------|
| `pfp:<url>`                  | Profile picture URL              | `pfp:example.com/img.png`  |
| `mail:<email>`               | Email address                    | `mail:example@example.com` |
| `link:<url>`                 | Redirect to a webpage            | `link:example.com`         |
| `onion:<url>`                | Redirect to an Onion service     | `onion:example`            |
| `gh:<username>`              | GitHub profile/repo              | `gh:username`              |

### Social
| **Prefix**                   | **Purpose**                      | **Example**                |
|------------------------------|----------------------------------|----------------------------|
| `x:<username>`               | X (formerly Twitter) profile    | `x:username`                |
| `nostr:<npub>`               | Nostr public key                | `nostr:npub123`             |
| `bsky:<username>`            | Bluesky profile                 | `bsky:username`             |
| `ig:<username>`              | Instagram profile               | `ig:username`               |
| `fb:<username>`              | Facebook profile                | `fb:username`               |

### Communication
| **Prefix**                   | **Purpose**                      | **Example**                |
|------------------------------|----------------------------------|----------------------------|
| `tb:<username>`              | Thunderbolt identifier           | `tb:username`              |
| `sn:<number>`                | Signal profile                   | `sn:1234567890`            |
| `wa:<number>`                | WhatsApp                         | `wa:1234567890`            |
| `tg:<username>`              | Telegram                         | `tg:username`              |
| `tel:<number>`               | Phone number                     | `tel:+1234567890`          |

### Layout
| **Prefix**                   | **Purpose**                      | **Example**                |
|------------------------------|----------------------------------|----------------------------|
| `bgcolor:<hex>`              | Background color in HEX format   | `bgcolor:ffffff`           |
| `bg:<url>`                   | Background image URL             | `bg:example.com/bg_img.png`|

### Wallet
| **Prefix**                   | **Purpose**                      | **Example**                |
|------------------------------|----------------------------------|----------------------------|
| `btc:<address>`              | Bitcoin wallet address           | `btc:btc_address`          |
| `hns:<address>`              | Handshake wallet address         | `hns:hns_address`          |
| `xmr:<address>`              | Monero wallet address            | `xmr:xmr_address`          |
| `eth:<address>`              | Ethereum wallet address          | `eth:eth_address`          |
---

# Note:
This is an experimental demo. It uses https://doh.hnsdns.com to fetch the TXT records and currently supports off-chain TXT records only. It works with Handshake HNS TLDs, HNS SLDs, and ICANN SLDs.

The primary goal of this demo is to establish a universal standard for TXT records and pave the way for APIs supporting wallets, clients, logins, and more based on this standard.

## License

No license, no limits. Free to use, abuse and improve this code however you see fit.



