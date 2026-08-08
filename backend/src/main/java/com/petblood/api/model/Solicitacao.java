package com.petblood.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacoes")
@Data
@NoArgsConstructor
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomePaciente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Pet.Especie especie;

    private String raca;
    private String peso;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoSanguineo tipoSanguineo;

    @Column(nullable = false)
    private String volume;

    private String motivo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Urgencia urgencia = Urgencia.NORMAL;

    private String medicoResponsavel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDENTE;

    @Column(updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "clinica_id", nullable = false)
    private Usuario clinica;

    public enum TipoSanguineo {
        DEA_1_1_POS, DEA_1_1_NEG, DEA_3, DEA_4, DEA_5, DEA_7,
        TIPO_A, TIPO_B, TIPO_AB
    }

    public enum Urgencia {
        NORMAL, CRITICO
    }

    public enum Status {
        PENDENTE, CONCLUIDA, CANCELADA
    }
}
