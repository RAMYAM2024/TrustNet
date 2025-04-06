# TrustNet
AI-Powered Online Safety Tool
# TrustNet: AI-Powered Online Safety

## Overview
TrustNet is an advanced AI-driven browser extension designed to detect and moderate harmful content in real-time. Utilizing Google's Gemini API, TrustNet provides:
- **Real-time detection of harmful words** in text inputs.
- **Immediate notifications** with harm percentage and rewrite suggestions.
- **Multilingual hate speech detection** powered by Gemini AI.
- **OCR-based image/video scanning** to uncover hidden harmful content.
- **One-click appeal system** with AI-generated explanations.
- **ToneShift™ real-time harm probability scoring** using Gemini-Nano.
- **Cloud-based scalability** for seamless moderation at any scale.

## Features in the final version
### 1. Real-time Harmful Content Detection
TrustNet actively scans typed text and webpage content, highlighting potential harmful language with real-time interventions and rewrite suggestions.

### 2. Multilingual Hate Speech Detection
Using Google's Gemini AI, TrustNet supports multiple languages, identifying hate speech beyond English.

### 3. Image & Video OCR Detection
With integrated OCR, TrustNet scans embedded media for hidden harmful messages, ensuring comprehensive content moderation.

### 4. One-Click Appeal System
Users can challenge flagged content with AI-generated explanations linked to moderation policies, ensuring transparency and fairness.

### 5. ToneShift™: AI-Powered Harm Prevention
TrustNet analyzes messages before sending, assigning harm probability scores and providing non-offensive rewrites.

### 6. Chrome Extension for Real-time Monitoring
Seamless browser integration allows for on-the-go moderation across websites and social platforms.

## Future Enhancements
### 1. Full Integration with Vertex AI
TrustNet will transition from direct Gemini API calls to Vertex AI for custom model training, improved scalability, and enhanced safety filtering.

### 2. Multi-Modal Detection
- **Expansion to images and videos** using Google Vision AI and Video AI to detect hate symbols and violent content.
- **Seamless integration** with existing text-based moderation for a comprehensive approach.

### 3. Self-Learning Moderation System
- **TensorFlow GNN for harassment detection**, identifying coordinated cyberbullying campaigns.
- **Automated updates of harmful word lists** using BigQuery analytics and user feedback.

### 4. Mobile ToneShift App
- **Android-based real-time intervention** for typed messages.
- **Firebase backend for seamless moderation syncing** across devices.

### 5. Automated Appeal & Transparency Dashboard
- **Moderator dashboard with real-time alerts** for policy enforcement.
- **One-click appeals** backed by Gemini AI-generated explanations.

### 6. Cloud Scalability with Auto-Scaling
- **ToneShift API deployment on Cloud Run** for handling viral harm spikes.
- **Auto-scaling ensures seamless performance** under high-traffic scenarios.

## Tech Stack
- **AI & NLP**: Google Gemini API, Vertex AI, TensorFlow
- **Cloud & Database**: Google Cloud Run, Firebase Firestore, BigQuery
- **Browser Extension**: JavaScript, Chrome Extension API
- **OCR & Vision**: Google Vision AI, Video AI
- **Mobile App**: Kotlin (Android), Firebase Authentication

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/trustnet.git
   ```
2. Navigate to the project folder:
   ```bash
   cd trustnet
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Load the extension in Chrome:
   - Open `chrome://extensions/`.
   - Enable "Developer Mode".
   - Click "Load unpacked" and select the `trustnet` folder.

## Usage
- The extension runs automatically in the background, analyzing text inputs and web pages.
- If harmful content is detected, a popup will display the harm percentage and alternative phrasing suggestions.
- Users can appeal flagged content through the TrustNet dashboard.

TrustNet is committed to building a safer online space with AI-powered moderation. Join us in making the internet a better place!

