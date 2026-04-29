package com.smartdoc.processing.model;

import java.util.List;

public enum ResumeRole {
  FRONTEND_DEVELOPER("Frontend Developer", List.of("React", "JavaScript", "HTML", "CSS", "Redux")),
  BACKEND_DEVELOPER("Backend Developer", List.of("Node.js", "Java", "Spring", "SQL", "API")),
  DEVOPS_ENGINEER("DevOps Engineer", List.of("Docker", "Kubernetes", "AWS", "CI/CD", "Linux"));

  private final String label;
  private final List<String> skills;

  ResumeRole(String label, List<String> skills) {
    this.label = label;
    this.skills = skills;
  }

  public String getLabel() {
    return label;
  }

  public List<String> getSkills() {
    return skills;
  }

  public static ResumeRole fromValue(String value) {
    if (value == null || value.isBlank()) {
      throw new IllegalArgumentException("A job role is required.");
    }

    return switch (value.trim().toLowerCase()) {
      case "frontend-developer", "frontend developer", "frontend" -> FRONTEND_DEVELOPER;
      case "backend-developer", "backend developer", "backend" -> BACKEND_DEVELOPER;
      case "devops-engineer", "devops engineer", "devops" -> DEVOPS_ENGINEER;
      default -> throw new IllegalArgumentException("Unsupported role: " + value);
    };
  }
}