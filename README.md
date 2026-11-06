# Aisle Rivals 🛒 — Couple's Store Scavenger Hunt

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)

An interactive, real-time 2-player store scavenger hunt web app designed for couples walking through **Walmart** (or any grocery/department store). Rather than mundane tasks like "find a banana", the game challenges you to track down hilarious, creative, and cursed retail curiosities.

---

## 🎯 Game Features

- **20 Creative Items Per Match**:
  - Each match randomly draws 20 challenges from a pool of 35+ curated prompts.
  - 🍕 **Unholy Flavor Combination**: Weird flavor pairings (pickle cotton candy, Flamin' Hot chocolate, watermelon Oreos).
  - 🛒 **Misplaced in the Wild**: Items abandoned in aisles where they definitely don't belong (frozen steaks in the toy aisle, toilet paper in automotive).
  - 🤨 **Who Approved This Design?**: Plushies, mugs, or clothing with terrifying or bizarre faces.
  - 🏷️ **Unhinged Clearance Find**: Absurd markdowns on dusty items that nobody has bought in years.
  - 🦹 **Shameless Brand Impersonator**: Great Value / generic items desperately pretending to be famous name brands.
  - 🤦 **Worst Pun On Packaging**: Groan-worthy greeting cards, dish towels, or novelty tees.
  - 🎨 **Accidental Renaissance in Aisle 7**: A shelf or shopping cart display that looks like classical art.
  - 🪙 **The "$1 Mystery Object"**: A dollar-section item that defies all manufacturing economics.
  - 👃 **Questionable Candle or Soap Scent**: Bizarrely named candle fragrances ("Warm Flannel & Concrete").
  - 📦 **Oversized Box / 90% Air**: Gigantic packaging for a comically tiny product.
  - 🪞 **Partner's Store Spirit Animal**: An item or plush that playfully reminds you of your partner.
  - 🛋️ **The Most Cursed Pillow or Blanket**: Creepy pug pillows or terrifying animal prints.
  - 📺 **Ridiculous "As Seen On TV" Gadget**: Solving problems nobody ever had.
  - 🐶 **Pet Costume That Destroys Dignity**: Dog hotdog outfits or pet tutus.
  - 🌶️ **Aggressively Threatening Hot Sauce**: Organ-threatening labels ("Satan's Blood").
  - 🍿 **The Comically Huge Snack**: Medieval village-sized chip bags or gallon tubs.
  - 🍜 **The $3 Date Night Meal**: Assembling the most chaotic budget meal on a shelf.
  - ➕ **Custom Inside-Joke Challenge Creator**: Add your own personal prompts on the fly!

- **🔄 Swap / Replace Any Item You Don't Like**:
  - If a challenge is unavailable in your store or you just don't like it, tap the **"🔄 Swap"** button on the card or inside the camera modal.
  - The game instantly replaces it with a fresh challenge from the master deck and syncs with your partner!

- **🏆 Custom Win Condition (Race to Goal)**:
  - 20 items are available on the board, letting you pick and choose your route through the store!
  - Host chooses the win goal: **First to 5, 8, 10, or 12 verified finds**.
  - First partner to reach the target wins the match and is crowned the Walmart Champion!

- **📸 Opposing Player Photo Verification**:
  - Whenever you find an item, snap a photo using your phone camera (`capture="environment"`) and add an optional defense note.
  - Your partner **instantly receives a vibrating audio notification** on their phone with your photo evidence.
  - Your partner must inspect the photo and click **"Approve (+Points)"** or **"Reject (Try Again)"** with feedback!

- **🌐 Play Anywhere in the World (Cellular 5G/LTE or Store Wi-Fi)**:
  - Built-in automatic Cloudflare tunnel creates a secure public HTTPS URL when started.
  - Both players can scan the on-screen QR code and play immediately from inside Walmart with zero router or firewall setup!

- **Couple's Victory Scrapbook**:
  - Confetti fanfare crowning the winner!
  - Side-by-side memory scrapbook comparing all the photos you both took during your date night.

---

## 🚀 Quick Start

### 1. Install & Run
```bash
git clone https://github.com/ahumpo7/aisle-rivals.git
cd aisle-rivals
npm install
cd client && npm install && npm run build && cd ..
npm start
```

### 2. Connect Your Phones
When started, the console will output:
```
🛒 COUPLE'S STORE SCAVENGER HUNT SERVER RUNNING!
Local machine:    http://localhost:3000
Wi-Fi / Phone URL: http://192.168.1.13:3000 (Wi-Fi)
✨ PUBLIC ANYWHERE URL: https://xxxx.trycloudflare.com
📲 Scan or open on your phones anywhere on 5G/LTE or Store Wi-Fi!
```
1. Open the URL on your phone or scan the QR code.
2. Tap **Create New Game**, choose your avatar, and set your win goal (e.g. First to 8).
3. Have your partner scan the QR code to join.
4. Hit **Start Store Hunt!** and have fun!

---

## ☁️ 24/7 Cloud Hosting Options

If you prefer to host it permanently online for free:

### Option A: Render
1. Push to GitHub (already configured with `render.yaml`).
2. Go to [render.com](https://render.com) -> New Web Service -> Connect this repo.
3. Render will automatically build and deploy it with a permanent `https://your-app.onrender.com` URL!

### Option B: Docker
```bash
docker build -t aisle-rivals .
docker run -p 3000:3000 aisle-rivals
```

---

## 🧪 Testing
Run the automated end-to-end WebSocket simulation:
```bash
node test-game-flow.js
```
