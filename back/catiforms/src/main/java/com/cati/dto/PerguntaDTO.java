package com.cati.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.Valid;
import java.util.List;

public class PerguntaDTO {
    
    @NotBlank(message = "O enunciado da pergunta é obrigatório")
    private String enunciado;

    @NotBlank(message = "O tipo da pergunta é obrigatório")
    private String tipo;
    
    // Uma pergunta no JSON tem uma lista de opções dentro dela
    @Valid
    private List<OpcaoDTO> opcoes;

    public String getEnunciado() { return enunciado; }
    public void setEnunciado(String enunciado) { this.enunciado = enunciado; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public List<OpcaoDTO> getOpcoes() { return opcoes; }
    public void setOpcoes(List<OpcaoDTO> opcoes) { this.opcoes = opcoes; }
}
