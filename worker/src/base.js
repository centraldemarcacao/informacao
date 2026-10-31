// Junta a base gerada das páginas (contexto.js) com o treinamento (treinamento-base.js).
// Os dois arquivos são GERADOS por scripts: não edite à mão.
import { CONTEXTO as CONTEXTO_PAGINAS, SECOES as SECOES_PAGINAS } from './contexto.js';
import { SECOES_TREINAMENTO, BLOCO_TREINAMENTO } from './treinamento-base.js';

export const SECOES = [...SECOES_PAGINAS, ...SECOES_TREINAMENTO];
export const CONTEXTO = CONTEXTO_PAGINAS + BLOCO_TREINAMENTO;
