package com.biblioteka.bibliotekabackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

@Entity
@Table(name = "iznajmljivanje")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Iznajmljivanje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iznajmljivanje_id")
    private Integer id;

    @NotNull(message = "Knjiga je obavezna za iznajmljivanje")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "knjiga_id", nullable = false)
    private Knjiga knjiga;

    @NotNull(message = "Čitalac je obavezan za iznajmljivanje")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citalac_id", nullable = false)
    private Citalac citalac;

    @NotNull(message = "Datum iznajmljivanja je obavezan")
    @PastOrPresent(message = "Datum iznajmljivanja ne može biti u budućnosti")
    @Column(name = "datum_iznajmljivanja_at", nullable = false)
    private LocalDate datumIznajmljivanja;

    @PastOrPresent(message = "Datum vraćanja ne može biti u budućnosti")
    @Column(name = "datum_vracanja_at")
    private LocalDate datumVracanja;
}