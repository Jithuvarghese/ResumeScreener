package com.smartdoc.processing.model;

import java.util.List;
public class ProcessingMetrics {
  private int totalWords;
  private int uniqueWords;
  private int skillCount;
  private int extractedNumbers;
  private String topKeyword;
  private double averageWordLength;
  private List<Double> detectedAmounts;

  public ProcessingMetrics() {
  }

  public ProcessingMetrics(int totalWords, int uniqueWords, int skillCount, int extractedNumbers, String topKeyword, double averageWordLength, List<Double> detectedAmounts) {
    this.totalWords = totalWords;
    this.uniqueWords = uniqueWords;
    this.skillCount = skillCount;
    this.extractedNumbers = extractedNumbers;
    this.topKeyword = topKeyword;
    this.averageWordLength = averageWordLength;
    this.detectedAmounts = detectedAmounts;
  }

  public int getTotalWords() {
    return totalWords;
  }

  public void setTotalWords(int totalWords) {
    this.totalWords = totalWords;
  }

  public int getUniqueWords() {
    return uniqueWords;
  }

  public void setUniqueWords(int uniqueWords) {
    this.uniqueWords = uniqueWords;
  }

  public int getSkillCount() {
    return skillCount;
  }

  public void setSkillCount(int skillCount) {
    this.skillCount = skillCount;
  }

  public int getExtractedNumbers() {
    return extractedNumbers;
  }

  public void setExtractedNumbers(int extractedNumbers) {
    this.extractedNumbers = extractedNumbers;
  }

  public String getTopKeyword() {
    return topKeyword;
  }

  public void setTopKeyword(String topKeyword) {
    this.topKeyword = topKeyword;
  }

  public double getAverageWordLength() {
    return averageWordLength;
  }

  public void setAverageWordLength(double averageWordLength) {
    this.averageWordLength = averageWordLength;
  }

  public List<Double> getDetectedAmounts() {
    return detectedAmounts;
  }

  public void setDetectedAmounts(List<Double> detectedAmounts) {
    this.detectedAmounts = detectedAmounts;
  }
}
