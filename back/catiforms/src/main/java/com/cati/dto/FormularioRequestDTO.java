package com.cati.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class FormularioRequestDTO {
    
    @NotBlank(message = "O título é obrigatório")
    private String titulo;

    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;

    private boolean solicitaEmail;

    @NotEmpty(message = "O formulário deve conter pelo menos uma pergunta")
    @Valid
    private List<PerguntaDTO> perguntas;

    // Getters e Setters
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public boolean isSolicitaEmail() { return solicitaEmail; }
    public void setSolicitaEmail(boolean solicitaEmail) { this.solicitaEmail = solicitaEmail; }

    public List<PerguntaDTO> getPerguntas() { return perguntas; }
    public void setPerguntas(List<PerguntaDTO> perguntas) { this.perguntas = perguntas; }
}
