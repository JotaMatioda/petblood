import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styles from './BuscaEmergencia.module.css'
import SidebarClinica from '../../../componentes/SidebarClinica/SidebarClinica.tsx'
import PerfilHeaderBtn from '../../../componentes/PerfilHeaderBtn/PerfilHeaderBtn.tsx'
import { carregarDoadores, distanciaKm } from '../../../servicos/doadores.ts'
import {
  AlertCircle, Search, Info, MoreVertical,
  MessageCircle, ChevronDown, X, Users
} from 'lucide-react'

// Fix ícones padrão do Leaflet no Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const iconeClinica = new L.DivIcon({
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;width:130px">
      <div style="background:#C0392B;color:white;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.25);line-height:1.4">
        🏥 Minha Clínica
      </div>
      <div style="width:2px;height:7px;background:#C0392B"></div>
      <div style="width:10px;height:10px;background:#C0392B;border-radius:50%;box-shadow:0 0 0 3px rgba(192,57,43,0.2)"></div>
    </div>`,
  className: '',
  iconSize: [130, 52],
  iconAnchor: [65, 52],
})

function AtualizarCentro({ centro }: { centro: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(centro, map.getZoom())
    map.invalidateSize()
  }, [centro])
  return null
}

async function geocodificar(endereco: string): Promise<[number, number] | null> {
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'pt-BR' } }
    )
    const dados = await resp.json()
    if (dados.length === 0) return null
    return [parseFloat(dados[0].lat), parseFloat(dados[0].lon)]
  } catch {
    return null
  }
}

type Doador = {
  id: string
  nome: string
  especie: string
  raca: string
  peso: string
  contato: string
  distanciaNum: number
  distancia: string
  lat: number
  lng: number
  selecionado: boolean
}

// Fallback: São Paulo centro
const SP_LAT = -23.5505
const SP_LNG = -46.6333

function construirDoadores(centro: [number, number], raio: number): Doador[] {
  return carregarDoadores()
    .map(p => {
      const dist = distanciaKm(centro[0], centro[1], p.lat, p.lng)
      return {
        id: String(p.petId),
        nome: p.nome,
        especie: p.especie,
        raca: p.raca,
        peso: p.peso,
        contato: p.contato,
        distanciaNum: dist,
        distancia: dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)} km`,
        lat: p.lat,
        lng: p.lng,
        selecionado: false,
      }
    })
    .filter(d => d.distanciaNum <= raio)
    .sort((a, b) => a.distanciaNum - b.distanciaNum)
}

