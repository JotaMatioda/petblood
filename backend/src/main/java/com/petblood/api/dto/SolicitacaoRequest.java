package com.petblood.api.dto;

import com.petblood.api.model.Solicitacao;
import com.petblood.api.model.Pet;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SolicitacaoRequest {

    @NotBlank
    private String nomePaciente;

    @NotNull
    private Pet.Especie especie;

    private String raca;
    private String peso;

    @NotNull
    private Solicitacao.TipoSanguineo tipoSanguineo;

    @NotBlank
    private String volume;

    private String motivo;

    private Solicitacao.Urgencia urgencia = Solicitacao.Urgencia.NORMAL;

    private String medicoResponsavel;
}
