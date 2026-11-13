package com.cati.dto;
import java.util.List;

public class FormularioRequestDTO {
    
    private String titulo;
    private String descricao;
    private boolean solicitaEmail;

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