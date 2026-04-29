package com.smartdoc.processing.service;

import com.smartdoc.processing.model.ResumeAnalysisResult;
import com.smartdoc.processing.model.ResumeRole;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeAnalysisService {

  private static final Tika TIKA = new Tika();
  private static final Pattern YEARS_PATTERN = Pattern.compile("(?i)(\\d{1,2})\\+?\\s+years?");

  public ResumeAnalysisResult analyzeResume(MultipartFile file, String roleValue) {
    ResumeRole role = ResumeRole.fromValue(roleValue);
    String extractedText = extractText(file);

    // Weighted matching across categories
    List<String> primary = role.getCategory("primary");
    List<String> secondary = role.getCategory("secondary");
    List<String> tools = role.getCategory("tools");
    List<String> soft = role.getCategory("soft");
    List<String> keywords = role.getCategory("keywords");

    Set<String> found = new LinkedHashSet<>();
    float score = 0f;

    List<String> foundPrimary = matchSkills(extractedText, primary);
    found.addAll(foundPrimary);
    score += foundPrimary.size() * 1.0f; // weight 1.0

    List<String> foundSecondary = matchSkills(extractedText, secondary);
    found.addAll(foundSecondary);
    score += foundSecondary.size() * 0.6f; // weight 0.6

    List<String> foundTools = matchSkills(extractedText, tools);
    found.addAll(foundTools);
    score += foundTools.size() * 0.5f; // weight 0.5

    List<String> foundSoft = matchSkills(extractedText, soft);
    found.addAll(foundSoft);
    score += foundSoft.size() * 0.3f; // weight 0.3

    List<String> foundKeywords = matchSkills(extractedText, keywords);
    found.addAll(foundKeywords);
    score += foundKeywords.size() * 0.2f; // weight 0.2

    List<String> skillsFound = new ArrayList<>(found);

    // Compute possible max score for normalization
    float maxPossible = primary.size() * 1.0f + secondary.size() * 0.6f + tools.size() * 0.5f + soft.size() * 0.3f + keywords.size() * 0.2f;
    int matchScore = maxPossible > 0 ? Math.round((score / maxPossible) * 100.0f) : 0;
    String recommendation = recommendationForScore(matchScore);
    int experienceEstimate = estimateExperienceYears(extractedText, skillsFound.size());

    // Build missing list as items from all categories not found
    List<String> allRoleSkills = role.getAllSkills();
    List<String> missingSkills = allRoleSkills.stream()
      .filter(skill -> skillsFound.stream().noneMatch(foundSkill -> foundSkill.equalsIgnoreCase(skill)))
      .collect(Collectors.toList());

    return new ResumeAnalysisResult(
      normalizeRoleKey(roleValue),
      role.getLabel(),
      matchScore,
      skillsFound,
      missingSkills,
      experienceEstimate,
      recommendation);
  }

  private String extractText(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new IllegalArgumentException("A resume file is required.");
    }

    try {
      String originalName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase(Locale.ROOT);
      byte[] bytes = file.getBytes();

      if (originalName.endsWith(".txt") || isPlainText(file.getContentType())) {
        return new String(bytes, StandardCharsets.UTF_8);
      }

      return TIKA.parseToString(new ByteArrayInputStream(bytes));
    } catch (org.apache.tika.exception.TikaException tikaException) {
      try {
        return new String(file.getBytes(), StandardCharsets.UTF_8);
      } catch (IOException ioException) {
        throw new IllegalArgumentException("Unable to extract resume text.", ioException);
      }
    } catch (IOException exception) {
      throw new IllegalArgumentException("Unable to read uploaded resume.", exception);
    } catch (RuntimeException exception) {
      try {
        return new String(file.getBytes(), StandardCharsets.UTF_8);
      } catch (IOException ioException) {
        throw new IllegalArgumentException("Unable to extract resume text.", ioException);
      }
    }
  }

  private boolean isPlainText(String contentType) {
    return contentType != null && contentType.contains("text");
  }

  private List<String> matchSkills(String text, List<String> roleSkills) {
    String normalizedText = normalize(text);
    String paddedText = " " + normalizedText + " ";
    LinkedHashSet<String> foundSkills = new LinkedHashSet<>();

    for (String skill : roleSkills) {
      String normalizedSkill = normalize(skill);
      if (paddedText.contains(" " + normalizedSkill + " ")) {
        foundSkills.add(skill);
      }
    }

    return new ArrayList<>(foundSkills);
  }

  private int estimateExperienceYears(String text, int skillMatches) {
    Matcher matcher = YEARS_PATTERN.matcher(text);
    int maxYears = 0;

    while (matcher.find()) {
      try {
        maxYears = Math.max(maxYears, Integer.parseInt(matcher.group(1)));
      } catch (NumberFormatException ignored) {
        // Keep scanning.
      }
    }

    if (maxYears > 0) {
      return maxYears;
    }

    return Math.max(1, Math.min(15, skillMatches + 1));
  }

  private String recommendationForScore(int score) {
    if (score > 75) {
      return "Good Fit";
    }

    if (score >= 50) {
      return "Moderate Fit";
    }

    return "Needs Improvement";
  }

  private String normalize(String value) {
    return value == null ? "" : value.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", " ").trim();
  }

  private String normalizeRoleKey(String roleValue) {
    return switch (roleValue.trim().toLowerCase(Locale.ROOT)) {
      case "frontend developer", "frontend" -> "frontend-developer";
      case "backend developer", "backend" -> "backend-developer";
      case "devops engineer", "devops" -> "devops-engineer";
      default -> roleValue.trim().toLowerCase(Locale.ROOT).replace(' ', '-');
    };
  }
}