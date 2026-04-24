/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Baby,
  Shield,
  Thermometer,
  TrendingUp,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  Instagram,
  Home, 
  Droplets, 
  HelpCircle, 
  Users, 
  Info, 
  X, 
  ChevronRight, 
  Plus,
  Minus,
  Play, 
  Heart, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const imagePath = (filename: string) => `${import.meta.env.BASE_URL}images/${filename}`;

const appImages = {
  guiaDePega: imagePath('pega-correta.jpeg'),
  posicoes: imagePath('posicoes-v2.jpeg'),
  bancoDuvidas: imagePath('banco-de-duvidas.jpeg'),
  logoUFF: imagePath('logo-uff-novo.jpeg'),
  brasaoUFF: imagePath('brasao-uff.png'),
  logoPEA: imagePath('logo-pea.png'),
  logoPACCS: imagePath('logo-paccs.png'),
  logoGrupoPesquisa: imagePath('logo-grupo-pesquisa.png'),
  logoEscolaEnfermagem: imagePath('logo-escola-enfermagem.png'),
};

type Tab = 'inicio' | 'banco' | 'duvidas' | 'comunidade' | 'sobre';

interface Post {
  id: string;
  text: string;
  date: string;
}

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-3xl p-6 shadow-2xl"
        >
          <button 
            id="close-modal"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
          <h2 className="text-2xl font-bold text-fm-primary text-center mb-6 pr-8">{title}</h2>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Card = ({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) => (
  <div className={`bg-white p-5 rounded-2xl shadow-sm border border-pink-50 mb-4 ${className}`}>
    {title && <h3 className="text-lg font-bold text-fm-primary border-b border-fm-secondary pb-2 mb-3">{title}</h3>}
    {children}
  </div>
);

const VideoCard = ({ title, videoId }: { title: string; videoId: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);

  return (
    <div className="mb-6">
      <span className="text-sm font-bold text-fm-primary mb-2 flex items-center gap-2">
        <Play className="w-4 h-4 fill-current" /> {title}
      </span>
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-pink-950 shadow-xl shadow-pink-200/60 ring-1 ring-pink-100">
        {isPlaying ? (
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            className="absolute inset-0 w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={title}
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="group absolute inset-0 block w-full overflow-hidden text-left"
            aria-label={`Assistir vídeo: ${title}`}
          >
            <img
              src={thumbnail}
              onError={() => setThumbnail(`https://img.youtube.com/vi/${videoId}/sddefault.jpg`)}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-fm-primary shadow-2xl shadow-black/30 transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-1 h-8 w-8 fill-current" />
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="inline-flex rounded-full bg-fm-primary px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white shadow-lg">
                Toque para assistir
              </span>
              <p className="mt-2 line-clamp-2 text-base font-black leading-tight text-white drop-shadow">
                {title}
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  const [isGuiaOpen, setIsGuiaOpen] = useState(false);
  const [isBeneficiosOpen, setIsBeneficiosOpen] = useState(false);
  const [isHoraDouradaOpen, setIsHoraDouradaOpen] = useState(false);
  const [isHIVOpen, setIsHIVOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [openFaq, setOpenFaq] = useState(-1);

  const faqItems = [
    {
      q: "Quando devo dar a primeira mamada?",
      tag: "Primeira hora",
      lead: "O ideal é oferecer ainda na primeira hora de vida, durante a “golden hour”.",
      details: [
        "Esse contato pele com pele logo após o nascimento ajuda a estimular o reflexo de busca e sucção do bebê.",
        "Nesse primeiro momento, o bebê recebe o colostro: um líquido rico em proteção e nutrientes, essencial nos primeiros dias de vida.",
        "Sempre que possível, mantenha mãe e bebê sem tecidos entre eles para favorecer esse vínculo inicial."
      ]
    },
    {
      q: "Quando oferecer o peito ao bebê?",
      tag: "Livre demanda",
      lead: "Ofereça sempre que o bebê demonstrar sinais de fome, sem horários rígidos.",
      details: [
        "Observe sinais como mexer bastante os braços, colocar a mão na boca e procurar o peito quando está no colo.",
        "O choro também pode ser sinal de fome, mas costuma aparecer mais tarde; tente perceber os sinais antes disso."
      ]
    },
    {
      q: "Quantas vezes um bebê mama por dia?",
      tag: "Rotina do bebê",
      lead: "Cada bebê tem seu ritmo, mas uma referência comum é de 8 a 12 mamadas por dia.",
      details: [
        "Não se prenda apenas aos números: frequência e duração podem variar conforme a fase e a necessidade do bebê.",
        "Como referência, é esperado que um bebê saudável mame por pelo menos 15 a 20 minutos em cada mamada."
      ]
    },
    {
      q: "Existe leite fraco?",
      tag: "Mito comum",
      lead: "Não existe leite fraco: o leite materno tem a composição ideal para o bebê.",
      details: [
        "O que pode acontecer é o bebê não mamar tempo suficiente para chegar ao leite do final da mamada.",
        "Esse leite posterior é mais gorduroso e ajuda na saciedade."
      ],
      img: appImages.bancoDuvidas
    },
    {
      q: "Silicone interfere na amamentação?",
      tag: "Cirurgia",
      lead: "Na maioria dos casos, os implantes de silicone não impedem a amamentação.",
      details: [
        "A cirurgia geralmente não corta a inervação e não altera as glândulas mamárias nem o mamilo.",
        "Se houver dúvidas sobre uma cirurgia específica, vale conversar com um profissional de saúde."
      ]
    },
    {
      q: "Como evitar o empedramento do leite?",
      tag: "Alívio",
      lead: "Massagear e ordenhar ajudam quando a mama está muito cheia, dolorida ou endurecida.",
      details: [
        "O empedramento acontece quando o bebê não consegue sugar bem ou quando consome menos leite do que é produzido.",
        "Faça massagens em movimentos circulares e, em seguida, realize a ordenha.",
        "O leite ordenhado pode ser armazenado ou doado para bancos de leite, seguindo as orientações adequadas."
      ]
    },
    {
      q: "O que fazer se surgirem feridas ou rachaduras?",
      tag: "Cuidado com a mama",
      lead: "Use o próprio leite para hidratar e observe se a pega precisa ser ajustada.",
      details: [
        "Passe o próprio leite no mamilo e na aréola e deixe secar ao ar livre.",
        "Tomar sol nos mamilos por cerca de 15 minutos ao dia pode ajudar.",
        "No banho, use apenas água e sabonete nas mamas e seque com uma toalha macia.",
        "Se a dor continuar, busque ajuda para avaliar a pega."
      ]
    },
    {
      q: "Vou voltar a trabalhar. O que devo fazer?",
      tag: "Retorno ao trabalho",
      lead: "O bebê não precisa ser desmamado quando a mãe volta ao trabalho.",
      details: [
        "Amamente diretamente no seio pela manhã, no fim da tarde ou durante a noite, quando estiver com o bebê.",
        "Quando não estiver presente, o leite pode ser oferecido em copinhos, evitando mamadeira para não confundir a forma de sugar.",
        "É possível criar um pequeno estoque; no congelador, o leite pode ser armazenado por no máximo 15 dias."
      ]
    },
    {
      q: "Ter mamilos planos ou invertidos impede a amamentação?",
      tag: "Anatomia",
      lead: "Não. Ter mamilos planos ou invertidos não impede que você amamente seu bebê.",
      details: [
        "Embora o formato do mamilo possa apresentar alguns desafios iniciais, a amamentação bem-sucedida depende muito mais da técnica de 'pega' do que da anatomia externa da mama.",
        "Técnica do 'Sanduíche': Segurar a mama em formato de 'C' e achatá-la levemente na hora da pega ajuda o bebê a abocanhar uma quantidade maior de tecido."
      ]
    },
    {
      q: "Pode-se fazer amamentação cruzada (amamentar o filho de outra pessoa)?",
      tag: "Segurança",
      lead: "Não. A amamentação cruzada é contraindicada pelo Ministério da Saúde e pela OMS.",
      details: [
        "A amamentação cruzada — quando uma mulher amamenta o filho de outra pessoa — apresenta riscos graves para a saúde do bebê.",
        "Existe o risco de transmissão de doenças infecciosas, como o HIV, através do leite materno.",
        "Caso você tenha excesso de leite, a recomendação segura é doar para um Banco de Leite Humano, onde o leite passa por processos de pasteurização e controle de qualidade."
      ]
    },
    {
      q: "Quais são os riscos da amamentação cruzada?",
      tag: "Riscos",
      lead: "O principal perigo é a transmissão de doenças infectocontagiosas.",
      details: [
        "Mesmo que a mulher pareça saudável, diversos vírus podem ser transmitidos através do leite materno.",
        "HIV (Aids): O vírus pode ser passado para o bebê mesmo que a mãe substituta não apresente sintomas.",
        "HTLV: Um vírus que pode causar problemas neurológicos e hematológicos.",
        "Hepatites: Algumas formas de hepatite também podem ser transmitidas."
      ]
    },
    {
      q: "Por que o leite materno de outra pessoa é arriscado, mas o do Banco de Leite não?",
      tag: "Segurança",
      lead: "A diferença fundamental está no rigoroso controle de segurança e processamento.",
      details: [
        "Bancos de Leite Humano: O leite doado passa por um rigoroso processo de seleção e exames laboratoriais da doadora.",
        "Pasteurização: O leite do banco passa por um processo térmico que elimina qualquer microrganismo que possa transmitir doenças.",
        "Controle de Qualidade: Esse processo garante que o leite seja 100% seguro para o consumo de qualquer bebê."
      ]
    },
    {
      q: "Por que amamentar apenas com leite materno até os 6 meses?",
      tag: "Nutrição",
      lead: "A recomendação de exclusividade protege e prepara o corpo do bebê de várias formas.",
      details: [
        "Imunidade: O leite materno é rico em anticorpos que protegem contra diarreias, pneumonias e infecções.",
        "Hidratação: Contém toda a água que o bebê precisa, mesmo em dias de calor intenso.",
        "Desenvolvimento Facial: O ato de sugar ajuda no crescimento dos ossos da face, dentes e fala.",
        "Prevenção de Doenças: Evita o contato precoce com substâncias que o intestino imaturo não processa, prevenindo alergias, obesidade e diabetes.",
        "Atenção: Introduzir outros alimentos antes do tempo aumenta o risco de doenças e pode diminuir a produção de leite."
      ]
    }
  ];

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
      })
      .catch(err => console.error('Failed to fetch posts:', err));
  }, []);

  const handlePost = async () => {
    if (!newPostText.trim()) return;
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newPostText,
          date: new Date().toLocaleDateString('pt-BR')
        }),
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts(prev => [newPost, ...prev]);
        setNewPostText('');
      }
    } catch (error) {
      console.error('Failed to post:', error);
    }
  };

  const tabs = [
    { id: 'inicio', icon: Home, label: 'Início' },
    { id: 'banco', icon: Droplets, label: 'Banco' },
    { id: 'duvidas', icon: HelpCircle, label: 'Dúvidas' },
    { id: 'comunidade', icon: Users, label: 'Comunidade' },
    { id: 'sobre', icon: Info, label: 'Sobre' }
  ];

  return (
    <div className="app-shell flex h-dvh overflow-hidden md:gap-9 md:p-5">
      {/* Desktop Sidebar */}
      <aside id="sidebar" className="hidden md:flex flex-col w-72 sidebar-panel z-20 rounded-[2.25rem]">
        <div className="p-5">
          <div className="rounded-[2rem] bg-white/70 border border-white/80 shadow-[0_18px_50px_rgba(255,133,162,0.18)] px-5 py-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-fm-primary to-pink-300 text-4xl shadow-lg shadow-pink-200/70">
              🌸
            </div>
            <h1 className="text-2xl font-black tracking-tight text-fm-primary">
              Flor de Maio
            </h1>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-pink-300">
              Amamentação
            </p>
          </div>
        </div>
        <nav className="flex-1 px-5 py-3 space-y-3">
          {tabs.map((tab) => (
            <button
              id={`tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === tab.id ? 'bg-white text-fm-primary font-bold shadow-lg shadow-pink-100/80 ring-1 ring-pink-100' : 'text-gray-500 hover:bg-white/60 hover:text-fm-primary'
              }`}
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all ${
                activeTab === tab.id ? 'bg-gradient-to-br from-fm-primary to-pink-300 text-white shadow-md shadow-pink-200/80' : 'bg-white/75 text-pink-300 group-hover:bg-pink-50'
              }`}>
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'fill-white/20' : ''}`} />
              </span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div id="main-content" className="main-panel flex-1 flex flex-col h-dvh overflow-hidden relative md:h-auto md:rounded-[2.25rem]">
        {/* Mobile Header */}
        <header id="header" className="md:hidden bg-white/92 backdrop-blur-xl py-4 px-6 text-center shadow-sm z-10 border-b border-pink-100">
          <h1 className="text-2xl font-black text-fm-primary flex items-center justify-center gap-2 drop-shadow-sm">
            <span className="text-3xl">🌸</span> Flor de Maio
          </h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-5 md:px-10 pt-7 pb-28 md:pb-10">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'inicio' && (
                <motion.section
                  id="section-inicio"
                  key="inicio"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-xl font-black text-gray-900">Aprendizado e Apoio</h2>
                    <p className="text-base md:text-sm text-gray-700 leading-relaxed">Comece com os guias abaixo e depois assista aos vídeos:</p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <button 
                      id="btn-guia"
                      onClick={() => setIsGuiaOpen(true)}
                      className="w-full md:w-auto md:min-w-[280px] bg-fm-primary text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
                    >
                      <ChevronRight className="w-5 h-5" /> COMECE AQUI: Guia da Pega
                    </button>
                    <button 
                      id="btn-hora-dourada"
                      onClick={() => setIsHoraDouradaOpen(true)}
                      className="w-full md:w-auto md:min-w-[280px] bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-yellow-100 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
                    >
                      <Sparkles className="w-5 h-5" /> Hora Dourada
                    </button>
                    <button 
                      id="btn-beneficios"
                      onClick={() => setIsBeneficiosOpen(true)}
                      className="w-full md:w-auto md:min-w-[280px] bg-white text-fm-primary border-2 border-fm-primary font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors"
                    >
                      <Heart className="w-5 h-5" /> Benefícios da Amamentação
                    </button>
                    <button 
                      id="btn-hiv"
                      onClick={() => setIsHIVOpen(true)}
                      className="w-full md:w-auto md:min-w-[280px] bg-fm-primary text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
                    >
                      <AlertTriangle className="w-5 h-5" /> HIV e Amamentação
                    </button>
                  </div>

                  <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <VideoCard 
                      title="Como acontece a amamentação (UNICEF)" 
                      videoId="QC6EPTd-xv0" 
                    />
                    <VideoCard 
                      title="Pega e Posições (Ministério da Saúde)" 
                      videoId="cEVcQMFgs1g" 
                    />
                  </div>
                </motion.section>
              )}

              {activeTab === 'banco' && (
                <motion.section
                  id="section-banco"
                  key="banco"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold text-fm-primary mb-4 flex items-center gap-2">
                    <Droplets className="w-6 h-6" /> Banco de Leite Materno
                  </h2>
                  
                  <Card title="Quem pode doar leite materno?">
                    <p className="text-sm leading-relaxed">
                      Mulheres saudáveis com excesso de leite e com exames de pré-natal negativos podem contribuir significativamente salvando vidas de bebês prematuros e internados.
                    </p>
                  </Card>

                  <Card title="Passo a Passo: Como Doar">
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-bold text-fm-primary mb-1">1. Preparo do Frasco</h4>
                        <p>Ferva frasco de vidro com tampa plástica por 15 min. Deixe secar sobre pano limpo.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-fm-primary mb-1">2. Higiene Pessoal</h4>
                        <p>Use touca e máscara. Lave mãos e braços até o cotovelo. Lave as mamas apenas com água.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-fm-primary mb-1">3. Extração</h4>
                        <p>Massageie as mamas em movimentos circulares. Pressione a aréola para trás e aperte suavemente.</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-xl border-l-4 border-blue-400">
                        <p className="font-bold text-blue-800 mb-1 flex items-center gap-1">
                          <Info className="w-4 h-4" /> Conservação
                        </p>
                        <p className="text-blue-700">O leite extraído pode ficar no freezer por até 10 dias.</p>
                      </div>
                    </div>
                  </Card>

                  <div className="bg-green-50 p-5 rounded-2xl border-2 border-green-200 text-center">
                    <p className="text-green-700 font-bold text-lg">Sua doação salva vidas!</p>
                    <p className="text-green-600 text-sm mt-1">1 litro de leite pode alimentar até 10 bebês por dia.</p>
                  </div>

                  <div className="pt-4">
                    <a 
                      id="btn-instagram"
                      href="https://www.instagram.com/mulheresapoiandoamamentacao?igsh=MTRlemZ0cGxlbWJlNQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-pink-100 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
                    >
                      <Instagram className="w-5 h-5" /> Consultoria de Amamentação
                    </a>
                    <p className="text-center text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-bold">
                      Clique para abrir no Instagram
                    </p>
                  </div>
                </motion.section>
              )}

              {activeTab === 'duvidas' && (
                <motion.section
                  id="section-duvidas"
                  key="duvidas"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="rounded-[2rem] border border-white/80 bg-white/72 p-5 md:p-7 shadow-[0_18px_50px_rgba(255,133,162,0.16)] backdrop-blur">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                      <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-fm-primary ring-1 ring-pink-100">
                          <HelpCircle className="h-4 w-4" /> Guia rápido
                        </span>
                        <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900">
                          Dúvidas Frequentes
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
                          Toque em uma pergunta para abrir a explicação completa. Cada card começa com a resposta mais importante para facilitar a leitura.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-gradient-to-br from-fm-primary to-pink-300 px-5 py-4 text-white shadow-lg shadow-pink-200 md:text-right">
                        <p className="text-3xl font-black">{faqItems.length}</p>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/85">respostas</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {faqItems.map((item, i) => {
                      const isOpen = openFaq === i;

                      return (
                        <motion.article
                          id={`faq-item-${i}`}
                          key={item.q}
                          initial={false}
                          className={`overflow-hidden rounded-3xl border bg-white/90 shadow-sm transition-all ${
                            isOpen
                              ? 'border-pink-200 shadow-xl shadow-pink-100/70 md:col-span-2'
                              : 'border-white hover:border-pink-100 hover:shadow-md'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaq(isOpen ? -1 : i)}
                            className="w-full p-5 text-left transition-colors hover:bg-pink-50/45"
                          >
                            <div className="flex items-start gap-4">
                              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black transition-colors ${
                                isOpen ? 'bg-fm-primary text-white' : 'bg-pink-50 text-fm-primary'
                              }`}>
                                {i + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <span className="mb-2 inline-flex rounded-full bg-yellow-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-yellow-700 ring-1 ring-yellow-100">
                                  {item.tag}
                                </span>
                                <h3 className="text-lg font-black leading-snug text-fm-primary">
                                  {item.q}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                                  {item.lead}
                                </p>
                                <span className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition-colors ${
                                  isOpen
                                    ? 'bg-fm-primary text-white shadow-lg shadow-pink-200'
                                    : 'bg-pink-50 text-fm-primary ring-1 ring-pink-100'
                                }`}>
                                  {isOpen ? (
                                    <>
                                      <Minus className="h-4 w-4" /> Fechar resposta
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="h-4 w-4" /> Ver resposta
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="overflow-hidden"
                              >
                                <div className="mx-5 mb-5 border-t border-pink-100 pt-4">
                                  <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                                    <ul className="space-y-3">
                                      {item.details.map((detail) => (
                                        <li key={detail} className="flex gap-3 text-sm leading-relaxed text-gray-600">
                                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-fm-primary" />
                                          <span>{detail}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    {'img' in item && item.img && (
                                      <div className="overflow-hidden rounded-2xl border border-pink-100 bg-pink-50 md:w-72">
                                        <img
                                          src={item.img}
                                          alt="Tipos de Leite Materno"
                                          className="h-auto w-full"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.article>
                      );
                    })}
                  </div>

                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 border-l-4 border-l-orange-400 flex items-start gap-3 shadow-sm">
                    <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-orange-800 font-semibold leading-relaxed">
                      Febre, vermelhidão intensa, dor extrema ou piora dos sintomas? Procure um médico ou Banco de Leite imediatamente.
                    </p>
                  </div>
                </motion.section>
              )}

              {activeTab === 'comunidade' && (
                <motion.section
                  id="section-comunidade"
                  key="comunidade"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-fm-primary mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6" /> Comunidade
                  </h2>

                  <Card>
                    <textarea 
                      id="post-input"
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fm-primary focus:border-transparent outline-none resize-none text-sm"
                      placeholder="Compartilhe sua jornada ou uma dica..."
                    />
                    <button 
                      id="btn-publish"
                      onClick={handlePost}
                      className="mt-3 bg-fm-primary text-white font-bold py-2 px-6 rounded-xl shadow-md hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> Publicar
                    </button>
                  </Card>

                  <div className="space-y-4">
                    {posts.length === 0 ? (
                      <div className="text-center py-10 text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>Ainda não há relatos. Seja a primeira!</p>
                      </div>
                    ) : (
                      posts.map(post => (
                        <motion.div 
                          key={post.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-fm-primary text-sm">Mãe da Comunidade</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">{post.date}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{post.text}</p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.section>
              )}

              {activeTab === 'sobre' && (
                <motion.section
                  id="section-sobre"
                  key="sobre"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <div className="py-4">
                    <Info className="w-12 h-12 text-fm-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">Sobre o Projeto</h2>
                  </div>
                  
                  <div className="relative overflow-hidden bg-gradient-to-br from-white via-pink-50/40 to-white p-8 rounded-3xl shadow-sm border border-pink-100/60">
                    <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-fm-primary/10 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-pink-200/20 blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col items-center">
                      <div className="mb-5 flex items-center justify-center rounded-3xl bg-white p-5 shadow-md shadow-pink-100/60 ring-1 ring-pink-100">
                        <img
                          id="logo-uff"
                          src={appImages.brasaoUFF}
                          alt="Brasão UFF"
                          className="h-28 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <p className="font-bold text-lg text-gray-800 leading-tight text-center">Desenvolvido por Acadêmicos de Enfermagem</p>
                      <p className="text-fm-primary font-bold text-sm mt-1 text-center">Universidade Federal Fluminense</p>
                    </div>

                    <div className="relative mt-7 pt-6 border-t border-dashed border-pink-200/80">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-pink-400 mb-5">
                        Em parceria com
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { src: appImages.logoEscolaEnfermagem, label: "Escola de Enfermagem", title: "Escola de Enfermagem Aurora de Afonso Costa" },
                          { src: appImages.logoPACCS, label: "PACCS UFF", title: "PACCS UFF" },
                          { src: appImages.logoGrupoPesquisa, label: "Grupo de Pesquisa", title: "Grupo de Pesquisa - Maternidade, Saúde da Mulher e Criança" },
                          { src: appImages.logoPEA, label: "PEA", title: "PEA" },
                        ].map((logo) => (
                          <div
                            key={logo.label}
                            title={logo.title}
                            className="group flex flex-col items-center justify-end gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-pink-100/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-100/80 hover:ring-fm-primary/30"
                          >
                            <div className="flex h-20 w-full items-center justify-center">
                              <img
                                src={logo.src}
                                alt={logo.title}
                                className="max-h-20 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 text-center leading-tight">
                              {logo.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Equipe</h3>
                    <div className="bg-pink-50 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-px">
                      {[
                        "Maria Luiza Cavalcanti Marques Gall Otero",
                        "Cecília Soares da Silva Costa",
                        "Letícia Oliveira Siqueira de Lima",
                        "Lohayne de Araújo Martinusso",
                        "Maria Eduarda da Silva Gil",
                        "Maria Eduarda Pacheco Rocha",
                        "Sylvia Malheiro Barcellos"
                      ].map((name, i) => (
                        <div key={i} className="py-3 px-4 text-sm text-gray-600 bg-white flex items-center justify-center text-center">
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Orientadores</h3>
                    <div className="bg-pink-50 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-px">
                      {[
                        "Prof. Diego Pereira Rodrigues",
                        "Profa. Diva Cristina Morett Romano Leão",
                        "Prof. Valdecyr Herdy Alves",
                        "Prof. Bianca Dargam Gomes Vieira",
                        "Prof Audrey Vidal Pereira"
                      ].map((name, i) => (
                        <div key={i} className="py-3 px-4 text-sm text-gray-600 bg-white flex items-center justify-center text-center">
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-fm-secondary/30 p-6 rounded-3xl">
                    <p className="text-sm text-gray-600 italic leading-relaxed">
                      "Nossa missão é proporcionar informações de qualidade e apoio a mães durante a jornada da amamentação, promovendo a saúde e bem-estar materno e infantil."
                    </p>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Mobile Navigation */}
        <nav id="mobile-nav" className="md:hidden fixed -bottom-1 left-0 right-0 h-[84px] bg-white/95 backdrop-blur-xl border-t border-pink-100 shadow-[0_-14px_35px_rgba(255,133,162,0.16)] flex justify-around items-start pt-2 px-2 z-20">
          {tabs.map((tab) => (
            <button
              id={`mobile-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex min-w-[58px] flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-2 transition-all ${
                activeTab === tab.id ? 'text-fm-primary scale-105 bg-pink-50' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'fill-pink-100' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-[-0.02em]">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Modal: Guia da Pega */}
      <Modal 
        isOpen={isGuiaOpen} 
        onClose={() => setIsGuiaOpen(false)} 
        title="Guia Passo a Passo"
      >
        <div className="space-y-6 text-sm">
          <div className="border-b border-pink-50 pb-4">
            <h4 className="font-bold text-fm-primary mb-2 flex items-center gap-2">
              <span className="bg-fm-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Preparação e Conforto
            </h4>
            <p className="text-gray-600">Sente-se em local confortável com apoio para as costas e braços. Use almofadas para elevar o bebê.</p>
          </div>
          <div className="border-b border-pink-50 pb-4">
            <h4 className="font-bold text-fm-primary mb-2 flex items-center gap-2">
              <span className="bg-fm-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Posicionamento
            </h4>
            <p className="text-gray-600">Barriga com barriga. Cabeça e tronco alinhados. Nariz na direção do mamilo.</p>
          </div>
          <div className="border-b border-pink-50 pb-4">
            <h4 className="font-bold text-fm-primary mb-2 flex items-center gap-2">
              <span className="bg-fm-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
              A Pega Correta
            </h4>
            <div className="mb-3 rounded-xl overflow-hidden border border-pink-100 shadow-sm">
              <img
                src={appImages.guiaDePega}
                alt="Demonstração da Pega Correta e Incorreta"
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Boca de Peixinho (lábios para fora)</li>
              <li>Abocanhar quase toda a aréola</li>
              <li>Queixo encostado no peito</li>
            </ul>
          </div>
          <div className="border-b border-pink-50 pb-4">
            <h4 className="font-bold text-fm-primary mb-2 flex items-center gap-2">
              <span className="bg-fm-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
              Posições para Amamentar
            </h4>
            <div className="rounded-xl overflow-hidden border border-pink-100 shadow-sm">
              <img
                src={appImages.posicoes}
                alt="Posições Tradicional, Transversal, Invertida e Deitada de Lado"
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="border-b border-pink-50 pb-4">
            <h4 className="font-bold text-fm-primary mb-2 flex items-center gap-2">
              <span className="bg-fm-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">5</span>
              Sinais de Pega Correta
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Boca bem aberta</li>
              <li>Lábios virados pra fora</li>
              <li>Queixo encostado na mama</li>
              <li>Nariz livre ou tocando levemente</li>
              <li>Sucção lenta, profunda e ritmada</li>
              <li>Amamentação sem dor</li>
            </ul>
          </div>
          <div className="bg-yellow-50 p-4 rounded-2xl border-l-4 border-yellow-400">
            <p className="font-bold text-yellow-800 mb-1">Dicas de Ouro:</p>
            <p className="text-yellow-700 text-xs leading-relaxed">
              • Mamas duras? Massageie e ordenhe um pouco antes.<br/>
              • Higiene: Não lave os mamilos a cada mamada.<br/>
              • Troca: Deixe esvaziar bem um peito antes de mudar.
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal: Benefícios */}
      <Modal 
        isOpen={isBeneficiosOpen} 
        onClose={() => setIsBeneficiosOpen(false)} 
        title="Benefícios Padrão-Ouro"
      >
        <div className="space-y-6 text-sm">
          <div className="bg-pink-50 p-4 rounded-2xl">
            <h4 className="font-bold text-fm-primary mb-2 flex items-center gap-2">
              <Heart className="w-5 h-5 fill-current" /> Para o Bebê
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-fm-primary shrink-0 mt-0.5" /> Proteção contra diarreias e alergias.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-fm-primary shrink-0 mt-0.5" /> Melhor desenvolvimento cognitivo.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-fm-primary shrink-0 mt-0.5" /> Nutrição completa até os 6 meses.</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl">
            <h4 className="font-bold text-blue-600 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 fill-current" /> Para a Mãe
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Redução de hemorragias pós-parto.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Prevenção de câncer de mama e ovário.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Fortalecimento do vínculo afetivo.</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Modal: Hora Dourada */}
      <Modal 
        isOpen={isHoraDouradaOpen} 
        onClose={() => setIsHoraDouradaOpen(false)} 
        title="✨ Hora Dourada: O Início de uma Grande Jornada"
      >
        <div className="space-y-6 text-sm">
          <div className="bg-yellow-50/50 p-5 rounded-3xl border border-yellow-100">
            <p className="text-gray-700 leading-relaxed italic">
              "Você sabia que os primeiros 60 minutos de vida do seu bebê podem mudar o futuro dele? Esse momento é tão especial que o chamamos de Hora Dourada. É o encontro de pele, cheiro e instinto entre você e seu pequeno."
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-orange-100 p-2.5 rounded-2xl text-orange-600 shrink-0">
                <Baby className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">O Superpoder do Bebê</h4>
                <p className="text-gray-600 leading-relaxed">
                  Logo após o parto, seu bebê está super alerta! Se colocado sobre sua barriga, ele é capaz de "engatinhar" sozinho até o seu seio. Ele se guia pelo seu cheiro e pelo toque da sua pele. É a natureza em ação!
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-yellow-100 p-2.5 rounded-2xl text-yellow-700 shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">A Primeira Vacina (Colostro)</h4>
                <p className="text-gray-600 leading-relaxed">
                  Aquele líquido amarelinho que sai primeiro não é "leite fraco", é o <span className="font-bold text-yellow-700">Líquido de Ouro</span>!
                </p>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span className="font-semibold text-gray-800">Imunidade:</span> Carregado de anticorpos.
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span className="font-semibold text-gray-800">Digestão:</span> Evita o amarelão (icterícia).
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span className="font-semibold text-gray-800">Nutrição:</span> Perfeito para o estômago pequeno.
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-pink-100 p-2.5 rounded-2xl text-pink-600 shrink-0">
                <Thermometer className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Benefícios que Curam</h4>
                <p className="text-gray-600 leading-relaxed">
                  Estar no seu colo, pele a pele, é o melhor remédio:
                </p>
                <p className="mt-1 text-gray-600">
                  <span className="font-semibold text-gray-800">Para o Bebê:</span> Acalma os batimentos e aquece o corpo.<br/>
                  <span className="font-semibold text-gray-800">Para Você:</span> Libera ocitocina, ajudando o útero a voltar ao normal.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-green-100 p-2.5 rounded-2xl text-green-600 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Um Número que Impressiona</h4>
                <p className="text-gray-600 leading-relaxed">
                  A ciência confirma: amamentar na primeira hora pode evitar até <span className="font-bold text-green-700 text-lg">22%</span> das mortes de recém-nascidos no mundo.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 flex gap-3 items-start">
            <Lightbulb className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">Dica Prática</h4>
              <p className="text-blue-800 leading-relaxed">
                Coloque no seu Plano de Parto que você deseja a "Hora Dourada". Peça para que exames de rotina sejam feitos só depois desse primeiro contato.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 font-medium">
            Recomendação global da OMS e UNICEF 🤱✨
          </p>
        </div>
      </Modal>

      {/* Modal: HIV e Amamentação */}
      <Modal 
        isOpen={isHIVOpen} 
        onClose={() => setIsHIVOpen(false)} 
        title="HIV e Amamentação: Orientações Importantes"
      >
        <div className="space-y-6 text-sm">
          <div className="bg-red-50 p-5 rounded-3xl border border-red-100 flex gap-3 items-start">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-900 mb-1">Recomendação no Brasil</h4>
              <p className="text-red-800 leading-relaxed">
                No Brasil, a recomendação oficial do Ministério da Saúde é que mães vivendo com HIV <strong>não amamentem</strong> seus bebês, para evitar o risco de transmissão do vírus pelo leite materno.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-blue-100 p-2.5 rounded-2xl text-blue-600 shrink-0">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Inibição da Lactação</h4>
                <p className="text-gray-600 leading-relaxed">
                  A mãe tem o direito de receber medicação para interromper a produção de leite de forma segura e humanizada logo após o parto, evitando o ingurgitamento mamário.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-green-100 p-2.5 rounded-2xl text-green-600 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Direito à Fórmula Infantil</h4>
                <p className="text-gray-600 leading-relaxed">
                  O bebê tem direito a receber fórmula infantil gratuitamente pelo SUS até, pelo menos, os 6 meses de idade (podendo se estender conforme avaliação médica), garantindo sua nutrição completa.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-orange-100 p-2.5 rounded-2xl text-orange-600 shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Alimentação Mista</h4>
                <p className="text-gray-600 leading-relaxed">
                  A alimentação mista (leite materno + fórmula) também é contraindicada, pois mantém o risco de transmissão do vírus.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-fm-primary" /> Apoio e Cuidado
            </h4>
            <p className="text-gray-600 leading-relaxed">
              O acompanhamento pré-natal e pós-parto especializado é essencial. Converse abertamente com sua equipe de saúde para receber todo o suporte necessário para você e seu bebê.
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 font-medium">
            Fonte: Ministério da Saúde do Brasil 🇧🇷
          </p>
        </div>
      </Modal>
    </div>
  );
}
