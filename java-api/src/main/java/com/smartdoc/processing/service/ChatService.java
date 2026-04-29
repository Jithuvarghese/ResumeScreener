package com.smartdoc.processing.service;

import com.smartdoc.processing.model.ResumeRole;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

  public Object handleMessage(String roleValue, String message) {
    // For now: if message asks for questions, return role-specific questions
    String normalized = message == null ? "" : message.toLowerCase(Locale.ROOT);
    if (normalized.contains("question") || normalized.contains("interview") || normalized.contains("quiz")) {
      return generateQuestions(roleValue);
    }

    // Default: return a short help text and suggested prompt
    return Map.of(
        "text", "Send 'interview' to get role-specific questions or ask for suggested interview prompts.",
        "suggested", "interview"
    );
  }

  private List<String> generateQuestions(String roleValue) {
    ResumeRole role = ResumeRole.fromValue(roleValue == null ? "" : roleValue);
    List<String> questions = new ArrayList<>();

    List<String> primaries = role.getCategory("primary");
    List<String> keywords = role.getCategory("keywords");

    // Create up to 5 focused questions from primary skills and keywords
    for (int i = 0; i < Math.min(3, primaries.size()); i++) {
      String skill = primaries.get(i);
      questions.add("Tell me about a project where you used " + skill + ". What challenges did you face and how did you solve them?");
    }

    for (int i = 0; i < Math.min(2, keywords.size()); i++) {
      String kw = keywords.get(i);
      questions.add("Describe your experience with " + kw + " in production.");
    }

    return questions.stream().collect(Collectors.toList());
  }
}
