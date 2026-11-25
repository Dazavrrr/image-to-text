# Image to Text Converter

A simple Angular application that extracts text from uploaded images using the ParseJet OCR API.

## Features

- JPEG and PNG image upload
- File size validation (up to 2 MB)
- Image preview
- Text extraction using OCR API
- Copy extracted text to clipboard
- Loading and error states
- Responsive layout

## Tech Stack

- Angular
- TypeScript
- SCSS
- ParseJet OCR API

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open http://localhost:4200 in your browser.

## Limitations

OCR accuracy depends on image quality, font style, and contrast. API usage is subject to the provider's request limits.
