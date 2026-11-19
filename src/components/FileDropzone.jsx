import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'

export default function FileDropzone({ file, onChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const choose = files => {
    if (files.length > 1) { setError('Selecione apenas um arquivo.'); return }
    const selected = files[0]
    if (!selected) return
    if (!/\.(pdf|jpe?g|png)$/i.test(selected.name)) { setError('Escolha um arquivo PDF, JPG ou PNG.'); return }
    if (selected.size > 10 * 1024 * 1024) { setError('O arquivo deve ter até 10 MB.'); return }
    setError(''); onChange(selected)
  }
  return <section className="file-dropzone-field" aria-label="Anexar documento">
    <p>Anexar nota fiscal ou pedido <span>(opcional)</span></p>
    <div className={`file-dropzone ${dragging ? 'is-dragging' : ''}`} onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false) }} onDrop={event => { event.preventDefault(); setDragging(false); choose(event.dataTransfer.files) }}>
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" aria-label="Escolher nota fiscal ou pedido" className="visually-hidden" tabIndex={-1} onChange={event => { choose(event.target.files); event.target.value = '' }}/>
      {file ? <div className="file-dropzone__selected"><span><strong>{file.name}</strong><small>{(file.size / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} KB</small></span><button type="button" aria-label="Remover arquivo" onClick={() => { onChange(null); setError('') }}><X size={18}/></button></div> : <button type="button" className="file-dropzone__choose" onClick={() => inputRef.current?.click()}><Upload size={20} aria-hidden="true"/><span>Arraste o arquivo aqui ou <strong>escolha no dispositivo</strong><small>PDF, JPG ou PNG · até 10 MB</small></span></button>}
    </div>
    {error && <p className="file-dropzone__error" role="alert">{error}</p>}
  </section>
}
