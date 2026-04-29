package com.smartdoc.processing.model;

import java.util.List;

public class RoleAnalysisResult {
  private String roleKey;
  private String roleLabel;
  private long matchScore;
  private List<String> skillsFound;
  private List<String> missingSkills;
  private int experienceEstimate;
  private String recommendation;

  public RoleAnalysisResult() {
  }

  public RoleAnalysisResult(String roleKey, String roleLabel, long matchScore, List<String> skillsFound, List<String> missingSkills, int experienceEstimate, String recommendation) {
    this.roleKey = roleKey;
    this.roleLabel = roleLabel;
    this.matchScore = matchScore;
    this.skillsFound = skillsFound;
    this.missingSkills = missingSkills;
    this.experienceEstimate = experienceEstimate;
    this.recommendation = recommendation;
  }

  public static Builder builder() {
    return new Builder();
  }

  public String getRoleKey() {
    return roleKey;
  }

  public void setRoleKey(String roleKey) {
    this.roleKey = roleKey;
  }

  public String getRoleLabel() {
    return roleLabel;
  }

  public void setRoleLabel(String roleLabel) {
    this.roleLabel = roleLabel;
  }

  public long getMatchScore() {
    return matchScore;
  }

  public void setMatchScore(long matchScore) {
    this.matchScore = matchScore;
  }

  public List<String> getSkillsFound() {
    return skillsFound;
  }

  public void setSkillsFound(List<String> skillsFound) {
    this.skillsFound = skillsFound;
  }

  public List<String> getMissingSkills() {
    return missingSkills;
  }

  public void setMissingSkills(List<String> missingSkills) {
    this.missingSkills = missingSkills;
  }

  public int getExperienceEstimate() {
    return experienceEstimate;
  }

  public void setExperienceEstimate(int experienceEstimate) {
    this.experienceEstimate = experienceEstimate;
  }

  public String getRecommendation() {
    return recommendation;
  }

  public void setRecommendation(String recommendation) {
    this.recommendation = recommendation;
  }

  public enum Recommendation {
    GOOD_FIT("Good Fit"),
    MODERATE_FIT("Moderate Fit"),
    NEEDS_IMPROVEMENT("Needs Improvement");

    private final String label;

    Recommendation(String label) {
      this.label = label;
    }

    public String getLabel() {
      return label;
    }
  }

  public static final class Builder {
    private String roleKey;
    private String roleLabel;
    private long matchScore;
    private List<String> skillsFound;
    private List<String> missingSkills;
    private int experienceEstimate;
    private String recommendation;

    private Builder() {
    }

    public Builder roleKey(String roleKey) {
      this.roleKey = roleKey;
      return this;
    }

    public Builder roleLabel(String roleLabel) {
      this.roleLabel = roleLabel;
      return this;
    }

    public Builder matchScore(long matchScore) {
      this.matchScore = matchScore;
      return this;
    }

    public Builder skillsFound(List<String> skillsFound) {
      this.skillsFound = skillsFound;
      return this;
    }

    public Builder missingSkills(List<String> missingSkills) {
      this.missingSkills = missingSkills;
      return this;
    }

    public Builder experienceEstimate(int experienceEstimate) {
      this.experienceEstimate = experienceEstimate;
      return this;
    }

    public Builder recommendation(String recommendation) {
      this.recommendation = recommendation;
      return this;
    }

    public RoleAnalysisResult build() {
      return new RoleAnalysisResult(roleKey, roleLabel, matchScore, skillsFound, missingSkills, experienceEstimate, recommendation);
    }
  }
}
