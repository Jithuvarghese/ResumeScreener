package com.smartdoc.processing.controller;

import com.smartdoc.processing.model.ResumeAnalysisResult;
import com.smartdoc.processing.service.ResumeAnalysisService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/analyze")
public class AnalyzeController {

  private final ResumeAnalysisService resumeAnalysisService;

  public AnalyzeController(ResumeAnalysisService resumeAnalysisService) {
    this.resumeAnalysisService = resumeAnalysisService;
  }

  @GetMapping("/health")
  public String health() {
    return "ok";
  }

  @PostMapping(value = "/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResumeAnalysisResult analyzeResume(@RequestParam("file") MultipartFile file, @RequestParam("role") String role) {
    return resumeAnalysisService.analyzeResume(file, role);
  }
}