export default function BuscaEmergencia() {
  const [especie, setEspecie] = useState('Todos')
  const [tipoSanguineo, setTipoSanguineo] = useState('DEA 1.1+')
  const [raio, setRaio] = useState(10)
  const [doadores, setDoadores] = useState<Doador[]>([])
  const [filtro, setFiltro] = useState('')
  const [_filtroStatus, _setFiltroStatus] = useState<'todos' | 'confirmou' | 'aguardando' | 'sem_resposta'>('todos')
  const [centro, setCentro] = useState<[number, number]>([SP_LAT, SP_LNG])
  const [enderecoClin, setEnderecoClin] = useState(localStorage.getItem('petblood_clinica_endereco') ?? '')
  const [geocodificando, setGeocodificando] = useState(false)

  useEffect(() => {
    const end = localStorage.getItem('petblood_clinica_endereco') ?? ''
    setEnderecoClin(end)
    if (!end) {
      setDoadores(construirDoadores([SP_LAT, SP_LNG], raio))
      return
    }
    setGeocodificando(true)
    geocodificar(end).then(coords => {
      const c = coords ?? [SP_LAT, SP_LNG] as [number, number]
      setCentro(c)
      setDoadores(construirDoadores(c, raio))
      setGeocodificando(false)
    })
  }, [])

  function buscar() {
    setDoadores(construirDoadores(centro, raio))
  }

  const selecionados = doadores.filter(d => d.selecionado)

  const doadoresFiltrados = doadores.filter(d => {
    const texto = filtro.toLowerCase()
    const bateTexto = !texto ||
      d.nome.toLowerCase().includes(texto) ||
      d.raca.toLowerCase().includes(texto) ||
      d.contato.includes(texto)
    const bateEspecie = especie === 'Todos' || (especie === 'Canina' ? d.especie === 'CAO' : d.especie === 'GATO')
    return bateTexto && bateEspecie
  })

  function toggleDoador(id: string) {
    setDoadores(prev => prev.map(d => d.id === id ? { ...d, selecionado: !d.selecionado } : d))
  }

  function toggleTodos() {
    const todos = doadoresFiltrados.every(d => d.selecionado)
    const ids = new Set(doadoresFiltrados.map(d => d.id))
    setDoadores(prev => prev.map(d => ids.has(d.id) ? { ...d, selecionado: !todos } : d))
  }

  return (
    <div className={styles.pagina}>
      <SidebarClinica />

      <div className={styles.conteudoWrapper}>
        <header className={styles.header}>
          <div className={styles.headerEsquerda}>
            <h1 className={styles.headerTitulo}>Busca de emergência</h1>
            <span className={styles.badgeEmergencia}><span className={styles.pulsoDot} /> Emergência aberta</span>
          </div>
          <PerfilHeaderBtn />
        </header>

        <main className={styles.main}>

          <div className={styles.alertaCritico}>
            <AlertCircle size={18} color="#C0392B" />
            <div>
              <strong>ALERTA CRÍTICO</strong>
              <span>Cão com anemia hemolítica imunomediada — necessita transfusão <strong>{tipoSanguineo}</strong> urgente.</span>
            </div>
          </div>

          <div className={styles.gridPrincipal}>

            {/* Painel esquerdo */}
            <div className={styles.painelEsquerdo}>
              <div className={styles.card}>
                <h2 className={styles.cardTitulo}>Configurar Busca</h2>

                <div className={styles.campo}>
                  <label>Espécie</label>
                  <div className={styles.selectWrapper}>
                    <select value={especie} onChange={e => setEspecie(e.target.value)}>
                      <option>Todos</option>
                      <option>Canina</option>
                      <option>Felina</option>
                    </select>
                    <ChevronDown size={14} className={styles.selectIcone} />
                  </div>
                </div>

                <div className={styles.campo}>
                  <label>Tipo Sanguíneo</label>
                  <div className={styles.selectWrapper}>
                    <select value={tipoSanguineo} onChange={e => setTipoSanguineo(e.target.value)}>
                      <option>DEA 1.1+</option>
                      <option>DEA 1.1-</option>
                      <option>DEA 3</option>
                      <option>DEA 4</option>
                      <option>DEA 7</option>
                      <option>Tipo A</option>
                      <option>Tipo B</option>
                      <option>Tipo AB</option>
                    </select>
                    <ChevronDown size={14} className={styles.selectIcone} />
                  </div>
                </div>

                <div className={styles.campo}>
                  <div className={styles.raioLabel}>
                    <label>Raio de busca</label>
                    <strong className={styles.raioValor}>{raio}km</strong>
                  </div>
                  <input
                    type="range" min={1} max={50} step={1}
                    value={raio}
                    onChange={e => setRaio(Number(e.target.value))}
                    className={styles.slider}
                  />
                </div>

                <button className={styles.btnBuscar} onClick={buscar}>
                  <Search size={17} /> Buscar doadores agora
                </button>
              </div>

              <div className={styles.notaCard}>
                <div className={styles.notaTitulo}>
                  <Info size={14} color="#2563EB" />
                  <span>NOTA MÉDICA</span>
                </div>
                <p>
                  Doadores ideais para {tipoSanguineo} devem pesar mais de 25kg e estar com vacinação em dia.
                  O tempo estimado de resposta para esta região é de 15 min.
                </p>
              </div>
            </div>

            {/* Mapa real */}
            <div className={styles.mapaWrapper}>
              {geocodificando && (
                <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: 'white', padding: '6px 14px', borderRadius: 8, fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  Localizando endereço...
                </div>
              )}
              <MapContainer
                center={centro}
                zoom={14}
                style={{ width: '100%', height: '400px', borderRadius: '14px', border: '1px solid #e5e0da' }}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <AtualizarCentro centro={centro} />

                {/* Marcador da clínica */}
                <Marker position={centro} icon={iconeClinica}>
                  <Popup>
                    <strong>🏥 Minha Clínica</strong><br />
                    {enderecoClin || 'Unidade solicitante'}
                  </Popup>
                </Marker>

                {/* Círculo do raio */}
                <Circle
                  center={centro}
                  radius={raio * 1000}
                  pathOptions={{ color: '#C0392B', fillColor: '#C0392B', fillOpacity: 0.06, weight: 1.5, dashArray: '6 4' }}
                />

                {/* Marcadores dos doadores */}
                {doadores.map(d => (
                  <Marker
                    key={d.id}
                    position={[d.lat, d.lng]}
                    icon={new L.DivIcon({
                      html: `
                        <div style="display:flex;flex-direction:column;align-items:center;width:120px">
                          <div style="background:#2563EB;color:white;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.25);line-height:1.4">
                            ${d.especie === 'CAO' ? '🐕' : '🐈'} ${d.nome}
                          </div>
                          <div style="width:2px;height:7px;background:#2563EB"></div>
                          <div style="width:10px;height:10px;background:#2563EB;border-radius:50%;box-shadow:0 0 0 3px rgba(37,99,235,0.2)"></div>
                        </div>`,
                      className: '',
                      iconSize: [120, 52],
                      iconAnchor: [60, 52],
                    })}
                  >
                    <Popup>
                      <strong>{d.nome}</strong> — {d.raca}<br />
                      Peso: {d.peso} · {d.distancia}<br />
                      📞 {d.contato}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Tabela */}
          <div className={styles.tabelaCard}>
            <div className={styles.tabelaCabecalho}>
              <h2 className={styles.tabelaTitulo}>
                Doadores encontrados <span className={styles.tabelaCount}>({doadoresFiltrados.length})</span>
              </h2>
              <div className={styles.filtrosWrapper}>
                <div className={styles.filtroBusca}>
                  <Search size={14} className={styles.filtroIcone} />
                  <input
                    className={styles.filtroInput}
                    placeholder="Buscar por nome, raça..."
                    value={filtro}
                    onChange={e => setFiltro(e.target.value)}
                  />
                  {filtro && (
                    <button className={styles.filtroClear} onClick={() => setFiltro('')}><X size={13} /></button>
                  )}
                </div>
                {selecionados.length > 0 && (
                  <button className={styles.btnAlertar}>
                    <MessageCircle size={16} /> Alertar selecionados ({selecionados.length})
                  </button>
                )}
              </div>
            </div>

            <div className={styles.tabelaHeader}>
              <div className={styles.thCheck}>
                <input type="checkbox" checked={doadoresFiltrados.length > 0 && doadoresFiltrados.every(d => d.selecionado)} onChange={toggleTodos} className={styles.checkbox} />
              </div>
              <span>DOADOR</span>
              <span>ESPÉCIE / RAÇA</span>
              <span>PESO</span>
              <span>CONTATO</span>
              <span>DISTÂNCIA</span>
              <span>AÇÕES</span>
            </div>

            {doadoresFiltrados.length === 0 && (
              <div className={styles.semResultados}>
                <Users size={28} color="#ccc" />
                <p>
                  {doadores.length === 0
                    ? 'Nenhum pet doador cadastrado dentro do raio de busca. Clique em "Buscar doadores agora" após ajustar o raio.'
                    : 'Nenhum doador encontrado para os filtros aplicados.'}
                </p>
              </div>
            )}
            {doadoresFiltrados.map(d => (
              <div key={d.id} className={`${styles.tabelaLinha} ${d.selecionado ? styles.linhaSelecionada : ''}`}>
                <div className={styles.thCheck}>
                  <input type="checkbox" checked={d.selecionado} onChange={() => toggleDoador(d.id)} className={styles.checkbox} />
                </div>
                <div className={styles.doadorInfo}>
                  <div className={styles.doadorIcone}>{d.especie === 'CAO' ? '🐕' : '🐈'}</div>
                  <div>
                    <strong>{d.nome}</strong>
                    <span>{d.raca}</span>
                  </div>
                </div>
                <span className={styles.celula}>{d.especie === 'CAO' ? 'Canino' : 'Felino'} / {d.raca}</span>
                <span className={styles.celula}>{d.peso}</span>
                <span className={styles.celula}>{d.contato}</span>
                <span className={`${styles.celula} ${styles.distancia}`}>{d.distancia}</span>
                <button className={styles.btnMenu}><MoreVertical size={16} /></button>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}
