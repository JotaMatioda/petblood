package com.petblood.api.dto;

import com.petblood.api.model.Solicitacao;
import com.petblood.api.model.Pet;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SolicitacaoResponse {

    private Long id;
    private String nomePaciente;
    private Pet.Especie especie;
    private String raca;
    private String peso;
    private Solicitacao.TipoSanguineo tipoSanguineo;
    private String volume;
    private String motivo;
    private Solicitacao.Urgencia urgencia;
    private String medicoResponsavel;
    private Solicitacao.Status status;
    private LocalDateTime criadoEm;
    private String clinicaNome;

    public static SolicitacaoResponse de(Solicitacao s) {
        SolicitacaoResponse r = new SolicitacaoResponse();
        r.id = s.getId();
        r.nomePaciente = s.getNomePaciente();
        r.especie = s.getEspecie();
        r.raca = s.getRaca();
        r.peso = s.getPeso();
        r.tipoSanguineo = s.getTipoSanguineo();
        r.volume = s.getVolume();
        r.motivo = s.getMotivo();
        r.urgencia = s.getUrgencia();
        r.medicoResponsavel = s.getMedicoResponsavel();
        r.status = s.getStatus();
        r.criadoEm = s.getCriadoEm();
        r.clinicaNome = s.getClinica().getNome();
        return r;
    }
}
