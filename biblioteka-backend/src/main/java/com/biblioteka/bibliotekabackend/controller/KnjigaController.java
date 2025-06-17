package com.biblioteka.bibliotekabackend.controller;

import com.biblioteka.bibliotekabackend.entity.Knjiga;
import com.biblioteka.bibliotekabackend.repository.KnjigaRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/knjige")
public class KnjigaController {

    private final KnjigaRepository knjigaRepository;

    public KnjigaController(KnjigaRepository knjigaRepository) {
        this.knjigaRepository = knjigaRepository;
    }

    @GetMapping
    public List<Knjiga> getAllKnjige() {
        return knjigaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Knjiga> getKnjigaById(@PathVariable Integer id) {
        Optional<Knjiga> knjiga = knjigaRepository.findById(id);
        return knjiga.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createKnjiga(@Valid @RequestBody Knjiga knjiga, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        if (knjiga.getBrojKopija() == null) {
            knjiga.setBrojKopija(0);
        }
        if (knjiga.getDostupneKopije() == null) {
            knjiga.setDostupneKopije(knjiga.getBrojKopija());
        }

        try {
            Knjiga savedKnjiga = knjigaRepository.save(knjiga);
            return new ResponseEntity<>(savedKnjiga, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage() != null && e.getMessage().contains("Duplicate entry")) {
                return new ResponseEntity<>("Knjiga sa ovim ISBN brojem već postoji.", HttpStatus.CONFLICT);
            }
            return new ResponseEntity<>("Greška pri unosu podataka: " + e.getMostSpecificCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>("Nepoznata greška prilikom dodavanja knjige: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateKnjiga(@PathVariable Integer id, @Valid @RequestBody Knjiga knjigaDetails, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        Optional<Knjiga> existingKnjigaOptional = knjigaRepository.findById(id);

        if (existingKnjigaOptional.isPresent()) {
            Knjiga existingKnjiga = existingKnjigaOptional.get();

            if (knjigaDetails.getNaslov() != null) existingKnjiga.setNaslov(knjigaDetails.getNaslov());
            if (knjigaDetails.getAutor() != null) existingKnjiga.setAutor(knjigaDetails.getAutor());
            if (knjigaDetails.getIsbn() != null) existingKnjiga.setIsbn(knjigaDetails.getIsbn());
            if (knjigaDetails.getGodinaIzdanja() != null) existingKnjiga.setGodinaIzdanja(knjigaDetails.getGodinaIzdanja());

            if (knjigaDetails.getBrojKopija() != null) {
                int razlika = knjigaDetails.getBrojKopija() - existingKnjiga.getBrojKopija();
                existingKnjiga.setBrojKopija(knjigaDetails.getBrojKopija());
                existingKnjiga.setDostupneKopije(existingKnjiga.getDostupneKopije() + razlika);

                if (existingKnjiga.getDostupneKopije() < 0) { existingKnjiga.setDostupneKopije(0); }
                if (existingKnjiga.getDostupneKopije() > existingKnjiga.getBrojKopija()) { existingKnjiga.setDostupneKopije(existingKnjiga.getBrojKopija()); }
            }
            if (knjigaDetails.getDostupneKopije() != null) {
                existingKnjiga.setDostupneKopije(knjigaDetails.getDostupneKopije());
                if (existingKnjiga.getDostupneKopije() > existingKnjiga.getBrojKopija()) { existingKnjiga.setDostupneKopije(existingKnjiga.getBrojKopija()); }
            }

            try {
                Knjiga updatedKnjiga = knjigaRepository.save(existingKnjiga);
                return ResponseEntity.ok(updatedKnjiga);
            } catch (DataIntegrityViolationException e) {
                if (e.getMessage() != null && e.getMessage().contains("Duplicate entry")) {
                    return new ResponseEntity<>("Knjiga sa ovim ISBN brojem već postoji.", HttpStatus.CONFLICT);
                }
                return new ResponseEntity<>("Greška pri ažuriranju podataka: " + e.getMostSpecificCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            } catch (Exception e) {
                return new ResponseEntity<>("Nepoznata greška prilikom ažuriranja knjige: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKnjiga(@PathVariable Integer id) {
        if (knjigaRepository.existsById(id)) {
            try {
                knjigaRepository.deleteById(id);
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