package com.biblioteka.bibliotekabackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.Email; // Import
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "citalac")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Citalac {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "citalac_id")
    private Integer id;

    @NotBlank(message = "Ime ne sme biti prazno")
    @Size(max = 100, message = "Ime može imati najviše 100 karaktera")
    private String ime;

    @NotBlank(message = "Prezime ne sme biti prazno")
    @Size(max = 100, message = "Prezime može imati najviše 100 karaktera")
    private String prezime;

    @NotBlank(message = "Email ne sme biti prazan")
    @Size(max = 255, message = "Email može imati najviše 255 karaktera")
    @Email(message = "Email nije u ispravnom formatu")
    private String email;
}