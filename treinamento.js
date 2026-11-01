/* =====================================================================
   treinamento.js • CONTEÚDO do Guia de Treinamento (só dados, sem layout)
   Usado por treinamento.html. Para criar Oncologia Clínica ou Hematologia,
   basta preencher o módulo correspondente abaixo, com a mesma estrutura da Radioterapia.

   Texto: **assim** vira negrito.

   ESTRUTURA DE UM MÓDULO
   - id, titulo, ico, cor, resumo, pronto (true/false: false mostra "Em breve")
   - licoes[]   : { id, titulo, ico, min, resumo, blocos[], chaves[] }
       blocos: { t:'p', x }                          parágrafo
               { t:'lista', itens:[...] }            lista
               { t:'passos', itens:[{t,x}] }         passos numerados
               { t:'tabela', cab:[...], linhas:[[...]] }
               { t:'alerta', tipo:'info|warn|ok|err', x }
               { t:'contato', nome, tel, via:'ligacao|whatsapp', obs }
   - arvore     : { inicio:'id', nos:{ id:{ q, opcoes:[{l, prox, add}] } | { fim:true, tipo, titulo, passos:[] } } }
   - cartoes[]  : flashcards  { f: frente, v: verso }
   - quiz[]     : { q, op:[...], ok: índice da correta, why }
   - simulador[]: { msg: mensagem do paciente, op:[respostas], ok, why }
   - cola[]     : consulta rápida { t: título, r: resposta, tags, tel?, via? }
   ===================================================================== */
