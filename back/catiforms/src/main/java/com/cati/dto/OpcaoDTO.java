package com.cati.dto;

import jakarta.validation.constraints.NotBlank;

public class OpcaoDTO {
    
    @NotBlank(message = "O texto da opção é obrigatório")
    private String texto;

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
}
