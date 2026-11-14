package com.cati.dto;

import java.util.List;

public class RespostaRequestDTO {
    private Long perguntaId; 
    private String valor;
    private String texto;
    private Object opcaoId;          // Aceita Long, String ou UUID
    private List<Object> opcoesIds;  // Aceita List<Long>, List<String> ou List<UUID>
    private String justificativa;

    public Long getPerguntaId() { return perguntaId; }
    public void setPerguntaId(Long perguntaId) { this.perguntaId = perguntaId; }

    public String getValor() { return valor; }
    public void setValor(String valor) { this.valor = valor; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public Object getOpcaoId() { return opcaoId; }
    public void setOpcaoId(Object opcaoId) { this.opcaoId = opcaoId; }

    public List<Object> getOpcoesIds() { return opcoesIds; }
    public void setOpcoesIds(List<Object> opcoesIds) { this.opcoesIds = opcoesIds; }

    public String getJustificativa() { return justificativa; }
    public void setJustificativa(String justificativa) { this.justificativa = justificativa; }
}
