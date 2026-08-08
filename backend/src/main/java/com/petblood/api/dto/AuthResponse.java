package com.petblood.api.dto;

import com.petblood.api.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long id;
    private String nome;
    private String email;
    private Usuario.Perfil perfil;
}
