package com.biblioteka.bibliotekabackend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IznajmljivanjeRequestDTO {

    @NotNull(message = "ID knjige je obavezan.")
    private Integer knjigaId;

    @NotNull(message = "ID čitaoca je obavezan.")
    private Integer citalacId;
}