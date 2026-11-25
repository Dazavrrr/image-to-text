import { Component, signal, OnDestroy } from '@angular/core';

interface OcrResponse {
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnDestroy {
  selectedFile = signal<File | null>(null);
  previewUrl = signal('');
  extractedText = signal('');
  error = signal('');
  isLoading = signal(false);
  isCopied = signal(false);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.clear();

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.error.set('Only JPEG and PNG images are allowed.');
      input.value = '';
      return;
    }

    if (file.size > 2_000_000) {
      this.error.set('Image size must not exceed 2 MB.');
      input.value = '';
      return;
    }

    this.selectedFile.set(file);
    this.previewUrl.set(URL.createObjectURL(file));
  }

  async extractText(): Promise<void> {
    const file = this.selectedFile();

    if (!file || this.isLoading()) return;

    this.isLoading.set(true);
    this.error.set('');
    this.extractedText.set('');
    this.isCopied.set(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://api.parsejet.com/v1/parse/image/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status}).`);
      }

      const data: OcrResponse = await response.json();
      const text = data.text?.trim();

      if (!text) {
        this.error.set('No text was detected in the image.');
        return;
      }

      this.extractedText.set(text);
    } catch (error) {
      this.error.set(
        error instanceof Error ? error.message : 'Failed to extract text. Please try again.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  async copyText(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.extractedText());
      this.isCopied.set(true);
    } catch {
      this.error.set('Failed to copy text.');
    }
  }

  clear(): void {
    if (this.previewUrl()) {
      URL.revokeObjectURL(this.previewUrl());
    }

    this.selectedFile.set(null);
    this.previewUrl.set('');
    this.extractedText.set('');
    this.error.set('');
    this.isCopied.set(false);
  }

  ngOnDestroy(): void {
    this.clear();
  }
}
