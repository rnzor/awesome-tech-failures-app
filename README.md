# Awesome Tech Failures 🛠️💥

> **BETA VERSION** - This is a beta release of the Awesome Tech Failures app. Features and UI may change.

A comprehensive database of technology failures, outages, and incidents from across the industry. Learn from others' mistakes to build more resilient systems.

## Features

- 📊 **Extensive Database**: Curated collection of major tech failures with detailed analysis
- 🎨 **Dual Theme**: Dark and light themes with improved accessibility
- 🔍 **Advanced Search**: Fuzzy search across titles, descriptions, companies, and tags
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🏷️ **Category Filtering**: Browse by failure type (Security, Outages, AI Slop, etc.)
- 📈 **Analytics Dashboard**: Statistical insights and trends
- 🤖 **AI Integration**: Coming soon - AI-powered failure analysis

## Run Locally

**Prerequisites:** Node.js (v16 or higher)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rnzor/awesome-tech-failures-app.git
   cd awesome-tech-failures-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # React components
│   ├── FailureCard.tsx  # Individual failure display
│   ├── Sidebar.tsx      # Navigation and filters
│   ├── StatsDashboard.tsx # Analytics view
│   └── ...
├── services/           # Data fetching and API services
├── types.ts           # TypeScript type definitions
└── App.tsx           # Main application component
```

## Contributing

This is currently a beta version. Found a bug or have suggestions?

- Report issues on [GitHub Issues](https://github.com/rnzor/awesome-tech-failures-app/issues)
- Submit pull requests for improvements

## License

MIT License - See LICENSE file for details
