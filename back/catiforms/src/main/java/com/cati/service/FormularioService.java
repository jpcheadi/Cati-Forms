package com.cati.service;

import com.cati.dto.FormularioRequestDTO;
import com.cati.dto.OpcaoDTO;
import com.cati.dto.PerguntaDTO;
import com.cati.model.Formulario;
import com.cati.model.Opcao;
import com.cati.model.Pergunta;
import com.cati.repository.FormularioRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service // Indica que esta classe contém as regras de negócio
public class FormularioService {

    // O Service precisa do Repository para conversar com o banco. 
    // O Spring injeta essa dependência automaticamente pelo construtor.
    private final FormularioRepository repository;

    public FormularioService(FormularioRepository repository) {
        this.repository = repository;
    }

    public Formulario buscarPorId(UUID id) {
        // Busca no banco. Se não achar, lança um erro que trava a execução.
        Optional<Formulario> formulario = repository.findById(id);
        
        if(formulario.isEmpty()) {
            throw new RuntimeException("Formulário não encontrado!");
        }
        
        return formulario.get();
    }

    // Recebe o DTO, transforma na Entidade (Formulario) e salva no banco
    public Formulario criarFormulario(FormularioRequestDTO dto) {
        Formulario novoFormulario = new Formulario();
        novoFormulario.setTitulo(dto.getTitulo());
        novoFormulario.setDescricao(dto.getDescricao());
        novoFormulario.setSolicitaEmail(dto.isSolicitaEmail());

        // Verifica se vieram perguntas no JSON
        if (dto.getPerguntas() != null) {
            
            // Para cada PerguntaDTO que veio do Frontend...
            for (PerguntaDTO pDto : dto.getPerguntas()) {
                Pergunta novaPergunta = new Pergunta();
                novaPergunta.setEnunciado(pDto.getEnunciado());
                novaPergunta.setTipo(pDto.getTipo());
                
                // Avisa a Pergunta de quem ela é filha
                novaPergunta.setFormulario(novoFormulario);

                // Se essa pergunta for de múltipla escolha, ela terá opções
                if (pDto.getOpcoes() != null) {
                    for (OpcaoDTO oDto : pDto.getOpcoes()) {
                        Opcao novaOpcao = new Opcao();
                        novaOpcao.setTexto(oDto.getTexto()); // Lembrando que Opcao usa getDescricao e o DTO usa getTexto
                        
                        // Avisa a Opção de qual pergunta ela é filha
                        novaOpcao.setPergunta(novaPergunta);
                        
                        // Guarda a opção dentro da lista da pergunta
                        novaPergunta.getOpcoes().add(novaOpcao);
                    }
                }

                // Guarda a pergunta montada dentro da lista do formulário
                novoFormulario.getPerguntas().add(novaPergunta);
            }
        }

        // Quando salva no front, o CascadeType.ALL salva
        // o formulário, depois as perguntas, e depois as opções na ordem certinha!
        // O Repository traduz isso para o comando SQL "INSERT INTO formularios..."
        return repository.save(novoFormulario);
    }
}