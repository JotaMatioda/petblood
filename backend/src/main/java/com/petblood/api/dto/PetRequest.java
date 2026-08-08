package com.petblood.api.dto;

import com.petblood.api.model.Pet;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PetRequest {
    @NotBlank
    private String nome;

    @NotNull
    private Pet.Especie especie;

    private String raca;
    private Integer idade;
    private Double peso;
    private Pet.TipoSanguineo tipoSanguineo;
    private Boolean vacinaV10;
    private Boolean vacinaRabica;
    private Boolean vacinaGripe;
}
