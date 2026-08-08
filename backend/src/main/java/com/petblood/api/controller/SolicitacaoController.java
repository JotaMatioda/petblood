package com.petblood.api.controller;

import com.petblood.api.dto.SolicitacaoRequest;
import com.petblood.api.dto.SolicitacaoResponse;
import com.petblood.api.service.SolicitacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
@RequiredArgsConstructor
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    @PostMapping
    public ResponseEntity<SolicitacaoResponse> criar(@Valid @RequestBody SolicitacaoRequest request,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(solicitacaoService.criar(request, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<SolicitacaoResponse>> listar(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(solicitacaoService.listar(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponse> buscar(@PathVariable Long id,
                                                       @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(solicitacaoService.buscar(id, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolicitacaoResponse> atualizar(@PathVariable Long id,
                                                          @Valid @RequestBody SolicitacaoRequest request,
                                                          @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(solicitacaoService.atualizar(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        solicitacaoService.deletar(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
