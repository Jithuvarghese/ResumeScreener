package com.smartdoc.processing.model;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum ResumeRole {
  FRONTEND_DEVELOPER(
      "Frontend Developer",
      Map.of(
          "primary", List.of("React", "JavaScript", "HTML", "CSS"),
          "secondary", List.of("TypeScript", "Redux", "Next.js"),
          "tools", List.of("Vite", "Webpack", "Storybook"),
          "soft", List.of("Design systems", "Accessibility"),
          "keywords", List.of("ui", "frontend", "web", "component")
      )
  ),
  BACKEND_DEVELOPER(
      "Backend Developer",
      Map.of(
          "primary", List.of("Node.js", "Java", "Spring"),
          "secondary", List.of("Express", "Hibernate", "SQL"),
          "tools", List.of("Docker", "Postman", "Redis"),
          "soft", List.of("System design", "APIs"),
          "keywords", List.of("api", "backend", "service", "microservice")
      )
  ),
  DEVOPS_ENGINEER(
      "DevOps Engineer",
      Map.of(
          "primary", List.of("Docker", "Kubernetes", "CI/CD"),
          "secondary", List.of("Terraform", "Prometheus"),
          "tools", List.of("AWS", "Helm", "Jenkins"),
          "soft", List.of("Automation", "Reliability"),
          "keywords", List.of("infrastructure", "deployment", "ops")
      )
  ),
  DATA_SCIENTIST(
      "Data Scientist",
      Map.of(
          "primary", List.of("Python", "Pandas", "Machine Learning"),
          "secondary", List.of("TensorFlow", "PyTorch", "Scikit-learn"),
          "tools", List.of("Jupyter", "Docker", "MLflow"),
          "soft", List.of("Feature engineering", "Statistics"),
          "keywords", List.of("data", "ml", "modeling", "analysis")
      )
  );

  private final String label;
  private final Map<String, List<String>> categories;

  ResumeRole(String label, Map<String, List<String>> categories) {
    this.label = label;
    this.categories = categories;
  }

  public String getLabel() {
    return label;
  }

  public List<String> getCategory(String key) {
    return categories.getOrDefault(key, List.of());
  }

  public List<String> getAllSkills() {
    return categories.values().stream().flatMap(List::stream).collect(Collectors.toList());
  }

  public static ResumeRole fromValue(String value) {
    if (value == null || value.isBlank()) {
      throw new IllegalArgumentException("A job role is required.");
    }

    return switch (value.trim().toLowerCase()) {
      case "frontend-developer", "frontend developer", "frontend" -> FRONTEND_DEVELOPER;
      case "backend-developer", "backend developer", "backend" -> BACKEND_DEVELOPER;
      case "devops-engineer", "devops engineer", "devops" -> DEVOPS_ENGINEER;
      case "data-scientist", "data scientist", "data" -> DATA_SCIENTIST;
      default -> throw new IllegalArgumentException("Unsupported role: " + value);
    };
  }
}