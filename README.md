# Spam vs. Ham SMS Classifier

An intelligent SMS classifier powered by the Google Gemini API, designed with a modern, responsive, and feature-rich user interface.

![Spam vs Ham SMS Classifier Screenshot](https://storage.googleapis.com/aistudio-ux-team-public/sdk_gallery_demos/sms_spam_classifier.png)

## ✨ Key Features

- **🧠 AI-Powered Classification**: Utilizes the `gemini-2.5-flash` model to accurately classify messages as 'Spam' or 'Ham'.
- **📊 Confidence Score**: Visualizes the AI's confidence level with an animated donut chart.
- **🌐 Grounded Responses**: Integrates Google Search to provide references, offering transparency into how the classification was determined.
- **💾 Message History**: Automatically logs all classifications with timestamps for review.
- **⚡️ Real-time Validation**: Provides instant feedback with a character counter and input validation to prevent empty or oversized submissions.
- **🚀 Optimized for Speed**: Disables the model's "thinking" phase to deliver near-instant classification results.
- **✅ User Feedback**: Includes an interactive like/dislike mechanism for rating classification accuracy.
- **📋 Easy Testing**: Comes with pre-defined 'Spam' and 'Ham' examples to test the classifier instantly.
- **🔗 Actionable Results**: Allows users to easily copy results to the clipboard or share them using the native Web Share API.
- **📱 Responsive Design**: Features a clean, modern UI with fluid animations that looks great on any device.

## ⚙️ How It Works

The application provides a simple interface for users to input an SMS message. On submission:

1.  **Client-Side Validation**: The input is first checked to ensure it's not empty and doesn't exceed the 500-character limit.
2.  **API Service Call**: The message is sent to a backend service that communicates with the Google Gemini API.
3.  **Intelligent Prompting**: A carefully crafted prompt instructs the `gemini-2.5-flash` model to analyze the message, classify it, provide a confidence score, and use Google Search for grounding. The prompt strictly requests a JSON-formatted response.
4.  **Robust Parsing**: The service sanitizes the API response, cleaning up potential markdown formatting before parsing the JSON data.
5.  **UI Update**: The frontend receives the structured data (classification, probability, and references) and dynamically updates the UI to display the result, chart, and source links.
6.  **History Logging**: The result is prepended to the history log, which is maintained in the application's state.

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini API (`gemini-2.5-flash`)
- **Charting**: Recharts
- **Bundler**: Vite (via the development environment)

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites

- Node.js (v18 or later)
- `npm` or a compatible package manager
- A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/sms-spam-classifier.git
    cd sms-spam-classifier
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add your Gemini API key:
    ```
    # .env
    API_KEY="YOUR_GEMINI_API_KEY"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173`.

## 📂 Project Structure

The project follows a standard React application structure, organized for clarity and scalability.

```
/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── icons/            # Reusable SVG icon components
│   │   ├── ExampleMessages.tsx
│   │   ├── HistoryLog.tsx
│   │   ├── InputForm.tsx
│   │   ├── ReferencesDisplay.tsx
│   │   └── ResultDisplay.tsx
│   ├── services/
│   │   └── geminiService.ts  # Logic for Gemini API interaction
│   ├── App.tsx               # Main application component and state management
│   ├── index.tsx             # React entry point
│   └── types.ts              # TypeScript type definitions
├── .env.example              # Environment variable template
├── index.html                # Main HTML file
├── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or find any issues, please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
