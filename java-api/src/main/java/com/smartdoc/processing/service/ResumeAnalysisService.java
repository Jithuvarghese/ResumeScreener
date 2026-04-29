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
    List<String> skillsFound = matchSkills(extractedText, role.getSkills());
    List<String> missingSkills = role.getSkills().stream()
        .filter(skill -> skillsFound.stream().noneMatch(found -> found.equalsIgnoreCase(skill)))
        .collect(Collectors.toList());

    int matchScore = Math.round((skillsFound.size() * 100.0f) / role.getSkills().size());
    String recommendation = recommendationForScore(matchScore);
    int experienceEstimate = estimateExperienceYears(extractedText, skillsFound.size());

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