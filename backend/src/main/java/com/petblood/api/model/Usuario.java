package com.petblood.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nome;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Perfil perfil;

    private String telefone;
    private String cpfCnpj;
    private String crmv;

    @Column(updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @OneToMany(mappedBy = "dono", cascade = CascadeType.ALL)
    private List<Pet> pets;

    public enum Perfil {
        TUTOR, VETERINARIO, CLINICA
    }
}
