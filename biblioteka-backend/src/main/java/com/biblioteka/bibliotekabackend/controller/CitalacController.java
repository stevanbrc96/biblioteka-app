package com.biblioteka.bibliotekabackend.controller;

import com.biblioteka.bibliotekabackend.entity.Citalac;
import com.biblioteka.bibliotekabackend.repository.CitalacRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;

import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/citaoci")
public class CitalacController {

    @Autowired
    private CitalacRepository citalacRepository;

    @GetMapping
    public List<Citalac> getAllCitaoci() {
        return citalacRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Citalac> getCitalacById(@PathVariable Integer id) {
        Optional<Citalac> citalac = citalacRepository.findById(id);
        return citalac.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createCitalac(@Valid @RequestBody Citalac citalac, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        try {
            Citalac savedCitalac = citalacRepository.save(citalac);
            return new ResponseEntity<>(savedCitalac, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage() != null && e.getMessage().contains("Duplicate entry") && e.getMessage().contains("for key 'uq_citalac_email'")) {
                return new ResponseEntity<>("Čitalac sa ovom email adresom već postoji.", HttpStatus.CONFLICT);
            }
            return new ResponseEntity<>("Greška pri unosu podataka: " + e.getMostSpecificCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>("Nepoznata greška prilikom dodavanja čitaoca: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCitalac(@PathVariable Integer id, @Valid @RequestBody Citalac citalacDetails, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        Optional<Citalac> existingCitalacOptional = citalacRepository.findById(id);

        if (existingCitalacOptional.isPresent()) {
            Citalac existingCitalac = existingCitalacOptional.get();

            if (citalacDetails.getIme() != null) existingCitalac.setIme(citalacDetails.getIme());
            if (citalacDetails.getPrezime() != null) existingCitalac.setPrezime(citalacDetails.getPrezime());
            if (citalacDetails.getEmail() != null) existingCitalac.setEmail(citalacDetails.getEmail());

            try {
                Citalac updatedCitalac = citalacRepository.save(existingCitalac);
                return ResponseEntity.ok(updatedCitalac);
            } catch (DataIntegrityViolationException e) {
                if (e.getMessage() != null && e.getMessage().contains("Duplicate entry") && e.getMessage().contains("for key 'uq_citalac_email'")) {
                    return new ResponseEntity<>("Čitalac sa ovom email adresom već postoji.", HttpStatus.CONFLICT);
                }
                return new ResponseEntity<>("Greška pri ažuriranju podataka: " + e.getMostSpecificCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            } catch (Exception e) {
                return new ResponseEntity<>("Nepoznata greška prilikom ažuriranja čitaoca: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCitalac(@PathVariable Integer id) {
        if (citalacRepository.existsById(id)) {
            try {
                citalacRepository.deleteById(id);
                return ResponseEntity.noContent().build();
            } catch (DataIntegrityViolationException e) {
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}