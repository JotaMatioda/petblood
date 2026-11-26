package com.petblood.api.dto;

import com.petblood.api.model.Pet;
import lombok.Data;

@Data
public class DoadorResponse {
    private Long id;
    private String nome;
    private String especie;
    private String raca;
    private Double peso;
    private String tipoSanguineo;
    private String tutorNome;
    private String tutorTelefone;

    public static DoadorResponse de(Pet pet) {
        DoadorResponse r = new DoadorResponse();
        r.setId(pet.getId());
        r.setNome(pet.getNome());
        r.setEspecie(pet.getEspecie() != null ? pet.getEspecie().name() : null);
        r.setRaca(pet.getRaca());
        r.setPeso(pet.getPeso());
        r.setTipoSanguineo(pet.getTipoSanguineo() != null ? pet.getTipoSanguineo().name() : null);
        if (pet.getDono() != null) {
            r.setTutorNome(pet.getDono().getNome());
            r.setTutorTelefone(pet.getDono().getTelefone());
        }
        return r;
    }
}
