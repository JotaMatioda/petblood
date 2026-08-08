package com.petblood.api.repository;

import com.petblood.api.model.Doacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoacaoRepository extends JpaRepository<Doacao, Long> {
    List<Doacao> findByPetDonoId(Long donoId);
    List<Doacao> findByPetId(Long petId);
}
