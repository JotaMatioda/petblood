package com.petblood.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "pets")
@Data
@NoArgsConstructor
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Especie especie;

    private String raca;
    private Integer idade;
    private Double peso;

    @Enumerated(EnumType.STRING)
    private TipoSanguineo tipoSanguineo;

    @Enumerated(EnumType.STRING)
    private Status status = Status.DISPONIVEL;

    private String fotoUrl;
    private Boolean vacinaV10 = false;
    private Boolean vacinaRabica = false;
    private Boolean vacinaGripe = false;

    @Column(updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "dono_id", nullable = false)
    private Usuario dono;

    public enum Especie {
        CAO, GATO
    }

    public enum TipoSanguineo {
        DEA_1_1_POS, DEA_1_1_NEG, DEA_3, DEA_4, DEA_5, DEA_7, DAL, DESCONHECIDO,
        TIPO_A, TIPO_B, TIPO_AB
    }

    public enum Status {
        DISPONIVEL, EM_DESCANSO, BLOQUEADO, PRIORITARIO
    }
}
