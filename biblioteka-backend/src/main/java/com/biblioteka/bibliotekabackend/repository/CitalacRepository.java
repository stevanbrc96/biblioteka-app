package com.biblioteka.bibliotekabackend.repository;
import com.biblioteka.bibliotekabackend.entity.Citalac;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CitalacRepository extends JpaRepository<Citalac, Integer> {
}