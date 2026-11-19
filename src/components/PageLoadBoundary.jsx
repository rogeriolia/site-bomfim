import { Component } from 'react'

export default class PageLoadBoundary extends Component {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  render() {
    if (!this.state.error) return this.props.children
    return <main className="route-loading" role="alert">
      <img src={`${import.meta.env.BASE_URL}assets/brand/bomfim-cargas.webp`} width="150" height="48" alt="Bomfim Cargas" />
      <h1>Não foi possível carregar esta página.</h1>
      <p>O site pode ter sido atualizado ou a conexão foi interrompida.</p>
      <button type="button" className="route-loading__retry" onClick={() => window.location.reload()}>Atualizar página</button>
      <a href={import.meta.env.BASE_URL}>Voltar ao início</a>
    </main>
  }
}
