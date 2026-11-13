package com.cati.controller;

import com.cati.model.Usuario;
import com.cati.repository.UsuarioRepository;
import com.cati.security.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioRepository ur, TokenService ts, PasswordEncoder pe) {
        this.usuarioRepository = ur;
        this.tokenService = ts;
        this.passwordEncoder = pe;
    }

    public record LoginRequestDTO(String username, String senha) {}
    public record RegisterRequestDTO(String username, String senha) {}

    // Rota para cadastrar novos usuários com senha criptografada
    @PostMapping("/register")
    public ResponseEntity<?> cadastrar(@RequestBody RegisterRequestDTO dados) {
        if (usuarioRepository.findByUsername(dados.username()).isPresent()) {
            return ResponseEntity.badRequest().body("Usuário já existe!");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setUsername(dados.username());
        // Criptografa a senha antes de salvar no PostgreSQL
        novoUsuario.setSenha(passwordEncoder.encode(dados.senha()));

        usuarioRepository.save(novoUsuario);

        return ResponseEntity.status(201).body("Usuário cadastrado com sucesso!");
    }

    // Rota de Login consultando o Banco de Dados
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dados) {
        
        Usuario usuario = usuarioRepository.findByUsername(dados.username())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Compara a senha digitada com o Hash salvo no banco
        if (passwordEncoder.matches(dados.senha(), usuario.getSenha())) {
            String token = tokenService.gerarToken(usuario.getUsername());
            return ResponseEntity.ok(Map.of("token", token, "username", usuario.getUsername()));
        }

        return ResponseEntity.status(401).body("Credenciais inválidas");
    }
}