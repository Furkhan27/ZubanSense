# Zuban Sense – Smart Multilingual Dictionary & Translator

Zuban Sense is a **Chrome extension** that helps users instantly translate words into **two languages**, understand their **meaning with example sentences**, and build a **personal dictionary** of searched words that can be downloaded anytime.

---

**Author:** Mohammed Furqan Siddiq  

## Overview

While reading content online, users often encounter unfamiliar words. Zuban Sense simplifies language learning by providing instant translations, meanings, and usage examples directly inside the browser.  
The extension also maintains a **dictionary book** that stores all searched words, helping users revise and expand their vocabulary over time.

---

## Features

- **Dual-Language Translation**  
  Translate words into two languages simultaneously

- **Word Meaning & Example Sentences**  
  Understand contextual usage of words

- **Personal Dictionary Book**  
  Automatically saves searched words

- **Download Saved Words**  
  Export your dictionary for offline learning

- **Instant Browser Access**  
  Lightweight and fast Chrome extension

- **Clean & User-Friendly UI**  
  Simple popup interface for easy interaction

---

## How It Works

1. User selects or enters a word
2. The extension fetches:
   - Meaning
   - Translations in two languages
   - Example sentence
3. The word is automatically saved to the dictionary
4. Saved words can be viewed and downloaded anytime

---

## Project Structure

```text
Zuban Sense/
├── app.py                 # Backend logic (if applicable)
├── background.js          # Background service worker
├── content.js             # Content script for webpage interaction
├── popup.html             # Extension popup UI
├── popup.js               # Popup functionality
├── manifest.json          # Chrome extension configuration
├── saved_notes.json       # Stored dictionary words
├── fonts/                 # Custom fonts
├── icon.png               # Extension icon
├── sweetalert2.all.min.js # Alert UI library
├── tts_output.mp3         # Text-to-speech output
└── README.md              # Project documentation


