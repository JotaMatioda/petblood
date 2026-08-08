package com.petblood.api.controller;

import com.petblood.api.dto.PetRequest;
import com.petblood.api.model.Pet;
import com.petblood.api.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @PostMapping
    public ResponseEntity<Pet> cadastrar(@Valid @RequestBody PetRequest request,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(petService.cadastrar(request, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<Pet>> listar(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(petService.listarPorDono(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> buscar(@PathVariable Long id,
                                      @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(petService.buscarPorId(id, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> atualizar(@PathVariable Long id,
                                          @Valid @RequestBody PetRequest request,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(petService.atualizar(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        petService.deletar(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
