// src/main/java/com/biblioteka/bibliotekabackend/repository/IznajmljivanjeRepository.java
package com.biblioteka.bibliotekabackend.repository;

import com.biblioteka.bibliotekabackend.entity.Iznajmljivanje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;

@Repository
public interface IznajmljivanjeRepository extends JpaRepository<Iznajmljivanje, Integer> {


    List<Iznajmljivanje> findByCitalacId(Integer citalacId);

    List<Iznajmljivanje> findByKnjigaId(Integer knjigaId);

    List<Iznajmljivanje> findByDatumVracanjaIsNull();

    List<Iznajmljivanje> findByDatumVracanjaIsNotNull();

    List<Iznajmljivanje> findByDatumIznajmljivanjaBeforeAndDatumVracanjaAfterOrDatumIznajmljivanjaBeforeAndDatumVracanjaIsNull(LocalDate date1, LocalDate date2, LocalDate date3);
}