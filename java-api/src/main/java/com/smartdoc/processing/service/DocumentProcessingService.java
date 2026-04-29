package com.smartdoc.processing.service;

import com.smartdoc.processing.model.DocumentType;
import com.smartdoc.processing.model.KeywordItem;
import com.smartdoc.processing.model.ProcessingMetrics;
import com.smartdoc.processing.model.ProcessingResult;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentProcessingService {

  private static final Pattern WORD_PATTERN = Pattern.compile("[a-zA-Z][a-zA-Z0-9+#.-]{1,}");
  private static final Pattern AMOUNT_PATTERN = Pattern.compile("(?i)(?:[$€£]|usd|eur|inr|gbp)?\\s*(\\d{1,3}(?:,\\d{3})*(?:\\.\\d{2})?)");
  private static final Set<String> STOP_WORDS = Set.of(
      "about", "above", "after", "again", "against", "among", "and", "are", "because", "been", "before",
      "being", "between", "both", "but", "can", "could", "did", "does", "doing", "down", "during", "each",
      "few", "for", "from", "further", "had", "has", "have", "having", "here", "into", "its", "just",
      "more", "most", "other", "over", "such", "than", "that", "the", "their", "there", "these", "they",
      "this", "those", "through", "under", "until", "very", "was", "were", "what", "when", "where", "which",
      "while", "with", "within", "without", "you", "your", "resume", "invoice", "work", "experience", "skills",
      "summary", "project", "projects", "team", "role", "roles", "responsible", "responsibilities");

  private static final List<String> SKILL_CATALOG = List.of(
      "java",
      "spring boot",
      "spring",
      "react",
      "typescript",
      "javascript",
      "node.js",
      "node",
      "express",
      "rest api",
      "sql",
      "postgresql",
      "mysql",
      "mongodb",
      "aws",
      "azure",
      "docker",
      "kubernetes",
      "git",
      "ci/cd",
      "html",
      "css",
      "tailwind css",
      "testing",
      "python",
      "microservices");

  public ProcessingResult processResume(MultipartFile file) {
    return process(file, DocumentType.RESUME);
  }

  public ProcessingResult processInvoice(MultipartFile file) {
    return process(file, DocumentType.INVOICE);
  }

  private ProcessingResult process(MultipartFile file, DocumentType type) {
    String text = extractText(file);
    List<String> words = tokenize(text);
    Map<String, Integer> frequencies = countWords(words);
    List<String> skills = detectSkills(text);
    List<KeywordItem> keywords = toTopKeywords(frequencies, 10);
    List<Double> amounts = extractAmounts(text);

    ProcessingMetrics metrics = new ProcessingMetrics(
      words.size(),
      frequencies.size(),
      skills.size(),
      amounts.size(),
      keywords.isEmpty() ? "" : keywords.get(0).getTerm(),
      averageWordLength(words),
      amounts);

    String summary = buildSummary(type, skills, keywords, amounts, text);

    return new ProcessingResult(
      type.toApiValue(),
      file.getOriginalFilename() == null ? "uploaded-document" : file.getOriginalFilename(),
      skills,
      keywords,
      summary,
      metrics,
      Instant.now());
  }

  private String extractText(MultipartFile file) {
    try {
      String originalName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase(Locale.ROOT);
      byte[] bytes = file.getBytes();

      if (originalName.endsWith(".txt") || isPlainText(file.getContentType())) {
        return new String(bytes, StandardCharsets.UTF_8);
      }

      String bestEffort = new String(bytes, StandardCharsets.ISO_8859_1)
          .replaceAll("[^\\x20-\\x7E\\n\\r\\t]", " ")
          .replaceAll("\\s+", " ")
          .trim();

      if (!bestEffort.isBlank()) {
        return bestEffort;
      }

      return new String(bytes, StandardCharsets.UTF_8);
    } catch (IOException ex) {
      throw new IllegalArgumentException("Unable to read uploaded file", ex);
    }
  }

  private boolean isPlainText(String contentType) {
    return contentType != null && contentType.contains("text");
  }

  private List<String> tokenize(String text) {
    Matcher matcher = WORD_PATTERN.matcher(text.toLowerCase(Locale.ROOT));
    List<String> words = new ArrayList<>();

    while (matcher.find()) {
      String word = matcher.group().toLowerCase(Locale.ROOT);
      if (!STOP_WORDS.contains(word)) {
        words.add(word);
      }
    }

    return words;
  }

  private Map<String, Integer> countWords(List<String> words) {
    Map<String, Integer> counts = new HashMap<>();
    for (String word : words) {
      counts.merge(word, 1, Integer::sum);
    }
    return counts;
  }

  private List<String> detectSkills(String text) {
    String normalized = text.toLowerCase(Locale.ROOT);
    return SKILL_CATALOG.stream()
        .filter(normalized::contains)
        .distinct()
        .sorted(Comparator.comparingInt(String::length).reversed())
        .toList();
  }

  private List<KeywordItem> toTopKeywords(Map<String, Integer> frequencies, int limit) {
    return frequencies.entrySet().stream()
        .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
        .limit(limit)
        .map(entry -> new KeywordItem(entry.getKey(), entry.getValue()))
        .collect(Collectors.toList());
  }

  private List<Double> extractAmounts(String text) {
    Matcher matcher = AMOUNT_PATTERN.matcher(text);
    List<Double> amounts = new ArrayList<>();

    while (matcher.find()) {
      String candidate = matcher.group(1);
      if (candidate == null || candidate.isBlank()) {
        continue;
      }

      try {
        amounts.add(Double.parseDouble(candidate.replace(",", "")));
      } catch (NumberFormatException ignored) {
        // Skip malformed values and keep the processing pipeline resilient.
      }
    }

    return amounts;
  }

  private double averageWordLength(List<String> words) {
    if (words.isEmpty()) {
      return 0.0;
    }

    int totalCharacters = words.stream().mapToInt(String::length).sum();
    return (double) totalCharacters / words.size();
  }

  private String buildSummary(DocumentType type, List<String> skills, List<KeywordItem> keywords, List<Double> amounts, String text) {
    if (type == DocumentType.INVOICE) {
      String amountText = amounts.isEmpty() ? "no monetary values" : amounts.size() + " monetary values";
      String keywordText = keywords.isEmpty() ? "general invoice language" : "top keyword '" + keywords.get(0).getTerm() + "'";
      return "Invoice analyzed with " + amountText + ", " + keywordText + ", and " + skills.size() + " matched skills.";
    }

    String skillText = skills.isEmpty() ? "no direct skill matches" : skills.size() + " matched skills";
    String keywordText = keywords.isEmpty() ? "no dominant keywords" : "top keyword '" + keywords.get(0).getTerm() + "'";
    String extractedPreview = text.replaceAll("\\s+", " ").trim();
    String preview = extractedPreview.length() > 160 ? extractedPreview.substring(0, 160).trim() + "..." : extractedPreview;
    return "Resume analyzed with " + skillText + ", " + keywordText + ", and a preview of: " + preview;
  }
}
