package com.biblioteka.bibliotekabackend.controller;

import com.biblioteka.bibliotekabackend.dto.IznajmljivanjeRequestDTO;
import com.biblioteka.bibliotekabackend.entity.Iznajmljivanje;
import com.biblioteka.bibliotekabackend.service.IznajmljivanjeService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/iznajmljivanja")
public class IznajmljivanjeController {

    private final IznajmljivanjeService iznajmljivanjeService;

    public IznajmljivanjeController(IznajmljivanjeService iznajmljivanjeService) {
        this.iznajmljivanjeService = iznajmljivanjeService;
    }

    @GetMapping
    public List<Iznajmljivanje> getAllIznajmljivanja() {
        return iznajmljivanjeService.getAllIznajmljivanja();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getIznajmljivanjeById(@PathVariable Integer id) {
        try {
            Iznajmljivanje iznajmljivanje = iznajmljivanjeService.getIznajmljivanjeById(id);
            return ResponseEntity.ok(iznajmljivanje);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createIznajmljivanje(@Valid @RequestBody IznajmljivanjeRequestDTO request) {
        try {
            Iznajmljivanje novoIznajmljivanje = iznajmljivanjeService.createIznajmljivanje(request.getKnjigaId(), request.getCitalacId());
            return new ResponseEntity<>(novoIznajmljivanje, HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Nepoznata greška prilikom iznajmljivanja: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/vrati/{id}")
    public ResponseEntity<?> returnIznajmljivanje(@PathVariable Integer id) {
        try {
            Iznajmljivanje vracenoIznajmljivanje = iznajmljivanjeService.returnIznajmljivanje(id);
            return ResponseEntity.ok(vracenoIznajmljivanje);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Nepoznata greška prilikom vraćanja knjige: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIznajmljivanje(@PathVariable Integer id) {
        try {
            iznajmljivanjeService.deleteIznajmljivanje(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("Greška prilikom brisanja: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}