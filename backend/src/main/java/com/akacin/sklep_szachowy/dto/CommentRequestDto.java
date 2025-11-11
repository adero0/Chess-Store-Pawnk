package com.akacin.sklep_szachowy.dto;

import jakarta.validation.constraints.NotBlank;

public class CommentRequestDto {
    @NotBlank
    private String content;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
