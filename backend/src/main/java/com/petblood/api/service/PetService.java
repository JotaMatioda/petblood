package com.petblood.api.service;

import com.petblood.api.dto.PetRequest;
import com.petblood.api.model.Pet;
import com.petblood.api.model.Usuario;
import com.petblood.api.repository.PetRepository;
import com.petblood.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final UsuarioRepository usuarioRepository;

    public Pet cadastrar(PetRequest request, String emailDono) {
        Usuario dono = usuarioRepository.findByEmail(emailDono)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Pet pet = new Pet();
        pet.setNome(request.getNome());
        pet.setEspecie(request.getEspecie());
        pet.setRaca(request.getRaca());
        pet.setIdade(request.getIdade());
        pet.setPeso(request.getPeso());
        pet.setTipoSanguineo(request.getTipoSanguineo());
        pet.setVacinaV10(request.getVacinaV10() != null && request.getVacinaV10());
        pet.setVacinaRabica(request.getVacinaRabica() != null && request.getVacinaRabica());
        pet.setVacinaGripe(request.getVacinaGripe() != null && request.getVacinaGripe());
        pet.setDono(dono);

        return petRepository.save(pet);
    }

    public List<Pet> listarPorDono(String emailDono) {
        Usuario dono = usuarioRepository.findByEmail(emailDono)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        return petRepository.findByDono(dono);
    }

    public Pet buscarPorId(Long id, String emailDono) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado."));
        if (!pet.getDono().getEmail().equals(emailDono)) {
            throw new RuntimeException("Acesso negado.");
        }
        return pet;
    }

    public Pet atualizar(Long id, PetRequest request, String emailDono) {
        Pet pet = buscarPorId(id, emailDono);
        pet.setNome(request.getNome());
        pet.setEspecie(request.getEspecie());
        pet.setRaca(request.getRaca());
        pet.setIdade(request.getIdade());
        pet.setPeso(request.getPeso());
        pet.setTipoSanguineo(request.getTipoSanguineo());
        if (request.getVacinaV10() != null) pet.setVacinaV10(request.getVacinaV10());
        if (request.getVacinaRabica() != null) pet.setVacinaRabica(request.getVacinaRabica());
        if (request.getVacinaGripe() != null) pet.setVacinaGripe(request.getVacinaGripe());
        return petRepository.save(pet);
    }

    public void deletar(Long id, String emailDono) {
        Pet pet = buscarPorId(id, emailDono);
        petRepository.delete(pet);
    }
}