const TREINO = {

/* ===================================================================
   RADIOTERAPIA
   =================================================================== */
radioterapia: {
  id: 'radioterapia',
  titulo: 'Radioterapia',
  ico: '☢️',
  cor: '#CC5500',
  pronto: true,
  resumo: 'Como orientar a 1ª consulta, a triagem, os casos especiais e os contatos da Radioterapia.',

  licoes: [
    /* ---------------------------------------------------------- 1 */
    {
      id: 'jornada', titulo: 'A jornada do paciente', ico: '🗺️', min: 3,
      resumo: 'Visão geral: do primeiro contato ao início das sessões.',
      blocos: [
        { t: 'p', x: 'Antes de decorar regras, entenda o caminho. Quase toda dúvida de paciente se resolve sabendo **em que etapa ele está**.' },
        { t: 'passos', itens: [
          { t: 'Pedido da 1ª consulta (triagem)', x: 'O que se envia e por qual canal depende do tipo de atendimento: **Particular, Convênio ou SUS**.' },
          { t: 'Consulta com o médico da Radioterapia', x: 'Para SUS no interior, a guia de solicitação deve ser emitida na secretaria de saúde do município.' },
          { t: 'Tomografia de planejamento', x: 'Exame que prepara o tratamento.' },
          { t: 'Análise dos médicos', x: 'Prazo de **até 20 dias úteis**, conforme o caso do paciente.' },
          { t: 'Início das sessões', x: 'O paciente é chamado para começar a radioterapia.' }
        ] },
        { t: 'alerta', tipo: 'info', x: 'Fora da jornada principal existem **situações especiais**: urgência, troca de médico, atendimento vencido (mais de 2 anos) e encaminhamentos que não são da Radioterapia.' }
      ],
      chaves: [
        'Identifique a etapa do paciente antes de responder.',
        'Prazo após a tomografia de planejamento: até 20 dias úteis.',
        'Urgência, troca de médico e atendimento vencido têm fluxo próprio.'
      ]
    },

    /* ---------------------------------------------------------- 2 */
    {
      id: 'primeira', titulo: 'Consulta de 1ª vez', ico: '🆕', min: 4,
      resumo: 'O que enviar e por onde: Particular, Convênio e SUS.',
      blocos: [
        { t: 'p', x: 'A regra muda conforme o tipo de atendimento. **Memorize a tabela:**' },
        { t: 'tabela',
          cab: ['Atendimento', 'Como solicitar', 'O que é necessário', 'Biópsia'],
          linhas: [
            ['**Particular**', 'Solicitar no grupo **RXT 1° VEZ** (Google Chat)', 'Apenas o encaminhamento médico', 'Não exigida'],
            ['**Convênio**', 'Paciente envia por **WhatsApp** para a triagem', 'Resultado da biópsia + encaminhamento médico', 'Exigida'],
            ['**SUS**', 'Paciente envia por **WhatsApp** para a triagem', 'Resultado da biópsia + encaminhamento médico', 'Exigida']
          ] },
        { t: 'alerta', tipo: 'warn', x: '**Convênio e SUS têm a mesma regra.** Só o Particular é diferente: ele não passa pelo WhatsApp, e a solicitação é feita pela equipe no grupo **RXT 1° VEZ**.' },
        { t: 'alerta', tipo: 'ok', x: 'Existem encaminhamentos em que a biópsia **não** é exigida. Veja a lição seguinte.' }
      ],
      chaves: [
        'Particular: grupo RXT 1° VEZ + só o encaminhamento.',
        'Convênio e SUS: WhatsApp com biópsia + encaminhamento, para a triagem.',
        'Sem biópsia e sem encaminhamento, o paciente não passa pela triagem.'
      ]
    },

    /* ---------------------------------------------------------- 3 */
    {
      id: 'semBiopsia', titulo: 'Quando a biópsia NÃO é exigida', ico: '🔬', min: 3,
      resumo: 'As 5 exceções que dispensam a biópsia.',
      blocos: [
        { t: 'p', x: 'Nestes encaminhamentos a triagem **não exige o resultado da biópsia**:' },
        { t: 'tabela',
          cab: ['Encaminhamento', 'O que é (para você se situar)'],
          linhas: [
            ['**MAV**', 'Malformação arteriovenosa: alteração nos vasos sanguíneos'],
            ['**Tumores em tronco cerebral**', 'Região onde **não é possível realizar biópsia**'],
            ['**Meningioma**', 'Tumor das meninges (membranas que envolvem o cérebro), em geral benigno'],
            ['**Queloides**', 'Cicatrizes elevadas, de crescimento exagerado'],
            ['**Braquiterapia**', 'Radioterapia com a fonte de radiação colocada perto do tumor']
          ] },
        { t: 'alerta', tipo: 'info', x: '**Macete para memorizar:** MAV, Meningioma, Queloide, Braquiterapia e Tronco cerebral. Qualquer outro caso, em Convênio ou SUS, **exige biópsia**.' },
        { t: 'alerta', tipo: 'warn', x: 'Nesses casos o paciente ainda precisa enviar o **encaminhamento médico**. O que muda é só a dispensa da biópsia.' }
      ],
      chaves: [
        'São 5: MAV, tronco cerebral, meningioma, queloide e braquiterapia.',
        'Tronco cerebral: a biópsia não pode ser feita.',
        'Fora dessa lista, Convênio e SUS precisam da biópsia.'
      ]
    },

    /* ---------------------------------------------------------- 4 */
    {
      id: 'naoRadio', titulo: 'O que NÃO é da Radioterapia', ico: '🚫', min: 2,
      resumo: 'Radioiodoterapia e iodoterapia pertencem à Medicina Nuclear.',
      blocos: [
        { t: 'p', x: 'O nome parece parecido, mas o setor é outro. **Radioiodoterapia** e **iodoterapia** são da **Medicina Nuclear**, não da Radioterapia.' },
        { t: 'alerta', tipo: 'err', x: 'Se o encaminhamento fala em **iodo**, não abra triagem da Radioterapia. Direcione o paciente à Medicina Nuclear.' },
        { t: 'contato', nome: 'Medicina Nuclear', tel: '(84) 4009-7442', via: 'whatsapp', obs: 'Contato por WhatsApp' }
      ],
      chaves: [
        'Iodoterapia / radioiodoterapia = Medicina Nuclear.',
        'Contato da Medicina Nuclear: (84) 4009-7442, por WhatsApp.'
      ]
    },

    /* ---------------------------------------------------------- 5 */
    {
      id: 'sus', titulo: 'Autorização SUS (paciente do interior)', ico: '📄', min: 2,
      resumo: 'Guia de solicitação emitida pela secretaria de saúde do município.',
      blocos: [
        { t: 'p', x: 'Quando a consulta de 1ª vez é pelo **SUS** e o paciente **mora no interior**:' },
        { t: 'passos', itens: [
          { t: 'Orientar o paciente', x: 'Ele deve ir à **secretaria de saúde do seu município**.' },
          { t: 'Dar entrada e emitir a guia de solicitação', x: 'A guia pode estar com o status **pendente**; isso não impede o atendimento.' },
          { t: 'Levar a guia no dia da consulta', x: 'Mesmo pendente, a consulta **será realizada**.' }
        ] },
        { t: 'alerta', tipo: 'ok', x: 'Guia **pendente não é motivo para remarcar ou recusar** o paciente. O importante é ele trazê-la no dia da consulta.' }
      ],
      chaves: [
        'Interior + SUS: secretaria de saúde do município emite a guia.',
        'Guia com status pendente também vale. Levar no dia da consulta.'
      ]
    },

    /* ---------------------------------------------------------- 6 */
    {
      id: 'tomografia', titulo: 'Depois da tomografia de planejamento', ico: '⏳', min: 2,
      resumo: 'Prazo de até 20 dias úteis e o que fazer se passar.',
      blocos: [
        { t: 'p', x: 'Com a tomografia de planejamento realizada, o paciente **aguarda a chamada**. Nesse período os médicos analisam os exames.' },
        { t: 'tabela',
          cab: ['Situação', 'Orientação'],
          linhas: [
            ['Dentro de **20 dias úteis**', 'Orientar a aguardar. O prazo depende do caso do paciente. Ele será chamado para iniciar as sessões.'],
            ['Passou de **20 dias úteis**', 'Orientar a manter contato com as **secretárias da Radioterapia**.']
          ] },
        { t: 'contato', nome: 'Secretárias da Radioterapia', tel: '(84) 4009-5575', via: 'ligacao', obs: 'ou (84) 4009-7433' },
        { t: 'alerta', tipo: 'warn', x: 'Conte em **dias úteis**, não corridos. 20 dias úteis equivalem a cerca de 4 semanas.' }
      ],
      chaves: [
        'Prazo: até 20 dias úteis, conforme o caso.',
        'Ultrapassou? Secretárias: (84) 4009-5575 ou (84) 4009-7433 (ligação).'
      ]
    },

    /* ---------------------------------------------------------- 7 */
    {
      id: 'especiais', titulo: 'Situações especiais', ico: '⚠️', min: 4,
      resumo: 'Urgência, troca de médico e atendimento vencido.',
      blocos: [
        { t: 'p', x: '**1. Urgência**' },
        { t: 'p', x: 'Paciente pedindo atendimento de urgência: direcione ao **pronto-socorro do Hospital Luiz Antônio**, aberto **24 horas**, com oncologistas de prontidão.' },
        { t: 'contato', nome: 'Clínica de Suporte Oncológico (CSO)', tel: '(84) 4009-5441', via: 'ligacao', obs: 'Ligação' },
        { t: 'p', x: '**2. Troca de médico**' },
        { t: 'p', x: 'O paciente precisa vir **pessoalmente** à unidade do **CECAN** e procurar as secretárias da Radioterapia, onde será assinado um **termo de mudança de médico**. Não é resolvido por mensagem.' },
        { t: 'p', x: '**3. Atendimento vencido (2 anos)**' },
        { t: 'p', x: 'O atendimento com a Radioterapia **expira em 2 anos**. Depois disso, é preciso solicitar **nova triagem no grupo RXT 1° VEZ**.' },
        { t: 'alerta', tipo: 'warn', x: 'Se o caso for **grave** (a gravidade do paciente), além da nova triagem, mantenha contato com a **secretária ou o responsável da Radioterapia** para não perder tempo.' }
      ],
      chaves: [
        'Urgência: pronto-socorro do Hospital Luiz Antônio, 24 h. CSO (84) 4009-5441.',
        'Troca de médico: só presencialmente no CECAN, com termo assinado.',
        'Vencido (2 anos): nova triagem no RXT 1° VEZ. Se grave, acionar a secretária.'
      ]
    },

    /* ---------------------------------------------------------- 8 */
    {
      id: 'contatos', titulo: 'Contatos essenciais', ico: '☎️', min: 2,
      resumo: 'Quem chamar em cada situação.',
      blocos: [
        { t: 'contato', nome: 'Secretárias da Radioterapia', tel: '(84) 4009-5575', via: 'ligacao', obs: 'ou (84) 4009-7433. Prazo vencido, dúvidas do tratamento, troca de médico' },
        { t: 'contato', nome: 'Clínica de Suporte Oncológico (CSO)', tel: '(84) 4009-5441', via: 'ligacao', obs: 'Urgência. Pronto-socorro do Hospital Luiz Antônio, 24 h' },
        { t: 'contato', nome: 'Medicina Nuclear', tel: '(84) 4009-7442', via: 'whatsapp', obs: 'Iodoterapia / radioiodoterapia' },
        { t: 'alerta', tipo: 'info', x: '**Grupo RXT 1° VEZ** (Google Chat): triagem de 1ª vez da Radioterapia, usado para solicitações de pacientes **particulares** e novas triagens de atendimentos vencidos.' },
        { t: 'p', x: 'A lista completa de telefones dos setores está na página **Telefonia**.' }
      ],
      chaves: [
        'Secretárias Radio: 5575 ou 7433 (ligação).',
        'CSO (urgência): 5441 (ligação).',
        'Medicina Nuclear: 7442 (WhatsApp).'
      ]
    }
  ],

  /* ===================== ÁRVORE DE DECISÃO ===================== */
  arvore: {
    inicio: 'motivo',
    nos: {
      motivo: { q: 'Qual é o motivo do contato do paciente?', opcoes: [
        { l: '🆕 Quer marcar a 1ª consulta de Radioterapia', prox: 'tipo' },
        { l: '☢️ O encaminhamento é de iodoterapia / radioiodoterapia', prox: 'fimIodo' },
        { l: '🚨 Está pedindo atendimento de urgência', prox: 'fimUrgencia' },
        { l: '🔄 Quer trocar de médico', prox: 'fimTroca' },
        { l: '⏳ Já fez a tomografia de planejamento', prox: 'tomo' },
        { l: '📅 Já foi atendido, mas faz mais de 2 anos', prox: 'fimVencido' }
      ] },

      tipo: { q: 'Qual é o tipo de atendimento?', opcoes: [
        { l: '👤 Particular', prox: 'fimParticular' },
        { l: '🏥 Convênio', prox: 'bioConv', add: 'Tipo de atendimento: Convênio.' },
        { l: '🏛️ SUS', prox: 'bioSus', add: 'Tipo de atendimento: SUS.' }
      ] },

      bioConv: { q: 'O encaminhamento é de MAV, tronco cerebral, meningioma, queloide ou braquiterapia?', opcoes: [
        { l: '✅ Sim, é um desses casos', prox: 'fimTriagem', add: 'A biópsia é dispensada. Peça que o paciente envie apenas o encaminhamento médico por WhatsApp.' },
        { l: '❌ Não, é outro caso', prox: 'fimTriagem', add: 'Peça que o paciente envie por WhatsApp o resultado da biópsia e o encaminhamento médico.' }
      ] },
      bioSus: { q: 'O encaminhamento é de MAV, tronco cerebral, meningioma, queloide ou braquiterapia?', opcoes: [
        { l: '✅ Sim, é um desses casos', prox: 'interior', add: 'A biópsia é dispensada. Peça que o paciente envie apenas o encaminhamento médico por WhatsApp.' },
        { l: '❌ Não, é outro caso', prox: 'interior', add: 'Peça que o paciente envie por WhatsApp o resultado da biópsia e o encaminhamento médico.' }
      ] },
      interior: { q: 'O paciente mora no interior?', opcoes: [
        { l: '📍 Sim, mora no interior', prox: 'fimTriagem', add: 'Oriente-o a ir à secretaria de saúde do município para emitir a guia de solicitação. Pode estar pendente; ele deve levá-la no dia da consulta.' },
        { l: '🏙️ Não', prox: 'fimTriagem' }
      ] },

      tomo: { q: 'Quantos dias úteis se passaram desde a tomografia de planejamento?', opcoes: [
        { l: 'Até 20 dias úteis', prox: 'fimAguardar' },
        { l: 'Mais de 20 dias úteis', prox: 'fimSecretarias' }
      ] },

      /* ---- resultados ---- */
      fimParticular: { fim: true, tipo: 'ok', titulo: 'Solicitar no grupo RXT 1° VEZ', passos: [
        'Atendimento **Particular**: não precisa de biópsia.',
        'Solicite a consulta no grupo **RXT 1° VEZ** (Google Chat).',
        'O paciente precisa apenas do **encaminhamento médico**.'
      ] },
      fimTriagem: { fim: true, tipo: 'ok', titulo: 'Encaminhar para a triagem via WhatsApp', passos: [
        'Com os documentos recebidos por WhatsApp, o paciente **passa pela triagem**.'
      ] },
      fimIodo: { fim: true, tipo: 'warn', titulo: 'Não é Radioterapia: é Medicina Nuclear', passos: [
        'Iodoterapia e radioiodoterapia são da **Medicina Nuclear**.',
        'Passe o contato: **(84) 4009-7442** (WhatsApp).'
      ] },
      fimUrgencia: { fim: true, tipo: 'err', titulo: 'Direcionar ao pronto-socorro', passos: [
        'Encaminhe ao **pronto-socorro do Hospital Luiz Antônio**, 24 horas, com oncologistas de prontidão.',
        'Telefone da Clínica de Suporte Oncológico (CSO): **(84) 4009-5441** (ligação).'
      ] },
      fimTroca: { fim: true, tipo: 'warn', titulo: 'Troca de médico: só presencial', passos: [
        'O paciente deve ir **pessoalmente à unidade do CECAN** e procurar as secretárias da Radioterapia.',
        'Será assinado um **termo de mudança de médico**.'
      ] },
      fimVencido: { fim: true, tipo: 'warn', titulo: 'Atendimento vencido: nova triagem', passos: [
        'O atendimento expira em **2 anos**.',
        'Solicite **nova triagem** no grupo **RXT 1° VEZ**.',
        'Se o caso for **grave**, mantenha contato com a secretária ou o responsável da Radioterapia.'
      ] },
      fimAguardar: { fim: true, tipo: 'ok', titulo: 'Orientar a aguardar', passos: [
        'O prazo é de **até 20 dias úteis**, conforme o caso. Os médicos estão analisando os exames.',
        'O paciente será **chamado** para iniciar as sessões.'
      ] },
      fimSecretarias: { fim: true, tipo: 'warn', titulo: 'Prazo ultrapassado: secretárias', passos: [
        'Oriente o paciente a manter contato com as **secretárias da Radioterapia**.',
        'Telefones: **(84) 4009-5575** ou **(84) 4009-7433** (ligação).'
      ] }
    }
  },

  /* ===================== FLASHCARDS ===================== */
  cartoes: [
    { f: 'Paciente **Particular**, 1ª consulta. O que precisa?', v: 'Apenas o **encaminhamento médico**. Solicitar no grupo **RXT 1° VEZ** (Google Chat).' },
    { f: 'Paciente de **Convênio**, 1ª consulta. O que enviar?', v: 'Por **WhatsApp**: resultado da **biópsia** + **encaminhamento médico**, para passar pela triagem.' },
    { f: 'Paciente do **SUS**, 1ª consulta. O que enviar?', v: 'Igual ao Convênio: por **WhatsApp**, **biópsia** + **encaminhamento médico**, para a triagem.' },
    { f: 'Cite os **5 encaminhamentos** que não exigem biópsia.', v: '**MAV**, **tronco cerebral**, **meningioma**, **queloides** e **braquiterapia**.' },
    { f: 'Por que tumores em tronco cerebral não exigem biópsia?', v: 'Porque é uma região onde **não é possível realizar biópsia**.' },
    { f: 'O que é **MAV**?', v: '**Malformação arteriovenosa**: alteração nos vasos sanguíneos. Não exige biópsia.' },
    { f: 'Encaminhamento de **iodoterapia / radioiodoterapia** vai para onde?', v: '**Medicina Nuclear**, não é Radioterapia.' },
    { f: 'Contato da **Medicina Nuclear**', v: '**(84) 4009-7442** (WhatsApp).' },
    { f: 'Paciente quer **trocar de médico**. O que fazer?', v: 'Ir **pessoalmente ao CECAN**, falar com as secretárias da Radioterapia e assinar um **termo de mudança de médico**.' },
    { f: 'Em quanto tempo o **atendimento expira**?', v: '**2 anos**. Depois, solicitar **nova triagem** no grupo RXT 1° VEZ.' },
    { f: 'Atendimento vencido e caso **grave**. Qual o cuidado extra?', v: 'Além da nova triagem, manter **contato com a secretária ou o responsável** da Radioterapia.' },
    { f: 'Paciente pede **urgência**. Para onde?', v: '**Pronto-socorro do Hospital Luiz Antônio**, 24 h, com oncologistas de prontidão. CSO: **(84) 4009-5441**.' },
    { f: 'Prazo após a **tomografia de planejamento**', v: '**Até 20 dias úteis** (depende do caso). Se passar, ligar para as secretárias da Radioterapia.' },
    { f: 'Telefones das **secretárias da Radioterapia**', v: '**(84) 4009-5575** ou **(84) 4009-7433** (ligação).' },
    { f: 'SUS + paciente do **interior**: como conseguir a autorização?', v: 'Ir à **secretaria de saúde do município**, emitir a guia de solicitação (pode estar **pendente**) e levá-la no dia da consulta.' },
    { f: 'Telefone da **CSO** (Clínica de Suporte Oncológico)', v: '**(84) 4009-5441** (ligação).' }
  ],

  /* ===================== QUIZ ===================== */
  quiz: [
    { q: 'Um paciente **particular** quer a 1ª consulta de Radioterapia. O que ele precisa?',
      op: ['Resultado da biópsia e encaminhamento, enviados por WhatsApp', 'Apenas o encaminhamento médico, com solicitação no grupo RXT 1° VEZ', 'A guia da secretaria de saúde do município', 'Não precisa de nada'], ok: 1,
      why: 'Particular: só o encaminhamento médico, solicitado no grupo RXT 1° VEZ.' },
    { q: 'Paciente de **convênio** quer a 1ª consulta. O que deve ser enviado por WhatsApp?',
      op: ['Só o encaminhamento', 'Só a biópsia', 'Resultado da biópsia e encaminhamento médico', 'A carteirinha do convênio'], ok: 2,
      why: 'Convênio (e SUS) enviam biópsia + encaminhamento por WhatsApp para passar pela triagem.' },
    { q: 'Qual destes encaminhamentos **exige** biópsia na triagem de Convênio ou SUS?',
      op: ['Meningioma', 'Queloide', 'MAV', 'Câncer de mama'], ok: 3,
      why: 'Meningioma, queloide, MAV, tronco cerebral e braquiterapia estão dispensados. Os demais casos exigem a biópsia.' },
    { q: 'Por que os tumores de **tronco cerebral** não exigem biópsia?',
      op: ['São sempre benignos', 'Não é possível realizar biópsia nessa região', 'São tratados só em hospital', 'Por orientação do convênio'], ok: 1,
      why: 'É uma região em que não é possível realizar biópsia.' },
    { q: 'O encaminhamento do paciente é de **radioiodoterapia**. O que fazer?',
      op: ['Abrir triagem da Radioterapia', 'Direcionar à Medicina Nuclear', 'Pedir nova biópsia', 'Enviar ao pronto-socorro'], ok: 1,
      why: 'Iodoterapia e radioiodoterapia são da Medicina Nuclear: (84) 4009-7442 (WhatsApp).' },
    { q: 'Paciente do **SUS**, do **interior**, ainda sem autorização. Qual a orientação?',
      op: ['Aguardar em casa até ser chamado', 'Ir à secretaria de saúde do município e emitir a guia, mesmo pendente, e levá-la no dia da consulta', 'Só vir quando a guia estiver aprovada', 'Pagar a consulta como particular'], ok: 1,
      why: 'A guia pode estar pendente. O paciente a leva no dia da consulta e o atendimento é realizado.' },
    { q: 'Paciente com **dor intensa** pede atendimento de urgência. Para onde direcionar?',
      op: ['Aguardar a triagem normal', 'Secretárias da Radioterapia', 'Pronto-socorro do Hospital Luiz Antônio (24 h)', 'Medicina Nuclear'], ok: 2,
      why: 'Urgência: pronto-socorro do Hospital Luiz Antônio, 24 h, com oncologistas de prontidão. CSO: (84) 4009-5441.' },
    { q: 'Como o paciente pode **trocar de médico** na Radioterapia?',
      op: ['Por WhatsApp', 'Pelo grupo RXT 1° VEZ', 'Pessoalmente no CECAN, assinando um termo de mudança de médico', 'Ligando para a CSO'], ok: 2,
      why: 'É preciso ir pessoalmente às secretárias da Radioterapia no CECAN e assinar o termo.' },
    { q: 'O último atendimento do paciente na Radioterapia foi há **2 anos e 3 meses**. O que fazer?',
      op: ['Nada, o atendimento continua válido', 'Solicitar nova triagem no grupo RXT 1° VEZ', 'Pedir nova biópsia ao paciente', 'Encaminhar à Medicina Nuclear'], ok: 1,
      why: 'O atendimento expira em 2 anos. Passado o prazo, solicita-se nova triagem no grupo.' },
    { q: 'O atendimento venceu e o paciente está em **estado grave**. O que fazer além da nova triagem?',
      op: ['Nada além da nova triagem', 'Manter contato com a secretária ou o responsável da Radioterapia', 'Esperar 20 dias úteis', 'Encaminhar à Medicina Nuclear'], ok: 1,
      why: 'Conforme a gravidade, o contato com a secretária ou responsável evita perda de tempo.' },
    { q: 'O paciente fez a tomografia de planejamento há **12 dias úteis** e pergunta quando começa. Qual a orientação?',
      op: ['Ligar para a CSO', 'Refazer a triagem', 'Aguardar até 20 dias úteis: os médicos analisam os exames e ele será chamado', 'Ir ao CECAN presencialmente'], ok: 2,
      why: 'O prazo é de até 20 dias úteis, conforme o caso. Só se passar disso se orienta contato com as secretárias.' },
    { q: 'Já se passaram **25 dias úteis** da tomografia de planejamento e ninguém chamou o paciente. O que orientar?',
      op: ['Aguardar mais 20 dias', 'Manter contato com as secretárias da Radioterapia', 'Refazer a tomografia', 'Procurar a Medicina Nuclear'], ok: 1,
      why: 'Ultrapassado o prazo, o paciente deve falar com as secretárias: (84) 4009-5575 ou (84) 4009-7433.' },
    { q: 'Qual é o canal de contato da **Clínica de Suporte Oncológico (CSO)**?',
      op: ['(84) 4009-5441, por ligação', '(84) 4009-7442, por WhatsApp', '(84) 4009-5575, por WhatsApp', 'Grupo RXT 1° VEZ'], ok: 0,
      why: 'CSO: (84) 4009-5441 (ligação). O 7442 é da Medicina Nuclear e o 5575 é das secretárias da Radioterapia.' }
  ],

  /* ===================== SIMULADOR DE ATENDIMENTO ===================== */
  simulador: [
    { msg: 'Boa tarde! Tenho convênio e meu médico pediu radioterapia. Como faço para marcar a consulta?',
      op: ['Pode vir direto à unidade, sem precisar de nada.', 'Por favor, nos envie por aqui o resultado da biópsia e o encaminhamento médico para passarmos pela triagem.', 'Basta enviar o encaminhamento; a biópsia não é necessária.'], ok: 1,
      why: 'Convênio exige biópsia + encaminhamento por WhatsApp para a triagem.' },
    { msg: 'Meu pai tem um meningioma e vai pelo SUS. Ainda não fez biópsia. Isso é problema?',
      op: ['Sim, sem biópsia não podemos fazer nada.', 'Para meningioma a biópsia não é exigida. Envie por aqui o encaminhamento médico para a triagem.', 'Ele precisa ir à Medicina Nuclear.'], ok: 1,
      why: 'Meningioma está na lista de dispensa da biópsia, mas o encaminhamento ainda é necessário.' },
    { msg: 'O médico pediu iodoterapia. Quero marcar com vocês da radioterapia.',
      op: ['Vou abrir uma triagem para você.', 'A iodoterapia é da Medicina Nuclear. O contato deles é (84) 4009-7442 pelo WhatsApp.', 'Procure o pronto-socorro.'], ok: 1,
      why: 'Iodoterapia e radioiodoterapia pertencem à Medicina Nuclear.' },
    { msg: 'Moro no interior e vou pelo SUS. Como consigo a autorização?',
      op: ['Só dá para agendar depois de a guia estar aprovada.', 'Vá à secretaria de saúde do seu município, dê entrada e emita a guia de solicitação. Mesmo pendente, leve no dia da consulta.', 'Peça ao seu médico para ligar para nós.'], ok: 1,
      why: 'A guia pode estar pendente. Ela deve ser levada no dia da consulta.' },
    { msg: 'Estou com muita dor e piorando a cada hora. Posso esperar a triagem?',
      op: ['Pode esperar, a triagem responde em breve.', 'Procure agora o pronto-socorro do Hospital Luiz Antônio, que funciona 24 horas e tem oncologistas de prontidão. Se precisar, ligue (84) 4009-5441.', 'Mande o encaminhamento de novo.'], ok: 1,
      why: 'Urgência vai para o pronto-socorro, não para a fila da triagem.' },
    { msg: 'Fiz a tomografia de planejamento há mais de 25 dias úteis e ninguém me chamou.',
      op: ['Aguarde mais um pouco, o prazo é de 60 dias.', 'Entre em contato com as secretárias da Radioterapia: (84) 4009-5575 ou (84) 4009-7433.', 'Você precisa fazer uma nova tomografia.'], ok: 1,
      why: 'O prazo é de até 20 dias úteis. Passou disso, o contato é com as secretárias.' },
    { msg: 'Quero trocar de médico na radioterapia. Dá para fazer por aqui?',
      op: ['Sim, me envie o nome do novo médico.', 'A troca precisa ser presencial: venha ao CECAN falar com as secretárias da radioterapia para assinar o termo de mudança de médico.', 'Só pelo grupo de triagem.'], ok: 1,
      why: 'A troca exige presença e termo assinado.' }
  ],

  /* ===================== CONSULTA RÁPIDA ("cola") ===================== */
  cola: [
    { t: '1ª consulta: Particular', r: 'Solicitar no grupo **RXT 1° VEZ** (Google Chat). Paciente leva apenas o encaminhamento médico.', tags: 'particular primeira vez grupo rxt' },
    { t: '1ª consulta: Convênio', r: 'Paciente envia por WhatsApp o resultado da biópsia + encaminhamento médico para a triagem.', tags: 'convenio primeira vez biopsia whatsapp triagem' },
    { t: '1ª consulta: SUS', r: 'Paciente envia por WhatsApp o resultado da biópsia + encaminhamento médico para a triagem.', tags: 'sus primeira vez biopsia whatsapp triagem' },
    { t: 'Biópsia dispensada', r: 'MAV, tumores de tronco cerebral, meningioma, queloides e braquiterapia.', tags: 'sem biopsia mav tronco cerebral meningioma queloide braquiterapia excecao' },
    { t: 'Iodoterapia / radioiodoterapia', r: 'Não é Radioterapia. É Medicina Nuclear: (84) 4009-7442 (WhatsApp).', tags: 'iodo iodoterapia radioiodoterapia medicina nuclear', tel: '(84) 4009-7442', via: 'whatsapp' },
    { t: 'Troca de médico', r: 'Presencial, na unidade do CECAN, com as secretárias da Radioterapia (assinatura de termo).', tags: 'trocar mudar medico termo cecan' },
    { t: 'Validade do atendimento', r: '2 anos. Depois, nova triagem no grupo RXT 1° VEZ. Se grave, manter contato com a secretária ou o responsável.', tags: 'expira vencido validade dois anos nova triagem gravidade' },
    { t: 'Urgência', r: 'Pronto-socorro do Hospital Luiz Antônio, 24 h, com oncologistas de prontidão. CSO: (84) 4009-5441.', tags: 'urgencia emergencia pronto socorro hospital luiz antonio cso', tel: '(84) 4009-5441', via: 'ligacao' },
    { t: 'Após a tomografia de planejamento', r: 'Aguardar até 20 dias úteis (depende do caso): análise médica e chamada para iniciar as sessões. Passou do prazo: secretárias.', tags: 'tomografia planejamento prazo 20 dias uteis inicio sessoes' },
    { t: 'Secretárias da Radioterapia', r: '(84) 4009-5575 ou (84) 4009-7433 (ligação).', tags: 'secretaria secretarias radioterapia telefone', tel: '(84) 4009-5575', via: 'ligacao' },
    { t: 'SUS + interior', r: 'Secretaria de saúde do município emite a guia de solicitação. Pode estar pendente; levar no dia da consulta.', tags: 'sus interior autorizacao guia secretaria saude municipio pendente' },
    { t: 'CSO: Clínica de Suporte Oncológico', r: '(84) 4009-5441 (ligação).', tags: 'cso suporte oncologico telefone', tel: '(84) 4009-5441', via: 'ligacao' }
  ]
},

/* ===================================================================
   ONCOLOGIA CLÍNICA: em breve
   Quando tiver o conteúdo, preencha como na Radioterapia e troque pronto para true.
   =================================================================== */
oncologia: {
  id: 'oncologia', titulo: 'Oncologia Clínica', ico: '♋', cor: '#c2185b', pronto: false,
  resumo: 'Em breve: fluxo da 1ª consulta, divisão por tumores e orientações por tipo de atendimento.',
  licoes: [], arvore: null, cartoes: [], quiz: [], simulador: [], cola: []
},

/* ===================================================================
   HEMATOLOGIA: em breve
   =================================================================== */
hematologia: {
  id: 'hematologia', titulo: 'Hematologia', ico: '🩸', cor: '#b71c1c', pronto: false,
  resumo: 'Em breve: fluxo da 1ª consulta, autorizações e orientações por tipo de atendimento.',
  licoes: [], arvore: null, cartoes: [], quiz: [], simulador: [], cola: []
}
};
