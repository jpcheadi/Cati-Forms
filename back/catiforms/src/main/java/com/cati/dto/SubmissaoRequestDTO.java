package com.cati.dto;

import java.util.List;

public class SubmissaoRequestDTO {
    private String email;
    private List<RespostaRequestDTO> respostas;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public List<RespostaRequestDTO> getRespostas() { return respostas; }
    public void setRespostas(List<RespostaRequestDTO> respostas) { this.respostas = respostas; }

}