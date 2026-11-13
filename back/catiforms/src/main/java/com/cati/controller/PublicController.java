package com.cati.controller;

import com.cati.dto.SubmissaoRequestDTO;
import com.cati.dto.RespostaRequestDTO;
import com.cati.model.Formulario;
import com.cati.model.Pergunta;
import com.cati.model.Resposta;
import com.cati.model.Submissao;
import com.cati.repository.FormularioRepository;
import com.cati.repository.PerguntaRepository; // Você precisará criar essa interface vazia igual fez com as outras!
import com.cati.repository.SubmissaoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/public") // Todas as rotas aqui serão públicas
@CrossOrigin(origins = "*")
public class PublicController {

    private final FormularioRepository formularioRepository;
    private final PerguntaRepository perguntaRepository;
    private final SubmissaoRepository submissaoRepository;

    public PublicController(FormularioRepository fr, PerguntaRepository pr, SubmissaoRepository sr) {
        this.formularioRepository = fr;
        this.perguntaRepository = pr;
        this.submissaoRepository = sr;
    }

    // Método para BUSCAR o formulário (Para o candidato ver as perguntas)
    @GetMapping("/formularios/{id}")
    public ResponseEntity<Formulario> buscarFormularioPublico(@PathVariable UUID id) {
        return formularioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Método para SALVAR as respostas que o candidato enviou
    @PostMapping("/formularios/{id}/respostas")
    public ResponseEntity<?> receberRespostas(@PathVariable UUID id, @RequestBody SubmissaoRequestDTO dto) {
        
        // 1. Acha o formulário
        Formulario formulario = formularioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formulário não encontrado!"));

        // 2. Cria a folha de prova (Submissao)
        Submissao submissao = new Submissao();
        submissao.setFormulario(formulario);
        submissao.setEmail(dto.getEmail());

        // 3. Varre as respostas enviadas pelo frontend
        for (RespostaRequestDTO respDto : dto.getRespostas()) {
            
            // Procura qual é a pergunta no banco de dados para vincular
            Pergunta pergunta = perguntaRepository.findById(respDto.getPerguntaId())
                    .orElseThrow(() -> new RuntimeException("Pergunta " + respDto.getPerguntaId() + " não existe!"));

            // O pulo do gato: vincula a resposta à submissão e à pergunta
            Resposta resposta = new Resposta();
            resposta.setValor(respDto.getValor());
            resposta.setPergunta(pergunta);
            resposta.setSubmissao(submissao);

            submissao.getRespostas().add(resposta);
        }

        // 4. Salva a submissão (e o cascadeType.ALL salva as respostas juntas)
        submissaoRepository.save(submissao);

        return ResponseEntity.status(201).body("Respostas salvas com sucesso!");
    }
}