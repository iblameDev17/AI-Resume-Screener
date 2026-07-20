package com.dev.resume_screener.resume;

import java.io.IOException;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.InvalidPasswordException;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class PDFParserService {

    public String extractText(MultipartFile file) {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            if (document.isEncrypted()) {
                throw new ResumeValidationException("The PDF is password protected.");
            }

            String extractedText = new PDFTextStripper().getText(document);
            String normalizedText = normalizeWhitespace(extractedText);
            if (normalizedText.isBlank()) {
                throw new ResumeValidationException("The PDF does not contain extractable text.");
            }

            return normalizedText;
        } catch (ResumeValidationException exception) {
            throw exception;
        } catch (InvalidPasswordException exception) {
            throw new ResumeValidationException("The PDF is password protected.");
        } catch (IOException exception) {
            log.debug("PDF parsing failed for file {}", file.getOriginalFilename());
            throw new ResumeParseException("The PDF could not be read. Please upload a valid PDF file.", exception);
        }
    }

    private String normalizeWhitespace(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }

        return input
                .replace("\r\n", "\n")
                .replace('\r', '\n')
                .replaceAll("[\\t\\x0B\\f ]+", " ")
                .replaceAll(" *\n *", "\n")
                .replaceAll("\n{3,}", "\n\n")
                .trim();
    }
}
