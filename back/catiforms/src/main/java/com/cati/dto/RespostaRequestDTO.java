package com.cati.dto;
import java.util.List;

public class RespostaRequestDTO {
    private Long perguntaId; 
    private String valor;
    private Long opcaoId;          // Para escolha única
    private List<Long> opcoesIds;  // Para múltipla escolha (checkbox)
    private String justificativa;  // Para escolha única justificada

    public Long getPerguntaId() { return perguntaId; }
    public void setPerguntaId(Long perguntaId) { this.perguntaId = perguntaId; }
    public String getValor() { return valor; }
    public void setValor(String valor) { this.valor = valor; }
    public Long getOpcaoId() { return opcaoId; }
    public void setOpcaoId(Long opcaoId) { this.opcaoId = opcaoId; }
    public List<Long> getOpcoesIds() { return opcoesIds; }
    public void setOpcoesIds(List<Long> opcoesIds) { this.opcoesIds = opcoesIds; }
    public String getJustificativa() { return justificativa; }
    public void setJustificativa(String justificativa) { this.justificativa = justificativa; }
}
