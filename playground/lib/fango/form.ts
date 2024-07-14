import dynamic from 'next/dynamic'
import '@fango/form/dist/style.css'

const LocoForm = dynamic(() => import('@fango/form').then(({ LocoForm }) => LocoForm), {
  ssr: false,
})

export {
  LocoForm,
}
