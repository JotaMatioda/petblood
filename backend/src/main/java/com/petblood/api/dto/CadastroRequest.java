package com.petblood.api.dto;

import com.petblood.api.model.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CadastroRequest {
    @NotBlank
    private String nome;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String senha;

    @NotNull
    private Usuario.Perfil perfil;

    private String cpfCnpj;
    private String telefone;
    private String crmv;
}
