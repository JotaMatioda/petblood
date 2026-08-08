package com.petblood.api.repository;

import com.petblood.api.model.Solicitacao;
import com.petblood.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    List<Solicitacao> findByClinicaOrderByCriadoEmDesc(Usuario clinica);
}
