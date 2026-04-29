package com.smartdoc.processing.controller;

import com.smartdoc.processing.service.ChatService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

  private final ChatService chatService;

  public ChatController(ChatService chatService) {
    this.chatService = chatService;
  }

  @PostMapping
  public ResponseEntity<?> chat(@RequestBody Map<String, Object> body) {
    String role = (String) body.getOrDefault("role", "");
    String message = (String) body.getOrDefault("message", "");
    Object result = chatService.handleMessage(role, message);
    return ResponseEntity.ok(Map.of("response", result));
  }
}
