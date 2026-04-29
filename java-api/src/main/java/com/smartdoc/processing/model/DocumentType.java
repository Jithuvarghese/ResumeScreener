package com.smartdoc.processing.model;

public enum DocumentType {
  RESUME,
  INVOICE;

  public static DocumentType fromPathVariable(String value) {
    return DocumentType.valueOf(value.trim().toUpperCase());
  }

  public String toApiValue() {
    return name().toLowerCase();
  }
}
