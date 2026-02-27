"use client";

import { useCallback, useRef, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";

type ResumeUploaderProps = {
  onExtract: (text: string) => void;
};

export function ResumeUploader({ onExtract }: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const extractPdfText = useCallback(
    async (file: File) => {
      setIsExtracting(true);
      setError(null);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ");
          fullText += pageText + "\n";
        }

        setExtractedText(fullText.trim());
        onExtract(fullText.trim());
      } catch {
        setError("PDFの読み込みに失敗しました。別のファイルをお試しください。");
      } finally {
        setIsExtracting(false);
      }
    },
    [onExtract]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== "application/pdf") {
        setError("PDFファイルのみ対応しています。");
        return;
      }
      setFileName(file.name);
      setExtractedText(null);
      extractPdfText(file);
    },
    [extractPdfText]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="space-y-3">
      <div
        className={`relative flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
          isDragging
            ? "border-primary bg-primary-light"
            : "border-border bg-muted hover:border-primary/50 hover:bg-primary-light/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleChange}
        />
        {isExtracting ? (
          <div className="flex flex-col items-center gap-2 text-secondary">
            <Spinner size="lg" />
            <span className="text-sm">テキストを抽出中...</span>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-1 px-4 text-center">
            <svg
              className="h-8 w-8 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-foreground">
              {fileName}
            </span>
            <span className="text-xs text-secondary">
              クリックして変更
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <svg
              className="h-10 w-10 text-secondary/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-foreground">
                PDFをドロップ、またはクリックして選択
              </p>
              <p className="mt-0.5 text-xs text-secondary">
                PDF形式の職歴書・レジュメに対応
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}

      {extractedText && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-secondary">
            抽出テキストプレビュー
          </p>
          <textarea
            readOnly
            value={extractedText}
            rows={6}
            className="w-full resize-none rounded-md border border-border bg-muted p-3 text-xs text-foreground focus:outline-none"
          />
          <p className="text-xs text-secondary">
            {extractedText.length.toLocaleString()} 文字を抽出
          </p>
        </div>
      )}
    </div>
  );
}
