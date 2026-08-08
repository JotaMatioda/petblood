package com.petblood.api.service;

import com.petblood.api.dto.AuthResponse;
import com.petblood.api.dto.CadastroRequest;
import com.petblood.api.dto.LoginRequest;
import com.petblood.api.model.Usuario;
import com.petblood.api.repository.UsuarioRepository;
import com.petblood.api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse cadastrar(CadastroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setPerfil(request.getPerfil());
        usuario.setCpfCnpj(request.getCpfCnpj());
        usuario.setTelefone(request.getTelefone());
        usuario.setCrmv(request.getCrmv());

        usuarioRepository.save(usuario);

        String token = jwtUtil.gerarToken(usuario.getEmail());
        return new AuthResponse(token, usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getPerfil());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        String token = jwtUtil.gerarToken(usuario.getEmail());
        return new AuthResponse(token, usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getPerfil());
    }
}
