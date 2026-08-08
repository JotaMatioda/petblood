package com.petblood.api.service;

import com.petblood.api.dto.SolicitacaoRequest;
import com.petblood.api.dto.SolicitacaoResponse;
import com.petblood.api.model.Solicitacao;
import com.petblood.api.model.Usuario;
import com.petblood.api.repository.SolicitacaoRepository;
import com.petblood.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public SolicitacaoResponse criar(SolicitacaoRequest request, String emailClinica) {
        Usuario clinica = usuarioRepository.findByEmail(emailClinica)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Solicitacao s = new Solicitacao();
        s.setNomePaciente(request.getNomePaciente());
        s.setEspecie(request.getEspecie());
        s.setRaca(request.getRaca());
        s.setPeso(request.getPeso());
        s.setTipoSanguineo(request.getTipoSanguineo());
        s.setVolume(request.getVolume());
        s.setMotivo(request.getMotivo());
        s.setUrgencia(request.getUrgencia() != null ? request.getUrgencia() : Solicitacao.Urgencia.NORMAL);
        s.setMedicoResponsavel(request.getMedicoResponsavel());
        s.setClinica(clinica);

        return SolicitacaoResponse.de(solicitacaoRepository.save(s));
    }

    public List<SolicitacaoResponse> listar(String emailClinica) {
        Usuario clinica = usuarioRepository.findByEmail(emailClinica)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        return solicitacaoRepository.findByClinicaOrderByCriadoEmDesc(clinica)
                .stream().map(SolicitacaoResponse::de).toList();
    }

    public SolicitacaoResponse buscar(Long id, String emailClinica) {
        Solicitacao s = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada."));
        if (!s.getClinica().getEmail().equals(emailClinica))
            throw new RuntimeException("Acesso negado.");
        return SolicitacaoResponse.de(s);
    }

    public SolicitacaoResponse atualizar(Long id, SolicitacaoRequest request, String emailClinica) {
        Solicitacao s = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada."));
        if (!s.getClinica().getEmail().equals(emailClinica))
            throw new RuntimeException("Acesso negado.");

        s.setNomePaciente(request.getNomePaciente());
        s.setEspecie(request.getEspecie());
        s.setRaca(request.getRaca());
        s.setPeso(request.getPeso());
        s.setTipoSanguineo(request.getTipoSanguineo());
        s.setVolume(request.getVolume());
        s.setMotivo(request.getMotivo());
        if (request.getUrgencia() != null) s.setUrgencia(request.getUrgencia());
        s.setMedicoResponsavel(request.getMedicoResponsavel());

        return SolicitacaoResponse.de(solicitacaoRepository.save(s));
    }

    public void deletar(Long id, String emailClinica) {
        Solicitacao s = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada."));
        if (!s.getClinica().getEmail().equals(emailClinica))
            throw new RuntimeException("Acesso negado.");
        solicitacaoRepository.delete(s);
    }
}
