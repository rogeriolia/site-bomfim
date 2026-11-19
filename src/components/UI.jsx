import { readContactMemory, rememberContactField } from '../utils/contactMemory.js'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'

export function Button({ children, variant = 'primary', size = 'md', className = '', href, type = 'button', ...props }) {
  const variants = {
    primary: 'bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] border-[var(--brand)]',
    secondary: 'bg-white text-[var(--ink)] hover:bg-[var(--soft)] border-[var(--line)]',
    outline: 'bg-transparent text-[var(--ink)] hover:bg-[var(--soft)] border-[#9aa3b0]',
    white: 'bg-white text-[var(--brand)] hover:bg-[#fff1f4] border-white',
    'on-dark': 'bg-transparent text-white hover:bg-white/10 border-white',
    text: 'bg-transparent text-[var(--brand)] hover:bg-[#fff1f4] border-transparent',
  }
  const sizes = { sm: 'min-h-11 px-4 text-sm', md: 'min-h-12 px-5 text-sm', lg: 'min-h-14 px-6 text-base' }
  const classes = `inline-flex items-center justify-center gap-2 rounded-full border font-bold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`
  if (href) return <Link to={href} className={classes} {...props}>{children}</Link>
  return <button type={type} className={classes} {...props}>{children}</button>
}

export function ArrowLink({ children, href, className = '' }) {
  return <Link to={href} className={`inline-flex items-center gap-2 font-bold text-[var(--brand)] hover:underline ${className}`}>{children}<ArrowRight size={18} aria-hidden="true" /></Link>
}

export function Chip({ children, active = false, onClick }) {
  const cls = `inline-flex items-center rounded-full px-3 text-xs font-semibold ${active ? 'bg-[var(--ink)] text-white' : 'bg-[var(--soft)] text-[var(--subtle)]'}`
  return onClick ? <button type="button" onClick={onClick} aria-pressed={active} className={`${cls} min-h-11 hover:opacity-80`}>{children}</button> : <span className={`${cls} min-h-7`}>{children}</span>
}

export function Field({ label, id, as = 'input', options, className = '', error, ...props }) {
  const memoryKeys = { name: 'name', organization: 'company', tel: 'phone', email: 'email' }
  const inferredKey = { name: 'name', company: 'company', organization: 'company', phone: 'phone', email: 'email' }[props.name]
  const memoryKey = !id?.startsWith('report-') && id !== 'contact-name-report' ? memoryKeys[props.autoComplete] || inferredKey : null
  const fieldProps = { ...props }
  if (memoryKey && as === 'input') {
    if (props.value === undefined && props.defaultValue === undefined) fieldProps.defaultValue = readContactMemory()[memoryKey] || ''
    fieldProps.onBlur = event => { rememberContactField(memoryKey, event.target.value); props.onBlur?.(event) }
  }
  const accessibility = error ? { 'aria-invalid': true, 'aria-describedby': `${id}-error` } : {}
  return <div className={className}>
    <label className="field-label" htmlFor={id}>{label}</label>
    {as === 'select' ? <select id={id} className="field" {...accessibility} {...fieldProps}>{options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      : as === 'textarea' ? <textarea id={id} className="field !min-h-24 py-3" {...accessibility} {...fieldProps} />
      : <input id={id} className="field" {...accessibility} {...fieldProps} />}
    {error && <p id={`${id}-error`} className="mt-1 text-xs font-semibold text-[var(--brand)]">{error}</p>}
  </div>
}

export function Dialog({ open, onClose, titleId, children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])
  return <dialog ref={ref} aria-labelledby={titleId} onClose={onClose} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose() }} className={`m-auto max-h-[min(90vh,900px)] w-[min(calc(100%-32px),640px)] overflow-y-auto rounded-2xl border-0 bg-white p-0 text-[var(--ink)] shadow-2xl backdrop:bg-[#071628b8] backdrop:backdrop-blur-[3px] ${className}`}>
    <div className="relative p-6 sm:p-9">
      <button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full hover:bg-[var(--soft)]"><X size={22} /></button>
      {children}
    </div>
  </dialog>
}

export function SectionIntro({ eyebrow, title, body, aside }) {
  return <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
    <div className="max-w-3xl"><div className="line-accent mb-4" />{eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}<h2 className="heading text-3xl sm:text-4xl">{title}</h2>{body && <p className="mt-3 max-w-2xl text-[var(--muted)]">{body}</p>}</div>
    {aside}
  </div>
}
