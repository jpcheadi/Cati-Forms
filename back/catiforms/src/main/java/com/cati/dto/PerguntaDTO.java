package com.cati.dto;

import java.util.List;

public class PerguntaDTO {
    
    private String enunciado;
    private String tipo;
    
    // Uma pergunta no JSON tem uma lista de opções dentro dela
    private List<OpcaoDTO> opcoes;

    public String getEnunciado() { return enunciado; }
    public void setEnunciado(String enunciado) { this.enunciado = enunciado; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public List<OpcaoDTO> getOpcoes() { return opcoes; }
    public void setOpcoes(List<OpcaoDTO> opcoes) { this.opcoes = opcoes; }
}