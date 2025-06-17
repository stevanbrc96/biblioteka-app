package com.biblioteka.bibliotekabackend.service;

import com.biblioteka.bibliotekabackend.entity.Citalac;
import com.biblioteka.bibliotekabackend.entity.Iznajmljivanje;
import com.biblioteka.bibliotekabackend.entity.Knjiga;
import com.biblioteka.bibliotekabackend.repository.CitalacRepository;
import com.biblioteka.bibliotekabackend.repository.IznajmljivanjeRepository;
import com.biblioteka.bibliotekabackend.repository.KnjigaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class IznajmljivanjeService {

    @Autowired
    private IznajmljivanjeRepository iznajmljivanjeRepository;

    @Autowired
    private KnjigaRepository knjigaRepository;

    @Autowired
    private CitalacRepository citalacRepository;


    @Transactional
    public Iznajmljivanje createIznajmljivanje(Integer knjigaId, Integer citalacId) {
        Knjiga knjiga = knjigaRepository.findById(knjigaId)
                .orElseThrow(() -> new EntityNotFoundException("Knjiga sa ID-om " + knjigaId + " nije pronađena."));
        Citalac citalac = citalacRepository.findById(citalacId)
                .orElseThrow(() -> new EntityNotFoundException("Čitalac sa ID-om " + citalacId + " nije pronađen."));

        if (knjiga.getDostupneKopije() <= 0) {
            throw new IllegalStateException("Nema dostupnih kopija knjige '" + knjiga.getNaslov() + "'.");
        }

        knjiga.setDostupneKopije(knjiga.getDostupneKopije() - 1);
        knjigaRepository.save(knjiga);

        Iznajmljivanje novoIznajmljivanje = new Iznajmljivanje();
        novoIznajmljivanje.setKnjiga(knjiga);
        novoIznajmljivanje.setCitalac(citalac);
        novoIznajmljivanje.setDatumIznajmljivanja(LocalDate.now());

        return iznajmljivanjeRepository.save(novoIznajmljivanje);
    }


    @Transactional
    public Iznajmljivanje returnIznajmljivanje(Integer id) {
        Iznajmljivanje iznajmljivanje = iznajmljivanjeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Zapis o iznajmljivanju sa ID-om " + id + " nije pronađen."));

        if (iznajmljivanje.getDatumVracanja() != null) {
            throw new IllegalStateException("Ova knjiga je već vraćena.");
        }

        iznajmljivanje.setDatumVracanja(LocalDate.now());

        Knjiga knjiga = iznajmljivanje.getKnjiga();
        knjiga.setDostupneKopije(knjiga.getDostupneKopije() + 1);
        knjigaRepository.save(knjiga);

        return iznajmljivanjeRepository.save(iznajmljivanje);
    }


    public List<Iznajmljivanje> getAllIznajmljivanja() {
        return iznajmljivanjeRepository.findAll();
    }

    public Iznajmljivanje getIznajmljivanjeById(Integer id) {
        return iznajmljivanjeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Zapis o iznajmljivanju sa ID-om " + id + " nije pronađen."));
    }

    @Transactional
    public void deleteIznajmljivanje(Integer id) {
        Iznajmljivanje iznajmljivanje = iznajmljivanjeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Zapis o iznajmljivanju sa ID-om " + id + " nije pronađen."));

        if (iznajmljivanje.getDatumVracanja() == null) {
            throw new IllegalStateException("Ne možete obrisati zapis o iznajmljivanju dok knjiga nije vraćena.");
        }

        iznajmljivanjeRepository.deleteById(id);
    }
}