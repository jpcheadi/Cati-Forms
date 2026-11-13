package com.cati.repository;

import com.cati.model.Submissao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface SubmissaoRepository extends JpaRepository<Submissao, UUID> {
}