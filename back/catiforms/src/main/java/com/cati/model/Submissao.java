package com.cati.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "submissoes")
public class Submissao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String email; // Opcional, dependendo da configuração do Formulário

    @Column(nullable = false)
    private LocalDateTime dataEnvio = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "formulario_id", nullable = false)
    private Formulario formulario;

    // Uma submissão tem várias respostas dentro dela
    @OneToMany(mappedBy = "submissao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Resposta> respostas = new ArrayList<>();

    // --- Getters e Setters ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public LocalDateTime getDataEnvio() { return dataEnvio; }
    public void setDataEnvio(LocalDateTime dataEnvio) { this.dataEnvio = dataEnvio; }
    public Formulario getFormulario() { return formulario; }
    public void setFormulario(Formulario formulario) { this.formulario = formulario; }
    public List<Resposta> getRespostas() { return respostas; }
    public void setRespostas(List<Resposta> respostas) { this.respostas = respostas; }
}