package com.biblioteka.bibliotekabackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern; // Potreban import za @Pattern
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.PastOrPresent;

@Entity
@Table(name = "knjiga")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Knjiga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "knjiga_id")
    private Integer id;

    @NotBlank(message = "Naslov ne sme biti prazan")
    @Size(max = 255, message = "Naslov može imati najviše 255 karaktera")
    private String naslov;

    @NotBlank(message = "Autor ne sme biti prazan")
    @Size(max = 255, message = "Autor može imati najviše 255 karaktera")
    private String autor;

    @NotBlank(message = "ISBN ne sme biti prazan")

    @Pattern(regexp = "^(978|979)[-]?\\d{10}$", message = "ISBN mora biti validan 13-cifreni broj koji počinje sa 978 ili 979.")
    private String isbn;

    @NotNull(message = "Godina izdanja mora biti uneta")
    @PastOrPresent(message = "Godina izdanja ne može biti u budućnosti")
    private LocalDate godinaIzdanja;


    @NotNull(message = "Broj kopija je obavezan")
    @Min(value = 0, message = "Broj kopija ne može biti negativan")
    private Integer brojKopija;

    @Min(value = 0, message = "Dostupne kopije ne mogu biti negativne")
    private Integer dostupneKopije;
}
