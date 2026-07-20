package com.dev.resume_screener.resume;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

class PDFParserServiceTest {

    private final PDFParserService pdfParserService = new PDFParserService();

    @Test
    void shouldExtractExpectedTextFromPdf() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "files",
                "candidate.pdf",
                "application/pdf",
                buildPdf("Jane Candidate\nJava Engineer"));

        String extractedText = pdfParserService.extractText(file);

        assertThat(extractedText).contains("Jane Candidate").contains("Java Engineer");
    }

    @Test
    void shouldRejectCorruptedPdf() {
        MockMultipartFile file = new MockMultipartFile(
                "files",
                "corrupted.pdf",
                "application/pdf",
                new byte[] {1, 2, 3, 4});

        assertThatThrownBy(() -> pdfParserService.extractText(file))
                .isInstanceOf(ResumeParseException.class)
                .hasMessage("The PDF could not be read. Please upload a valid PDF file.");
    }

    @Test
    void shouldRejectPdfWithoutExtractableText() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "files",
                "empty.pdf",
                "application/pdf",
                buildEmptyPdf());

        assertThatThrownBy(() -> pdfParserService.extractText(file))
                .isInstanceOf(ResumeValidationException.class)
                .hasMessage("The PDF does not contain extractable text.");
    }

    private byte[] buildPdf(String text) throws IOException {
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                contentStream.newLineAtOffset(50, 700);
                for (String line : text.split("\\n")) {
                    contentStream.showText(line);
                    contentStream.newLineAtOffset(0, -18);
                }
                contentStream.endText();
            }

            document.save(output);
            return output.toByteArray();
        }
    }

    private byte[] buildEmptyPdf() throws IOException {
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            document.addPage(new PDPage());
            document.save(output);
            return output.toByteArray();
        }
    }
}
