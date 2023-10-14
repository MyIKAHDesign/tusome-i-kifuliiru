import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

const config: DocsThemeConfig = {
  logo: <span>Tusome i Kifuliiru</span>,
  project: {
    link: 'https://github.com/MyIKAHDesign/tusome-i-kifuliiru',
  },
  
  docsRepositoryBase: 'https://github.com/MyIKAHDesign/tusome-i-kifuliiru',
  // footer: {
  //   text: 'Tusome i Kifuliiru',
  // },
  useNextSeoProps() {
    const { route } = useRouter()
    if (route !== '/') {
      return {
        titleTemplate: '%s – Tusome i Kifuliiru'
      }
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Tusome i Kifuliiru. Kifuliiru ndeto yitu" />
      <meta property="og:description" content="Tusome indeto yitu Kifuliiru mu Kifuliiru. Kifuliiru ndeto yitu, ndeto ngale." />
    </>
  ),
  banner: {
    key: '2.0-release',
    text: <a href="https://ibufuliiru.editorx.io/kifuliiru" target="_blank">
      🎉 Zatira namuyehuulo we' Kifuliiru. Lenga hano →
    </a>,
  },
  footer: {
    text: <div>
      <span>
      Tusome i Kifuliiru {new Date().getFullYear()} © <a href="https://kifuliiru.vercel.app/"> Tumenye Ibufuliiru</a>. 
    </span>
    <span> Mukolwa gumwa <a href="https://ayivugwe.editorx.io/ayivugwekabemba" target="_blank">Ayivugwe Kabemba</a>.</span>
    </div>,
  },
  search:{
    placeholder: "Looza hano...",
   // emptyResult: "Ndabyo twaloonga",
   // loading: "Tugweeti tugalooza",
   // error:"Hali ibitagendeka bwija",
  },
  // sidebar:{
  //    toggleButton:true,
  // },
}

export default config
