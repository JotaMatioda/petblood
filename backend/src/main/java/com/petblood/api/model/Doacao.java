package com.petblood.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "doacoes")
@Data
@NoArgsConstructor
public class Doacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "solicitante_id")
    private Usuario solicitante;

    private String clinica;
    private LocalDateTime dataAgendada;
    private LocalDateTime dataRealizada;

    @Enumerated(EnumType.STRING)
    private Status status = Status.AGENDADO;

    private String observacoes;

    @Column(updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    public enum Status {
        AGENDADO, CONCLUIDO, CANCELADO
    }
}
