package com.petblood.api.repository;

import com.petblood.api.model.Pet;
import com.petblood.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByDono(Usuario dono);
    List<Pet> findByDonoId(Long donoId);
}
