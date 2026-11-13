package com.cati.controller;


import com.cati.dto.FormularioRequestDTO;
import com.cati.dto.RespostaRequestDTO;
import com.cati.dto.SubmissaoRequestDTO;
import com.cati.model.Formulario;
import com.cati.model.Pergunta;
import com.cati.model.Resposta;
import com.cati.model.Submissao;
import com.cati.repository.FormularioRepository;
import com.cati.repository.PerguntaRepository;
import com.cati.repository.SubmissaoRepository;
import com.cati.service.FormularioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController // Indica que esta classe responde a requisições web (JSON)
@RequestMapping("/api/formularios") // URL base para todos os métodos desta classe
@CrossOrigin(origins = "*") // Permite que o Frontend se comunique com o servidor
public class FormularioController {

    private final FormularioService service;
    private final FormularioRepository formularioRepository;
    private final SubmissaoRepository submissaoRepository;
    private final PerguntaRepository perguntaRepository;

    public FormularioController(FormularioService service, FormularioRepository formularioRepository,
                                SubmissaoRepository submissaoRepository,
                                PerguntaRepository perguntaRepository) {
        this.service = service;
        this.formularioRepository = formularioRepository;
        this.submissaoRepository = submissaoRepository;
        this.perguntaRepository = perguntaRepository;
    }

    // Mapeia uma requisição GET para a URL /api/formularios/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Formulario> buscarFormulario(@PathVariable UUID id) {
        // 1. O Controller recebe o ID da URL
        // 2. Entrega para o Service processar
        Formulario form = service.buscarPorId(id);
        
        // 3. Devolve a resposta com status 200 (OK)
        return ResponseEntity.ok(form);
    }

    // Mapeia uma requisição GET para a URL /api/formularios/{id}
    @GetMapping("/public/{id}")
    public ResponseEntity<Formulario> buscarFormularioPublico(@PathVariable UUID id) {
        // 1. O Controller recebe o ID da URL
        // 2. Entrega para o Service processar
        Formulario form = service.buscarPorId(id);
        
        // 3. Devolve a resposta com status 200 (OK)
        return ResponseEntity.ok(form);
    }

    @GetMapping
    public ResponseEntity<List<Formulario>> listarMeusFormularios(Principal principal) {
        // Busca todos os formulários salvos no banco
        List<Formulario> lista = service.listarMeusFormularios(principal.getName());
        return ResponseEntity.ok(lista);
    }
    
    @PostMapping
    public ResponseEntity<Formulario> criarFormulario(@RequestBody FormularioRequestDTO dto, Principal principal) {
         Formulario formCriado = service.criarFormulario(dto, principal.getName());
        
    //     // Retorna status 201 (Created) e os dados do formulário recém-criado (incluindo o UUID gerado)
         return ResponseEntity.status(201).body(formCriado);
    }

    // 2. O Candidato clica em "Enviar" e salva a Submissao

    @GetMapping("/{id}/respostas")
    public ResponseEntity<?> listarRespostasDoFormulario(@PathVariable UUID id, Principal principal) {
        // 1. Busca o formulário
        Formulario form = formularioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formulário não encontrado"));
        
        // 2. Trava de Segurança: Verifica se o formulário pertence a quem está logado
        if (!form.getUsuario().getUsername().equals(principal.getName())) {
            return ResponseEntity.status(403).body(java.util.Map.of("erro", "Você não tem permissão para ver estas respostas."));
        }

        // 3. Busca todas as submissões desse formulário
        List<Submissao> submissoes = submissaoRepository.findByFormularioId(id);
        
        return ResponseEntity.ok(submissoes);
    }
    
    @PostMapping("/public/{id}/responses")
    public ResponseEntity<?> receberSubmissao(
            @PathVariable UUID id, 
            @RequestBody SubmissaoRequestDTO dto) {
        
        // Acha o formulário
        Formulario formulario = formularioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formulário não encontrado"));

        // Cria a Capa da Prova (Submissao)
        Submissao submissao = new Submissao();
        submissao.setFormulario(formulario);
        submissao.setEmail(dto.getEmail());

        // Processa cada resposta que veio no JSON
        if (dto.getRespostas() != null) {
            for (RespostaRequestDTO respostaDto : dto.getRespostas()) {
                Resposta resposta = new Resposta();
                resposta.setSubmissao(submissao);
                resposta.setValor(respostaDto.getValor());
                
                // Busca a pergunta correspondente para vincular
                Pergunta pergunta = perguntaRepository.findById(respostaDto.getPerguntaId())
                        .orElseThrow(() -> new RuntimeException("Pergunta não encontrada: " + respostaDto.getPerguntaId()));
                
                resposta.setPergunta(pergunta);
                
                // Monta o campo 'valor' com segurança para nunca ficar nulo
                if (respostaDto.getValor() != null && !respostaDto.getValor().isBlank()) {
                    resposta.setValor(respostaDto.getValor());
                } else if (respostaDto.getOpcoesIds() != null && !respostaDto.getOpcoesIds().isEmpty()) {
                    resposta.setValor("Opções selecionadas (IDs): " + respostaDto.getOpcoesIds().toString());
                } else if (respostaDto.getOpcaoId() != null) {
                    String texto = "Opção ID: " + respostaDto.getOpcaoId();
                    if (respostaDto.getJustificativa() != null && !respostaDto.getJustificativa().isBlank()) {
                        texto += " | Justificativa: " + respostaDto.getJustificativa();
                    }
                    resposta.setValor(texto);
                } else {
                    resposta.setValor("Sem resposta");
                }
                
                // Guarda a resposta na lista da submissão
                submissao.getRespostas().add(resposta);
            }
        }

        // Salva tudo no banco graças ao CascadeType.ALL
        submissaoRepository.save(submissao);

        return ResponseEntity.status(201).body(java.util.Map.of("mensagem", "Respostas enviadas com sucesso!"));
    }
}