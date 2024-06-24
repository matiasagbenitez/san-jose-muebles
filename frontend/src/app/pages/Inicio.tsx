import { ProgressBar } from 'react-bootstrap'

export const Inicio = () => {
  return (
    <div className="d-flex flex-column align-items-center">
      {/* <Image src="/logos/logo-transparent.png" fluid height={200} width={200} /> */}
      <h4 className="mt-4 font-monospace">
        Sistema en construcción
      </h4>
      <ProgressBar now={75} className="w-50 mt-4" animated  />

    </div>
  )
}
