import dynamic from 'next/dynamic'
import '@fango/form/dist/style.css'

const FangoForm = dynamic(() => import('@fango/form').then(({ FangoForm }) => FangoForm), {
  ssr: false,
})

export {
  FangoForm,
}
