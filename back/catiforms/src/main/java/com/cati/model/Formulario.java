package com.cati.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

@Entity // Diz ao Spring: "Crie uma tabela no PostgreSQL baseada nesta classe"
@Table(name = "formularios") // Nome da tabela no banco
public class Formulario {

    @Id // Diz que este atributo é a Chave Primária
    @GeneratedValue(strategy = GenerationType.UUID) // O Java vai gerar um ID único automaticamente
    private UUID id;

    @Column(nullable = false) // Esta coluna não pode ser nula no banco
    private String titulo;

    @Column(columnDefinition = "TEXT") // Permite textos longos
    private String descricao;

    @Column(name = "solicita_email", nullable = false)
    private boolean solicitaEmail;

    @OneToMany(mappedBy = "formulario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pergunta> perguntas = new ArrayList<>();

    public List<Pergunta> getPerguntas() { return perguntas; }
    public void setPerguntas(List<Pergunta> perguntas) { this.perguntas = perguntas; }

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @com.fasterxml.jackson.annotation.JsonIgnore // Evita erro de recursão ao devolver o JSON
    private Usuario usuario;
    
    public Formulario() {}

    // Getters e Setters 
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public boolean isSolicitaEmail() { return solicitaEmail; }
    public void setSolicitaEmail(boolean solicitaEmail) { this.solicitaEmail = solicitaEmail; }
}