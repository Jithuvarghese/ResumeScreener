package com.smartdoc.processing.model;

import java.util.List;

public class ResumeAnalysisResult {
  private String roleKey;
  private String role;
  private int matchScore;
  private List<String> skillsFound;
  private List<String> missingSkills;
  private int experienceEstimate;
  private String recommendation;

  public ResumeAnalysisResult() {
  }

  public ResumeAnalysisResult(String roleKey, String role, int matchScore, List<String> skillsFound, List<String> missingSkills, int experienceEstimate, String recommendation) {
    this.roleKey = roleKey;
    this.role = role;
    this.matchScore = matchScore;
    this.skillsFound = skillsFound;
    this.missingSkills = missingSkills;
    this.experienceEstimate = experienceEstimate;
    this.recommendation = recommendation;
  }

  public String getRoleKey() {
    return roleKey;
  }

  public void setRoleKey(String roleKey) {
    this.roleKey = roleKey;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public int getMatchScore() {
    return matchScore;
  }

  public void setMatchScore(int matchScore) {
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
}