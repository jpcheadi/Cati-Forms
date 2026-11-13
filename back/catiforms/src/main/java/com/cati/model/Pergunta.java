package com.cati.model;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;

@Entity
@Table(name = "perguntas")
public class Pergunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Diferente do form, a pergunta pode usar ID sequencial (1,2,3) pois não vai na URL
    private Long id;

    @Column(nullable = false)
    private String enunciado;

    @Column(nullable = false)
    private String tipo; // Ex: "DISCURSIVA", "MULTIPLA_ESCOLHA"

    // Relacionamento: Muitas perguntas pertencem a UM formulário
    @ManyToOne 
    @JoinColumn(name = "formulario_id", nullable = false) // Cria a Chave Estrangeira no banco
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Formulario formulario;


    // Uma pergunta tem muitas opções
    @OneToMany(mappedBy = "pergunta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Opcao> opcoes = new ArrayList<>();

    // Não esqueça de gerar o getOpcoes() e setOpcoes() !
    public List<Opcao> getOpcoes() { return opcoes; }
    public void setOpcoes(List<Opcao> opcoes) { this.opcoes = opcoes; }

    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEnunciado() { return enunciado; }
    public void setEnunciado(String enunciado) { this.enunciado = enunciado; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Formulario getFormulario() { return formulario; }
    public void setFormulario(Formulario formulario) { this.formulario = formulario; }
}