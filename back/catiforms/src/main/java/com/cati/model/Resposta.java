package com.cati.model;

import jakarta.persistence.*;

@Entity
@Table(name = "respostas")
public class Resposta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String valor; // O que a pessoa digitou ou a opção que marcou

    @ManyToOne
    @JoinColumn(name = "pergunta_id", nullable = false)
    private Pergunta pergunta;

    @ManyToOne
    @JoinColumn(name = "submissao_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Submissao submissao;

    // --- Getters e Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getValor() { return valor; }
    public void setValor(String valor) { this.valor = valor; }
    public Pergunta getPergunta() { return pergunta; }
    public void setPergunta(Pergunta pergunta) { this.pergunta = pergunta; }
    public Submissao getSubmissao() { return submissao; }
    public void setSubmissao(Submissao submissao) { this.submissao = submissao; }
}
