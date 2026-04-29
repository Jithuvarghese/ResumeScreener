package com.smartdoc.processing.model;

import java.time.Instant;
import java.util.List;
public class ProcessingResult {
  private String type;
  private String fileName;
  private List<String> skills;
  private List<KeywordItem> keywords;
  private String summary;
  private ProcessingMetrics metrics;
  private Instant createdAt;

  public ProcessingResult() {
  }

  public ProcessingResult(String type, String fileName, List<String> skills, List<KeywordItem> keywords, String summary, ProcessingMetrics metrics, Instant createdAt) {
    this.type = type;
    this.fileName = fileName;
    this.skills = skills;
    this.keywords = keywords;
    this.summary = summary;
    this.metrics = metrics;
    this.createdAt = createdAt;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public List<String> getSkills() {
    return skills;
  }

  public void setSkills(List<String> skills) {
    this.skills = skills;
  }

  public List<KeywordItem> getKeywords() {
    return keywords;
  }

  public void setKeywords(List<KeywordItem> keywords) {
    this.keywords = keywords;
  }

  public String getSummary() {
    return summary;
  }

  public void setSummary(String summary) {
    this.summary = summary;
  }

  public ProcessingMetrics getMetrics() {
    return metrics;
  }

  public void setMetrics(ProcessingMetrics metrics) {
    this.metrics = metrics;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
