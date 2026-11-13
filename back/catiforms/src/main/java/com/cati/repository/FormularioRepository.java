package com.cati.repository;

import com.cati.model.Formulario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
// O JpaRepository recebe dois parâmetros: <Qual a Entidade, Qual o tipo do ID dela>
public interface FormularioRepository extends JpaRepository<Formulario, UUID> {
}