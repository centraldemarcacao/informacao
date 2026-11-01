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
  resumo: 'Orientações para a 1ª consulta, triagem, situações especiais e contatos institucionais da Radioterapia.',

  licoes: [
    /* ---------------------------------------------------------- 1 */
    {
      id: 'jornada', titulo: 'A jornada do paciente', ico: '🗺️', min: 3,
      resumo: 'Visão geral: do primeiro contato ao início das sessões.',
      blocos: [
        { t: 'p', x: 'Antes de aplicar as regras, é necessário identificar a etapa do paciente no fluxo assistencial. A maior parte das dúvidas é resolvida ao se conhecer **em que etapa ele se encontra**.' },
        { t: 'passos', itens: [
          { t: 'Pedido da 1ª consulta (triagem)', x: 'O que se envia e por qual canal depende do tipo de atendimento: **Particular, Convênio ou SUS**.' },
          { t: 'Consulta com o médico da Radioterapia', x: 'Para SUS no interior, a guia de solicitação deve ser emitida na secretaria de saúde do município.' },
          { t: 'Tomografia de planejamento', x: 'Exame destinado ao planejamento do tratamento.' },
          { t: 'Análise dos médicos', x: 'Prazo de **até 20 dias úteis**, conforme o caso do paciente.' },
          { t: 'Início das sessões', x: 'O paciente é convocado para o início do tratamento radioterápico.' }
        ] },
        { t: 'alerta', tipo: 'info', x: 'Fora da jornada principal existem **situações especiais**: urgência, troca de médico, atendimento vencido (mais de 2 anos) e encaminhamentos que não são da Radioterapia.' }
      ],
      chaves: [
        'Identifique a etapa do paciente antes de orientar.',
        'Prazo após a tomografia de planejamento: até 20 dias úteis.',
        'Urgência, troca de médico e atendimento expirado possuem fluxo próprio.'
      ]
    },

    /* ---------------------------------------------------------- 2 */
    {
      id: 'primeira', titulo: 'Consulta de 1ª vez', ico: '🆕', min: 4,
      resumo: 'O que enviar e por onde: Particular, Convênio e SUS.',
      blocos: [
        { t: 'p', x: 'Os requisitos variam conforme o tipo de atendimento. **Consulte a tabela:**' },
        { t: 'tabela',
          cab: ['Atendimento', 'Como solicitar', 'O que é necessário', 'Biópsia'],
          linhas: [
            ['**Particular**', 'Solicitar no grupo **RXT 1° VEZ** (Google Chat)', 'Apenas o encaminhamento médico', 'Não exigida'],
            ['**Convênio**', 'Paciente envia por **WhatsApp** para a triagem', 'Resultado da biópsia + encaminhamento médico', 'Exigida'],
            ['**SUS**', 'Paciente envia por **WhatsApp** para a triagem', 'Resultado da biópsia + encaminhamento médico', 'Exigida']
          ] },
        { t: 'alerta', tipo: 'warn', x: '**Convênio e SUS seguem o mesmo procedimento.** O atendimento Particular é distinto: não utiliza o WhatsApp, e a solicitação é registrada pela equipe no grupo **RXT 1° VEZ**.' },
        { t: 'alerta', tipo: 'ok', x: 'Há encaminhamentos para os quais a biópsia **não** é exigida. Consulte a lição seguinte.' }
      ],
      chaves: [
        'Particular: grupo RXT 1° VEZ + só o encaminhamento.',
        'Convênio e SUS: WhatsApp com biópsia + encaminhamento, para a triagem.',
        'Sem a documentação exigida (biópsia, quando aplicável, e encaminhamento médico), a triagem não pode ser realizada.'
      ]
    },

    /* ---------------------------------------------------------- 3 */
    {
      id: 'semBiopsia', titulo: 'Dispensa de biópsia', ico: '🔬', min: 3,
      resumo: 'Cinco encaminhamentos que dispensam a biópsia.',
      blocos: [
        { t: 'p', x: 'Nestes encaminhamentos a triagem **não exige o resultado da biópsia**:' },
        { t: 'tabela',
          cab: ['Encaminhamento', 'Descrição'],
          linhas: [
            ['**MAV**', 'Malformação arteriovenosa: alteração nos vasos sanguíneos'],
            ['**Tumores em tronco cerebral**', 'Região onde **não é possível realizar biópsia**'],
            ['**Meningioma**', 'Tumor das meninges (membranas que envolvem o cérebro), em geral benigno'],
            ['**Queloides**', 'Cicatrizes elevadas, de crescimento excessivo'],
            ['**Braquiterapia**', 'Modalidade de radioterapia em que a fonte de radiação é posicionada próxima ao tumor']
          ] },
        { t: 'alerta', tipo: 'info', x: '**Encaminhamentos dispensados:** MAV, meningioma, queloide, braquiterapia e tumores de tronco cerebral. Para os demais casos, em Convênio ou SUS, **a biópsia é exigida**.' },
        { t: 'alerta', tipo: 'warn', x: 'Nesses casos o paciente ainda precisa enviar o **encaminhamento médico**. A única alteração é a dispensa da biópsia.' }
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
        { t: 'p', x: 'Apesar da semelhança de nomenclatura, trata-se de outro setor. **Radioiodoterapia** e **iodoterapia** são atribuições da **Medicina Nuclear**, e não da Radioterapia.' },
        { t: 'alerta', tipo: 'err', x: 'Se o encaminhamento mencionar **iodo**, não abra triagem na Radioterapia. Direcione o paciente à Medicina Nuclear.' },
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
          { t: 'Orientar o paciente', x: 'Ele deve comparecer à **secretaria municipal de saúde do seu município**.' },
          { t: 'Dar entrada e emitir a guia de solicitação', x: 'A guia pode constar com o status **pendente**; essa condição não impede o atendimento.' },
          { t: 'Levar a guia no dia da consulta', x: 'Ainda que pendente, a consulta **será realizada**.' }
        ] },
        { t: 'alerta', tipo: 'ok', x: 'Guia **pendente não constitui motivo para remarcação ou recusa** do atendimento. O paciente deve apresentá-la no dia da consulta.' }
      ],
      chaves: [
        'Interior + SUS: secretaria de saúde do município emite a guia.',
        'Guia com status pendente também vale. Levar no dia da consulta.'
      ]
    },

    /* ---------------------------------------------------------- 6 */
    {
      id: 'tomografia', titulo: 'Depois da tomografia de planejamento', ico: '⏳', min: 2,
      resumo: 'Prazo de até 20 dias úteis e conduta em caso de extrapolação.',
      blocos: [
        { t: 'p', x: 'Realizada a tomografia de planejamento, o paciente **aguarda a convocação**. Nesse período, a equipe médica analisa os exames.' },
        { t: 'tabela',
          cab: ['Situação', 'Orientação'],
          linhas: [
            ['Dentro de **20 dias úteis**', 'Orientar o paciente a aguardar. O prazo varia conforme o caso clínico. Ele será convocado para iniciar as sessões.'],
            ['Passou de **20 dias úteis**', 'Orientar a manter contato com as **secretarias da Radioterapia**.']
          ] },
        { t: 'contato', nome: 'Secretarias da Radioterapia', tel: '(84) 4009-5575', via: 'ligacao', obs: 'ou (84) 4009-7433' },
        { t: 'alerta', tipo: 'warn', x: 'O prazo é contado em **dias úteis**, e não em dias corridos. Vinte dias úteis equivalem a, aproximadamente, 4 semanas.' }
      ],
      chaves: [
        'Prazo: até 20 dias úteis, conforme o caso.',
        'Prazo excedido: secretarias da Radioterapia: (84) 4009-5575 ou (84) 4009-7433 (ligação).'
      ]
    },

    /* ---------------------------------------------------------- 7 */
    {
      id: 'especiais', titulo: 'Situações especiais', ico: '⚠️', min: 4,
      resumo: 'Urgência, troca de médico e atendimento vencido.',
      blocos: [
        { t: 'p', x: '**1. Urgência**' },
        { t: 'p', x: 'Paciente que solicita atendimento de urgência: encaminhe ao **pronto-socorro do Hospital Luiz Antônio**, aberto **24 horas**, com oncologistas de prontidão.' },
        { t: 'contato', nome: 'Clínica de Suporte Oncológico (CSO)', tel: '(84) 4009-5441', via: 'ligacao', obs: 'Ligação' },
        { t: 'p', x: '**2. Troca de médico**' },
        { t: 'p', x: 'O paciente precisa vir **pessoalmente** à unidade do **CECAN** e procurar as secretarias da Radioterapia, onde será assinado um **termo de mudança de médico**. A solicitação não pode ser atendida por mensagem.' },
        { t: 'p', x: '**3. Atendimento vencido (2 anos)**' },
        { t: 'p', x: 'O atendimento com a Radioterapia **expira em 2 anos**. Após esse prazo, é necessário solicitar **nova triagem no grupo RXT 1° VEZ**.' },
        { t: 'alerta', tipo: 'warn', x: 'Em caso de **maior gravidade clínica**, além da nova triagem, mantenha contato com a **secretaria ou o responsável da Radioterapia**, a fim de evitar atraso no atendimento.' }
      ],
      chaves: [
        'Urgência: pronto-socorro do Hospital Luiz Antônio, 24 h. CSO (84) 4009-5441.',
        'Troca de médico: só presencialmente no CECAN, com termo assinado.',
        'Atendimento expirado (2 anos): nova triagem no RXT 1° VEZ. Em caso grave, acionar a secretaria.'
      ]
    },

    /* ---------------------------------------------------------- 8 */
    {
      id: 'contatos', titulo: 'Contatos essenciais', ico: '☎️', min: 2,
      resumo: 'Setor de referência para cada situação.',
      blocos: [
        { t: 'contato', nome: 'Secretarias da Radioterapia', tel: '(84) 4009-5575', via: 'ligacao', obs: 'ou (84) 4009-7433. Prazo excedido, dúvidas sobre o tratamento, troca de médico' },
        { t: 'contato', nome: 'Clínica de Suporte Oncológico (CSO)', tel: '(84) 4009-5441', via: 'ligacao', obs: 'Urgência. Pronto-socorro do Hospital Luiz Antônio, 24 h' },
        { t: 'contato', nome: 'Medicina Nuclear', tel: '(84) 4009-7442', via: 'whatsapp', obs: 'Iodoterapia / radioiodoterapia' },
        { t: 'alerta', tipo: 'info', x: '**Grupo RXT 1° VEZ** (Google Chat): triagem de 1ª vez da Radioterapia, utilizado para solicitações de pacientes **particulares** e para novas triagens de atendimentos expirados.' },
        { t: 'p', x: 'A lista completa de telefones dos setores está na página **Telefonia**.' }
      ],
      chaves: [
        'Secretarias da Radioterapia: 5575 ou 7433 (ligação).',
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
        { l: '🆕 Solicita agendamento da 1ª consulta de Radioterapia', prox: 'tipo' },
        { l: '☢️ O encaminhamento é de iodoterapia / radioiodoterapia', prox: 'fimIodo' },
        { l: '🚨 Solicita atendimento de urgência', prox: 'fimUrgencia' },
        { l: '🔄 Solicita troca de médico', prox: 'fimTroca' },
        { l: '⏳ Tomografia de planejamento já realizada', prox: 'tomo' },
        { l: '📅 Atendimento anterior há mais de 2 anos', prox: 'fimVencido' }
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
        'Informe o contato: **(84) 4009-7442** (WhatsApp).'
      ] },
      fimUrgencia: { fim: true, tipo: 'err', titulo: 'Direcionar ao pronto-socorro', passos: [
        'Encaminhe ao **pronto-socorro do Hospital Luiz Antônio**, 24 horas, com oncologistas de prontidão.',
        'Telefone da Clínica de Suporte Oncológico (CSO): **(84) 4009-5441** (ligação).'
      ] },
      fimTroca: { fim: true, tipo: 'warn', titulo: 'Troca de médico: só presencial', passos: [
        'O paciente deve ir **pessoalmente à unidade do CECAN** e procurar as secretarias da Radioterapia.',
        'Será assinado um **termo de mudança de médico**.'
      ] },
      fimVencido: { fim: true, tipo: 'warn', titulo: 'Atendimento expirado: nova triagem', passos: [
        'O atendimento expira em **2 anos**.',
        'Solicite **nova triagem** no grupo **RXT 1° VEZ**.',
        'Em caso de maior gravidade clínica, mantenha contato com a secretaria ou o responsável da Radioterapia.'
      ] },
      fimAguardar: { fim: true, tipo: 'ok', titulo: 'Orientar o paciente a aguardar', passos: [
        'O prazo é de **até 20 dias úteis**, conforme o caso. A equipe médica está analisando os exames.',
        'O paciente será **convocado** para iniciar as sessões.'
      ] },
      fimSecretarias: { fim: true, tipo: 'warn', titulo: 'Prazo excedido: contatar as secretarias', passos: [
        'Oriente o paciente a manter contato com as **secretarias da Radioterapia**.',
        'Telefones: **(84) 4009-5575** ou **(84) 4009-7433** (ligação).'
      ] }
    }
  },

  /* ===================== FLASHCARDS ===================== */
  cartoes: [
    { f: 'Paciente **Particular**, 1ª consulta. Qual documentação é necessária?', v: 'Apenas o **encaminhamento médico**. Solicitar no grupo **RXT 1° VEZ** (Google Chat).' },
    { f: 'Paciente de **Convênio**, 1ª consulta. Quais documentos enviar?', v: 'Por **WhatsApp**: resultado da **biópsia** + **encaminhamento médico**, para realização da triagem.' },
    { f: 'Paciente do **SUS**, 1ª consulta. Quais documentos enviar?', v: 'Mesmo procedimento do Convênio: por **WhatsApp**, **biópsia** + **encaminhamento médico**, para a triagem.' },
    { f: 'Cite os **5 encaminhamentos** que dispensam biópsia.', v: '**MAV**, **tronco cerebral**, **meningioma**, **queloides** e **braquiterapia**.' },
    { f: 'Por que tumores de tronco cerebral dispensam biópsia?', v: 'Porque é uma região onde **não é possível realizar biópsia**.' },
    { f: 'O que é **MAV**?', v: '**Malformação arteriovenosa**: alteração vascular. Dispensa biópsia.' },
    { f: 'Para qual setor deve ser encaminhado o paciente com indicação de **iodoterapia / radioiodoterapia**?', v: '**Medicina Nuclear**; não é atribuição da Radioterapia.' },
    { f: 'Contato da **Medicina Nuclear**', v: '**(84) 4009-7442** (WhatsApp).' },
    { f: 'Paciente solicita **troca de médico**. Qual a conduta?', v: 'Comparecer **pessoalmente ao CECAN**, procurar as secretarias da Radioterapia e assinar um **termo de mudança de médico**.' },
    { f: 'Qual a **validade do atendimento**?', v: '**2 anos**. Depois, solicitar **nova triagem** no grupo RXT 1° VEZ.' },
    { f: 'Atendimento expirado em caso de **maior gravidade clínica**. Qual a conduta adicional?', v: 'Além da nova triagem, manter **contato com a secretaria ou o responsável** da Radioterapia.' },
    { f: 'Paciente solicita **atendimento de urgência**. Qual o encaminhamento?', v: '**Pronto-socorro do Hospital Luiz Antônio**, 24 h, com oncologistas de prontidão. CSO: **(84) 4009-5441**.' },
    { f: 'Prazo após a **tomografia de planejamento**', v: '**Até 20 dias úteis** (depende do caso). Se excedido, contatar as secretarias da Radioterapia.' },
    { f: 'Telefones das **secretarias da Radioterapia**', v: '**(84) 4009-5575** ou **(84) 4009-7433** (ligação).' },
    { f: 'SUS e paciente do **interior**: como obter a autorização?', v: 'Comparecer à **secretaria municipal de saúde**, emitir a guia de solicitação (pode constar como **pendente**) e apresentá-la no dia da consulta.' },
    { f: 'Telefone da **CSO** (Clínica de Suporte Oncológico)', v: '**(84) 4009-5441** (ligação).' }
  ],

  /* ===================== QUIZ ===================== */
  quiz: [
    { q: 'Um paciente **particular** solicita a 1ª consulta de Radioterapia. Qual documentação é necessária?',
      op: ['Resultado da biópsia e encaminhamento, enviados por WhatsApp', 'Apenas o encaminhamento médico, com solicitação no grupo RXT 1° VEZ', 'A guia da secretaria de saúde do município', 'Nenhuma documentação é necessária'], ok: 1,
      why: 'Particular: só o encaminhamento médico, solicitado no grupo RXT 1° VEZ.' },
    { q: 'Paciente de **convênio** solicita a 1ª consulta. Quais documentos devem ser enviados por WhatsApp?',
      op: ['Só o encaminhamento', 'Só a biópsia', 'Resultado da biópsia e encaminhamento médico', 'Apenas a carteira do convênio'], ok: 2,
      why: 'Convênio (e SUS) enviam biópsia + encaminhamento por WhatsApp para realização da triagem.' },
    { q: 'Qual destes encaminhamentos **exige** biópsia na triagem de Convênio ou SUS?',
      op: ['Meningioma', 'Queloide', 'MAV', 'Câncer de mama'], ok: 3,
      why: 'Meningioma, queloide, MAV, tronco cerebral e braquiterapia estão dispensados. Os demais casos exigem biópsia.' },
    { q: 'Por que os tumores de **tronco cerebral** dispensam biópsia?',
      op: ['São sempre benignos', 'Não é possível realizar biópsia nessa região', 'São tratados só em hospital', 'Por orientação do convênio'], ok: 1,
      why: 'Trata-se de região em que a biópsia não é tecnicamente viável.' },
    { q: 'O encaminhamento do paciente indica **radioiodoterapia**. Qual a conduta?',
      op: ['Abrir triagem da Radioterapia', 'Direcionar à Medicina Nuclear', 'Pedir nova biópsia', 'Enviar ao pronto-socorro'], ok: 1,
      why: 'Iodoterapia e radioiodoterapia são da Medicina Nuclear: (84) 4009-7442 (WhatsApp).' },
    { q: 'Paciente do **SUS**, residente no **interior**, ainda sem autorização. Qual a orientação correta?',
      op: ['Aguardar em domicílio até ser contatado', 'Comparecer à secretaria municipal de saúde, emitir a guia (ainda que pendente) e apresentá-la no dia da consulta', 'Comparecer somente após a aprovação da guia', 'Custear a consulta como particular'], ok: 1,
      why: 'A guia pode constar como pendente. O paciente a apresenta no dia da consulta e o atendimento é realizado.' },
    { q: 'Paciente com **dor intensa** solicita atendimento de urgência. Para onde deve ser encaminhado?',
      op: ['Aguardar a triagem regular', 'Secretarias da Radioterapia', 'Pronto-socorro do Hospital Luiz Antônio (24 h)', 'Medicina Nuclear'], ok: 2,
      why: 'Urgência: pronto-socorro do Hospital Luiz Antônio, 24 h, com oncologistas de prontidão. CSO: (84) 4009-5441.' },
    { q: 'Qual é o procedimento para **troca de médico** na Radioterapia?',
      op: ['Por WhatsApp', 'Pelo grupo RXT 1° VEZ', 'Presencialmente no CECAN, mediante assinatura de termo de mudança de médico', 'Ligando para a CSO'], ok: 2,
      why: 'É necessário comparecer presencialmente às secretarias da Radioterapia, no CECAN, e assinar o termo.' },
    { q: 'O último atendimento do paciente na Radioterapia ocorreu há **2 anos e 3 meses**. Qual a conduta?',
      op: ['Nenhuma; o atendimento permanece válido', 'Solicitar nova triagem no grupo RXT 1° VEZ', 'Solicitar nova biópsia ao paciente', 'Encaminhar à Medicina Nuclear'], ok: 1,
      why: 'O atendimento expira em 2 anos. Após esse prazo, solicita-se nova triagem no grupo.' },
    { q: 'O atendimento expirou e o paciente apresenta **quadro clínico grave**. Qual a conduta adicional à nova triagem?',
      op: ['Nada além da nova triagem', 'Manter contato com a secretaria ou o responsável da Radioterapia', 'Esperar 20 dias úteis', 'Encaminhar à Medicina Nuclear'], ok: 1,
      why: 'Conforme a gravidade, o contato com a secretaria ou o responsável evita atraso no atendimento.' },
    { q: 'O paciente realizou a tomografia de planejamento há **12 dias úteis** e questiona a data de início. Qual a orientação?',
      op: ['Contatar a CSO', 'Refazer a triagem', 'Aguardar até 20 dias úteis: a equipe médica analisa os exames e o paciente será convocado', 'Comparecer ao CECAN'], ok: 2,
      why: 'O prazo é de até 20 dias úteis, conforme o caso. Somente se esse prazo for excedido deve-se orientar contato com as secretarias.' },
    { q: 'Transcorreram **25 dias úteis** desde a tomografia de planejamento sem convocação do paciente. Qual a orientação?',
      op: ['Aguardar mais 20 dias', 'Manter contato com as secretarias da Radioterapia', 'Refazer a tomografia', 'Procurar a Medicina Nuclear'], ok: 1,
      why: 'Excedido o prazo, o paciente deve contatar as secretarias: (84) 4009-5575 ou (84) 4009-7433.' },
    { q: 'Qual é o canal de contato da **Clínica de Suporte Oncológico (CSO)**?',
      op: ['(84) 4009-5441, por ligação', '(84) 4009-7442, por WhatsApp', '(84) 4009-5575, por WhatsApp', 'Grupo RXT 1° VEZ'], ok: 0,
      why: 'CSO: (84) 4009-5441 (ligação). O número 7442 pertence à Medicina Nuclear e o 5575, às secretarias da Radioterapia.' }
  ],

  /* ===================== SIMULADOR DE ATENDIMENTO ===================== */
  simulador: [
    { msg: 'Boa tarde. Possuo convênio e meu médico indicou radioterapia. Qual o procedimento para agendar a consulta?',
      op: ['Pode comparecer diretamente à unidade, sem documentação.', 'Solicitamos o envio, por este canal, do resultado da biópsia e do encaminhamento médico, para a realização da triagem.', 'É suficiente enviar o encaminhamento; a biópsia é dispensada.'], ok: 1,
      why: 'Convênio exige biópsia + encaminhamento por WhatsApp para a triagem.' },
    { msg: 'Meu pai possui diagnóstico de meningioma e será atendido pelo SUS. Ele ainda não realizou biópsia. Isso impede o atendimento?',
      op: ['Sim, sem biópsia não é possível prosseguir.', 'Para meningioma, a biópsia não é exigida. Solicitamos o envio do encaminhamento médico, por este canal, para a triagem.', 'Ele deve ser encaminhado à Medicina Nuclear.'], ok: 1,
      why: 'Meningioma está na lista de dispensa da biópsia, mas o encaminhamento ainda é necessário.' },
    { msg: 'O médico solicitou iodoterapia. Desejo agendar com a Radioterapia.',
      op: ['Será aberta uma triagem na Radioterapia.', 'A iodoterapia é atribuição da Medicina Nuclear. O contato do setor é (84) 4009-7442, por WhatsApp.', 'Dirija-se ao pronto-socorro.'], ok: 1,
      why: 'Iodoterapia e radioiodoterapia pertencem à Medicina Nuclear.' },
    { msg: 'Resido no interior e serei atendido pelo SUS. Como obtenho a autorização?',
      op: ['O agendamento somente é possível após a aprovação da guia.', 'Compareça à secretaria municipal de saúde, realize o cadastro e emita a guia de solicitação. Ainda que pendente, apresente-a no dia da consulta.', 'Solicite ao seu médico que entre em contato conosco.'], ok: 1,
      why: 'A guia pode constar como pendente e deve ser apresentada no dia da consulta.' },
    { msg: 'Estou com dor intensa e em piora progressiva. Posso aguardar a triagem?',
      op: ['Pode aguardar; a triagem responderá em breve.', 'Dirija-se imediatamente ao pronto-socorro do Hospital Luiz Antônio, que funciona 24 horas e conta com oncologistas de prontidão. Se necessário, contate o (84) 4009-5441.', 'Reenvie o encaminhamento.'], ok: 1,
      why: 'Casos de urgência devem ser encaminhados ao pronto-socorro, e não à fila de triagem.' },
    { msg: 'Realizei a tomografia de planejamento há mais de 25 dias úteis e não fui contatado.',
      op: ['Aguarde; o prazo é de 60 dias.', 'Entre em contato com as secretarias da Radioterapia: (84) 4009-5575 ou (84) 4009-7433.', 'É necessário realizar nova tomografia.'], ok: 1,
      why: 'O prazo é de até 20 dias úteis. Excedido esse período, o contato deve ser feito com as secretarias.' },
    { msg: 'Desejo trocar de médico na Radioterapia. É possível realizar a solicitação por este canal?',
      op: ['Sim, envie o nome do novo médico.', 'A troca deve ser presencial: compareça ao CECAN, procure as secretarias da Radioterapia e assine o termo de mudança de médico.', 'Apenas pelo grupo de triagem.'], ok: 1,
      why: 'A troca exige comparecimento e termo assinado.' }
  ],

  /* ===================== CONSULTA RÁPIDA ("cola") ===================== */
  cola: [
    { t: '1ª consulta: Particular', r: 'Solicitar no grupo **RXT 1° VEZ** (Google Chat). O paciente apresenta apenas o encaminhamento médico.', tags: 'particular primeira vez grupo rxt' },
    { t: '1ª consulta: Convênio', r: 'O paciente envia, por WhatsApp, o resultado da biópsia e o encaminhamento médico para a triagem.', tags: 'convenio primeira vez biopsia whatsapp triagem' },
    { t: '1ª consulta: SUS', r: 'O paciente envia, por WhatsApp, o resultado da biópsia e o encaminhamento médico para a triagem.', tags: 'sus primeira vez biopsia whatsapp triagem' },
    { t: 'Biópsia dispensada', r: 'MAV, tumores de tronco cerebral, meningioma, queloides e braquiterapia.', tags: 'sem biopsia mav tronco cerebral meningioma queloide braquiterapia excecao' },
    { t: 'Iodoterapia / radioiodoterapia', r: 'Não é Radioterapia. É Medicina Nuclear: (84) 4009-7442 (WhatsApp).', tags: 'iodo iodoterapia radioiodoterapia medicina nuclear', tel: '(84) 4009-7442', via: 'whatsapp' },
    { t: 'Troca de médico', r: 'Presencial, na unidade do CECAN, junto às secretarias da Radioterapia (assinatura de termo).', tags: 'trocar mudar medico termo cecan' },
    { t: 'Validade do atendimento', r: '2 anos. Depois, nova triagem no grupo RXT 1° VEZ. Em caso grave, manter contato com a secretaria ou o responsável.', tags: 'expira vencido validade dois anos nova triagem gravidade' },
    { t: 'Urgência', r: 'Pronto-socorro do Hospital Luiz Antônio, 24 h, com oncologistas de prontidão. CSO: (84) 4009-5441.', tags: 'urgencia emergencia pronto socorro hospital luiz antonio cso', tel: '(84) 4009-5441', via: 'ligacao' },
    { t: 'Após a tomografia de planejamento', r: 'Aguardar até 20 dias úteis (conforme o caso): análise médica e convocação para o início das sessões. Prazo excedido: contatar as secretarias.', tags: 'tomografia planejamento prazo 20 dias uteis inicio sessoes' },
    { t: 'Secretarias da Radioterapia', r: '(84) 4009-5575 ou (84) 4009-7433 (ligação).', tags: 'secretaria secretarias radioterapia telefone', tel: '(84) 4009-5575', via: 'ligacao' },
    { t: 'SUS + interior', r: 'A secretaria municipal de saúde emite a guia de solicitação, que pode constar como pendente; apresentá-la no dia da consulta.', tags: 'sus interior autorizacao guia secretaria saude municipio pendente' },
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
