package com.cati.repository;

import com.cati.model.Formulario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
// O JpaRepository recebe dois parâmetros: <Qual a Entidade, Qual o tipo do ID dela>
public interface FormularioRepository extends JpaRepository<Formulario, UUID> {
    // Busca todos os formulários vinculados ao username passado
    List<Formulario> findByUsuarioUsername(String username);
}