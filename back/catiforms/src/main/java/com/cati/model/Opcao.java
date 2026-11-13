package com.cati.model;

import java.util.UUID;
import jakarta.persistence.*;

@Entity // Diz ao Spring: "Crie uma tabela no PostgreSQL baseada nesta classe"
@Table(name = "opcao") // Nome da tabela no banco
public class Opcao {

    @Id // Diz que este atributo é a Chave Primária
    @GeneratedValue(strategy = GenerationType.UUID) // O Java vai gerar um ID único automaticamente
    private UUID id;

    @Column(name = "texto", nullable = false, columnDefinition = "TEXT") // Permite textos longos
    private String texto;

    // Relacionamento: Muitas opções pertencem a uma pergunta
    @ManyToOne 
    @JoinColumn(name = "pergunta_id", nullable = false) // Cria a Chave Estrangeira no banco
    @com.fasterxml.jackson.annotation.JsonIgnore 
    private Pergunta pergunta;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTexto() { return texto; }
    public void setTexto(String descricao) { this.texto = descricao; }

    public Pergunta getPergunta() { return pergunta; }
    public void setPergunta(Pergunta pergunta) { this.pergunta = pergunta; }
}
