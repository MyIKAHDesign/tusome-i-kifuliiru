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
      <meta property="og:title" content="Kifuliiru | Tusome i Kifuliiru mu Kifuliiru" />
      <meta property="og:description" content="Kifuliiru. Kifuliiru language. Kifuliiru language online documentation. Kifuliiru Academy. Tusome indeto yitu Kifuliiru mu Kifuliiru. Kifuliiru ndeto yitu, ndeto ngale. Learn the Kifuliiru language in Kifuliiru.
      This website is here to learn the Kifuliiru language and to promote it. The Kifuliiru language is a language spoken in DRCongo, the Congo-Kinshasa; in the Eastern part, in Uvira territory, South Kivu province. 
      You may have been asking yourself about what this language is? How can I learn it? Here is a platform for the Kifuliiru language for learners or students and teachers as well." />
      <meta property="og:image" content=".github/DRCongo.png" />
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
      Tusome i Kifuliiru {new Date().getFullYear()} © <a href="https://kifuliiru.net/"> Tumenye Ibufuliiru</a>. 
    </span>
    <span> Mukolwa gumwa <a href="https://ayivugwe.editorx.io/ayivugwekabemba" target="_blank">Ayivugwe Kabemba Mukome</a>.</span>
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
