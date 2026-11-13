package com.cati.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    
    // A chave secreta que só o seu servidor conhece (idealmente deveria vir do application.properties)
    private final String secret = "minha_chave_secreta_super_segura_123";

    // Cria a pulseira VIP
    public String gerarToken(String username) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("catiforms-api")
                    .withSubject(username)
                    .withExpiresAt(gerarDataExpiracao()) // Pulseira vale por 2 horas
                    .sign(algorithm);
        } catch (JWTCreationException exception){
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    // Verifica se a pulseira é falsa ou se está vencida
    public String validarToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("catiforms-api")
                    .build()
                    .verify(token)
                    .getSubject(); // Devolve o username ("admin") se estiver tudo certo
        } catch (JWTVerificationException exception){
            return ""; // Se der erro, devolve vazio (barra o usuário)
        }
    }

    private Instant gerarDataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}