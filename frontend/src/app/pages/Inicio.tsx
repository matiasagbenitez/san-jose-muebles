import { Image } from 'react-bootstrap'

export const Inicio = () => {
  return (
    <div className="d-flex flex-column align-items-center">
      <Image src="/logos/logo-transparent.png" fluid height={200} width={200} />
      <h4 className="mt-4 font-monospace">San José Muebles</h4>
    </div>
  )
}
