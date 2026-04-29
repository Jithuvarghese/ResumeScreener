package com.smartdoc.processing.controller;

import com.smartdoc.processing.model.ProcessingResult;
import com.smartdoc.processing.service.DocumentProcessingService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/process")
public class ProcessController {

  private final DocumentProcessingService documentProcessingService;

  public ProcessController(DocumentProcessingService documentProcessingService) {
    this.documentProcessingService = documentProcessingService;
  }

  @PostMapping(value = "/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ProcessingResult processResume(@RequestParam("file") MultipartFile file) {
    return documentProcessingService.processResume(file);
  }

  @PostMapping(value = "/invoice", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ProcessingResult processInvoice(@RequestParam("file") MultipartFile file) {
    return documentProcessingService.processInvoice(file);
  }
}
