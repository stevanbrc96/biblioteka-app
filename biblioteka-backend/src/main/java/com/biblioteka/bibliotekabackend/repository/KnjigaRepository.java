package com.biblioteka.bibliotekabackend.repository;
import com.biblioteka.bibliotekabackend.entity.Knjiga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


    @Repository
    public interface KnjigaRepository extends JpaRepository<Knjiga, Integer> {

    }

