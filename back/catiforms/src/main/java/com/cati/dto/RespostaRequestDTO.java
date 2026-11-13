package com.cati.dto;

public class RespostaRequestDTO {
    private Long perguntaId; // Precisamos saber qual pergunta a pessoa está respondendo
    private String valor;

    public Long getPerguntaId() { return perguntaId; }
    public void setPerguntaId(Long perguntaId) { this.perguntaId = perguntaId; }
    public String getValor() { return valor; }
    public void setValor(String valor) { this.valor = valor; }
}